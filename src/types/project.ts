// Project Types
export interface Project {
  id: string;
  name: string;
  code: string;
  description?: string;
  clientId?: string;
  client?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  projectType?: string;
  budget?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProjectDto {
  name: string;
  code: string;
  description?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  projectType?: string;
  budget?: number;
}

export type UpdateProjectDto = CreateProjectDto;
