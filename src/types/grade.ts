export interface Grade {
  id: string;
  code: string;
  name: string;
  level: number;
  description?: string;
  isActive: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGradeDto {
  code: string;
  name: string;
  level: number;
  description?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  displayOrder?: number;
}

export interface UpdateGradeDto extends CreateGradeDto {
  isActive: boolean;
}

export const AccrualStrategy = {
  Inherit: 0,
  AnnualCredit: 1,
  Monthly: 2,
  Quarterly: 3
} as const;

export type AccrualStrategy = typeof AccrualStrategy[keyof typeof AccrualStrategy];

export const ProRataMethod = {
  Inherit: 0,
  CalendarDays: 1,
  WorkingDays: 2,
  None: 3
} as const;

export type ProRataMethod = typeof ProRataMethod[keyof typeof ProRataMethod];

export interface GradeLeavePolicy {
  id: string;
  gradeId: string;
  leaveTypeId: string;
  financialYearId?: string;
  countryId?: string;
  stateId?: string;
  year: number;
  maxDaysPerYear: number;
  accrualStrategy: AccrualStrategy;
  proRataMethod: ProRataMethod;
  carryForwardLimit?: number;
  priority: number;
  isActive: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateGradeLeavePolicyDto {
  gradeId: string;
  leaveTypeId: string;
  financialYearId?: string;
  countryId?: string;
  stateId?: string;
  year: number;
  maxDaysPerYear: number;
  accrualStrategy?: AccrualStrategy;
  proRataMethod?: ProRataMethod;
  carryForwardLimit?: number;
  priority?: number;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface UpdateGradeLeavePolicyDto extends CreateGradeLeavePolicyDto {
  isActive: boolean;
}
