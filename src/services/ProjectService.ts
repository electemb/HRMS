import { BaseService } from "./BaseService";
import type { Project, CreateProjectDto, UpdateProjectDto } from "../types/project";

/**
 * Project Service
 * Handles all project-related API operations
 */
class ProjectService extends BaseService<
  Project,
  CreateProjectDto,
  UpdateProjectDto
> {
  constructor() {
    super("/projects");
  }

  /**
   * Get projects by status
   * @param status Project status
   */
  async getByStatus(status: string): Promise<Project[]> {
    return this.customGet("", { status });
  }

  /**
   * Get projects by client
   * @param clientId Client ID
   */
  async getByClient(clientId: string): Promise<Project[]> {
    return this.customGet("", { clientId });
  }
}

// Export singleton instance
export const projectService = new ProjectService();
export default projectService;
