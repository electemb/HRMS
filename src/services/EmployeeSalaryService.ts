import { BaseService } from "./BaseService";

/**
 * Employee Salary entity interface
 */
export interface EmployeeSalary {
  id: string;
  employeeId: string;
  salaryTemplateId: string;
  annualCTC: number;
  effectiveFrom: string;
  effectiveTo?: string;
  isActive: boolean;
  componentOverrides?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Create employee salary DTO
 */
export interface CreateEmployeeSalaryDto {
  employeeId: string;
  salaryTemplateId: string;
  annualCTC: number;
  effectiveFrom: string;
  isActive: boolean;
  componentOverrides?: string;
  remarks?: string;
}

/**
 * Update employee salary DTO
 */
export interface UpdateEmployeeSalaryDto extends Partial<CreateEmployeeSalaryDto> {
  effectiveTo?: string;
}

/**
 * Employee Salary Service
 * Handles all employee salary-related API operations
 */
class EmployeeSalaryService extends BaseService<
  EmployeeSalary,
  CreateEmployeeSalaryDto,
  UpdateEmployeeSalaryDto
> {
  constructor() {
    super("/employeesalaries");
  }

  /**
   * Get salary by employee ID
   * @param employeeId Employee ID
   */
  async getByEmployee(employeeId: string): Promise<EmployeeSalary[]> {
    return this.customGet("", { employeeId });
  }

  /**
   * Get active salary for employee
   * @param employeeId Employee ID
   */
  async getActiveSalary(employeeId: string): Promise<EmployeeSalary | null> {
    const salaries = await this.customGet<EmployeeSalary[]>("", {
      employeeId,
      activeOnly: "true",
    });
    return salaries.length > 0 ? salaries[0] : null;
  }
}

// Export singleton instance
export const employeeSalaryService = new EmployeeSalaryService();
export default employeeSalaryService;
