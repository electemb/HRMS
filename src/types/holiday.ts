export interface Holiday {
  id: string;
  name: string;
  date: string;
  type: string;
  description?: string;
  applicableLocation?: string;
  isOptional: boolean;
  isActive: boolean;
  financialYearId?: string;
  countryId?: string;
  stateId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateHolidayDto {
  name: string;
  date: string;
  type?: string;
  description?: string;
  applicableLocation?: string;
  isOptional?: boolean;
  financialYearId?: string;
  countryId?: string;
  stateId?: string;
}

export interface UpdateHolidayDto extends CreateHolidayDto {
  isActive: boolean;
}
