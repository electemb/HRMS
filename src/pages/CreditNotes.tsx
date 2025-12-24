import React from "react";
import { PageHeader, Card } from "../components/ui";
import "./Placeholder.css";

const CreditNotes: React.FC = () => {
  return (
    <div className="placeholder-page">
      <PageHeader
        title="Credit Notes"
        description="Manage customer credit notes and refunds"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Finance", path: "#" },
          { label: "Credit Notes" },
        ]}
      />
      <Card className="placeholder-card">
        <div className="placeholder-content">
          <div className="placeholder-icon">💳</div>
          <h2>Credit Notes (AR)</h2>
          <p>Issue credit notes for returns and adjustments</p>
          <ul className="placeholder-features">
            <li>Credit note creation</li>
            <li>Return and refund processing</li>
            <li>Invoice adjustments</li>
            <li>Credit note application</li>
            <li>Customer account credits</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default CreditNotes;
