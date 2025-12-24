import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { clientService } from "../services";
import type { Client } from "../types";

export const fetchClients = createAsyncThunk("clients/fetchAll", async () => {
  return await clientService.getAll();
});

export const deleteClient = createAsyncThunk(
  "clients/delete",
  async (id: string) => {
    await clientService.delete(id);
    return id;
  }
);

const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    items: [] as Client[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch clients";
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (client: Client) => client.id !== action.payload
        );
      });
  },
});

export default clientsSlice.reducer;
