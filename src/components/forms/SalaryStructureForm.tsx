import React, { useState, useEffect } from "react";
import { Button, Input, Card } from "../ui";
import { PayrollCalculator } from "../../utils/payrollCalculator";
import type { SalaryComponent, PayrollCalculation } from "../../types/payroll";
import {
  DEFAULT_SALARY_COMPONENTS,
  DESIGNATION_TEMPLATES,
} from "../../types/payroll";
import api from "../../api";
import "./SalaryStructureForm.css";

export interface SalaryStructureFormData {
  ctc: number;
  components: SalaryComponent[];
}

interface SalaryStructureFormProps {
  initialData?: Partial<SalaryStructureFormData>;
  designationId?: string;
  designationName?: string;
  salaryTemplateId?: string;
  onSubmit: (data: SalaryStructureFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const SalaryStructureForm: React.FC<SalaryStructureFormProps> = ({
  initialData,
  designationName = "",
  salaryTemplateId,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [ctc, setCtc] = useState<number>(initialData?.ctc || 0);
  const [components, setComponents] = useState<SalaryComponent[]>([]);
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(
    null
  );
  const [, setShowAddComponent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [, setLoadingTemplate] = useState(false);

  // Load template from API if salaryTemplateId is provided
  useEffect(() => {
    if (salaryTemplateId && !initialData?.components) {
      loadTemplateFromAPI(salaryTemplateId);
    } else if (initialData?.components) {
      setComponents(initialData.components);
    } else {
      loadTemplateForDesignation();
    }
  }, [salaryTemplateId, designationName, initialData]);

  const loadTemplateFromAPI = async (templateId: string) => {
    setLoadingTemplate(true);
    try {
      const response = await api.get(`/salarytemplates/${templateId}`);
      const template = response.data;

      if (template && template.components) {
        // Convert API components to SalaryComponent format
        const templateComponents: SalaryComponent[] = template.components.map(
          (tc: any, index: number) => ({
            id: tc.salaryComponent?.id || `comp-${index}`,
            name: tc.salaryComponent?.name || "",
            type: tc.salaryComponent?.type || "earning",
            calculationType: tc.salaryComponent?.calculationType || "fixed",
            value: tc.defaultValue || 0,
            baseComponent:
              tc.baseComponent || tc.salaryComponent?.baseComponent,
            isMandatory:
              tc.isMandatory || tc.salaryComponent?.isMandatory || false,
            isTaxable: tc.salaryComponent?.isTaxable || false,
            isStatutory: tc.salaryComponent?.isStatutory || false,
            displayOrder:
              tc.displayOrder || tc.salaryComponent?.displayOrder || index,
          })
        );

        setComponents(templateComponents);

        // Set default CTC from template if not already set
        if (template.ctcMin && !initialData?.ctc) {
          setCtc(template.ctcMin);
        }
      } else {
        // Fallback to default components
        loadDefaultComponents();
      }
    } catch (error) {
      console.error("Failed to load salary template:", error);
      // Fallback to designation-based or default components
      loadTemplateForDesignation();
    } finally {
      setLoadingTemplate(false);
    }
  };

  // Recalculate when CTC or components change
  useEffect(() => {
    if (ctc > 0 && components.length > 0) {
      try {
        const balancedComponents = PayrollCalculator.autoBalanceComponents(
          ctc,
          components
        );
        setComponents(balancedComponents);
        const calc = PayrollCalculator.calculateSalary(ctc, balancedComponents);
        setCalculation(calc);

        // Validate
        const validation = PayrollCalculator.validateStructure(
          ctc,
          balancedComponents
        );
        setErrors(validation.errors);
      } catch (error) {
        console.error("Calculation error:", error);
      }
    }
  }, [ctc, components.length]);

  const loadTemplateForDesignation = () => {
    const template = DESIGNATION_TEMPLATES[designationName];
    if (template?.components) {
      const templateComponents: SalaryComponent[] = template.components.map(
        (tc, index) => {
          const defaultComp = DEFAULT_SALARY_COMPONENTS.find(
            (dc) => dc.name === tc.name
          );
          return {
            id: `comp-${index}`,
            ...defaultComp!,
            value: tc.value,
          };
        }
      );
      setComponents(templateComponents);

      // Set default CTC from template
      if (template.ctcMin && !initialData?.ctc) {
        setCtc(template.ctcMin);
      }
    } else {
      // Load default components
      loadDefaultComponents();
    }
  };

  const loadDefaultComponents = () => {
    const defaultComps: SalaryComponent[] = [
      {
        id: "basic",
        name: "Basic Salary",
        type: "earning",
        calculationType: "percentage",
        value: 40,
        baseComponent: "ctc",
        isMandatory: true,
        isTaxable: true,
        isStatutory: false,
        displayOrder: 1,
      },
      {
        id: "hra",
        name: "House Rent Allowance (HRA)",
        type: "earning",
        calculationType: "percentage",
        value: 50,
        baseComponent: "basic",
        isMandatory: true,
        isTaxable: true,
        isStatutory: false,
        displayOrder: 2,
      },
      {
        id: "ta",
        name: "Transport Allowance",
        type: "earning",
        calculationType: "fixed",
        value: 1600,
        isMandatory: false,
        isTaxable: false,
        isStatutory: false,
        displayOrder: 3,
      },
      {
        id: "ma",
        name: "Medical Allowance",
        type: "earning",
        calculationType: "fixed",
        value: 1250,
        isMandatory: false,
        isTaxable: false,
        isStatutory: false,
        displayOrder: 4,
      },
      {
        id: "special",
        name: "Special Allowance",
        type: "earning",
        calculationType: "fixed",
        value: 0,
        isMandatory: false,
        isTaxable: true,
        isStatutory: false,
        displayOrder: 5,
      },
      {
        id: "pf",
        name: "Provident Fund (PF)",
        type: "deduction",
        calculationType: "percentage",
        value: 12,
        baseComponent: "basic",
        isMandatory: true,
        isTaxable: false,
        isStatutory: true,
        displayOrder: 6,
      },
      {
        id: "pt",
        name: "Professional Tax",
        type: "deduction",
        calculationType: "fixed",
        value: 200,
        isMandatory: false,
        isTaxable: false,
        isStatutory: true,
        displayOrder: 7,
      },
    ];
    setComponents(defaultComps);
  };

  const handleComponentChange = (
    id: string,
    field: keyof SalaryComponent,
    value: any
  ) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveComponent = (id: string) => {
    const component = components.find((c) => c.id === id);
    if (component?.isMandatory) {
      alert("Cannot remove mandatory component");
      return;
    }
    setComponents((prev) => prev.filter((c) => c.id !== id));
  };

  // Note: Add-new component flow will be implemented in the UI; setter kept for future toggle usage

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = PayrollCalculator.validateStructure(ctc, components);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit({
      ctc,
      components,
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="salary-structure-form">
      {/* CTC Input Section */}
      <div className="form-section">
        <h3 className="section-title">Cost to Company (CTC)</h3>
        <div className="ctc-input-wrapper">
          <Input
            label="Annual CTC"
            type="number"
            value={ctc || ""}
            onChange={(e) => setCtc(Number(e.target.value))}
            placeholder="Enter annual CTC"
            required
          />
          {ctc > 0 && (
            <div className="ctc-breakdown">
              <span>Monthly: {formatCurrency(ctc / 12)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Earnings Section */}
      <div className="form-section">
        <div className="section-header">
          <h3 className="section-title">Earnings</h3>
        </div>
        <div className="components-list">
          {components
            .filter((c) => c.type === "earning")
            .map((component) => (
              <Card key={component.id} className="component-card" padding="sm">
                <div className="component-header">
                  <div className="component-name">
                    <input
                      type="text"
                      value={component.name}
                      onChange={(e) =>
                        handleComponentChange(
                          component.id,
                          "name",
                          e.target.value
                        )
                      }
                      className="component-name-input"
                      disabled={component.isMandatory}
                    />
                    {component.isMandatory && (
                      <span className="mandatory-badge">Mandatory</span>
                    )}
                  </div>
                  {!component.isMandatory && (
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(component.id)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="component-inputs">
                  <div className="input-group">
                    <label>Calculation Type</label>
                    <select
                      value={component.calculationType}
                      onChange={(e) =>
                        handleComponentChange(
                          component.id,
                          "calculationType",
                          e.target.value
                        )
                      }
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>
                  {component.calculationType === "percentage" && (
                    <div className="input-group">
                      <label>Base On</label>
                      <select
                        value={component.baseComponent || ""}
                        onChange={(e) =>
                          handleComponentChange(
                            component.id,
                            "baseComponent",
                            e.target.value
                          )
                        }
                      >
                        <option value="ctc">CTC</option>
                        <option value="basic">Basic Salary</option>
                        <option value="gross">Gross Salary</option>
                      </select>
                    </div>
                  )}
                  <div className="input-group">
                    <label>
                      {component.calculationType === "percentage"
                        ? "Percentage"
                        : "Amount"}
                    </label>
                    <input
                      type="number"
                      value={component.value}
                      onChange={(e) =>
                        handleComponentChange(
                          component.id,
                          "value",
                          Number(e.target.value)
                        )
                      }
                      min="0"
                      step={
                        component.calculationType === "percentage"
                          ? "0.1"
                          : "100"
                      }
                    />
                  </div>
                  {calculation && (
                    <div className="calculated-value">
                      {formatCurrency(
                        calculation.earnings.find((e) => e.id === component.id)
                          ?.value || 0
                      )}
                    </div>
                  )}
                </div>
                <div className="component-flags">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={component.isTaxable}
                      onChange={(e) =>
                        handleComponentChange(
                          component.id,
                          "isTaxable",
                          e.target.checked
                        )
                      }
                    />
                    Taxable
                  </label>
                </div>
              </Card>
            ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddComponent(true)}
          className="add-component-btn"
        >
          + Add Earning Component
        </Button>
      </div>

      {/* Deductions Section */}
      <div className="form-section">
        <div className="section-header">
          <h3 className="section-title">Deductions</h3>
        </div>
        <div className="components-list">
          {components
            .filter((c) => c.type === "deduction")
            .map((component) => (
              <Card key={component.id} className="component-card" padding="sm">
                <div className="component-header">
                  <div className="component-name">
                    <input
                      type="text"
                      value={component.name}
                      onChange={(e) =>
                        handleComponentChange(
                          component.id,
                          "name",
                          e.target.value
                        )
                      }
                      className="component-name-input"
                      disabled={component.isMandatory}
                    />
                    {component.isMandatory && (
                      <span className="mandatory-badge">Mandatory</span>
                    )}
                    {component.isStatutory && (
                      <span className="statutory-badge">Statutory</span>
                    )}
                  </div>
                  {!component.isMandatory && (
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(component.id)}
                      className="remove-btn"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="component-inputs">
                  <div className="input-group">
                    <label>Calculation Type</label>
                    <select
                      value={component.calculationType}
                      onChange={(e) =>
                        handleComponentChange(
                          component.id,
                          "calculationType",
                          e.target.value
                        )
                      }
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>
                  {component.calculationType === "percentage" && (
                    <div className="input-group">
                      <label>Base On</label>
                      <select
                        value={component.baseComponent || ""}
                        onChange={(e) =>
                          handleComponentChange(
                            component.id,
                            "baseComponent",
                            e.target.value
                          )
                        }
                      >
                        <option value="basic">Basic Salary</option>
                        <option value="gross">Gross Salary</option>
                        <option value="taxable">Taxable Income</option>
                      </select>
                    </div>
                  )}
                  <div className="input-group">
                    <label>
                      {component.calculationType === "percentage"
                        ? "Percentage"
                        : "Amount"}
                    </label>
                    <input
                      type="number"
                      value={component.value}
                      onChange={(e) =>
                        handleComponentChange(
                          component.id,
                          "value",
                          Number(e.target.value)
                        )
                      }
                      min="0"
                      step={
                        component.calculationType === "percentage"
                          ? "0.1"
                          : "100"
                      }
                    />
                  </div>
                  {calculation && (
                    <div className="calculated-value deduction">
                      -
                      {formatCurrency(
                        calculation.deductions.find(
                          (d) => d.id === component.id
                        )?.value || 0
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
        </div>
      </div>

      {/* Salary Summary */}
      {calculation && (
        <div className="salary-summary">
          <Card className="summary-card">
            <h3 className="summary-title">Salary Breakdown</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Annual CTC</span>
                <span className="summary-value">
                  {formatCurrency(calculation.ctc)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Gross Salary (Annual)</span>
                <span className="summary-value earning">
                  {formatCurrency(calculation.grossSalary)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Deductions (Annual)</span>
                <span className="summary-value deduction">
                  -{formatCurrency(calculation.totalDeductions)}
                </span>
              </div>
              <div className="summary-item highlight">
                <span className="summary-label">Net Salary (Annual)</span>
                <span className="summary-value">
                  {formatCurrency(calculation.netSalary)}
                </span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-item">
                <span className="summary-label">Monthly Gross</span>
                <span className="summary-value">
                  {formatCurrency(calculation.monthlyGross)}
                </span>
              </div>
              <div className="summary-item highlight">
                <span className="summary-label">Monthly Net (In-hand)</span>
                <span className="summary-value large">
                  {formatCurrency(calculation.monthlyNet)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="form-errors">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Form Actions */}
      <div className="form-actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || errors.length > 0}>
          {isSubmitting ? "Saving..." : "Save Salary Structure"}
        </Button>
      </div>
    </form>
  );
};
