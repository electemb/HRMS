import { BaseService } from "./BaseService";
import type { Designation, CreateDesignationDto, UpdateDesignationDto } from "../types/designation";

/**
 * Designation Service
 * Handles all designation-related API operations
 */
class DesignationService extends BaseService<
  Designation,
  CreateDesignationDto,
  UpdateDesignationDto
> {
  constructor() {
    super("/designations");
  }

  /**
   * Get all active designations
   */
  async getActive(): Promise<Designation[]> {
    return this.getAll({ activeOnly: "true" });
  }

  /**
   * Get designations by department
   * @param departmentId Department ID
   */
  async getByDepartment(departmentId: string): Promise<Designation[]> {
    return this.customGet("", { departmentId });
  }

  /**
   * Override getAll to add 'name' property for backward compatibility
   */
  async getAll(params?: Record<string, unknown>): Promise<Designation[]> {
    return super.getAll(params);
  }

  /**
   * Override getById
   */
  async getById(id: string): Promise<Designation> {
    return super.getById(id);
  }
}

// Export singleton instance
export const designationService = new DesignationService();
export default designationService;
