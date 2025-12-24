import React from "react";
import { PageHeader, Card } from "../components/ui";

const FinancialReports: React.FC = () => {
  return (
    <div className="page-container">
      <PageHeader
        title="Financial Reports"
        description="View and generate financial reports and analytics"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Finance", path: "#" },
          { label: "Reports" },
        ]}
      />
      <Card className="placeholder-card">
        <h2>Financial Reports Module</h2>
        <p>Generate comprehensive financial reports, analytics, and insights</p>
        <p className="coming-soon">Coming soon...</p>
      </Card>
    </div>
  );
};

export default FinancialReports;
