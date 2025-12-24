// Leave Type Interfaces
export interface LeaveType {
  id: string;
  name: string;
  code: string;
  description: string;
  maxDaysPerYear: number;
  maxCarryForwardDays: number;
  isCarryForwardAllowed: boolean;
  isPaidLeave: boolean;
  isActive: boolean;
  requiresApproval: boolean;
  requiresDocumentation: boolean;
  canBeAppliedInAdvance: boolean;
  minDaysInAdvance: number;
  maxConsecutiveDays: number;
  applicableGender?: "Male" | "Female" | "All";
  applicableEmploymentType?: "Permanent" | "Contract" | "Intern" | "All";
  accruesMonthly: boolean;
  monthlyAccrualRate: number;
  deductsSalary: boolean;
  isOneTimeAllowance: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveTypeDto {
  name: string;
  code: string;
  description: string;
  maxDaysPerYear: number;
  maxCarryForwardDays: number;
  isCarryForwardAllowed: boolean;
  isPaidLeave: boolean;
  isActive: boolean;
  requiresApproval: boolean;
  requiresDocumentation: boolean;
  canBeAppliedInAdvance: boolean;
  minDaysInAdvance: number;
  maxConsecutiveDays: number;
  applicableGender?: "Male" | "Female" | "All";
  applicableEmploymentType?: "Permanent" | "Contract" | "Intern" | "All";
  accruesMonthly: boolean;
  monthlyAccrualRate: number;
  deductsSalary: boolean;
  isOneTimeAllowance: boolean;
}

export type UpdateLeaveTypeDto = CreateLeaveTypeDto;

// Leave Balance Interfaces
export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeCode: string;
  year: number;
  opening: number;
  accrued: number;
  used: number;
  available: number;
  carryForward: number;
  lapsed: number;
  adjusted: number;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalanceSummary {
  leaveTypeCode: string;
  leaveTypeName: string;
  available: number;
  used: number;
  total: number;
  isPaidLeave: boolean;
}

// Leave Application Interfaces
export interface LeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  leaveTypeCode: string;
  startDate: string;
  endDate: string;
  numberOfDays: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  documentPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeaveApplicationDto {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  documentPath?: string;
}

export interface UpdateLeaveApplicationDto {
  status: "Approved" | "Rejected" | "Cancelled";
  rejectionReason?: string;
}

// Filters and Query Parameters
export interface LeaveTypeFilters {
  activeOnly?: boolean;
  isPaidLeave?: boolean;
  requiresApproval?: boolean;
  applicableGender?: "Male" | "Female" | "All";
}

export interface LeaveBalanceFilters {
  employeeId?: string;
  leaveTypeId?: string;
  year?: number;
}

export interface LeaveApplicationFilters {
  employeeId?: string;
  leaveTypeId?: string;
  status?: "Pending" | "Approved" | "Rejected" | "Cancelled";
  fromDate?: string;
  toDate?: string;
}
