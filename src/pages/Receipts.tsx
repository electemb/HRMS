import React from "react";
import { PageHeader, Card } from "../components/ui";
import "./Placeholder.css";

const Receipts: React.FC = () => {
  return (
    <div className="placeholder-page">
      <PageHeader
        title="Payment Receipts"
        description="Manage customer payment receipts"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Finance", path: "#" },
          { label: "Receipts" },
        ]}
      />
      <Card className="placeholder-card">
        <div className="placeholder-content">
          <div className="placeholder-icon">🧾</div>
          <h2>Payment Receipts (AR)</h2>
          <p>Record and track customer payments</p>
          <ul className="placeholder-features">
            <li>Payment receipt generation</li>
            <li>Payment allocation to invoices</li>
            <li>Multiple payment methods</li>
            <li>Receipt acknowledgement</li>
            <li>Payment history tracking</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Receipts;
