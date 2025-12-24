import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { designationService } from "../services";
import type { Designation, CreateDesignationDto, UpdateDesignationDto } from "../types";

// DRY Principle: Reuse the async thunk pattern from departmentsSlice
export const fetchDesignations = createAsyncThunk(
  "designations/fetchAll",
  async () => {
    return await designationService.getAll();
  }
);

export const createDesignation = createAsyncThunk(
  "designations/create",
  async (designation: CreateDesignationDto) => {
    return await designationService.create(designation);
  }
);

export const updateDesignation = createAsyncThunk(
  "designations/update",
  async ({ id, ...data }: { id: string } & UpdateDesignationDto) => {
    return await designationService.update(id, data);
  }
);

export const deleteDesignation = createAsyncThunk(
  "designations/delete",
  async (id: string) => {
    await designationService.delete(id);
    return id;
  }
);

const designationsSlice = createSlice({
  name: "designations",
  initialState: {
    items: [] as Designation[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all designations
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch designations";
      })
      // Create designation
      .addCase(createDesignation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDesignation.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create designation";
      })
      // Update designation
      .addCase(updateDesignation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (des: Designation) => des.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update designation";
      })
      // Delete designation
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (des: Designation) => des.id !== action.payload
        );
      });
  },
});

export default designationsSlice.reducer;
