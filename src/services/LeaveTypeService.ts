import { BaseService } from "./BaseService";
import type {
  LeaveType,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
} from "../types/leave";

/**
 * Service for Leave Type CRUD operations
 * Extends BaseService with leave type-specific methods
 */
class LeaveTypeService extends BaseService<
  LeaveType,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto
> {
  constructor() {
    super("/leavetypes");
  }

  /**
   * Get all active leave types
   */
  async getAllActive(): Promise<LeaveType[]> {
    return this.getAll({ activeOnly: "true" });
  }

  /**
   * Get paid leave types only
   */
  async getPaidLeaveTypes(): Promise<LeaveType[]> {
    return this.getAll({ isPaidLeave: "true", activeOnly: "true" });
  }

  /**
   * Get leave types by gender applicability
   */
  async getByGender(gender: "Male" | "Female" | "All"): Promise<LeaveType[]> {
    return this.getAll({ applicableGender: gender, activeOnly: "true" });
  }

  /**
   * Get leave types that accrue monthly
   */
  async getAccrualLeaveTypes(): Promise<LeaveType[]> {
    return this.getAll({ accruesMonthly: "true", activeOnly: "true" });
  }

  /**
   * Activate a leave type
   */
  async activate(id: string): Promise<LeaveType> {
    return this.customPut<LeaveType>(`/${id}/activate`);
  }

  /**
   * Deactivate a leave type
   */
  async deactivate(id: string): Promise<LeaveType> {
    return this.customPut<LeaveType>(`/${id}/deactivate`);
  }
}

// Export singleton instance
export const leaveTypeService = new LeaveTypeService();
