import api from "./index";

export const getDesignations = async () => {
  const res = await api.get("/designations");
  return res.data;
};

export const getDesignation = async (id: string) => {
  const res = await api.get(`/designations/${id}`);
  return res.data;
};

export const createDesignation = async (data: any) => {
  const res = await api.post("/designations", data);
  return res.data;
};

export const updateDesignation = async (id: string, data: any) => {
  const res = await api.put(`/designations/${id}`, data);
  return res.data;
};

export const deleteDesignation = async (id: string) => {
  const res = await api.delete(`/designations/${id}`);
  return res.data;
};
