import React, { useState } from "react";
import { Input, Button } from "../ui";
import type { CreateFinancialYearDto, UpdateFinancialYearDto, FinancialYear } from "../../types";
import "./HolidayForm.css";

export interface FinancialYearFormProps {
  initialValues?: (CreateFinancialYearDto & { id?: string; isClosed?: boolean }) | (UpdateFinancialYearDto & { id?: string });
  onSubmit: (values: CreateFinancialYearDto | UpdateFinancialYearDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const FinancialYearForm: React.FC<FinancialYearFormProps> = ({ initialValues, onSubmit, onCancel, isSubmitting = false }) => {
  const [form, setForm] = useState<CreateFinancialYearDto | UpdateFinancialYearDto>({
    code: initialValues?.code || "",
    startDate: initialValues?.startDate || new Date().toISOString().slice(0, 10),
    endDate: initialValues?.endDate || new Date().toISOString().slice(0, 10),
    yearNumber: initialValues?.yearNumber,
    isCurrent: initialValues?.isCurrent ?? false,
    ...(initialValues && "isClosed" in initialValues ? { isClosed: (initialValues as UpdateFinancialYearDto).isClosed } : {} as Partial<UpdateFinancialYearDto>),
  } as CreateFinancialYearDto | UpdateFinancialYearDto);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateFinancialYearDto | UpdateFinancialYearDto = {
      ...form,
      yearNumber: form.yearNumber || undefined,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <Input
          label="Code"
          name="code"
          value={(form as FinancialYear).code || ""}
          onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
          required
          placeholder="e.g., FY2025-26"
        />
        <Input
          type="date"
          label="Start Date"
          name="startDate"
          value={(form as FinancialYear).startDate?.slice(0, 10) || ""}
          onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
          required
        />
        <Input
          type="date"
          label="End Date"
          name="endDate"
          value={(form as FinancialYear).endDate?.slice(0, 10) || ""}
          onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
          required
        />
        <Input
          type="number"
          label="Year Number"
          name="yearNumber"
          value={String((form as FinancialYear).yearNumber ?? "")}
          onChange={(e) => setForm((f) => ({ ...f, yearNumber: e.target.value ? Number(e.target.value) : undefined }))}
          placeholder="e.g., 2025"
        />
        <div>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={(form as FinancialYear).isCurrent || false}
              onChange={(e) => setForm((f) => ({ ...f, isCurrent: e.target.checked }))}
            />
            Set as Current
          </label>
        </div>
        {(form as UpdateFinancialYearDto).isClosed !== undefined && (
          <div>
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={(form as UpdateFinancialYearDto).isClosed}
                onChange={(e) => setForm((f) => ({ ...(f as UpdateFinancialYearDto), isClosed: e.target.checked }))}
              />
              Closed
            </label>
          </div>
        )}
      </div>
      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialValues?.id ? "Update Year" : "Create Year"}
        </Button>
      </div>
    </form>
  );
};

export default FinancialYearForm;
