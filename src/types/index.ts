/**
 * Centralized Type Definitions Index
 * 
 * All entity types are defined in separate files and exported here for easy import.
 * This follows the Single Responsibility Principle (SRP) and DRY principle.
 * 
 * Usage:
 *   import { Employee, Department, Designation } from '../types';
 * 
 * Instead of:
 *   - Defining interfaces locally in components ❌
 *   - Duplicating type definitions across files ❌
 *   - Importing from service files ❌
 */

// HR Module Types
export type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from './employee';

export type {
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from './department';

export type {
  Designation,
  CreateDesignationDto,
  UpdateDesignationDto,
} from './designation';

// Leave Management Types
export type {
  LeaveType,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
  LeaveBalance,
  LeaveBalanceSummary,
  LeaveApplication,
  CreateLeaveApplicationDto,
  UpdateLeaveApplicationDto,
  LeaveTypeFilters,
  LeaveBalanceFilters,
  LeaveApplicationFilters,
} from './leave';

// Grade & Leave Policy Types
export type {
  Grade,
  CreateGradeDto,
  UpdateGradeDto,
  GradeLeavePolicy,
  CreateGradeLeavePolicyDto,
  UpdateGradeLeavePolicyDto,
  AccrualStrategy,
  ProRataMethod,
} from './grade';

// Localization Types
export type {
  Country,
  CreateCountryDto,
  UpdateCountryDto,
  State,
  CreateStateDto,
  UpdateStateDto,
} from './localization';

// Financial Year Types
export type {
  FinancialYear,
  CreateFinancialYearDto,
  UpdateFinancialYearDto,
} from './financialYear';

// Holiday Types
export type {
  Holiday,
  CreateHolidayDto,
  UpdateHolidayDto,
} from './holiday';

// Payroll Types
export type {
  SalaryComponent,
  DesignationSalaryTemplate,
  EmployeeSalaryStructure,
  PayrollCalculation,
} from './payroll';

// Project Management Types
export type {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
} from './project';

// CRM Types
export type {
  Client,
  CreateClientDto,
  UpdateClientDto,
} from './client';

// Common Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}
