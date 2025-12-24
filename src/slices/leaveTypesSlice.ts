import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  leaveTypeService,
  type LeaveType,
  type CreateLeaveTypeDto,
  type UpdateLeaveTypeDto,
} from "../services";

export const fetchLeaveTypes = createAsyncThunk(
  "leaveTypes/fetchAll",
  async (activeOnly?: boolean) => {
    return activeOnly
      ? await leaveTypeService.getAllActive()
      : await leaveTypeService.getAll();
  }
);

export const fetchLeaveTypeById = createAsyncThunk(
  "leaveTypes/fetchById",
  async (id: string) => {
    return await leaveTypeService.getById(id);
  }
);

export const createLeaveType = createAsyncThunk(
  "leaveTypes/create",
  async (leaveType: CreateLeaveTypeDto) => {
    return await leaveTypeService.create(leaveType);
  }
);

export const updateLeaveType = createAsyncThunk(
  "leaveTypes/update",
  async ({ id, ...data }: { id: string } & UpdateLeaveTypeDto) => {
    return await leaveTypeService.update(id, data);
  }
);

export const deleteLeaveType = createAsyncThunk(
  "leaveTypes/delete",
  async (id: string) => {
    await leaveTypeService.delete(id);
    return id;
  }
);

export const activateLeaveType = createAsyncThunk(
  "leaveTypes/activate",
  async (id: string) => {
    return await leaveTypeService.activate(id);
  }
);

export const deactivateLeaveType = createAsyncThunk(
  "leaveTypes/deactivate",
  async (id: string) => {
    return await leaveTypeService.deactivate(id);
  }
);

const leaveTypesSlice = createSlice({
  name: "leaveTypes",
  initialState: {
    items: [] as LeaveType[],
    selectedLeaveType: null as LeaveType | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearSelectedLeaveType: (state) => {
      state.selectedLeaveType = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all leave types
      .addCase(fetchLeaveTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveTypes.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeaveTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch leave types";
      })
      // Fetch leave type by ID
      .addCase(fetchLeaveTypeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveTypeById.fulfilled, (state, action) => {
        state.selectedLeaveType = action.payload;
        state.loading = false;
      })
      .addCase(fetchLeaveTypeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch leave type";
      })
      // Create leave type
      .addCase(createLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLeaveType.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(createLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create leave type";
      })
      // Update leave type
      .addCase(updateLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLeaveType.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (lt: LeaveType) => lt.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedLeaveType?.id === action.payload.id) {
          state.selectedLeaveType = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update leave type";
      })
      // Delete leave type
      .addCase(deleteLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLeaveType.fulfilled, (state, action) => {
        state.items = state.items.filter((lt) => lt.id !== action.payload);
        if (state.selectedLeaveType?.id === action.payload) {
          state.selectedLeaveType = null;
        }
        state.loading = false;
      })
      .addCase(deleteLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete leave type";
      })
      // Activate leave type
      .addCase(activateLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateLeaveType.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (lt: LeaveType) => lt.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(activateLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to activate leave type";
      })
      // Deactivate leave type
      .addCase(deactivateLeaveType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateLeaveType.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (lt: LeaveType) => lt.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(deactivateLeaveType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to deactivate leave type";
      });
  },
});

export const { clearSelectedLeaveType, clearError } = leaveTypesSlice.actions;
export default leaveTypesSlice.reducer;
