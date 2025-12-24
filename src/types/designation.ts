// Designation Types
export interface Designation {
  id: string;
  title: string;
  code: string;
  description?: string;
  departmentId: string;
  departmentName?: string;
  departmentCode?: string;
  level: string;
  minSalary: number;
  maxSalary: number;
  requiredSkills?: string;
  jobDescription?: string;
  isActive?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDesignationDto {
  title: string;
  code: string;
  description?: string;
  departmentId: string;
  level: string;
  minSalary: number;
  maxSalary: number;
  requiredSkills?: string;
  jobDescription?: string;
  displayOrder?: number;
}

export type UpdateDesignationDto = CreateDesignationDto;
