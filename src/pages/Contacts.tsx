import React from "react";
import { PageHeader, Card } from "../components/ui";
import "./Placeholder.css";

const Contacts: React.FC = () => {
  return (
    <div className="placeholder-page">
      <PageHeader
        title="Contacts"
        description="Manage customer and prospect contacts"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "CRM", path: "#" },
          { label: "Contacts" },
        ]}
      />
      <Card className="placeholder-card">
        <div className="placeholder-content">
          <div className="placeholder-icon">📇</div>
          <h2>Contact Management</h2>
          <p>Centralized contact database and communication history</p>
          <ul className="placeholder-features">
            <li>Contact information management</li>
            <li>Communication history tracking</li>
            <li>Relationship mapping</li>
            <li>Contact segmentation</li>
            <li>Activity timeline</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Contacts;
