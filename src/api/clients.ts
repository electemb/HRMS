import api from "./index";

export const getClients = async () => {
  const res = await api.get("/clients");
  return res.data;
};

export const getClient = async (id: string) => {
  const res = await api.get(`/clients/${id}`);
  return res.data;
};

export const createClient = async (data: any) => {
  const res = await api.post("/clients", data);
  return res.data;
};

export const updateClient = async (id: string, data: any) => {
  const res = await api.put(`/clients/${id}`, data);
  return res.data;
};

export const deleteClient = async (id: string) => {
  const res = await api.delete(`/clients/${id}`);
  return res.data;
};
