import React from "react";
import { PageHeader, Card, Button } from "../components/ui";
import "./LeaveApplications.css";

const LeaveApplications: React.FC = () => {
  return (
    <div className="page-container">
      <PageHeader
        title="Leave Management"
        description="Manage employee leave requests and approvals"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Human Resources", path: "#" },
          { label: "Leave Management" },
        ]}
        actions={
          <Button variant="primary" size="md">
            + Apply Leave
          </Button>
        }
      />

      <Card>
        <div className="coming-soon">
          <span className="icon">📅</span>
          <h3>Leave Applications</h3>
          <p>
            Track and manage employee leave requests, balances, and approvals.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LeaveApplications;
