// Department Types
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  parentDepartmentId?: string;
  parentDepartment?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDepartmentDto {
  name: string;
  code: string;
  description?: string;
  parentDepartmentId?: string;
}

export type UpdateDepartmentDto = CreateDepartmentDto;
