import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { Layout } from "./components/Layout/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeeList from "./pages/EmployeeList";
import DepartmentList from "./pages/DepartmentList";
import DesignationList from "./pages/DesignationList";
import ProjectList from "./pages/ProjectList";
import ClientList from "./pages/ClientList";
import RequirementsList from "./pages/RequirementsList";
import LeaveTypeList from "./pages/LeaveTypeList";
import LeaveApplications from "./pages/LeaveApplications";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/Tasks";
import Timesheet from "./pages/Timesheet";
import Expenses from "./pages/Expenses";
import FinancialReports from "./pages/FinancialReports";
import PayrollProcessing from "./pages/PayrollProcessing";
import SalaryComponents from "./pages/SalaryComponents";
import SalaryTemplates from "./pages/SalaryTemplates";
import Holidays from "./pages/Holidays";
import FinancialYears from "./pages/FinancialYears";
import Grades from "./pages/Grades";
import GradeLeavePolicies from "./pages/GradeLeavePolicies";
import Leads from "./pages/Leads";
import Opportunities from "./pages/Opportunities";
import Campaigns from "./pages/Campaigns";
import Contacts from "./pages/Contacts";
import Receipts from "./pages/Receipts";
import CreditNotes from "./pages/CreditNotes";
import Bills from "./pages/Bills";
import Payments from "./pages/Payments";
import DebitNotes from "./pages/DebitNotes";
import {
  Countries,
  States,
  Cities,
  Currencies,
  IdentityTypes,
  OrganizationInfo,
  GeneralSettings,
} from "./pages/masters";
import { Organizations } from "./pages/Organizations";
import LoginPage from "./pages/LoginPage";
import Unauthorized from "./pages/Unauthorized";
import "./styles/global.css";
import "./App.css";

function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { isAuthenticated, roles: userRoles } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.some((r) => userRoles.includes(r)))
    return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/employees"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "HR Manager",
              "HR Executive",
              "Manager",
              "Employee",
              "Developer",
            ]}
          >
            <EmployeeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager", "HR Executive"]}>
            <DepartmentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/designations"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager", "HR Executive"]}>
            <DesignationList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "Project Manager",
              "PMO",
              "Tech Lead",
              "Manager",
              "Employee",
              "Developer",
            ]}
          >
            <ProjectList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute
            roles={["Admin", "Finance Manager", "Finance Executive", "Manager"]}
          >
            <ClientList />
          </ProtectedRoute>
        }
      />
      {/* CRM Module Routes */}
      <Route
        path="/crm/leads"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "Sales Manager",
              "Sales Executive",
              "Business Development",
              "Marketing",
            ]}
          >
            <Leads />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm/clients"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "Sales Manager",
              "Sales Executive",
              "Business Development",
            ]}
          >
            <ClientList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm/opportunities"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "Sales Manager",
              "Sales Executive",
              "Business Development",
            ]}
          >
            <Opportunities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm/campaigns"
        element={
          <ProtectedRoute roles={["Admin", "Sales Manager", "Marketing"]}>
            <Campaigns />
          </ProtectedRoute>
        }
      />
      <Route
        path="/crm/contacts"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "Sales Manager",
              "Sales Executive",
              "Business Development",
              "Marketing",
            ]}
          >
            <Contacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requirements"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "Project Manager",
              "PMO",
              "Tech Lead",
              "Manager",
              "Employee",
              "Developer",
              "QA",
              "BA",
            ]}
          >
            <RequirementsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/holidays"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager", "HR Executive"]}>
            <Holidays />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leave-types"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager", "HR Executive"]}>
            <LeaveTypeList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/leaves"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "HR Manager",
              "HR Executive",
              "Manager",
              "Employee",
              "Developer",
            ]}
          >
            <LeaveApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll/processing"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager", "Finance Manager"]}>
            <PayrollProcessing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll/components"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager"]}>
            <SalaryComponents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll/templates"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager"]}>
            <SalaryTemplates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payroll/reports"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager", "Finance Manager"]}>
            <div className="page-container">
              <div className="placeholder-card">
                <h1>Payroll Reports</h1>
                <p>Coming soon...</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute
            roles={["Admin", "HR Manager", "HR Executive", "Manager"]}
          >
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "Project Manager",
              "Tech Lead",
              "Manager",
              "Employee",
              "Developer",
              "QA",
            ]}
          >
            <Tasks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/timesheet"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "Project Manager",
              "Manager",
              "Employee",
              "Developer",
            ]}
          >
            <Timesheet />
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute
            roles={["Admin", "Finance Manager", "Finance Executive", "Manager"]}
          >
            <Expenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute roles={["Admin", "Finance Manager"]}>
            <FinancialReports />
          </ProtectedRoute>
        }
      />
      {/* Finance Module Routes */}
      <Route
        path="/finance/invoices"
        element={
          <ProtectedRoute
            roles={["Admin", "Finance Manager", "Finance Executive"]}
          >
            <div className="page-container">
              <div className="placeholder-card">
                <h1>Invoices (AR)</h1>
                <p>Coming soon...</p>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/receipts"
        element={
          <ProtectedRoute
            roles={["Admin", "Finance Manager", "Finance Executive"]}
          >
            <Receipts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/credit-notes"
        element={
          <ProtectedRoute
            roles={["Admin", "Finance Manager", "Finance Executive"]}
          >
            <CreditNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/bills"
        element={
          <ProtectedRoute
            roles={["Admin", "Finance Manager", "Finance Executive", "Manager"]}
          >
            <Bills />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/payments"
        element={
          <ProtectedRoute
            roles={["Admin", "Finance Manager", "Finance Executive", "Manager"]}
          >
            <Payments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/debit-notes"
        element={
          <ProtectedRoute
            roles={["Admin", "Finance Manager", "Finance Executive"]}
          >
            <DebitNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/expenses"
        element={
          <ProtectedRoute
            roles={["Admin", "Finance Manager", "Finance Executive", "Manager"]}
          >
            <Expenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/finance/reports"
        element={
          <ProtectedRoute roles={["Admin", "Finance Manager"]}>
            <FinancialReports />
          </ProtectedRoute>
        }
      />

      {/* Masters Module Routes */}
      <Route
        path="/masters/financial-years"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager"]}>
            <FinancialYears />
          </ProtectedRoute>
        }
      />
      <Route
        path="/masters/grades"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager"]}>
            <Grades />
          </ProtectedRoute>
        }
      />
      <Route
        path="/masters/grade-policies"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager"]}>
            <GradeLeavePolicies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/masters/countries"
        element={
          <ProtectedRoute roles={["Admin"]}>
            <Countries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/masters/states"
        element={
          <ProtectedRoute roles={["Admin"]}>
            <States />
          </ProtectedRoute>
        }
      />
      <Route
        path="/masters/cities"
        element={
          <ProtectedRoute roles={["Admin"]}>
            <Cities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/masters/currencies"
        element={
          <ProtectedRoute roles={["Admin", "Finance Manager"]}>
            <Currencies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/masters/identity-types"
        element={
          <ProtectedRoute roles={["Admin", "HR Manager"]}>
            <IdentityTypes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/masters/organizations"
        element={
          <ProtectedRoute roles={["Admin"]}>
            <Organizations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/masters/organization"
        element={
          <ProtectedRoute roles={["Admin"]}>
            <OrganizationInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/masters/general-settings"
        element={
          <ProtectedRoute roles={["Admin"]}>
            <GeneralSettings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            roles={[
              "Admin",
              "HR Manager",
              "HR Executive",
              "Finance Manager",
              "Sales Manager",
              "Manager",
              "Tech Lead",
              "Employee",
              "Developer",
              "QA",
              "BA",
            ]}
          >
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Add more protected routes for other modules */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
