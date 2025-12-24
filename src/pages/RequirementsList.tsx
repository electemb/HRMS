import React from "react";
import { PageHeader, Card, Button } from "../components/ui";
import "./RequirementsList.css";

const RequirementsList: React.FC = () => {
  return (
    <div className="page-container">
      <PageHeader
        title="Requirements"
        description="Manage project requirements and specifications"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Project Management", path: "#" },
          { label: "Requirements" },
        ]}
        actions={
          <Button variant="primary" size="md">
            + Add Requirement
          </Button>
        }
      />

      <Card>
        <div className="coming-soon">
          <span className="icon">📋</span>
          <h3>Requirements Management</h3>
          <p>
            Track and manage project requirements, user stories, and
            specifications.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default RequirementsList;
