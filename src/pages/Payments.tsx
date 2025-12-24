import React from "react";
import { PageHeader, Card } from "../components/ui";
import "./Placeholder.css";

const Payments: React.FC = () => {
  return (
    <div className="placeholder-page">
      <PageHeader
        title="Vendor Payments"
        description="Process payments to vendors and suppliers"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Finance", path: "#" },
          { label: "Payments" },
        ]}
      />
      <Card className="placeholder-card">
        <div className="placeholder-content">
          <div className="placeholder-icon">💰</div>
          <h2>Vendor Payments (AP)</h2>
          <p>Manage outgoing payments to vendors</p>
          <ul className="placeholder-features">
            <li>Payment processing</li>
            <li>Payment batch creation</li>
            <li>Payment method selection</li>
            <li>Payment approval workflow</li>
            <li>Payment history and reconciliation</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Payments;
