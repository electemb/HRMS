// Employee Types
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber?: string;
  alternatePhone?: string;
  departmentId?: string;
  department?: string;
  designationId?: string;
  designation?: string;
  reportingManagerId?: string;
  reportingManager?: string;
  dateOfJoining?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  employeeStatus?: string;
  employmentType?: string;
  workMode?: string;
  workLocation?: string;
  currentAddress?: string;
  permanentAddress?: string;
  aadharNumber?: string;
  panNumber?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phoneNumber?: string;
  departmentId?: string;
  designationId?: string;
  dateOfJoining?: string;
  dateOfBirth?: string;
  gender?: string;
  employmentType?: string;
  workMode?: string;
  salaryTemplateId?: string;
}

export interface UpdateEmployeeDto extends CreateEmployeeDto {
  employeeId?: string;
  employeeStatus?: string;
}
