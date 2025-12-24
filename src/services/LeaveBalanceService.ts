import { BaseService } from "./BaseService";
import type { LeaveBalance } from "../types/leave";

/**
 * DTO for assigning leave balances to an employee
 */
export interface AssignLeaveBalancesDto {
  message: string;
}

/**
 * DTO for adjusting leave balance
 */
export interface AdjustLeaveBalanceDto {
  adjustmentDays: number;
  reason: string;
}

/**
 * Service for Leave Balance operations
 * Extends BaseService with leave balance-specific methods
 */
class LeaveBalanceService extends BaseService<LeaveBalance, never, never> {
  constructor() {
    super("/leavebalances");
  }

  /**
   * Assign default leave balances to an employee
   * @param employeeId Employee ID
   */
  async assignToEmployee(employeeId: string): Promise<AssignLeaveBalancesDto> {
    return this.customPost<AssignLeaveBalancesDto>(
      `/../employees/${employeeId}/leave-balances/assign`
    );
  }

  /**
   * Get leave balances for a specific employee
   * @param employeeId Employee ID
   * @param year Optional year filter
   */
  async getByEmployee(
    employeeId: string,
    year?: number
  ): Promise<LeaveBalance[]> {
    const params: Record<string, string> = { employeeId };
    if (year) {
      params.year = year.toString();
    }
    return this.getAll(params);
  }

  /**
   * Get leave balance summary for an employee
   * @param employeeId Employee ID
   */
  async getSummary(employeeId: string): Promise<LeaveBalance[]> {
    return this.customGet<LeaveBalance[]>(
      `?employeeId=${employeeId}&year=${new Date().getFullYear()}`
    );
  }

  /**
   * Adjust leave balance manually
   * @param leaveBalanceId Leave Balance ID
   * @param adjustment Adjustment data
   */
  async adjust(
    leaveBalanceId: string,
    adjustment: AdjustLeaveBalanceDto
  ): Promise<LeaveBalance> {
    return this.customPost<LeaveBalance>(
      `/${leaveBalanceId}/adjust`,
      adjustment
    );
  }

  /**
   * Get available balance for a specific leave type
   * @param employeeId Employee ID
   * @param leaveTypeId Leave Type ID
   */
  async getAvailableBalance(
    employeeId: string,
    leaveTypeId: string
  ): Promise<number> {
    const balances = await this.getByEmployee(
      employeeId,
      new Date().getFullYear()
    );
    const balance = balances.find((b) => b.leaveTypeId === leaveTypeId);
    return balance?.available || 0;
  }
}

// Export singleton instance
export const leaveBalanceService = new LeaveBalanceService();
