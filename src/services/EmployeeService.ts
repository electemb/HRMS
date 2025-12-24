import { BaseService } from "./BaseService";
import type {
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from "../types/employee";

/**
 * Employee Service
 * Handles all employee-related API operations
 */
class EmployeeService extends BaseService<
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto
> {
  constructor() {
    super("/employees");
  }

  /**
   * Get all active employees
   */
  async getActive(): Promise<Employee[]> {
    return this.getAll({ status: "Active" });
  }

  /**
   * Search employees by query
   * @param query Search query
   */
  async search(query: string): Promise<Employee[]> {
    return this.customGet("", { search: query });
  }

  /**
   * Get employees by department
   * @param departmentId Department ID
   */
  async getByDepartment(departmentId: string): Promise<Employee[]> {
    return this.customGet("", { departmentId });
  }

  /**
   * Get employees by designation
   * @param designationId Designation ID
   */
  async getByDesignation(designationId: string): Promise<Employee[]> {
    return this.customGet("", { designationId });
  }
}

// Export singleton instance
export const employeeService = new EmployeeService();
export default employeeService;
