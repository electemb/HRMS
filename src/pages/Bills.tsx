import React from "react";
import { PageHeader, Card } from "../components/ui";
import "./Placeholder.css";

const Bills: React.FC = () => {
  return (
    <div className="placeholder-page">
      <PageHeader
        title="Bills"
        description="Manage vendor bills and invoices"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Finance", path: "#" },
          { label: "Bills" },
        ]}
      />
      <Card className="placeholder-card">
        <div className="placeholder-content">
          <div className="placeholder-icon">📃</div>
          <h2>Vendor Bills (AP)</h2>
          <p>Record and track vendor invoices</p>
          <ul className="placeholder-features">
            <li>Bill entry and recording</li>
            <li>Vendor invoice management</li>
            <li>Bill approval workflow</li>
            <li>Payment scheduling</li>
            <li>Outstanding bills tracking</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Bills;
