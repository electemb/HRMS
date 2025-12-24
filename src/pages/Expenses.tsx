import React from "react";
import { PageHeader, Card } from "../components/ui";

const Expenses: React.FC = () => {
  return (
    <div className="page-container">
      <PageHeader
        title="Expense Management"
        description="Track and manage business expenses"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Finance", path: "#" },
          { label: "Expenses" },
        ]}
      />
      <Card className="placeholder-card">
        <h2>Expense Management Module</h2>
        <p>Submit, approve, and track employee expenses and reimbursements</p>
        <p className="coming-soon">Coming soon...</p>
      </Card>
    </div>
  );
};

export default Expenses;
