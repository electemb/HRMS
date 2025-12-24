// Salary Component Types
export interface SalaryComponent {
  id: string;
  name: string;
  type: "earning" | "deduction";
  calculationType: "fixed" | "percentage" | "formula";
  value: number;
  baseComponent?: string; // For percentage calculations
  isMandatory: boolean;
  isTaxable: boolean;
  isStatutory: boolean;
  displayOrder: number;
}

// Designation Template
export interface DesignationSalaryTemplate {
  designationId: string;
  designationName: string;
  components: SalaryComponent[];
  ctcMin: number;
  ctcMax: number;
}

// Employee Salary Structure
export interface EmployeeSalaryStructure {
  employeeId: string;
  designationId: string;
  ctc: number;
  components: SalaryComponent[];
  effectiveFrom: string;
  createdAt: string;
  updatedAt: string;
}

// Payroll Calculation Result
export interface PayrollCalculation {
  ctc: number;
  grossSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  monthlyGross: number;
  monthlyNet: number;
  earnings: SalaryComponent[];
  deductions: SalaryComponent[];
}

// Default salary components
export const DEFAULT_SALARY_COMPONENTS: Omit<
  SalaryComponent,
  "id" | "value"
>[] = [
  {
    name: "Basic Salary",
    type: "earning",
    calculationType: "percentage",
    baseComponent: "ctc",
    isMandatory: true,
    isTaxable: true,
    isStatutory: false,
    displayOrder: 1,
  },
  {
    name: "House Rent Allowance (HRA)",
    type: "earning",
    calculationType: "percentage",
    baseComponent: "basic",
    isMandatory: true,
    isTaxable: true,
    isStatutory: false,
    displayOrder: 2,
  },
  {
    name: "Dearness Allowance (DA)",
    type: "earning",
    calculationType: "percentage",
    baseComponent: "basic",
    isMandatory: false,
    isTaxable: true,
    isStatutory: false,
    displayOrder: 3,
  },
  {
    name: "Transport Allowance",
    type: "earning",
    calculationType: "fixed",
    isMandatory: false,
    isTaxable: false,
    isStatutory: false,
    displayOrder: 4,
  },
  {
    name: "Medical Allowance",
    type: "earning",
    calculationType: "fixed",
    isMandatory: false,
    isTaxable: false,
    isStatutory: false,
    displayOrder: 5,
  },
  {
    name: "Special Allowance",
    type: "earning",
    calculationType: "fixed",
    isMandatory: false,
    isTaxable: true,
    isStatutory: false,
    displayOrder: 6,
  },
  {
    name: "Provident Fund (PF)",
    type: "deduction",
    calculationType: "percentage",
    baseComponent: "basic",
    isMandatory: true,
    isTaxable: false,
    isStatutory: true,
    displayOrder: 7,
  },
  {
    name: "Employee State Insurance (ESI)",
    type: "deduction",
    calculationType: "percentage",
    baseComponent: "gross",
    isMandatory: false,
    isTaxable: false,
    isStatutory: true,
    displayOrder: 8,
  },
  {
    name: "Professional Tax",
    type: "deduction",
    calculationType: "fixed",
    isMandatory: false,
    isTaxable: false,
    isStatutory: true,
    displayOrder: 9,
  },
  {
    name: "Income Tax (TDS)",
    type: "deduction",
    calculationType: "percentage",
    baseComponent: "taxable",
    isMandatory: true,
    isTaxable: false,
    isStatutory: true,
    displayOrder: 10,
  },
];

// Designation templates with predefined component mappings
export const DESIGNATION_TEMPLATES: Record<
  string,
  Partial<DesignationSalaryTemplate>
> = {
  "Software Engineer": {
    designationName: "Software Engineer",
    ctcMin: 300000,
    ctcMax: 800000,
    components: [
      { name: "Basic Salary", value: 40 }, // 40% of CTC
      { name: "House Rent Allowance (HRA)", value: 50 }, // 50% of Basic
      { name: "Transport Allowance", value: 1600 },
      { name: "Medical Allowance", value: 1250 },
      { name: "Special Allowance", value: 0 }, // Balance
      { name: "Provident Fund (PF)", value: 12 }, // 12% of Basic
      { name: "Professional Tax", value: 200 },
    ] as any[],
  },
  "Senior Software Engineer": {
    designationName: "Senior Software Engineer",
    ctcMin: 800000,
    ctcMax: 1500000,
    components: [
      { name: "Basic Salary", value: 40 },
      { name: "House Rent Allowance (HRA)", value: 50 },
      { name: "Dearness Allowance (DA)", value: 10 }, // 10% of Basic
      { name: "Transport Allowance", value: 3200 },
      { name: "Medical Allowance", value: 1250 },
      { name: "Special Allowance", value: 0 },
      { name: "Provident Fund (PF)", value: 12 },
      { name: "Professional Tax", value: 200 },
    ] as any[],
  },
  "Team Lead": {
    designationName: "Team Lead",
    ctcMin: 1200000,
    ctcMax: 2000000,
    components: [
      { name: "Basic Salary", value: 45 },
      { name: "House Rent Allowance (HRA)", value: 50 },
      { name: "Dearness Allowance (DA)", value: 15 },
      { name: "Transport Allowance", value: 3200 },
      { name: "Medical Allowance", value: 1250 },
      { name: "Special Allowance", value: 0 },
      { name: "Provident Fund (PF)", value: 12 },
      { name: "Professional Tax", value: 200 },
    ] as any[],
  },
  Manager: {
    designationName: "Manager",
    ctcMin: 1500000,
    ctcMax: 3000000,
    components: [
      { name: "Basic Salary", value: 45 },
      { name: "House Rent Allowance (HRA)", value: 50 },
      { name: "Dearness Allowance (DA)", value: 20 },
      { name: "Transport Allowance", value: 6400 },
      { name: "Medical Allowance", value: 1250 },
      { name: "Special Allowance", value: 0 },
      { name: "Provident Fund (PF)", value: 12 },
      { name: "Professional Tax", value: 200 },
    ] as any[],
  },
  "HR Executive": {
    designationName: "HR Executive",
    ctcMin: 250000,
    ctcMax: 500000,
    components: [
      { name: "Basic Salary", value: 40 },
      { name: "House Rent Allowance (HRA)", value: 50 },
      { name: "Transport Allowance", value: 1600 },
      { name: "Medical Allowance", value: 1250 },
      { name: "Special Allowance", value: 0 },
      { name: "Provident Fund (PF)", value: 12 },
      { name: "Professional Tax", value: 200 },
    ] as any[],
  },
};
