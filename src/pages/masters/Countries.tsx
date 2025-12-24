import React, { useState } from "react";
import { PageHeader, Card, Table, Button, Badge } from "../../components/ui";
import type { Column } from "../../components/ui/Table";
import "./Countries.css";

interface Country {
  id: string;
  code: string;
  name: string;
  currency: string;
  phoneCode: string;
  timezone: string;
  status: "active" | "inactive";
}

const Countries: React.FC = () => {
  const [countries] = useState<Country[]>([
    {
      id: "1",
      code: "IN",
      name: "India",
      currency: "INR",
      phoneCode: "+91",
      timezone: "Asia/Kolkata",
      status: "active",
    },
    {
      id: "2",
      code: "US",
      name: "United States",
      currency: "USD",
      phoneCode: "+1",
      timezone: "America/New_York",
      status: "active",
    },
    {
      id: "3",
      code: "GB",
      name: "United Kingdom",
      currency: "GBP",
      phoneCode: "+44",
      timezone: "Europe/London",
      status: "active",
    },
    {
      id: "4",
      code: "CA",
      name: "Canada",
      currency: "CAD",
      phoneCode: "+1",
      timezone: "America/Toronto",
      status: "active",
    },
    {
      id: "5",
      code: "AU",
      name: "Australia",
      currency: "AUD",
      phoneCode: "+61",
      timezone: "Australia/Sydney",
      status: "active",
    },
  ]);

  const columns: Column<Country>[] = [
    {
      key: "code",
      header: "Code",
      render: (country) => <span className="country-code">{country.code}</span>,
    },
    {
      key: "name",
      header: "Country Name",
      render: (country) => <span className="country-name">{country.name}</span>,
    },
    {
      key: "currency",
      header: "Currency",
      render: (country) => <Badge variant="info">{country.currency}</Badge>,
    },
    {
      key: "phoneCode",
      header: "Phone Code",
      render: (country) => (
        <span className="phone-code">{country.phoneCode}</span>
      ),
    },
    {
      key: "timezone",
      header: "Timezone",
      render: (country) => <span className="timezone">{country.timezone}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (country) => (
        <Badge variant={country.status === "active" ? "success" : "default"}>
          {country.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (country) => (
        <div className="table-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit", country.id)}
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
        title="Countries"
        description="Manage countries and their configurations"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Masters", path: "/masters" },
          { label: "Countries" },
        ]}
        actions={
          <Button variant="primary" onClick={() => console.log("Add Country")}>
            Add Country
          </Button>
        }
      />

      <Card>
        <Table
          columns={columns}
          data={countries}
          keyExtractor={(item) => item.id}
          loading={false}
          emptyMessage="No countries found"
          searchable={true}
          searchPlaceholder="Search countries by name or code..."
          paginated={true}
          pageSize={10}
        />
      </Card>
    </div>
  );
};

export default Countries;
