import React from "react";
import { PageHeader, Card } from "../components/ui";
import "./Placeholder.css";

const Opportunities: React.FC = () => {
  return (
    <div className="placeholder-page">
      <PageHeader
        title="Opportunities"
        description="Manage sales opportunities and deals"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "CRM", path: "#" },
          { label: "Opportunities" },
        ]}
      />
      <Card className="placeholder-card">
        <div className="placeholder-content">
          <div className="placeholder-icon">💼</div>
          <h2>Sales Opportunities</h2>
          <p>Track deals through the sales pipeline</p>
          <ul className="placeholder-features">
            <li>Opportunity pipeline management</li>
            <li>Sales stage tracking</li>
            <li>Deal value forecasting</li>
            <li>Win/loss analysis</li>
            <li>Sales velocity metrics</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Opportunities;
