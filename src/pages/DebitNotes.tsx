import React from "react";
import { PageHeader, Card } from "../components/ui";
import "./Placeholder.css";

const DebitNotes: React.FC = () => {
  return (
    <div className="placeholder-page">
      <PageHeader
        title="Debit Notes"
        description="Manage vendor debit notes and adjustments"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Finance", path: "#" },
          { label: "Debit Notes" },
        ]}
      />
      <Card className="placeholder-card">
        <div className="placeholder-content">
          <div className="placeholder-icon">📝</div>
          <h2>Debit Notes (AP)</h2>
          <p>Issue debit notes for vendor adjustments</p>
          <ul className="placeholder-features">
            <li>Debit note creation</li>
            <li>Vendor return processing</li>
            <li>Bill adjustments</li>
            <li>Vendor account debits</li>
            <li>Adjustment reconciliation</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default DebitNotes;
