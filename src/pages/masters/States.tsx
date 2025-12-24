import React, { useState } from "react";
import { PageHeader, Card, Table, Button, Badge } from "../../components/ui";
import type { Column } from "../../components/ui/Table";
import "./States.css";

interface State {
  id: string;
  code: string;
  name: string;
  country: string;
  countryCode: string;
  status: "active" | "inactive";
}

const States: React.FC = () => {
  const [states] = useState<State[]>([
    {
      id: "1",
      code: "MH",
      name: "Maharashtra",
      country: "India",
      countryCode: "IN",
      status: "active",
    },
    {
      id: "2",
      code: "KA",
      name: "Karnataka",
      country: "India",
      countryCode: "IN",
      status: "active",
    },
    {
      id: "3",
      code: "DL",
      name: "Delhi",
      country: "India",
      countryCode: "IN",
      status: "active",
    },
    {
      id: "4",
      code: "CA",
      name: "California",
      country: "United States",
      countryCode: "US",
      status: "active",
    },
    {
      id: "5",
      code: "NY",
      name: "New York",
      country: "United States",
      countryCode: "US",
      status: "active",
    },
    {
      id: "6",
      code: "TX",
      name: "Texas",
      country: "United States",
      countryCode: "US",
      status: "active",
    },
    {
      id: "7",
      code: "ON",
      name: "Ontario",
      country: "Canada",
      countryCode: "CA",
      status: "active",
    },
    {
      id: "8",
      code: "QC",
      name: "Quebec",
      country: "Canada",
      countryCode: "CA",
      status: "active",
    },
  ]);

  const columns: Column<State>[] = [
    {
      key: "code",
      header: "Code",
      render: (state) => <span className="state-code">{state.code}</span>,
    },
    {
      key: "name",
      header: "State/Province Name",
      render: (state) => <span className="state-name">{state.name}</span>,
    },
    {
      key: "country",
      header: "Country",
      render: (state) => (
        <div className="country-info">
          <span className="country-flag">{state.countryCode}</span>
          <span>{state.country}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (state) => (
        <Badge variant={state.status === "active" ? "success" : "default"}>
          {state.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (state) => (
        <div className="table-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit", state.id)}
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
        title="States & Provinces"
        description="Manage states, provinces, and administrative regions"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Masters", path: "/masters" },
          { label: "States & Provinces" },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => console.log("Add State/Province")}
          >
            Add State/Province
          </Button>
        }
      />

      <Card>
        <Table
          columns={columns}
          data={states}
          keyExtractor={(item) => item.id}
          loading={false}
          emptyMessage="No states/provinces found"
          searchable={true}
          searchPlaceholder="Search by state name, code, or country..."
          paginated={true}
          pageSize={15}
        />
      </Card>
    </div>
  );
};

export default States;
