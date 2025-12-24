import React, { useState, useEffect } from "react";
import { Input, Button } from "../ui";
import type { LeaveType, CreateLeaveTypeDto } from "../../types/leave";
import "./LeaveTypeForm.css";

export type LeaveTypeFormValues = CreateLeaveTypeDto;

interface LeaveTypeFormProps {
  initialValues?: Partial<LeaveType>;
  onSubmit: (values: LeaveTypeFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

interface ValidationErrors {
  name?: string;
  code?: string;
  description?: string;
  maxDaysPerYear?: string;
  maxCarryForwardDays?: string;
  minDaysInAdvance?: string;
  maxConsecutiveDays?: string;
  monthlyAccrualRate?: string;
}

const LeaveTypeForm: React.FC<LeaveTypeFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<LeaveTypeFormValues>({
    name: initialValues?.name || "",
    code: initialValues?.code || "",
    description: initialValues?.description || "",
    maxDaysPerYear: initialValues?.maxDaysPerYear || 0,
    maxCarryForwardDays: initialValues?.maxCarryForwardDays || 0,
    isCarryForwardAllowed: initialValues?.isCarryForwardAllowed ?? false,
    isPaidLeave: initialValues?.isPaidLeave ?? true,
    isActive: initialValues?.isActive ?? true,
    requiresApproval: initialValues?.requiresApproval ?? true,
    requiresDocumentation: initialValues?.requiresDocumentation ?? false,
    canBeAppliedInAdvance: initialValues?.canBeAppliedInAdvance ?? true,
    minDaysInAdvance: initialValues?.minDaysInAdvance || 0,
    maxConsecutiveDays: initialValues?.maxConsecutiveDays || 0,
    applicableGender: initialValues?.applicableGender || "All",
    applicableEmploymentType: initialValues?.applicableEmploymentType || "All",
    accruesMonthly: initialValues?.accruesMonthly ?? false,
    monthlyAccrualRate: initialValues?.monthlyAccrualRate || 0,
    deductsSalary: initialValues?.deductsSalary ?? false,
    isOneTimeAllowance: initialValues?.isOneTimeAllowance ?? false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || "",
        code: initialValues.code || "",
        description: initialValues.description || "",
        maxDaysPerYear: initialValues.maxDaysPerYear || 0,
        maxCarryForwardDays: initialValues.maxCarryForwardDays || 0,
        isCarryForwardAllowed: initialValues.isCarryForwardAllowed ?? false,
        isPaidLeave: initialValues.isPaidLeave ?? true,
        isActive: initialValues.isActive ?? true,
        requiresApproval: initialValues.requiresApproval ?? true,
        requiresDocumentation: initialValues.requiresDocumentation ?? false,
        canBeAppliedInAdvance: initialValues.canBeAppliedInAdvance ?? true,
        minDaysInAdvance: initialValues.minDaysInAdvance || 0,
        maxConsecutiveDays: initialValues.maxConsecutiveDays || 0,
        applicableGender: initialValues.applicableGender || "All",
        applicableEmploymentType: initialValues.applicableEmploymentType || "All",
        accruesMonthly: initialValues.accruesMonthly ?? false,
        monthlyAccrualRate: initialValues.monthlyAccrualRate || 0,
        deductsSalary: initialValues.deductsSalary ?? false,
        isOneTimeAllowance: initialValues.isOneTimeAllowance ?? false,
      });
    }
  }, [initialValues]);

  const validateField = (
    name: string,
    value: string | number | boolean | undefined
  ): string | undefined => {
    switch (name) {
      case "name":
        if (!value || String(value).trim() === "")
          return "Leave type name is required";
        if (String(value).length < 2)
          return "Name must be at least 2 characters";
        if (String(value).length > 100)
          return "Name must not exceed 100 characters";
        return undefined;

      case "code":
        if (!value || String(value).trim() === "")
          return "Leave code is required";
        if (!/^[A-Z0-9_-]+$/.test(String(value)))
          return "Code must contain only uppercase letters, numbers, hyphens, or underscores";
        if (String(value).length < 2)
          return "Code must be at least 2 characters";
        if (String(value).length > 10)
          return "Code must not exceed 10 characters";
        return undefined;

      case "description":
        if (value && String(value).length > 500)
          return "Description must not exceed 500 characters";
        return undefined;

      case "maxDaysPerYear":
        if (Number(value) < 0) return "Max days must be 0 or greater";
        if (Number(value) > 365) return "Max days cannot exceed 365";
        return undefined;

      case "maxCarryForwardDays":
        if (Number(value) < 0) return "Carry forward days must be 0 or greater";
        if (Number(value) > 365) return "Carry forward days cannot exceed 365";
        return undefined;

      case "minDaysInAdvance":
        if (Number(value) < 0) return "Min days in advance must be 0 or greater";
        if (Number(value) > 90) return "Min days in advance cannot exceed 90";
        return undefined;

      case "maxConsecutiveDays":
        if (Number(value) < 0) return "Max consecutive days must be 0 or greater";
        if (Number(value) > 365) return "Max consecutive days cannot exceed 365";
        return undefined;

      case "monthlyAccrualRate":
        if (Number(value) < 0) return "Accrual rate must be 0 or greater";
        if (Number(value) > 30) return "Accrual rate cannot exceed 30 days/month";
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    let finalValue: string | number | boolean = value;

    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      finalValue = value === "" ? 0 : Number(value);
    } else if (name === "code") {
      finalValue = value.toUpperCase();
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    if (touched[name]) {
      const error = validateField(name, finalValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    const stringFields: Array<keyof ValidationErrors> = [
      "name",
      "code",
      "description",
    ];
    const numberFields: Array<keyof ValidationErrors> = [
      "maxDaysPerYear",
      "maxCarryForwardDays",
      "minDaysInAdvance",
      "maxConsecutiveDays",
      "monthlyAccrualRate",
    ];

    stringFields.forEach((key) => {
      const value = formData[key as keyof LeaveTypeFormValues];
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    numberFields.forEach((key) => {
      const value = formData[key as keyof LeaveTypeFormValues];
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="leave-type-form">
      {/* Basic Information */}
      <div className="form-section">
        <h3 className="section-title">Basic Information</h3>

        <Input
          label="Leave Type Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name ? errors.name : undefined}
          required
          placeholder="e.g., Casual Leave"
        />

        <Input
          label="Code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.code ? errors.code : undefined}
          required
          placeholder="e.g., CL"
          helperText="Uppercase letters, numbers, hyphens, or underscores only"
        />

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.description && errors.description ? "error" : ""}
            rows={3}
            placeholder="Describe the purpose and usage of this leave type"
          />
          {touched.description && errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
        </div>
      </div>

      {/* Entitlement Configuration */}
      <div className="form-section">
        <h3 className="section-title">Entitlement Configuration</h3>

        <Input
          label="Max Days Per Year"
          type="number"
          name="maxDaysPerYear"
          value={formData.maxDaysPerYear}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.maxDaysPerYear ? errors.maxDaysPerYear : undefined}
          required
          min={0}
          max={365}
        />

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="accruesMonthly"
            name="accruesMonthly"
            checked={formData.accruesMonthly}
            onChange={handleChange}
          />
          <label htmlFor="accruesMonthly">Accrues Monthly</label>
        </div>

        {formData.accruesMonthly && (
          <Input
            label="Monthly Accrual Rate (days/month)"
            type="number"
            name="monthlyAccrualRate"
            value={formData.monthlyAccrualRate}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.monthlyAccrualRate ? errors.monthlyAccrualRate : undefined
            }
            min={0}
            max={30}
            step={0.1}
          />
        )}

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="isCarryForwardAllowed"
            name="isCarryForwardAllowed"
            checked={formData.isCarryForwardAllowed}
            onChange={handleChange}
          />
          <label htmlFor="isCarryForwardAllowed">
            Allow Carry Forward to Next Year
          </label>
        </div>

        {formData.isCarryForwardAllowed && (
          <Input
            label="Max Carry Forward Days"
            type="number"
            name="maxCarryForwardDays"
            value={formData.maxCarryForwardDays}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.maxCarryForwardDays
                ? errors.maxCarryForwardDays
                : undefined
            }
            min={0}
            max={365}
          />
        )}
      </div>

      {/* Leave Policies */}
      <div className="form-section">
        <h3 className="section-title">Leave Policies</h3>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="isPaidLeave"
            name="isPaidLeave"
            checked={formData.isPaidLeave}
            onChange={handleChange}
          />
          <label htmlFor="isPaidLeave">Paid Leave</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="deductsSalary"
            name="deductsSalary"
            checked={formData.deductsSalary}
            onChange={handleChange}
          />
          <label htmlFor="deductsSalary">Deducts Salary (LOP)</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="requiresApproval"
            name="requiresApproval"
            checked={formData.requiresApproval}
            onChange={handleChange}
          />
          <label htmlFor="requiresApproval">Requires Approval</label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="requiresDocumentation"
            name="requiresDocumentation"
            checked={formData.requiresDocumentation}
            onChange={handleChange}
          />
          <label htmlFor="requiresDocumentation">
            Requires Documentation (Medical Certificate, etc.)
          </label>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="isOneTimeAllowance"
            name="isOneTimeAllowance"
            checked={formData.isOneTimeAllowance}
            onChange={handleChange}
          />
          <label htmlFor="isOneTimeAllowance">
            One-Time Allowance (e.g., Marriage Leave)
          </label>
        </div>
      </div>

      {/* Advance Application */}
      <div className="form-section">
        <h3 className="section-title">Application Rules</h3>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="canBeAppliedInAdvance"
            name="canBeAppliedInAdvance"
            checked={formData.canBeAppliedInAdvance}
            onChange={handleChange}
          />
          <label htmlFor="canBeAppliedInAdvance">
            Can Be Applied In Advance
          </label>
        </div>

        {formData.canBeAppliedInAdvance && (
          <Input
            label="Minimum Days In Advance"
            type="number"
            name="minDaysInAdvance"
            value={formData.minDaysInAdvance}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.minDaysInAdvance ? errors.minDaysInAdvance : undefined
            }
            min={0}
            max={90}
          />
        )}

        <Input
          label="Max Consecutive Days (0 = unlimited)"
          type="number"
          name="maxConsecutiveDays"
          value={formData.maxConsecutiveDays}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            touched.maxConsecutiveDays ? errors.maxConsecutiveDays : undefined
          }
          min={0}
          max={365}
        />
      </div>

      {/* Applicability */}
      <div className="form-section">
        <h3 className="section-title">Applicability</h3>

        <div className="form-group">
          <label htmlFor="applicableGender">Applicable Gender</label>
          <select
            id="applicableGender"
            name="applicableGender"
            value={formData.applicableGender}
            onChange={handleChange}
          >
            <option value="All">All</option>
            <option value="Male">Male Only</option>
            <option value="Female">Female Only</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="applicableEmploymentType">
            Applicable Employment Type
          </label>
          <select
            id="applicableEmploymentType"
            name="applicableEmploymentType"
            value={formData.applicableEmploymentType}
            onChange={handleChange}
          >
            <option value="All">All</option>
            <option value="Permanent">Permanent Only</option>
            <option value="Contract">Contract Only</option>
            <option value="Intern">Intern Only</option>
          </select>
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
          />
          <label htmlFor="isActive">Active</label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialValues
            ? "Update Leave Type"
            : "Create Leave Type"}
        </Button>
      </div>
    </form>
  );
};

export default LeaveTypeForm;
