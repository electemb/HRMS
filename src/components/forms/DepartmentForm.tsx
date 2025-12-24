import React, { useState, useEffect } from "react";
import { Input, Button } from "../ui";
import { departmentService } from "../../services";
import type { Department } from "../../types";
import "./DepartmentForm.css";

export interface DepartmentFormValues {
  name: string;
  code: string;
  description?: string;
  parentDepartmentId?: string;
}

interface DepartmentFormProps {
  initialValues?: DepartmentFormValues & { id?: string };
  onSubmit: (values: DepartmentFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

interface ValidationErrors {
  name?: string;
  code?: string;
  description?: string;
  parentDepartmentId?: string;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  
  const [formData, setFormData] = useState<DepartmentFormValues>({
    name: initialValues?.name || "",
    code: initialValues?.code || "",
    description: initialValues?.description || "",
    parentDepartmentId: initialValues?.parentDepartmentId || undefined,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Fetch departments for parent selection
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      try {
        const depts = await departmentService.getAll();
        // Filter out current department from parent options when editing
        const filteredDepts = initialValues?.id
          ? depts.filter((d) => d.id !== initialValues.id)
          : depts;
        setDepartments(filteredDepts);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setDepartments([]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [initialValues?.id]);

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || "",
        code: initialValues.code || "",
        description: initialValues.description || "",
        parentDepartmentId: initialValues.parentDepartmentId || "",
      });
    }
  }, [initialValues]);

  const validateField = (
    name: string,
    value: string | undefined
  ): string | undefined => {
    switch (name) {
      case "name":
        if (!value || value.trim() === "") return "Department name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (value.length > 100) return "Name must not exceed 100 characters";
        return undefined;

      case "code":
        if (!value || value.trim() === "") return "Department code is required";
        if (!/^[A-Z0-9_-]+$/.test(value))
          return "Code must contain only uppercase letters, numbers, hyphens, or underscores";
        if (value.length < 2) return "Code must be at least 2 characters";
        if (value.length > 20) return "Code must not exceed 20 characters";
        return undefined;

      case "description":
        if (value && value.length > 500)
          return "Description must not exceed 500 characters";
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Auto-uppercase code field
    const finalValue = name === "code" ? value.toUpperCase() : value;
    
    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    if (touched[name]) {
      const error = validateField(name, finalValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    const fieldsToValidate: Array<keyof ValidationErrors> = [
      "name",
      "code",
      "description",
    ];

    fieldsToValidate.forEach((key) => {
      const value = formData[key];
      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      code: true,
      description: true,
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Clean up data: convert empty strings to undefined for optional fields
      const cleanedData: DepartmentFormValues = {
        name: formData.name,
        code: formData.code,
        description: formData.description || undefined,
        parentDepartmentId: formData.parentDepartmentId || undefined,
      };
      onSubmit(cleanedData);
    }
  };

  return (
    <form className="department-form" onSubmit={handleSubmit}>
      <div className="department-form__section">
        <h3 className="department-form__section-title">Basic Information</h3>
        
        <div className="department-form__row">
          <Input
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.name ? errors.name : undefined}
            required
            placeholder="e.g., Engineering, Human Resources"
            disabled={isSubmitting}
          />
        </div>

        <div className="department-form__row">
          <Input
            label="Department Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.code ? errors.code : undefined}
            required
            placeholder="e.g., ENG, HR, FIN"
            disabled={isSubmitting}
            helperText="Uppercase letters, numbers, hyphens, or underscores only"
          />
        </div>

        <div className="department-form__row">
          <div className="form-field">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Brief description of the department..."
              disabled={isSubmitting}
              rows={3}
              className={`form-textarea ${
                touched.description && errors.description ? "error" : ""
              }`}
            />
            {touched.description && errors.description && (
              <span className="form-error">{errors.description}</span>
            )}
          </div>
        </div>

        <div className="department-form__row">
          <div className="form-field">
            <label htmlFor="parentDepartmentId" className="form-label">
              Parent Department (Optional)
            </label>
            <select
              id="parentDepartmentId"
              name="parentDepartmentId"
              value={formData.parentDepartmentId}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting || loadingDepartments}
              className="form-select"
            >
              <option value="">None (Top Level)</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {loadingDepartments && (
              <span className="form-helper-text">Loading departments...</span>
            )}
          </div>
        </div>
      </div>

      <div className="department-form__actions">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : initialValues?.id ? "Update Department" : "Create Department"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default DepartmentForm;
