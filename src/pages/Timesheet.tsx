import React from "react";
import { PageHeader, Card } from "../components/ui";

const Timesheet: React.FC = () => {
  return (
    <div className="page-container">
      <PageHeader
        title="Timesheet"
        description="Track time spent on projects and tasks"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Project Management", path: "#" },
          { label: "Timesheet" },
        ]}
      />
      <Card className="placeholder-card">
        <h2>Timesheet Module</h2>
        <p>Log and manage time entries for projects and tasks</p>
        <p className="coming-soon">Coming soon...</p>
      </Card>
    </div>
  );
};

export default Timesheet;
