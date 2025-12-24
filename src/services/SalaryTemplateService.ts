import { BaseService } from "./BaseService";

/**
 * Salary Template entity interface
 */
export interface SalaryTemplate {
  id: string;
  code: string;
  name: string;
  description?: string;
  ctcMin: number;
  ctcMax: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Template Component interface
 */
export interface TemplateComponent {
  id: string;
  salaryComponentId: string;
  componentCode?: string;
  componentName?: string;
  componentType?: string;
  calculationType?: string;
  defaultValue: number;
  baseComponent?: string;
  displayOrder: number;
}

/**
 * Create salary template DTO
 */
export interface CreateSalaryTemplateDto {
  code: string;
  name: string;
  description?: string;
  ctcMin: number;
  ctcMax: number;
  components?: TemplateComponent[];
}

/**
 * Update salary template DTO
 */
export interface UpdateSalaryTemplateDto extends CreateSalaryTemplateDto {
  isActive?: boolean;
}

/**
 * Salary Template Service
 * Handles all salary template-related API operations
 */
class SalaryTemplateService extends BaseService<
  SalaryTemplate,
  CreateSalaryTemplateDto,
  UpdateSalaryTemplateDto
> {
  constructor() {
    super("/salarytemplates");
  }

  /**
   * Get all active salary templates
   */
  async getActive(): Promise<SalaryTemplate[]> {
    return this.getAll({ activeOnly: "true" });
  }

  /**
   * Get template with components
   * @param id Template ID
   */
  async getWithComponents(id: string): Promise<SalaryTemplate> {
    return this.customGet(`/${id}/components`);
  }

  /**
   * Get templates by CTC range
   * @param minCtc Minimum CTC
   * @param maxCtc Maximum CTC
   */
  async getByCtcRange(
    minCtc: number,
    maxCtc: number
  ): Promise<SalaryTemplate[]> {
    return this.customGet("", { minCtc: minCtc.toString(), maxCtc: maxCtc.toString() });
  }
}

// Export singleton instance
export const salaryTemplateService = new SalaryTemplateService();
export default salaryTemplateService;
