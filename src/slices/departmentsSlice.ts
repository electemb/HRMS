import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { departmentService } from "../services";
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from "../types";

export const fetchDepartments = createAsyncThunk(
  "departments/fetchAll",
  async () => {
    return await departmentService.getAll();
  }
);

export const createDepartment = createAsyncThunk(
  "departments/create",
  async (department: CreateDepartmentDto) => {
    return await departmentService.create(department);
  }
);

export const updateDepartment = createAsyncThunk(
  "departments/update",
  async ({ id, ...data }: { id: string } & UpdateDepartmentDto) => {
    return await departmentService.update(id, data);
  }
);

export const deleteDepartment = createAsyncThunk(
  "departments/delete",
  async (id: string) => {
    await departmentService.delete(id);
    return id;
  }
);

const departmentsSlice = createSlice({
  name: "departments",
  initialState: {
    items: [] as Department[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch departments";
      })
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create department";
      })
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (dep: Department) => dep.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update department";
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (dep: Department) => dep.id !== action.payload
        );
      });
  },
});

export default departmentsSlice.reducer;
