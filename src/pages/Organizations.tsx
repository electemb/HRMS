import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { organizationService, type Organization } from "../services";
import { PageHeader, Table, Button, type Column } from "../components/ui";
import "./Organizations.css";

export const Organizations: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await organizationService.getAll();
      console.log("Organizations loaded:", data);
      setOrganizations(data);
    } catch (err) {
      console.error("Failed to load organizations:", err);
      setError("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate("/masters/organizations/new");
  };

  const handleEdit = (org: Organization) => {
    navigate(`/masters/organizations/${org.id}`);
  };

  const columns: Column<Organization>[] = [
    {
      key: "name",
      header: "Organization",
      sortable: true,
      render: (org) => (
        <div className="org-name-cell">
          <div className="org-name-primary">{org.name}</div>
          <div className="org-name-secondary">Code: {org.code}</div>
        </div>
      ),
    },
    {
      key: "country",
      header: "Country",
      sortable: true,
      render: (org) => org.country || "-",
    },
    {
      key: "baseCurrencyCode",
      header: "Currency",
      sortable: true,
      render: (org) => org.baseCurrencyCode || "-",
    },
    {
      key: "isActive",
      header: "Status",
      sortable: true,
      render: (org) => (
        <span
          className={`org-status-badge ${
            org.isActive ? "org-status-active" : "org-status-inactive"
          }`}
        >
          {org.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Created",
      sortable: true,
      render: (org) => new Date(org.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "Actions",
      render: (org) => (
        <div className="org-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(org);
            }}
            className="org-action-button"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="organizations-loading">
        <div className="organizations-loading-text">Loading organizations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="organizations-error">
        <div className="organizations-error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="organizations-page">
      <PageHeader
        title="Organizations"
        description={`Manage your ${organizations.length} organization${
          organizations.length !== 1 ? "s" : ""
        }`}
        actions={
          <Button onClick={handleCreate} variant="primary">
            + Add Organization
          </Button>
        }
      />

      <div className="organizations-card">
        {organizations.length === 0 ? (
          <div className="organizations-empty">
            <div className="organizations-empty-icon">🏢</div>
            <h3 className="organizations-empty-title">No organizations</h3>
            <p className="organizations-empty-description">
              Get started by creating a new organization.
            </p>
            <div className="organizations-empty-action">
              <Button onClick={handleCreate} variant="primary">
                + Add Organization
              </Button>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            data={organizations}
            keyExtractor={(org) => org.id}
            onRowClick={handleEdit}
            searchable={true}
            searchPlaceholder="Search organizations..."
            paginated={true}
            pageSize={10}
          />
        )}
      </div>
    </div>
  );
};
