import React from "react";
import { PageHeader, Card } from "../components/ui";
import "./Placeholder.css";

const Campaigns: React.FC = () => {
  return (
    <div className="placeholder-page">
      <PageHeader
        title="Campaigns"
        description="Create and manage marketing campaigns"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "CRM", path: "#" },
          { label: "Campaigns" },
        ]}
      />
      <Card className="placeholder-card">
        <div className="placeholder-content">
          <div className="placeholder-icon">📢</div>
          <h2>Marketing Campaigns</h2>
          <p>Plan, execute, and track marketing campaigns</p>
          <ul className="placeholder-features">
            <li>Campaign planning and execution</li>
            <li>Email marketing automation</li>
            <li>Campaign ROI tracking</li>
            <li>Target audience segmentation</li>
            <li>Campaign performance analytics</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Campaigns;
