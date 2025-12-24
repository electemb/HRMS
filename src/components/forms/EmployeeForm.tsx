import React, { useState, useEffect } from "react";
import { Input, Button, Drawer } from "../ui";
import { SalaryStructureForm } from "./SalaryStructureForm";
import type { SalaryStructureFormData } from "./SalaryStructureForm";
import { departmentService, designationService, salaryTemplateService } from "../../services";
import type { Department, Designation } from "../../types";
import type { SalaryTemplate as SalaryTemplateType } from "../../services";
import "./EmployeeForm.css";

export interface EmployeeFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  departmentId?: string;
  designationId?: string;
  dateOfJoining?: string;
  salaryTemplateId?: string;
  salaryStructure?: SalaryStructureFormData;
}

interface EmployeeFormProps {
  initialData?: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [salaryTemplates, setSalaryTemplates] = useState<SalaryTemplateType[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingDesignations, setLoadingDesignations] = useState(false);

  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    departmentId: "",
    designationId: "",
    dateOfJoining: new Date().toISOString().split("T")[0],
    salaryTemplateId: "",
    ...initialData,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [salaryDrawerOpen, setSalaryDrawerOpen] = useState(false);

  // Fetch departments, designations, and salary templates on mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch departments
      setLoadingDepartments(true);
      try {
        const depts = await departmentService.getAll();
        setDepartments(depts);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setDepartments([]);
      } finally {
        setLoadingDepartments(false);
      }

      // Fetch designations
      setLoadingDesignations(true);
      try {
        const desigs = await designationService.getAll();
        setDesignations(desigs);
      } catch (error) {
        console.error("Failed to fetch designations:", error);
        setDesignations([]);
      } finally {
        setLoadingDesignations(false);
      }

      // Fetch salary templates
      setLoadingTemplates(true);
      try {
        const templates = await salaryTemplateService.getActive();
        setSalaryTemplates(templates);
      } catch (error) {
        console.error("Failed to fetch salary templates:", error);
        setSalaryTemplates([]);
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchData();
  }, []);

  // Get designation name for salary template
  const getDesignationName = (id?: string): string => {
    if (!id) return "";
    const designation = designations.find((d) => d.id === id);
    return designation?.title || "";
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        departmentId: initialData.departmentId || "",
        designationId: initialData.designationId || "",
        dateOfJoining: initialData.dateOfJoining || new Date().toISOString().split("T")[0],
        salaryTemplateId: initialData.salaryTemplateId || "",
      });
    }
  }, [initialData]);

  const validateField = (
    name: string,
    value: string | number | undefined
  ): string | undefined => {
    switch (name) {
      case "firstName":
        if (!value || String(value).trim() === "")
          return "First name is required";
        if (String(value).length < 2)
          return "First name must be at least 2 characters";
        return undefined;

      case "lastName":
        if (!value || String(value).trim() === "")
          return "Last name is required";
        if (String(value).length < 2)
          return "Last name must be at least 2 characters";
        return undefined;

      case "email": {
        if (!value || String(value).trim() === "") return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) return "Invalid email format";
        return undefined;
      }

      case "phoneNumber": {
        if (value && String(value).trim() !== "") {
          const phoneRegex = /^[\d\s\-+()]+$/;
          if (!phoneRegex.test(String(value)))
            return "Invalid phone number format";
        }
        return undefined;
      }

      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Only validate fields that exist in ValidationErrors
    const fieldsToValidate: Array<keyof ValidationErrors> = ['firstName', 'lastName', 'email', 'phoneNumber'];
    
    fieldsToValidate.forEach((key) => {
      const value = formData[key];
      if (typeof value === 'string' || typeof value === 'number' || value === undefined) {
        const error = validateField(key, value);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <div className="employee-form__section">
        <h3 className="employee-form__section-title">Personal Information</h3>
        <div className="employee-form__row">
          <Input
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName ? errors.firstName : undefined}
            required
            disabled={isSubmitting}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName ? errors.lastName : undefined}
            required
            disabled={isSubmitting}
          />
        </div>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          required
          disabled={isSubmitting}
        />
        <Input
          label="Phone Number"
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phoneNumber ? errors.phoneNumber : undefined}
          helperText="Optional"
          disabled={isSubmitting}
        />
      </div>

      <div className="employee-form__section">
        <h3 className="employee-form__section-title">Employment Details</h3>
        <Input
          label="Date of Joining"
          type="date"
          name="dateOfJoining"
          value={formData.dateOfJoining || ""}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        <div className="employee-form__row">
          <div className="employee-form__field">
            <label className="employee-form__label">
              Department
              <span className="employee-form__optional">(Optional)</span>
            </label>
            <select
              name="departmentId"
              value={formData.departmentId || ""}
              onChange={handleChange}
              className="employee-form__select"
              disabled={isSubmitting || loadingDepartments}
              title="Select Department"
            >
              <option value="">
                {loadingDepartments ? "Loading..." : "Select Department"}
              </option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div className="employee-form__field">
            <label className="employee-form__label">
              Designation
              <span className="employee-form__optional">(Optional)</span>
            </label>
            <select
              name="designationId"
              value={formData.designationId || ""}
              onChange={handleChange}
              className="employee-form__select"
              disabled={isSubmitting || loadingDesignations}
              title="Select Designation"
            >
              <option value="">
                {loadingDesignations ? "Loading..." : "Select Designation"}
              </option>
              {designations.map((desig) => (
                <option key={desig.id} value={desig.id}>
                  {desig.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Salary Configuration Section */}
      <div className="employee-form__section">
        <h3 className="employee-form__section-title">Salary & Payroll</h3>

        {/* Salary Template Selection */}
        <div className="employee-form__field">
          <label className="employee-form__label">
            Salary Template
            <span className="employee-form__optional">(Optional)</span>
          </label>
          <select
            name="salaryTemplateId"
            value={formData.salaryTemplateId || ""}
            onChange={handleChange}
            className="employee-form__select"
            disabled={isSubmitting || loadingTemplates}
            title="Select Salary Template"
          >
            <option value="">
              {loadingTemplates
                ? "Loading templates..."
                : "Select Salary Template"}
            </option>
            {salaryTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.code} - {template.name} (₹
                {(template.ctcMin / 100000).toFixed(1)}L - ₹
                {(template.ctcMax / 100000).toFixed(1)}L)
              </option>
            ))}
          </select>
          {formData.salaryTemplateId && (
            <div className="salary-template-info">
              <span className="info-icon">ℹ️</span>
              <span className="info-text">
                This template will be used as the base for this employee's
                salary structure
              </span>
            </div>
          )}
        </div>

        <div className="salary-config-section">
          {formData.salaryStructure ? (
            <div className="salary-summary-card">
              <div className="salary-summary-header">
                <div>
                  <div className="salary-label">Annual CTC</div>
                  <div className="salary-value">
                    ₹{formData.salaryStructure.ctc.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="salary-label">Monthly In-hand</div>
                  <div className="salary-value-highlight">
                    ₹
                    {Math.round(
                      (formData.salaryStructure.ctc -
                        formData.salaryStructure.components
                          .filter((c) => c.type === "deduction")
                          .reduce((sum, c) => sum + (c.value || 0), 0)) /
                        12
                    ).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
              <div className="salary-components-preview">
                <div className="components-col">
                  <strong>Earnings:</strong>
                  <ul>
                    {formData.salaryStructure.components
                      .filter((c) => c.type === "earning")
                      .slice(0, 3)
                      .map((c) => (
                        <li key={c.id}>{c.name}</li>
                      ))}
                    {formData.salaryStructure.components.filter(
                      (c) => c.type === "earning"
                    ).length > 3 && (
                      <li>
                        +
                        {formData.salaryStructure.components.filter(
                          (c) => c.type === "earning"
                        ).length - 3}{" "}
                        more
                      </li>
                    )}
                  </ul>
                </div>
                <div className="components-col">
                  <strong>Deductions:</strong>
                  <ul>
                    {formData.salaryStructure.components
                      .filter((c) => c.type === "deduction")
                      .map((c) => (
                        <li key={c.id}>{c.name}</li>
                      ))}
                  </ul>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSalaryDrawerOpen(true)}
                disabled={isSubmitting || !formData.designationId}
              >
                Modify Salary Structure
              </Button>
            </div>
          ) : (
            <div className="salary-empty-state">
              <p>No salary structure configured yet</p>
              <Button
                type="button"
                variant="primary"
                onClick={() => setSalaryDrawerOpen(true)}
                disabled={isSubmitting || !formData.designationId}
              >
                Configure Salary Structure
              </Button>
              {!formData.designationId && (
                <p className="helper-text">Please select a designation first</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="employee-form__actions">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isSubmitting}>
          {initialData?.id ? "Update Employee" : "Add Employee"}
        </Button>
      </div>

      {/* Salary Configuration Drawer */}
      <Drawer
        isOpen={salaryDrawerOpen}
        onClose={() => setSalaryDrawerOpen(false)}
        title="Configure Salary Structure"
        size="lg"
      >
        <SalaryStructureForm
          initialData={formData.salaryStructure}
          designationId={formData.designationId}
          designationName={getDesignationName(formData.designationId)}
          salaryTemplateId={formData.salaryTemplateId}
          onSubmit={(salaryData) => {
            setFormData((prev) => ({
              ...prev,
              salaryStructure: salaryData,
              salary: salaryData.ctc,
            }));
            setSalaryDrawerOpen(false);
          }}
          onCancel={() => setSalaryDrawerOpen(false)}
        />
      </Drawer>
    </form>
  );
};
