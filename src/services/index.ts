/**
 * Service Layer Entry Point
 * Centralized export for all service instances
 * 
 * NOTE: For types, import from '../types' directory instead
 */

// Export base service
export { BaseService } from "./BaseService";

// Export employee service
export { employeeService } from "./EmployeeService";

// Export department service
export { departmentService } from "./DepartmentService";

// Export designation service
export { designationService } from "./DesignationService";

// Export salary template service
export { salaryTemplateService } from "./SalaryTemplateService";
export type {
  SalaryTemplate,
  TemplateComponent,
  CreateSalaryTemplateDto,
  UpdateSalaryTemplateDto,
} from "./SalaryTemplateService";

// Export employee salary service
export { employeeSalaryService } from "./EmployeeSalaryService";
export type {
  EmployeeSalary,
  CreateEmployeeSalaryDto,
  UpdateEmployeeSalaryDto,
} from "./EmployeeSalaryService";

// Export project service
export { projectService } from "./ProjectService";

// Export client service
export { clientService } from "./ClientService";

// Export leave type service
export { leaveTypeService } from "./LeaveTypeService";
export type {
  LeaveType,
  CreateLeaveTypeDto,
  UpdateLeaveTypeDto,
} from "../types/leave";

// Export leave balance service
export { leaveBalanceService } from "./LeaveBalanceService";
export type { LeaveBalance } from "../types/leave";

// Export salary component service
export { salaryComponentService } from "./SalaryComponentService";

// Export grade services
export { gradeService } from "./GradeService";
export { gradeLeavePolicyService } from "./GradeLeavePolicyService";

// Export localization services
export { countryService, stateService } from "./LocalizationService";

// Export financial year service
export { financialYearService } from "./FinancialYearService";

// Export holiday service
export { holidayService } from "./HolidayService";

// Export organization service
export { organizationService } from "./OrganizationService";
export type { Organization } from "./OrganizationService";
