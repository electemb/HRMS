import React, { useState } from "react";
import { PageHeader, Card, Table, Button, Badge } from "../../components/ui";
import type { Column } from "../../components/ui/Table";
import "./Currencies.css";

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  countries: string[];
  exchangeRate?: number;
  isBase: boolean;
  status: "active" | "inactive";
}

const Currencies: React.FC = () => {
  const [currencies] = useState<Currency[]>([
    {
      id: "1",
      code: "INR",
      name: "Indian Rupee",
      symbol: "₹",
      decimalPlaces: 2,
      countries: ["India"],
      exchangeRate: 1.0,
      isBase: true,
      status: "active",
    },
    {
      id: "2",
      code: "USD",
      name: "US Dollar",
      symbol: "$",
      decimalPlaces: 2,
      countries: ["United States", "Ecuador", "El Salvador"],
      exchangeRate: 83.12,
      isBase: false,
      status: "active",
    },
    {
      id: "3",
      code: "EUR",
      name: "Euro",
      symbol: "€",
      decimalPlaces: 2,
      countries: ["Germany", "France", "Italy", "Spain"],
      exchangeRate: 89.45,
      isBase: false,
      status: "active",
    },
    {
      id: "4",
      code: "GBP",
      name: "British Pound",
      symbol: "£",
      decimalPlaces: 2,
      countries: ["United Kingdom"],
      exchangeRate: 104.23,
      isBase: false,
      status: "active",
    },
    {
      id: "5",
      code: "JPY",
      name: "Japanese Yen",
      symbol: "¥",
      decimalPlaces: 0,
      countries: ["Japan"],
      exchangeRate: 0.56,
      isBase: false,
      status: "active",
    },
    {
      id: "6",
      code: "AUD",
      name: "Australian Dollar",
      symbol: "A$",
      decimalPlaces: 2,
      countries: ["Australia"],
      exchangeRate: 54.67,
      isBase: false,
      status: "active",
    },
    {
      id: "7",
      code: "CAD",
      name: "Canadian Dollar",
      symbol: "C$",
      decimalPlaces: 2,
      countries: ["Canada"],
      exchangeRate: 61.23,
      isBase: false,
      status: "active",
    },
  ]);

  const columns: Column<Currency>[] = [
    {
      key: "code",
      header: "Code",
      render: (currency) => (
        <div className="currency-code-container">
          <span className="currency-code">{currency.code}</span>
          {currency.isBase && (
            <Badge variant="primary" size="sm">
              Base
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Currency Name",
      render: (currency) => (
        <div>
          <div className="currency-name">{currency.name}</div>
          <div className="currency-symbol">Symbol: {currency.symbol}</div>
        </div>
      ),
    },
    {
      key: "decimalPlaces",
      header: "Decimal Places",
      render: (currency) => (
        <Badge variant="info">{currency.decimalPlaces}</Badge>
      ),
    },
    {
      key: "exchangeRate",
      header: "Exchange Rate",
      render: (currency) => (
        <span className="exchange-rate">
          {currency.isBase
            ? "1.00 (Base)"
            : `${currency.exchangeRate?.toFixed(2)}`}
        </span>
      ),
    },
    {
      key: "countries",
      header: "Countries",
      render: (currency) => (
        <div className="countries-list">
          <span className="country-count">
            {currency.countries.length}{" "}
            {currency.countries.length === 1 ? "country" : "countries"}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (currency) => (
        <Badge variant={currency.status === "active" ? "success" : "default"}>
          {currency.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (currency) => (
        <div className="table-actions">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit", currency.id)}
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Update Rate", currency.id)}
          >
            Update Rate
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Currencies"
        description="Manage currencies and exchange rates"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Masters", path: "/masters" },
          { label: "Currencies" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => console.log("Update All Rates")}
            >
              Update All Rates
            </Button>
            <Button
              variant="primary"
              onClick={() => console.log("Add Currency")}
            >
              Add Currency
            </Button>
          </>
        }
      />

      <Card>
        <Table
          columns={columns}
          data={currencies}
          keyExtractor={(item) => item.id}
          loading={false}
          emptyMessage="No currencies found"
          searchable={true}
          searchPlaceholder="Search by currency code or name..."
          paginated={true}
          pageSize={10}
        />
      </Card>
    </div>
  );
};

export default Currencies;
