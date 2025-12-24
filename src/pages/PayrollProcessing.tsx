import React, { useState } from "react";
import { PageHeader, Card, Button, Badge } from "../components/ui";
import "./PayrollProcessing.css";

interface PayrollPeriod {
  id: string;
  month: string;
  year: number;
  status: "draft" | "processing" | "completed" | "published";
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  processedDate?: string;
  publishedDate?: string;
}

const PayrollProcessing: React.FC = () => {
  const [periods] = useState<PayrollPeriod[]>([
    {
      id: "1",
      month: "September",
      year: 2025,
      status: "completed",
      employeeCount: 99,
      totalGross: 85450000,
      totalDeductions: 10254000,
      totalNet: 75196000,
      processedDate: "2025-09-28",
      publishedDate: "2025-09-30",
    },
    {
      id: "2",
      month: "October",
      year: 2025,
      status: "draft",
      employeeCount: 99,
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
    },
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "default";
      case "processing":
        return "warning";
      case "completed":
        return "success";
      case "published":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <div className="payroll-processing-page">
      <PageHeader
        title="Payroll Processing"
        description="Process monthly payroll and generate payslips"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Payroll", path: "/payroll" },
          { label: "Payroll Processing" },
        ]}
        actions={
          <Button variant="primary" onClick={() => console.log("New Period")}>
            Initialize New Period
          </Button>
        }
      />

      <div className="page-content">
        {/* Current Period Card */}
        <Card className="current-period-card">
          <div className="period-header">
            <div>
              <h2 className="period-title">October 2025</h2>
              <p className="period-subtitle">Current Payroll Period</p>
            </div>
            <Badge variant="default" size="lg">
              Draft
            </Badge>
          </div>

          <div className="period-stats">
            <div className="stat-item">
              <div className="stat-label">Employees</div>
              <div className="stat-value">99</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Working Days</div>
              <div className="stat-value">26</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Estimated Gross</div>
              <div className="stat-value">{formatCurrency(85450000)}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Estimated Net</div>
              <div className="stat-value highlight">
                {formatCurrency(75196000)}
              </div>
            </div>
          </div>

          <div className="period-actions">
            <Button variant="outline" onClick={() => console.log("Configure")}>
              Configure Period
            </Button>
            <Button
              variant="outline"
              onClick={() => console.log("Import Attendance")}
            >
              Import Attendance
            </Button>
            <Button variant="primary" onClick={() => console.log("Process")}>
              Process Payroll
            </Button>
          </div>
        </Card>

        {/* Payroll Steps */}
        <Card>
          <h3 className="section-title">Payroll Processing Steps</h3>
          <div className="payroll-steps">
            <div className="step completed">
              <div className="step-icon">✓</div>
              <div className="step-content">
                <div className="step-title">1. Initialize Period</div>
                <div className="step-description">
                  Create payroll period for October 2025
                </div>
              </div>
              <Badge variant="success" size="sm">
                Completed
              </Badge>
            </div>

            <div className="step current">
              <div className="step-icon">2</div>
              <div className="step-content">
                <div className="step-title">2. Configure Period</div>
                <div className="step-description">
                  Set working days, holidays, and cutoff dates
                </div>
              </div>
              <Button variant="primary" size="sm">
                Configure
              </Button>
            </div>

            <div className="step pending">
              <div className="step-icon">3</div>
              <div className="step-content">
                <div className="step-title">3. Import Attendance</div>
                <div className="step-description">
                  Import attendance data for salary calculations
                </div>
              </div>
              <Badge variant="default" size="sm">
                Pending
              </Badge>
            </div>

            <div className="step pending">
              <div className="step-icon">4</div>
              <div className="step-content">
                <div className="step-title">4. Process Payroll</div>
                <div className="step-description">
                  Calculate salaries for all employees
                </div>
              </div>
              <Badge variant="default" size="sm">
                Pending
              </Badge>
            </div>

            <div className="step pending">
              <div className="step-icon">5</div>
              <div className="step-content">
                <div className="step-title">5. Review & Approve</div>
                <div className="step-description">
                  Review calculations and approve payroll
                </div>
              </div>
              <Badge variant="default" size="sm">
                Pending
              </Badge>
            </div>

            <div className="step pending">
              <div className="step-icon">6</div>
              <div className="step-content">
                <div className="step-title">6. Generate Payslips</div>
                <div className="step-description">
                  Generate and distribute payslips
                </div>
              </div>
              <Badge variant="default" size="sm">
                Pending
              </Badge>
            </div>

            <div className="step pending">
              <div className="step-icon">7</div>
              <div className="step-content">
                <div className="step-title">7. Publish Payroll</div>
                <div className="step-description">
                  Finalize and lock payroll period
                </div>
              </div>
              <Badge variant="default" size="sm">
                Pending
              </Badge>
            </div>
          </div>
        </Card>

        {/* Previous Periods */}
        <Card>
          <h3 className="section-title">Previous Payroll Periods</h3>
          <div className="periods-list">
            {periods
              .filter((p) => p.status !== "draft")
              .map((period) => (
                <div key={period.id} className="period-item">
                  <div className="period-info">
                    <div className="period-name">
                      {period.month} {period.year}
                    </div>
                    <Badge variant={getStatusColor(period.status)}>
                      {period.status}
                    </Badge>
                  </div>
                  <div className="period-summary">
                    <div className="summary-item">
                      <span className="summary-label">Employees:</span>
                      <span className="summary-value">
                        {period.employeeCount}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Gross:</span>
                      <span className="summary-value">
                        {formatCurrency(period.totalGross)}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Deductions:</span>
                      <span className="summary-value">
                        {formatCurrency(period.totalDeductions)}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Net:</span>
                      <span className="summary-value strong">
                        {formatCurrency(period.totalNet)}
                      </span>
                    </div>
                  </div>
                  <div className="period-actions-small">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Download Report
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PayrollProcessing;
