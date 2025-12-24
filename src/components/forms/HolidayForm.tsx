import React, { useEffect, useState } from "react";
import { Input, Select, Button } from "../ui";
import type { CreateHolidayDto, UpdateHolidayDto, FinancialYear, Country, State, Holiday } from "../../types";
import { financialYearService, countryService, stateService } from "../../services";
import "./HolidayForm.css";

export interface HolidayFormProps {
  initialValues?: (CreateHolidayDto & { id?: string; isActive?: boolean }) | (UpdateHolidayDto & { id?: string });
  onSubmit: (values: CreateHolidayDto | UpdateHolidayDto) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const HolidayForm: React.FC<HolidayFormProps> = ({ initialValues, onSubmit, onCancel, isSubmitting = false }) => {
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);

  const [form, setForm] = useState<CreateHolidayDto | UpdateHolidayDto>({
    name: initialValues?.name || "",
    date: initialValues?.date || new Date().toISOString().slice(0, 10),
    type: initialValues?.type || "",
    description: initialValues?.description || "",
    applicableLocation: initialValues?.applicableLocation || "",
    isOptional: (initialValues as UpdateHolidayDto)?.isOptional ?? false,
    financialYearId: initialValues?.financialYearId,
    countryId: initialValues?.countryId,
    stateId: initialValues?.stateId,
    ...(initialValues && "isActive" in initialValues ? { isActive: (initialValues as UpdateHolidayDto).isActive } : {} as Partial<UpdateHolidayDto>),
  } as CreateHolidayDto | UpdateHolidayDto);

  useEffect(() => {
    const load = async () => {
      const [ys, cs] = await Promise.all([financialYearService.getAll(), countryService.getAll()]);
      setYears(ys);
      setCountries(cs);
    };
    load();
  }, []);

  useEffect(() => {
    const loadStates = async () => {
      if (form.countryId) {
        const st = await stateService.getByCountry(form.countryId);
        setStates(st);
      } else {
        setStates([]);
      }
    };
    loadStates();
  }, [form.countryId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateHolidayDto | UpdateHolidayDto = {
      ...form,
      type: form.type || undefined,
      description: form.description || undefined,
      applicableLocation: form.applicableLocation || undefined,
      financialYearId: form.financialYearId || undefined,
      countryId: form.countryId || undefined,
      stateId: form.stateId || undefined,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <Input
          label="Holiday Name"
          name="name"
          value={(form as Holiday).name || ""}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          required
        />
        <Input
          type="date"
          label="Date"
          name="date"
          value={(form as Holiday).date?.slice(0, 10) || ""}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          required
        />
        <Input
          label="Type"
          name="type"
          value={(form as Holiday).type || ""}
          onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
          placeholder="e.g., Public, Company, Regional"
        />
        <Input
          label="Description"
          name="description"
          value={(form as Holiday).description || ""}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />
        <Select
          label="Financial Year"
          value={(form as Holiday).financialYearId || ""}
          onChange={(e) => setForm((f) => ({ ...f, financialYearId: e.target.value || undefined }))}
          options={[{ value: "", label: "Select financial year" }, ...years.map((y) => ({ value: y.id, label: y.code }))]}
        />
        <Select
          label="Country"
          value={(form as Holiday).countryId || ""}
          onChange={(e) => setForm((f) => ({ ...f, countryId: e.target.value || undefined, stateId: undefined }))}
          options={[{ value: "", label: "All Countries" }, ...countries.map((c) => ({ value: c.id, label: c.name }))]}
        />
        <Select
          label="State"
          value={(form as Holiday).stateId || ""}
          onChange={(e) => setForm((f) => ({ ...f, stateId: e.target.value || undefined }))}
          options={[{ value: "", label: "All States" }, ...states.map((s) => ({ value: s.id, label: s.name }))]}
          disabled={!(form as Holiday).countryId}
        />
        <div>
          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={(form as Holiday).isOptional || false}
              onChange={(e) => setForm((f) => ({ ...f, isOptional: e.target.checked }))}
            />
            Optional Holiday
          </label>
        </div>
        {(form as UpdateHolidayDto).isActive !== undefined && (
          <div>
            <label className="checkbox-inline">
              <input
                type="checkbox"
                checked={(form as UpdateHolidayDto).isActive}
                onChange={(e) => setForm((f) => ({ ...(f as UpdateHolidayDto), isActive: e.target.checked }))}
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
          {isSubmitting ? "Saving..." : initialValues?.id ? "Update Holiday" : "Create Holiday"}
        </Button>
      </div>
    </form>
  );
};

export default HolidayForm;
