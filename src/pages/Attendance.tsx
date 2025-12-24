import React from "react";
import { PageHeader, Card } from "../components/ui";

const Attendance: React.FC = () => {
  return (
    <div className="page-container">
      <PageHeader
        title="Attendance Management"
        description="Track and manage employee attendance"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Human Resources", path: "#" },
          { label: "Attendance" },
        ]}
      />
      <Card className="placeholder-card">
        <h2>Attendance Module</h2>
        <p>Daily attendance tracking and reporting</p>
        <p className="coming-soon">Coming soon...</p>
      </Card>
    </div>
  );
};

export default Attendance;
