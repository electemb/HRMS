import React, { useState, useEffect } from "react";
import {
  PageHeader,
  Card,
  Table,
  Button,
  Badge,
  Drawer,
  Input,
} from "../components/ui";
import type { Column } from "../components/ui/Table";
import api from "../api";
import "./SalaryTemplates.css";

interface SalaryTemplate {
  id: string;
  code: string;
  name: string;
  description: string;
  ctcMin: number;
  ctcMax: number;
  components: Array<{
    id: string;
    componentCode: string;
    componentName: string;
    defaultValue: number;
  }>;
  assignedEmployeesCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SalaryComponent {
  id: string;
  code: string;
  name: string;
  type: string;
  isActive: boolean;
}

interface TemplateComponentInput {
  salaryComponentId: string;
  defaultValue: number;
  displayOrder: number;
  isMandatory: boolean;
}

const SalaryTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<SalaryTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [availableComponents, setAvailableComponents] = useState<
    SalaryComponent[]
  >([]);
  const [selectedComponents, setSelectedComponents] = useState<
    TemplateComponentInput[]
  >([]);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    ctcMin: "",
    ctcMax: "",
    isActive: true,
    displayOrder: 0,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/salarytemplates");
      setTemplates(response.data);
    } catch (err: unknown) {
      console.error("Error fetching salary templates:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to load salary templates";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/salarytemplates/${id}/toggle-active`, {
        isActive: !currentStatus,
      });
      // Refresh the list
      await fetchTemplates();
    } catch (err: unknown) {
      console.error("Error toggling template status:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update template status";
      alert(errorMessage);
    }
  };

  const handleDelete = async (id: string, templateCode: string) => {
    if (
      !confirm(`Are you sure you want to delete template "${templateCode}"?`)
    ) {
      return;
    }

    try {
      await api.delete(`/salarytemplates/${id}`);
      // Refresh the list
      await fetchTemplates();
    } catch (err: unknown) {
      console.error("Error deleting template:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete template";
      alert(errorMessage);
    }
  };

  const handleClone = async (template: SalaryTemplate) => {
    const newCode = prompt(
      `Enter new code for cloned template (original: ${template.code}):`
    );
    if (!newCode) return;

    try {
      await api.post("/salarytemplates", {
        code: newCode,
        name: `${template.name} (Copy)`,
        description: template.description,
        ctcMin: template.ctcMin,
        ctcMax: template.ctcMax,
        isActive: false,
        displayOrder: 0,
        components: template.components.map((c) => ({
          salaryComponentId: c.id,
          defaultValue: c.defaultValue,
          displayOrder: 0,
          isMandatory: false,
        })),
      });
      // Refresh the list
      await fetchTemplates();
    } catch (err: unknown) {
      console.error("Error cloning template:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to clone template";
      alert(errorMessage);
    }
  };

  const handleOpenDrawer = async () => {
    try {
      // Fetch available salary components
      const response = await api.get("/salarycomponents?activeOnly=true");
      setAvailableComponents(response.data);
      setIsDrawerOpen(true);
    } catch (err: unknown) {
      console.error("Error fetching components:", err);
      alert("Failed to load salary components");
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Reset form
    setFormData({
      code: "",
      name: "",
      description: "",
      ctcMin: "",
      ctcMax: "",
      isActive: true,
      displayOrder: 0,
    });
    setSelectedComponents([]);
    setFormErrors({});
  };

  const handleFormChange = (
    field: string,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddComponent = () => {
    const newComponent: TemplateComponentInput = {
      salaryComponentId: "",
      defaultValue: 0,
      displayOrder: selectedComponents.length,
      isMandatory: false,
    };
    setSelectedComponents([...selectedComponents, newComponent]);
  };

  const handleRemoveComponent = (index: number) => {
    setSelectedComponents(selectedComponents.filter((_, i) => i !== index));
  };

  const handleComponentChange = (
    index: number,
    field: keyof TemplateComponentInput,
    value: string | number | boolean
  ) => {
    const updated = [...selectedComponents];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedComponents(updated);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.code.trim()) errors.code = "Template code is required";
    if (!formData.name.trim()) errors.name = "Template name is required";

    const ctcMin = Number(formData.ctcMin);
    const ctcMax = Number(formData.ctcMax);

    if (!formData.ctcMin || ctcMin <= 0)
      errors.ctcMin = "Minimum CTC must be greater than 0";
    if (!formData.ctcMax || ctcMax <= 0)
      errors.ctcMax = "Maximum CTC must be greater than 0";
    if (ctcMax < ctcMin)
      errors.ctcMax =
        "Maximum CTC must be greater than or equal to Minimum CTC";

    if (selectedComponents.length === 0) {
      errors.components = "At least one component is required";
    } else {
      const hasInvalidComponent = selectedComponents.some(
        (c) => !c.salaryComponentId || c.defaultValue < 0
      );
      if (hasInvalidComponent) {
        errors.components =
          "All components must have a valid selection and value";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        code: formData.code.trim().toUpperCase(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        ctcMin: Number(formData.ctcMin),
        ctcMax: Number(formData.ctcMax),
        isActive: formData.isActive,
        displayOrder: formData.displayOrder,
        components: selectedComponents,
      };

      await api.post("/salarytemplates", payload);
      await fetchTemplates();
      handleCloseDrawer();
      alert("Template created successfully!");
    } catch (err: unknown) {
      console.error("Error creating template:", err);
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to create template";
      alert(errorMessage);
    }
  };

  const formatCurrency = (value: number) => {
    return `₹${(value / 100000).toFixed(1)}L`;
  };

  const columns: Column<SalaryTemplate>[] = [
    {
      key: "code",
      header: "Template Code",
      render: (template) => (
        <span className="template-code">{template.code}</span>
      ),
    },
    {
      key: "name",
      header: "Template Name",
      render: (template) => (
        <div>
          <div className="template-name">{template.name}</div>
          <div className="template-description">{template.description}</div>
        </div>
      ),
    },
    {
      key: "ctcRange",
      header: "CTC Range",
      render: (template) => (
        <div className="ctc-range">
          <span className="ctc-min">{formatCurrency(template.ctcMin)}</span>
          <span className="ctc-separator">-</span>
          <span className="ctc-max">{formatCurrency(template.ctcMax)}</span>
        </div>
      ),
    },
    {
      key: "componentsCount",
      header: "Components",
      render: (template) => (
        <Badge variant="info">{template.components.length} components</Badge>
      ),
    },
    {
      key: "assignedEmployees",
      header: "Assigned To",
      render: (template) => (
        <div className="assigned-count">
          <span className="count-value">{template.assignedEmployeesCount}</span>
          <span className="count-label">employees</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (template) => (
        <Badge variant={template.isActive ? "success" : "default"}>
          {template.isActive ? "active" : "inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (template) => (
        <div className="table-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleActive(template.id, template.isActive)}
          >
            {template.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleClone(template)}
          >
            Clone
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(template.id, template.code)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Salary Templates"
        description="Manage salary structure templates for different designations"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Payroll", path: "/payroll" },
          { label: "Salary Templates" },
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => console.log("Import")}>
              Import Templates
            </Button>
            <Button variant="primary" onClick={handleOpenDrawer}>
              Create Template
            </Button>
          </>
        }
      />

      {error && (
        <Card className="error-card">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <div className="error-message">
              <h3>Error Loading Templates</h3>
              <p>{error}</p>
              <Button variant="primary" onClick={fetchTemplates}>
                Retry
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="templates-stats">
        <Card className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-details">
            <div className="stat-value">{templates.length}</div>
            <div className="stat-label">Total Templates</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <div className="stat-value">
              {templates.reduce((sum, t) => sum + t.assignedEmployeesCount, 0)}
            </div>
            <div className="stat-label">Total Assignments</div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <div className="stat-value">
              {templates.filter((t) => t.isActive).length}
            </div>
            <div className="stat-label">Active Templates</div>
          </div>
        </Card>
      </div>

      <Card>
        <Table
          columns={columns}
          data={templates}
          keyExtractor={(item) => item.id}
          loading={loading}
          emptyMessage="No salary templates found"
          searchable={true}
          searchPlaceholder="Search templates by name, code, or description..."
          paginated={true}
          pageSize={10}
        />
      </Card>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title="Create Salary Template"
        size="lg"
        footer={
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <Button variant="outline" onClick={handleCloseDrawer}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Create Template
            </Button>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Template Code *"
              value={formData.code}
              onChange={(e) => handleFormChange("code", e.target.value)}
              placeholder="e.g., TPL-SE"
              error={formErrors.code}
              helperText="Unique identifier for the template"
            />
            <Input
              label="Template Name *"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="e.g., Software Engineer"
              error={formErrors.name}
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
            placeholder="Template description"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Minimum CTC *"
              type="number"
              value={formData.ctcMin}
              onChange={(e) => handleFormChange("ctcMin", e.target.value)}
              placeholder="300000"
              error={formErrors.ctcMin}
            />
            <Input
              label="Maximum CTC *"
              type="number"
              value={formData.ctcMax}
              onChange={(e) => handleFormChange("ctcMax", e.target.value)}
              placeholder="800000"
              error={formErrors.ctcMax}
            />
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <label style={{ fontWeight: 500, fontSize: "14px" }}>
                Salary Components *
              </label>
              <Button size="sm" variant="outline" onClick={handleAddComponent}>
                + Add Component
              </Button>
            </div>

            {formErrors.components && (
              <div
                style={{
                  color: "#dc2626",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}
              >
                {formErrors.components}
              </div>
            )}

            {selectedComponents.length === 0 ? (
              <div
                style={{
                  padding: "24px",
                  border: "2px dashed #e5e7eb",
                  borderRadius: "8px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                No components added yet. Click "Add Component" to get started.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {selectedComponents.map((component, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "16px",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      display: "grid",
                      gridTemplateColumns: "1fr 120px 80px auto",
                      gap: "12px",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <label
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginBottom: "4px",
                          display: "block",
                        }}
                      >
                        Component
                      </label>
                      <select
                        value={component.salaryComponentId}
                        onChange={(e) =>
                          handleComponentChange(
                            index,
                            "salaryComponentId",
                            e.target.value
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      >
                        <option value="">Select Component</option>
                        {availableComponents.map((comp) => (
                          <option key={comp.id} value={comp.id}>
                            {comp.name} ({comp.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginBottom: "4px",
                          display: "block",
                        }}
                      >
                        Default Value
                      </label>
                      <input
                        type="number"
                        value={component.defaultValue}
                        onChange={(e) =>
                          handleComponentChange(
                            index,
                            "defaultValue",
                            Number(e.target.value)
                          )
                        }
                        placeholder="0"
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginBottom: "4px",
                          display: "block",
                        }}
                      >
                        Order
                      </label>
                      <input
                        type="number"
                        value={component.displayOrder}
                        onChange={(e) =>
                          handleComponentChange(
                            index,
                            "displayOrder",
                            Number(e.target.value)
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                        }}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveComponent(index)}
                      style={{ marginTop: "20px" }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleFormChange("isActive", e.target.checked)}
              style={{ width: "16px", height: "16px" }}
            />
            <label
              htmlFor="isActive"
              style={{ fontSize: "14px", cursor: "pointer" }}
            >
              Active (template can be assigned to employees)
            </label>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default SalaryTemplates;
