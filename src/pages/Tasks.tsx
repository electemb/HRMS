import React from "react";
import { PageHeader, Card } from "../components/ui";

const Tasks: React.FC = () => {
  return (
    <div className="page-container">
      <PageHeader
        title="Task Management"
        description="Manage project tasks and assignments"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Project Management", path: "#" },
          { label: "Tasks" },
        ]}
      />
      <Card className="placeholder-card">
        <h2>Task Management Module</h2>
        <p>Track and manage project tasks, assignments, and progress</p>
        <p className="coming-soon">Coming soon...</p>
      </Card>
    </div>
  );
};

export default Tasks;
