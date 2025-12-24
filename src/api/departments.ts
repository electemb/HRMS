import api from "./index";

export const getDepartments = async () => {
  const res = await api.get("/departments");
  return res.data;
};

export const getDepartment = async (id: string) => {
  const res = await api.get(`/departments/${id}`);
  return res.data;
};

export const createDepartment = async (data: any) => {
  const res = await api.post("/departments", data);
  return res.data;
};

export const updateDepartment = async (id: string, data: any) => {
  const res = await api.put(`/departments/${id}`, data);
  return res.data;
};

export const deleteDepartment = async (id: string) => {
  const res = await api.delete(`/departments/${id}`);
  return res.data;
};
