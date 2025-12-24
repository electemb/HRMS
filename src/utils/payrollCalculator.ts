import type { SalaryComponent, PayrollCalculation } from "../types/payroll";

export class PayrollCalculator {
  /**
   * Calculate complete salary structure from CTC and components
   */
  static calculateSalary(
    ctc: number,
    components: SalaryComponent[]
  ): PayrollCalculation {
    const earnings: SalaryComponent[] = [];
    const deductions: SalaryComponent[] = [];

    let calculatedValues: Record<string, number> = {
      ctc,
      basic: 0,
      gross: 0,
      taxable: 0,
    };

    // First pass: Calculate earnings
    const earningComponents = components
      .filter((c) => c.type === "earning")
      .sort((a, b) => a.displayOrder - b.displayOrder);

    for (const component of earningComponents) {
      const calculated = this.calculateComponent(component, calculatedValues);
      earnings.push(calculated);

      if (component.name === "Basic Salary") {
        calculatedValues.basic = calculated.value;
      }
    }

    // Calculate gross salary (sum of all earnings)
    const totalEarnings = earnings.reduce((sum, c) => sum + c.value, 0);
    calculatedValues.gross = totalEarnings;
    calculatedValues.taxable = earnings
      .filter((c) => c.isTaxable)
      .reduce((sum, c) => sum + c.value, 0);

    // Second pass: Calculate deductions
    const deductionComponents = components
      .filter((c) => c.type === "deduction")
      .sort((a, b) => a.displayOrder - b.displayOrder);

    for (const component of deductionComponents) {
      const calculated = this.calculateComponent(component, calculatedValues);
      deductions.push(calculated);
    }

    const totalDeductions = deductions.reduce((sum, c) => sum + c.value, 0);
    const netSalary = totalEarnings - totalDeductions;

    return {
      ctc,
      grossSalary: totalEarnings,
      totalEarnings,
      totalDeductions,
      netSalary,
      monthlyGross: Math.round(totalEarnings / 12),
      monthlyNet: Math.round(netSalary / 12),
      earnings,
      deductions,
    };
  }

  /**
   * Calculate individual component value
   */
  private static calculateComponent(
    component: SalaryComponent,
    calculatedValues: Record<string, number>
  ): SalaryComponent {
    let value = 0;

    switch (component.calculationType) {
      case "fixed":
        value = component.value;
        break;

      case "percentage":
        const base = this.getBaseValue(
          component.baseComponent,
          calculatedValues
        );
        value = Math.round((base * component.value) / 100);
        break;

      case "formula":
        // For complex formulas, implement as needed
        value = component.value;
        break;
    }

    return {
      ...component,
      value: Math.round(value),
    };
  }

  /**
   * Get base value for percentage calculations
   */
  private static getBaseValue(
    baseComponent: string | undefined,
    calculatedValues: Record<string, number>
  ): number {
    if (!baseComponent) return 0;
    return calculatedValues[baseComponent.toLowerCase()] || 0;
  }

  /**
   * Auto-balance special allowance to match CTC
   */
  static autoBalanceComponents(
    ctc: number,
    components: SalaryComponent[]
  ): SalaryComponent[] {
    const result = [...components];
    const specialAllowanceIndex = result.findIndex(
      (c) => c.name === "Special Allowance"
    );

    if (specialAllowanceIndex === -1) return result;

    // Calculate with special allowance = 0
    const tempComponents = result.map((c) =>
      c.name === "Special Allowance" ? { ...c, value: 0 } : c
    );

    const calculation = this.calculateSalary(ctc, tempComponents);
    const currentTotal = calculation.grossSalary;
    const deficit = ctc - currentTotal;

    // Set special allowance to balance
    if (deficit > 0) {
      result[specialAllowanceIndex] = {
        ...result[specialAllowanceIndex],
        value: deficit,
      };
    }

    return result;
  }

  /**
   * Validate salary structure
   */
  static validateStructure(
    ctc: number,
    components: SalaryComponent[]
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for mandatory components
    const hasBasic = components.some((c) => c.name === "Basic Salary");
    if (!hasBasic) {
      errors.push("Basic Salary is mandatory");
    }

    const hasPF = components.some((c) => c.name === "Provident Fund (PF)");
    if (!hasPF) {
      errors.push("Provident Fund is mandatory");
    }

    // Check if CTC is valid
    if (ctc <= 0) {
      errors.push("CTC must be greater than 0");
    }

    // Calculate and check totals
    const calculation = this.calculateSalary(ctc, components);
    const difference = Math.abs(ctc - calculation.grossSalary);

    if (difference > 100) {
      errors.push(
        `Salary components (₹${calculation.grossSalary.toLocaleString()}) don't match CTC (₹${ctc.toLocaleString()})`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
