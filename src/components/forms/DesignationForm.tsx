import React, { useState, useEffect } from "react";
import { Input, Button } from "../ui";
import { departmentService } from "../../services";
import type { Department } from "../../types";
import "./DesignationForm.css";

export interface DesignationFormValues {
  title: string;
  code: string;
  description?: string;
  departmentId: string; // Required field
  level: string;
  minSalary: number;
  maxSalary: number;
  requiredSkills?: string;
  jobDescription?: string;
}

interface DesignationFormProps {
  initialValues?: DesignationFormValues & { id?: string };
  onSubmit: (values: DesignationFormValues) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

interface ValidationErrors {
  title?: string;
  code?: string;
  description?: string;
  departmentId?: string;
  level?: string;
  minSalary?: string;
  maxSalary?: string;
  requiredSkills?: string;
  jobDescription?: string;
}

// SOLID Principle: Liskov Substitution - This component can replace DepartmentForm wherever needed
// DRY Principle: Reuse the same form structure, validation pattern, and state management
const DesignationForm: React.FC<DesignationFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [formData, setFormData] = useState<DesignationFormValues>({
    title: initialValues?.title || "",
    code: initialValues?.code || "",
    description: initialValues?.description || "",
    departmentId: initialValues?.departmentId || "",
    level: initialValues?.level || "",
    minSalary: initialValues?.minSalary || 0,
    maxSalary: initialValues?.maxSalary || 0,
    requiredSkills: initialValues?.requiredSkills || "",
    jobDescription: initialValues?.jobDescription || "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Fetch departments for selection
  useEffect(() => {
    const fetchDepartments = async () => {
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
    };

    fetchDepartments();
  }, []);

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title || "",
        code: initialValues.code || "",
        description: initialValues.description || "",
        departmentId: initialValues.departmentId || "",
        level: initialValues.level || "",
        minSalary: initialValues.minSalary || 0,
        maxSalary: initialValues.maxSalary || 0,
        requiredSkills: initialValues.requiredSkills || "",
        jobDescription: initialValues.jobDescription || "",
      });
    }
  }, [initialValues]);

  // SOLID Principle: Single Responsibility - Separate validation logic
  const validateField = (
    name: string,
    value: string | number | undefined
  ): string | undefined => {
    switch (name) {
      case "title":
        if (!value || String(value).trim() === "")
          return "Designation title is required";
        if (String(value).length < 2)
          return "Title must be at least 2 characters";
        if (String(value).length > 100)
          return "Title must not exceed 100 characters";
        return undefined;

      case "code":
        if (!value || String(value).trim() === "")
          return "Designation code is required";
        if (!/^[A-Z0-9_-]+$/.test(String(value)))
          return "Code must contain only uppercase letters, numbers, hyphens, or underscores";
        if (String(value).length < 2)
          return "Code must be at least 2 characters";
        if (String(value).length > 20)
          return "Code must not exceed 20 characters";
        return undefined;

      case "description":
        if (value && String(value).length > 500)
          return "Description must not exceed 500 characters";
        return undefined;

      case "departmentId":
        if (!value || String(value).trim() === "")
          return "Department is required";
        return undefined;

      case "level":
        if (!value || String(value).trim() === "") return "Level is required";
        if (String(value).length > 20)
          return "Level must not exceed 20 characters";
        return undefined;

      case "minSalary": {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0)
          return "Minimum salary must be a positive number";
        return undefined;
      }

      case "maxSalary": {
        const numValue = Number(value);
        if (isNaN(numValue) || numValue < 0)
          return "Maximum salary must be a positive number";
        if (numValue < formData.minSalary)
          return "Maximum salary must be greater than or equal to minimum salary";
        return undefined;
      }

      case "requiredSkills":
        if (value && String(value).length > 2000)
          return "Required skills must not exceed 2000 characters";
        return undefined;

      case "jobDescription":
        if (value && String(value).length > 1000)
          return "Job description must not exceed 1000 characters";
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

    const fieldsToValidate: Array<keyof ValidationErrors> = [
      "title",
      "code",
      "description",
      "departmentId",
      "level",
      "minSalary",
      "maxSalary",
      "requiredSkills",
      "jobDescription",
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
      title: true,
      code: true,
      description: true,
      departmentId: true,
      level: true,
      minSalary: true,
      maxSalary: true,
      requiredSkills: true,
      jobDescription: true,
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Clean up data: convert empty strings to undefined for optional fields
      const cleanedData: DesignationFormValues = {
        title: formData.title,
        code: formData.code,
        description: formData.description || undefined,
        departmentId: formData.departmentId, // Required field, keep as-is
        level: formData.level,
        minSalary: formData.minSalary,
        maxSalary: formData.maxSalary,
        requiredSkills: formData.requiredSkills || undefined,
        jobDescription: formData.jobDescription || undefined,
      };
      console.log("Submitting designation data:", cleanedData);
      onSubmit(cleanedData);
    }
  };

  // Predefined levels for consistency
  const levels = [
    "Intern",
    "Junior",
    "Mid-Level",
    "Senior",
    "Lead",
    "Principal",
    "Manager",
    "Senior Manager",
    "Director",
    "VP",
    "C-Level",
  ];

  return (
    <form className="designation-form" onSubmit={handleSubmit}>
      <div className="designation-form__section">
        <h3 className="designation-form__section-title">Basic Information</h3>

        <div className="designation-form__row">
          <Input
            label="Designation Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title ? errors.title : undefined}
            required
            placeholder="e.g., Senior Software Engineer, HR Manager"
            disabled={isSubmitting}
          />
        </div>

        <div className="designation-form__row designation-form__row--two-cols">
          <Input
            label="Designation Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.code ? errors.code : undefined}
            required
            placeholder="e.g., SSE, HRM"
            disabled={isSubmitting}
            helperText="Uppercase letters, numbers, hyphens, or underscores only"
          />

          <div className="form-field">
            <label htmlFor="level" className="form-label required">
              Level
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              className={`form-select ${
                touched.level && errors.level ? "error" : ""
              }`}
              required
            >
              <option value="">Select Level</option>
              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            {touched.level && errors.level && (
              <span className="form-error">{errors.level}</span>
            )}
          </div>
        </div>

        <div className="designation-form__row">
          <div className="form-field">
            <label htmlFor="departmentId" className="form-label required">
              Department
            </label>
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting || loadingDepartments}
              className={`form-select ${
                touched.departmentId && errors.departmentId ? "error" : ""
              }`}
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name} ({dept.code})
                </option>
              ))}
            </select>
            {touched.departmentId && errors.departmentId && (
              <span className="form-error">{errors.departmentId}</span>
            )}
            {loadingDepartments && (
              <span className="form-helper-text">Loading departments...</span>
            )}
          </div>
        </div>

        <div className="designation-form__row">
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
              placeholder="Brief description of the designation..."
              disabled={isSubmitting}
              rows={2}
              className={`form-textarea ${
                touched.description && errors.description ? "error" : ""
              }`}
            />
            {touched.description && errors.description && (
              <span className="form-error">{errors.description}</span>
            )}
          </div>
        </div>
      </div>

      <div className="designation-form__section">
        <h3 className="designation-form__section-title">Salary Range</h3>

        <div className="designation-form__row designation-form__row--two-cols">
          <Input
            label="Minimum Salary"
            name="minSalary"
            type="number"
            value={formData.minSalary}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.minSalary ? errors.minSalary : undefined}
            required
            placeholder="0"
            disabled={isSubmitting}
            min="0"
            step="1000"
          />

          <Input
            label="Maximum Salary"
            name="maxSalary"
            type="number"
            value={formData.maxSalary}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.maxSalary ? errors.maxSalary : undefined}
            required
            placeholder="0"
            disabled={isSubmitting}
            min="0"
            step="1000"
          />
        </div>
      </div>

      <div className="designation-form__section">
        <h3 className="designation-form__section-title">
          Additional Information
        </h3>

        <div className="designation-form__row">
          <div className="form-field">
            <label htmlFor="requiredSkills" className="form-label">
              Required Skills
            </label>
            <textarea
              id="requiredSkills"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Java, Spring Boot, Microservices, Leadership..."
              disabled={isSubmitting}
              rows={3}
              className={`form-textarea ${
                touched.requiredSkills && errors.requiredSkills ? "error" : ""
              }`}
            />
            {touched.requiredSkills && errors.requiredSkills && (
              <span className="form-error">{errors.requiredSkills}</span>
            )}
            <span className="form-helper-text">
              Comma-separated list of required skills
            </span>
          </div>
        </div>

        <div className="designation-form__row">
          <div className="form-field">
            <label htmlFor="jobDescription" className="form-label">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Brief job description and responsibilities..."
              disabled={isSubmitting}
              rows={4}
              className={`form-textarea ${
                touched.jobDescription && errors.jobDescription ? "error" : ""
              }`}
            />
            {touched.jobDescription && errors.jobDescription && (
              <span className="form-error">{errors.jobDescription}</span>
            )}
          </div>
        </div>
      </div>

      <div className="designation-form__actions">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : initialValues?.id
            ? "Update Designation"
            : "Create Designation"}
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

export default DesignationForm;
