import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeService } from "../services";
import type { Employee, CreateEmployeeDto, UpdateEmployeeDto } from "../types";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async () => {
    return await employeeService.getAll();
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id: string) => {
    await employeeService.delete(id);
    return id;
  }
);

export const addEmployee = createAsyncThunk(
  "employees/add",
  async (data: CreateEmployeeDto) => {
    return await employeeService.create(data);
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, data }: { id: string; data: UpdateEmployeeDto }) => {
    return await employeeService.update(id, data);
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    items: [] as Employee[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch employees";
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (emp: Employee) => emp.id !== action.payload
        );
      });
  },
});

export default employeesSlice.reducer;
