import React, { useState } from "react";
import { Input, Button } from "../ui";
import type { CreateGradeDto, UpdateGradeDto, Grade } from "../../types";
import "./HolidayForm.css";

export interface GradeFormProps {
  initialValues?: (CreateGradeDto & { id?: string; isActive?: boolean }) | (UpdateGradeDto & { id?: string });
  onSubmit: (values: CreateGradeDto | UpdateGradeDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const GradeForm: React.FC<GradeFormProps> = ({ initialValues, onSubmit, onCancel, isSubmitting = false }) => {
  const [form, setForm] = useState<CreateGradeDto | UpdateGradeDto>({
    code: initialValues?.code || "",
    name: initialValues?.name || "",
    level: initialValues?.level ?? 1,
    description: initialValues?.description || "",
    effectiveFrom: initialValues?.effectiveFrom,
    effectiveTo: initialValues?.effectiveTo,
    displayOrder: initialValues?.displayOrder ?? 0,
    ...(initialValues && "isActive" in initialValues ? { isActive: (initialValues as UpdateGradeDto).isActive } : {} as Partial<UpdateGradeDto>),
  } as CreateGradeDto | UpdateGradeDto);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateGradeDto | UpdateGradeDto = {
      ...form,
      description: form.description || undefined,
      effectiveFrom: form.effectiveFrom || undefined,
      effectiveTo: form.effectiveTo || undefined,
      displayOrder: form.displayOrder ?? 0,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <Input
          label="Code"
          name="code"
          value={(form as Grade).code || ""}
          onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
          required
          placeholder="e.g., G1"
        />
        <Input
          label="Name"
          name="name"
          value={(form as Grade).name || ""}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <Input
          type="number"
          label="Level"
          name="level"
          value={String((form as Grade).level)}
          onChange={(e) => setForm((f) => ({ ...f, level: Number(e.target.value) }))}
          required
        />
        <Input
          label="Description"
          name="description"
          value={(form as Grade).description || ""}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <Input
          type="date"
          label="Effective From"
          name="effectiveFrom"
          value={(form as Grade).effectiveFrom?.slice(0, 10) || ""}
          onChange={(e) => setForm((f) => ({ ...f, effectiveFrom: e.target.value || undefined }))}
        />
        <Input
          type="date"
          label="Effective To"
          name="effectiveTo"
          value={(form as Grade).effectiveTo?.slice(0, 10) || ""}
          onChange={(e) => setForm((f) => ({ ...f, effectiveTo: e.target.value || undefined }))}
        />
        {(form as UpdateGradeDto).isActive !== undefined && (
          <div>
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={(form as UpdateGradeDto).isActive}
                onChange={(e) => setForm((f) => ({ ...(f as UpdateGradeDto), isActive: e.target.checked }))}
              />
              Active
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
          {isSubmitting ? "Saving..." : initialValues?.id ? "Update Grade" : "Create Grade"}
        </Button>
      </div>
    </form>
  );
};

export default GradeForm;
