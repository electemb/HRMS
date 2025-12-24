export interface FinancialYear {
  id: string;
  code: string;
  startDate: string;
  endDate: string;
  yearNumber: number;
  isCurrent: boolean;
  isClosed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFinancialYearDto {
  code: string;
  startDate: string;
  endDate: string;
  yearNumber?: number;
  isCurrent?: boolean;
}

export interface UpdateFinancialYearDto extends CreateFinancialYearDto {
  isClosed: boolean;
}
