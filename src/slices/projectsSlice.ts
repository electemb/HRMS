import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectService } from "../services";
import type { Project } from "../types";

export const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  return await projectService.getAll();
});

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id: string) => {
    await projectService.delete(id);
    return id;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    items: [] as Project[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch projects";
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (proj: Project) => proj.id !== action.payload
        );
      });
  },
});

export default projectsSlice.reducer;
