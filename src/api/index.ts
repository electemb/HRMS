import axios from "axios";

// Read API base URL from environment variable (Vite uses import.meta.env)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5187/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token and organization ID to every request
api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { accessToken } = JSON.parse(auth);
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }
    
    // Attach organization ID from localStorage
    const currentOrgId = localStorage.getItem("currentOrgId");
    if (currentOrgId) {
      config.headers = config.headers || {};
      config.headers["X-Org-Id"] = currentOrgId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors and try refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const auth = localStorage.getItem("auth");
        if (!auth) throw error;
        const { refreshToken } = JSON.parse(auth);

        // Make direct refresh API call to avoid circular import
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );
        const res = refreshResponse.data;

        localStorage.setItem(
          "auth",
          JSON.stringify({
            ...JSON.parse(auth),
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
            user: res.user,
          })
        );
        api.defaults.headers.common["Authorization"] =
          "Bearer " + res.accessToken;
        processQueue(null, res.accessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err as Error, null);
        localStorage.removeItem("auth");
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
