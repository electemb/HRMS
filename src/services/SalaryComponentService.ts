import { BaseService } from "./BaseService";

/**
 * Salary Component entity
 */
export interface SalaryComponent {
  id: string;
  name: string;
  code: string;
  type: "earning" | "deduction";
  calculationType: "fixed" | "percentage" | "formula";
  value: number;
  baseComponent?: string;
  isMandatory: boolean;
  isTaxable: boolean;
  isStatutory: boolean;
  displayOrder: number;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a salary component
 */
export interface CreateSalaryComponentDto {
  name: string;
  code: string;
  type: "earning" | "deduction";
  calculationType: "fixed" | "percentage" | "formula";
  value: number;
  baseComponent?: string;
  isMandatory: boolean;
  isTaxable: boolean;
  isStatutory: boolean;
  displayOrder: number;
  isActive: boolean;
  description?: string;
}

/**
 * DTO for updating a salary component
 */
export type UpdateSalaryComponentDto = CreateSalaryComponentDto;

/**
 * Service for Salary Component CRUD operations
 * Extends BaseService with salary component-specific methods
 */
class SalaryComponentService extends BaseService<
  SalaryComponent,
  CreateSalaryComponentDto,
  UpdateSalaryComponentDto
> {
  constructor() {
    super("/salarycomponents");
  }

  /**
   * Get all active salary components
   */
  async getAllActive(): Promise<SalaryComponent[]> {
    return this.getAll({ activeOnly: "true" });
  }

  /**
   * Get salary components by type
   */
  async getByType(type: "earning" | "deduction"): Promise<SalaryComponent[]> {
    return this.getAll({ type, activeOnly: "true" });
  }

  /**
   * Get earning components
   */
  async getEarnings(): Promise<SalaryComponent[]> {
    return this.getByType("earning");
  }

  /**
   * Get deduction components
   */
  async getDeductions(): Promise<SalaryComponent[]> {
    return this.getByType("deduction");
  }

  /**
   * Activate a salary component
   */
  async activate(id: string): Promise<SalaryComponent> {
    return this.customPut<SalaryComponent>(`/${id}/activate`);
  }

  /**
   * Deactivate a salary component
   */
  async deactivate(id: string): Promise<SalaryComponent> {
    return this.customPut<SalaryComponent>(`/${id}/deactivate`);
  }
}

// Export singleton instance
export const salaryComponentService = new SalaryComponentService();
