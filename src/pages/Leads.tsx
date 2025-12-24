import React from "react";
import { PageHeader, Card } from "../components/ui";
import "./Placeholder.css";

const Leads: React.FC = () => {
  return (
    <div className="placeholder-page">
      <PageHeader
        title="Leads"
        description="Manage sales leads and prospects"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "CRM", path: "#" },
          { label: "Leads" },
        ]}
      />
      <Card className="placeholder-card">
        <div className="placeholder-content">
          <div className="placeholder-icon">🎯</div>
          <h2>Lead Management</h2>
          <p>Track and manage sales leads through the pipeline</p>
          <ul className="placeholder-features">
            <li>Lead capture and qualification</li>
            <li>Lead scoring and prioritization</li>
            <li>Lead assignment and routing</li>
            <li>Lead conversion tracking</li>
            <li>Lead source analytics</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Leads;
