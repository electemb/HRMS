import React, { useState } from "react";
import { PageHeader, Card, Table, Button, Badge } from "../../components/ui";
import type { Column } from "../../components/ui/Table";
import "./Cities.css";

interface City {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  country: string;
  countryCode: string;
  population?: number;
  status: "active" | "inactive";
}

const Cities: React.FC = () => {
  const [cities] = useState<City[]>([
    {
      id: "1",
      name: "Mumbai",
      state: "Maharashtra",
      stateCode: "MH",
      country: "India",
      countryCode: "IN",
      population: 20961472,
      status: "active",
    },
    {
      id: "2",
      name: "Pune",
      state: "Maharashtra",
      stateCode: "MH",
      country: "India",
      countryCode: "IN",
      population: 7764042,
      status: "active",
    },
    {
      id: "3",
      name: "Bangalore",
      state: "Karnataka",
      stateCode: "KA",
      country: "India",
      countryCode: "IN",
      population: 13608000,
      status: "active",
    },
    {
      id: "4",
      name: "New Delhi",
      state: "Delhi",
      stateCode: "DL",
      country: "India",
      countryCode: "IN",
      population: 32941000,
      status: "active",
    },
    {
      id: "5",
      name: "Los Angeles",
      state: "California",
      stateCode: "CA",
      country: "United States",
      countryCode: "US",
      population: 3979576,
      status: "active",
    },
    {
      id: "6",
      name: "New York",
      state: "New York",
      stateCode: "NY",
      country: "United States",
      countryCode: "US",
      population: 8336817,
      status: "active",
    },
  ]);

  const formatPopulation = (pop?: number) => {
    if (!pop) return "N/A";
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`;
    if (pop >= 1000) return `${(pop / 1000).toFixed(0)}K`;
    return pop.toString();
  };

  const columns: Column<City>[] = [
    {
      key: "name",
      header: "City Name",
      render: (city) => <span className="city-name">{city.name}</span>,
    },
    {
      key: "state",
      header: "State/Province",
      render: (city) => (
        <div className="location-info">
          <span className="location-code">{city.stateCode}</span>
          <span>{city.state}</span>
        </div>
      ),
    },
    {
      key: "country",
      header: "Country",
      render: (city) => (
        <div className="location-info">
          <span className="location-code">{city.countryCode}</span>
          <span>{city.country}</span>
        </div>
      ),
    },
    {
      key: "population",
      header: "Population",
      render: (city) => (
        <Badge variant="info">{formatPopulation(city.population)}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (city) => (
        <Badge variant={city.status === "active" ? "success" : "default"}>
          {city.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (city) => (
        <div className="table-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit", city.id)}
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
        title="Cities"
        description="Manage cities and urban areas"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Masters", path: "/masters" },
          { label: "Cities" },
        ]}
        actions={
          <Button variant="primary" onClick={() => console.log("Add City")}>
            Add City
          </Button>
        }
      />

      <Card>
        <Table
          columns={columns}
          data={cities}
          keyExtractor={(item) => item.id}
          loading={false}
          emptyMessage="No cities found"
          searchable={true}
          searchPlaceholder="Search by city, state, or country..."
          paginated={true}
          pageSize={15}
        />
      </Card>
    </div>
  );
};

export default Cities;
