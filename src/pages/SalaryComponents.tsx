import React, { useState, useEffect } from "react";
import api from "../api";
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
import "./SalaryComponents.css";

interface SalaryComponent {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: "earning" | "deduction";
  calculationType: "fixed" | "percentage" | "formula";
  defaultValue: number;
  baseComponent?: string;
  isMandatory: boolean;
  isTaxable: boolean;
  isStatutory: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const SalaryComponents: React.FC = () => {
  const [components, setComponents] = useState<SalaryComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "earning" as "earning" | "deduction",
    calculationType: "fixed" as "fixed" | "percentage" | "formula",
    defaultValue: "",
    baseComponent: "",
    isMandatory: false,
    isTaxable: true,
    isStatutory: false,
    displayOrder: 0,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/salarycomponents?activeOnly=true");
      // Successfully fetched data - even if it's an empty array
      setComponents(response.data || []);
    } catch (err) {
      console.error("Error fetching salary components:", err);
      // Only set error for actual failures, not empty results
      let errorMessage = "Failed to load salary components. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          errorMessage = axiosErr.response.data.message;
        }
      }
      setError(errorMessage);
      // Set empty array on error so the table shows empty state
      setComponents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this component?")) {
      return;
    }

    try {
      await api.delete(`/salarycomponents/${id}`);
      await fetchComponents();
    } catch (err) {
      console.error("Error deleting component:", err);
      let errorMessage = "Failed to delete component. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          errorMessage = axiosErr.response.data.message;
        }
      }
      alert(errorMessage);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.patch(`/salarycomponents/${id}/toggle-active`, {});
      await fetchComponents();
    } catch (err) {
      console.error("Error toggling component status:", err);
      let errorMessage = "Failed to update component status. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          errorMessage = axiosErr.response.data.message;
        }
      }
      alert(errorMessage);
    }
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Reset form
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "earning",
      calculationType: "fixed",
      defaultValue: "",
      baseComponent: "",
      isMandatory: false,
      isTaxable: true,
      isStatutory: false,
      displayOrder: 0,
      isActive: true,
    });
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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.code.trim()) errors.code = "Component code is required";
    if (!formData.name.trim()) errors.name = "Component name is required";

    const defaultValue = Number(formData.defaultValue);
    if (formData.defaultValue && isNaN(defaultValue)) {
      errors.defaultValue = "Default value must be a number";
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
        type: formData.type,
        calculationType: formData.calculationType,
        defaultValue: Number(formData.defaultValue) || 0,
        baseComponent: formData.baseComponent.trim() || null,
        isMandatory: formData.isMandatory,
        isTaxable: formData.isTaxable,
        isStatutory: formData.isStatutory,
        displayOrder: formData.displayOrder,
        isActive: formData.isActive,
      };

      await api.post("/salarycomponents", payload);
      await fetchComponents();
      handleCloseDrawer();
      alert("Component created successfully!");
    } catch (err) {
      console.error("Error creating component:", err);
      let errorMessage = "Failed to create component. Please try again.";
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          errorMessage = axiosErr.response.data.message;
        }
      }
      alert(errorMessage);
    }
  };

  const columns: Column<SalaryComponent>[] = [
    {
      key: "code",
      header: "Code",
      render: (comp) => <span className="component-code">{comp.code}</span>,
    },
    {
      key: "name",
      header: "Component Name",
      render: (comp) => (
        <div>
          <div className="component-name">{comp.name}</div>
          {comp.isMandatory && (
            <Badge variant="error" size="sm">
              Mandatory
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (comp) => (
        <Badge variant={comp.type === "earning" ? "success" : "warning"}>
          {comp.type === "earning" ? "Earning" : "Deduction"}
        </Badge>
      ),
    },
    {
      key: "calculationType",
      header: "Calculation",
      render: (comp) => (
        <div className="calculation-info">
          <span className="calc-type">
            {comp.calculationType === "percentage"
              ? "Percentage"
              : "Fixed Amount"}
          </span>
          <span className="calc-value">
            {comp.calculationType === "percentage"
              ? `${comp.defaultValue}%`
              : `₹${comp.defaultValue.toLocaleString()}`}
          </span>
        </div>
      ),
    },
    {
      key: "flags",
      header: "Attributes",
      render: (comp) => (
        <div className="component-flags">
          {comp.isTaxable && (
            <Badge variant="info" size="sm">
              Taxable
            </Badge>
          )}
          {comp.isStatutory && (
            <Badge variant="warning" size="sm">
              Statutory
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (comp) => (
        <Badge variant={comp.isActive ? "success" : "default"}>
          {comp.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (comp) => (
        <div className="table-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit", comp.id)}
            title="Edit component"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToggleActive(comp.id)}
            title={comp.isActive ? "Deactivate" : "Activate"}
          >
            {comp.isActive ? "Deactivate" : "Activate"}
          </Button>
          {!comp.isMandatory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(comp.id)}
              title="Delete component"
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Salary Components"
        description="Configure earning and deduction components for payroll processing"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Payroll", path: "/payroll" },
          { label: "Salary Components" },
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => console.log("Import")}>
              Import Components
            </Button>
            <Button variant="primary" onClick={handleOpenDrawer}>
              Add Component
            </Button>
          </>
        }
      />

      <div className="component-stats">
        <Card className="stat-card">
          <div className="stat-label">Total Components</div>
          <div className="stat-value">{components.length}</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-label">Earnings</div>
          <div className="stat-value earning">
            {components.filter((c) => c.type === "earning").length}
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-label">Deductions</div>
          <div className="stat-value deduction">
            {components.filter((c) => c.type === "deduction").length}
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-label">Statutory</div>
          <div className="stat-value">
            {components.filter((c) => c.isStatutory).length}
          </div>
        </Card>
      </div>

      {error && (
        <Card className="error-card">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={fetchComponents}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      <Card>
        <Table
          columns={columns}
          data={components}
          keyExtractor={(item) => item.id}
          loading={loading}
          emptyMessage="No salary components found. Click 'Add Component' to create one."
          searchable={true}
          searchPlaceholder="Search components by name, code, or type..."
          paginated={true}
          pageSize={15}
        />
      </Card>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title="Add Salary Component"
        size="lg"
        footer={
          <div
            style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
          >
            <Button variant="outline" onClick={handleCloseDrawer}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Add Component
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
              label="Component Code *"
              value={formData.code}
              onChange={(e) => handleFormChange("code", e.target.value)}
              placeholder="e.g., BASIC, HRA"
              error={formErrors.code}
              helperText="Unique identifier (will be auto-uppercased)"
            />
            <Input
              label="Component Name *"
              value={formData.name}
              onChange={(e) => handleFormChange("name", e.target.value)}
              placeholder="e.g., Basic Salary"
              error={formErrors.name}
            />
          </div>

          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => handleFormChange("description", e.target.value)}
            placeholder="Component description"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                Component Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value="earning">Earning</option>
                <option value="deduction">Deduction</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "8px",
                }}
              >
                Calculation Type *
              </label>
              <select
                value={formData.calculationType}
                onChange={(e) =>
                  handleFormChange("calculationType", e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              >
                <option value="fixed">Fixed Amount</option>
                <option value="percentage">Percentage of Component</option>
                <option value="formula">Formula Based</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Input
              label="Default Value"
              type="number"
              value={formData.defaultValue}
              onChange={(e) => handleFormChange("defaultValue", e.target.value)}
              placeholder="0"
              error={formErrors.defaultValue}
              helperText="Default amount or percentage"
            />
            <Input
              label="Base Component"
              value={formData.baseComponent}
              onChange={(e) =>
                handleFormChange("baseComponent", e.target.value)
              }
              placeholder="e.g., BASIC"
              helperText="Reference component code (for % calculations)"
            />
          </div>

          <Input
            label="Display Order"
            type="number"
            value={formData.displayOrder}
            onChange={(e) =>
              handleFormChange("displayOrder", Number(e.target.value))
            }
            placeholder="0"
            helperText="Order in which component appears"
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
              padding: "16px",
              background: "#f9fafb",
              borderRadius: "8px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={formData.isMandatory}
                onChange={(e) =>
                  handleFormChange("isMandatory", e.target.checked)
                }
                style={{ width: "16px", height: "16px" }}
              />
              <span style={{ fontSize: "14px" }}>Mandatory Component</span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={formData.isTaxable}
                onChange={(e) =>
                  handleFormChange("isTaxable", e.target.checked)
                }
                style={{ width: "16px", height: "16px" }}
              />
              <span style={{ fontSize: "14px" }}>Taxable</span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={formData.isStatutory}
                onChange={(e) =>
                  handleFormChange("isStatutory", e.target.checked)
                }
                style={{ width: "16px", height: "16px" }}
              />
              <span style={{ fontSize: "14px" }}>Statutory Component</span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleFormChange("isActive", e.target.checked)}
                style={{ width: "16px", height: "16px" }}
              />
              <span style={{ fontSize: "14px" }}>Active</span>
            </label>
          </div>

          <div
            style={{
              padding: "12px",
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "6px",
              fontSize: "13px",
              color: "#1e40af",
            }}
          >
            <strong>💡 Tip:</strong> Use clear, consistent codes (e.g., BASIC,
            HRA, PF) for easy reference in salary templates.
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default SalaryComponents;
