import { BaseService } from "./BaseService";
import type { Department, CreateDepartmentDto, UpdateDepartmentDto } from "../types/department";

/**
 * Department Service
 * Handles all department-related API operations
 */
class DepartmentService extends BaseService<
  Department,
  CreateDepartmentDto,
  UpdateDepartmentDto
> {
  constructor() {
    super("/departments");
  }

  /**
   * Get all active departments
   */
  async getActive(): Promise<Department[]> {
    return this.getAll({ activeOnly: "true" });
  }

  /**
   * Get departments by parent
   * @param parentId Parent department ID
   */
  async getByParent(parentId: string): Promise<Department[]> {
    return this.customGet("", { parentDepartmentId: parentId });
  }
}

// Export singleton instance
export const departmentService = new DepartmentService();
export default departmentService;
