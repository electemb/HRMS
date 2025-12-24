import React, { useState } from "react";
import { PageHeader, Card, Table, Button, Badge } from "../../components/ui";
import type { Column } from "../../components/ui/Table";
import "./IdentityTypes.css";

interface IdentityType {
  id: string;
  code: string;
  name: string;
  description: string;
  country: string;
  countryCode: string;
  validationPattern?: string;
  isMandatory: boolean;
  displayOrder: number;
  status: "active" | "inactive";
}

const IdentityTypes: React.FC = () => {
  const [identityTypes] = useState<IdentityType[]>([
    {
      id: "1",
      code: "PAN",
      name: "PAN Card",
      description: "Permanent Account Number",
      country: "India",
      countryCode: "IN",
      validationPattern: "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
      isMandatory: true,
      displayOrder: 1,
      status: "active",
    },
    {
      id: "2",
      code: "AADHAR",
      name: "Aadhaar Card",
      description: "Unique Identification Number",
      country: "India",
      countryCode: "IN",
      validationPattern: "^[0-9]{12}$",
      isMandatory: true,
      displayOrder: 2,
      status: "active",
    },
    {
      id: "3",
      code: "PASSPORT",
      name: "Passport",
      description: "International travel document",
      country: "India",
      countryCode: "IN",
      validationPattern: "^[A-Z]{1}[0-9]{7}$",
      isMandatory: false,
      displayOrder: 3,
      status: "active",
    },
    {
      id: "4",
      code: "DL",
      name: "Driving License",
      description: "Valid driving license",
      country: "India",
      countryCode: "IN",
      validationPattern: "^[A-Z]{2}[0-9]{13}$",
      isMandatory: false,
      displayOrder: 4,
      status: "active",
    },
    {
      id: "5",
      code: "SSN",
      name: "Social Security Number",
      description: "US Social Security Number",
      country: "United States",
      countryCode: "US",
      validationPattern: "^[0-9]{3}-[0-9]{2}-[0-9]{4}$",
      isMandatory: true,
      displayOrder: 1,
      status: "active",
    },
    {
      id: "6",
      code: "EIN",
      name: "Employer Identification Number",
      description: "US Tax ID for employers",
      country: "United States",
      countryCode: "US",
      validationPattern: "^[0-9]{2}-[0-9]{7}$",
      isMandatory: false,
      displayOrder: 2,
      status: "active",
    },
    {
      id: "7",
      code: "NI",
      name: "National Insurance Number",
      description: "UK National Insurance",
      country: "United Kingdom",
      countryCode: "GB",
      validationPattern: "^[A-Z]{2}[0-9]{6}[A-Z]{1}$",
      isMandatory: true,
      displayOrder: 1,
      status: "active",
    },
    {
      id: "8",
      code: "SIN",
      name: "Social Insurance Number",
      description: "Canadian social insurance",
      country: "Canada",
      countryCode: "CA",
      validationPattern: "^[0-9]{3}-[0-9]{3}-[0-9]{3}$",
      isMandatory: true,
      displayOrder: 1,
      status: "active",
    },
  ]);

  const columns: Column<IdentityType>[] = [
    {
      key: "code",
      header: "Code",
      render: (type) => <span className="identity-code">{type.code}</span>,
    },
    {
      key: "name",
      header: "Identity Type",
      render: (type) => (
        <div>
          <div className="identity-name">{type.name}</div>
          <div className="identity-description">{type.description}</div>
        </div>
      ),
    },
    {
      key: "country",
      header: "Country",
      render: (type) => (
        <div className="country-info">
          <span className="country-flag">{type.countryCode}</span>
          <span>{type.country}</span>
        </div>
      ),
    },
    {
      key: "validationPattern",
      header: "Validation Pattern",
      render: (type) => (
        <span className="validation-pattern">
          {type.validationPattern || "N/A"}
        </span>
      ),
    },
    {
      key: "isMandatory",
      header: "Mandatory",
      render: (type) => (
        <Badge variant={type.isMandatory ? "error" : "warning"} size="sm">
          {type.isMandatory ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "displayOrder",
      header: "Order",
      render: (type) => (
        <Badge variant="info" size="sm">
          {type.displayOrder}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (type) => (
        <Badge variant={type.status === "active" ? "success" : "default"}>
          {type.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (type) => (
        <div className="table-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit", type.id)}
          >
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Identity Types"
        description="Manage identity document types and validation rules by country"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Masters", path: "/masters" },
          { label: "Identity Types" },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => console.log("Add Identity Type")}
          >
            Add Identity Type
          </Button>
        }
      />

      <div className="identity-info-card">
        <Card>
          <div className="info-content">
            <span className="info-icon">ℹ️</span>
            <div className="info-text">
              <strong>Identity Types Configuration:</strong> Define
              country-specific identity documents that employees must provide.
              Each identity type can have validation patterns (regex) to ensure
              correct format entry. Mark types as mandatory to enforce
              collection during employee onboarding.
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <Table
          columns={columns}
          data={identityTypes}
          keyExtractor={(item) => item.id}
          loading={false}
          emptyMessage="No identity types found"
          searchable={true}
          searchPlaceholder="Search by identity type, code, or country..."
          paginated={true}
          pageSize={15}
        />
      </Card>
    </div>
  );
};

export default IdentityTypes;
