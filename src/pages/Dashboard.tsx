import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Card, CardBody, Badge, Button } from "../components/ui";
import "./Dashboard.css";

// Icon placeholders
const Users = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>👥</span>
);
const Briefcase = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>💼</span>
);
const Clock = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>🕐</span>
);
const FileText = ({
  size,
  className,
}: {
  size: number;
  className?: string;
}) => (
  <span className={className} style={{ fontSize: size }}>
    📄
  </span>
);
const TrendingUp = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>📈</span>
);
const Calendar = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>📅</span>
);
const DollarSign = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>💵</span>
);
const CheckCircle = ({ size }: { size: number }) => (
  <span style={{ fontSize: size }}>✅</span>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
  color?: "primary" | "success" | "warning" | "error";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = "primary",
}) => {
  return (
    <Card className="stat-card" hoverable>
      <CardBody>
        <div className="stat-card__content">
          <div className="stat-card__info">
            <span className="stat-card__title">{title}</span>
            <h3 className="stat-card__value">{value}</h3>
            {trend && (
              <div
                className={`stat-card__trend ${
                  trend.positive ? "positive" : "negative"
                }`}
              >
                <TrendingUp size={14} />
                <span>{trend.value}</span>
              </div>
            )}
          </div>
          <div className={`stat-card__icon stat-card__icon--${color}`}>
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: "primary" | "success" | "warning" | "error";
}

const Dashboard: React.FC = () => {
  const { user, roles } = useAuth();

  // Role-based stats
  const getStatsForRole = () => {
    const isAdmin = roles.includes("Admin");
    const isManager = roles.includes("Manager");
    const isHR = roles.includes("HR Manager") || roles.includes("HR Executive");
    const isFinance = roles.includes("Finance Manager");

    if (isAdmin || isManager) {
      return [
        {
          title: "Total Employees",
          value: 142,
          icon: <Users size={24} />,
          trend: { value: "+8% this month", positive: true },
          color: "primary" as const,
        },
        {
          title: "Active Projects",
          value: 28,
          icon: <Briefcase size={24} />,
          trend: { value: "+3 new", positive: true },
          color: "success" as const,
        },
        {
          title: "Total Hours Logged",
          value: "1,248",
          icon: <Clock size={24} />,
          trend: { value: "+12% from last week", positive: true },
          color: "primary" as const,
        },
        {
          title: "Pending Tasks",
          value: 63,
          icon: <CheckCircle size={24} />,
          color: "warning" as const,
        },
      ];
    }

    if (isHR) {
      return [
        {
          title: "Total Employees",
          value: 142,
          icon: <Users size={24} />,
          trend: { value: "+8% this month", positive: true },
          color: "primary" as const,
        },
        {
          title: "Pending Leave Requests",
          value: 12,
          icon: <Calendar size={24} />,
          color: "warning" as const,
        },
        {
          title: "Open Positions",
          value: 5,
          icon: <Briefcase size={24} />,
          color: "primary" as const,
        },
        {
          title: "Departments",
          value: 8,
          icon: <FileText size={24} />,
          color: "success" as const,
        },
      ];
    }

    if (isFinance) {
      return [
        {
          title: "Total Invoices",
          value: 84,
          icon: <FileText size={24} />,
          trend: { value: "+15 this month", positive: true },
          color: "primary" as const,
        },
        {
          title: "Revenue",
          value: "$248K",
          icon: <DollarSign size={24} />,
          trend: { value: "+18% vs last month", positive: true },
          color: "success" as const,
        },
        {
          title: "Pending Payments",
          value: "$42K",
          icon: <Clock size={24} />,
          color: "warning" as const,
        },
        {
          title: "Active Clients",
          value: 32,
          icon: <Users size={24} />,
          color: "primary" as const,
        },
      ];
    }

    // Default for employees/developers
    return [
      {
        title: "My Projects",
        value: 4,
        icon: <Briefcase size={24} />,
        color: "primary" as const,
      },
      {
        title: "Hours This Week",
        value: 32,
        icon: <Clock size={24} />,
        trend: { value: "8 hours today", positive: true },
        color: "success" as const,
      },
      {
        title: "Tasks Assigned",
        value: 12,
        icon: <CheckCircle size={24} />,
        color: "warning" as const,
      },
      {
        title: "Leave Balance",
        value: "18 days",
        icon: <Calendar size={24} />,
        color: "primary" as const,
      },
    ];
  };

  const getQuickActionsForRole = (): QuickAction[] => {
    const isAdmin = roles.includes("Admin");
    const isManager = roles.includes("Manager");
    const isHR = roles.includes("HR Manager") || roles.includes("HR Executive");
    const isFinance = roles.includes("Finance Manager");

    if (isAdmin || isManager) {
      return [
        {
          title: "Add New Employee",
          description: "Register a new team member",
          icon: <Users size={20} />,
          path: "/employees",
          color: "primary",
        },
        {
          title: "Create Project",
          description: "Start a new project",
          icon: <Briefcase size={20} />,
          path: "/projects",
          color: "success",
        },
        {
          title: "View Time Entries",
          description: "Review team hours",
          icon: <Clock size={20} />,
          path: "/time-entries",
          color: "primary",
        },
        {
          title: "Manage Clients",
          description: "Client relationships",
          icon: <Users size={20} />,
          path: "/clients",
          color: "warning",
        },
      ];
    }

    if (isHR) {
      return [
        {
          title: "Employee Management",
          description: "Manage employee records",
          icon: <Users size={20} />,
          path: "/employees",
          color: "primary",
        },
        {
          title: "Leave Requests",
          description: "Review pending leaves",
          icon: <Calendar size={20} />,
          path: "/leaves",
          color: "warning",
        },
        {
          title: "Departments",
          description: "Manage departments",
          icon: <Briefcase size={20} />,
          path: "/departments",
          color: "primary",
        },
        {
          title: "Designations",
          description: "Manage job titles",
          icon: <FileText size={20} />,
          path: "/designations",
          color: "success",
        },
      ];
    }

    if (isFinance) {
      return [
        {
          title: "Create Invoice",
          description: "Generate new invoice",
          icon: <FileText size={20} />,
          path: "/invoices",
          color: "primary",
        },
        {
          title: "Client Management",
          description: "Manage client accounts",
          icon: <Users size={20} />,
          path: "/clients",
          color: "success",
        },
        {
          title: "View Reports",
          description: "Financial reports",
          icon: <TrendingUp size={20} />,
          path: "/invoices",
          color: "primary",
        },
        {
          title: "Payment Tracking",
          description: "Track pending payments",
          icon: <DollarSign size={20} />,
          path: "/invoices",
          color: "warning",
        },
      ];
    }

    // Default for employees/developers
    return [
      {
        title: "Log Time",
        description: "Record work hours",
        icon: <Clock size={20} />,
        path: "/time-entries",
        color: "primary",
      },
      {
        title: "My Projects",
        description: "View assigned projects",
        icon: <Briefcase size={20} />,
        path: "/projects",
        color: "success",
      },
      {
        title: "My Tasks",
        description: "Check task list",
        icon: <CheckCircle size={20} />,
        path: "/tasks",
        color: "primary",
      },
      {
        title: "Request Leave",
        description: "Apply for time off",
        icon: <Calendar size={20} />,
        path: "/leaves",
        color: "warning",
      },
    ];
  };

  const stats = getStatsForRole();
  const quickActions = getQuickActionsForRole();

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">
            Welcome back, {user?.email?.split("@")[0]}! 👋
          </h1>
          <p className="dashboard__subtitle">
            Here's what's happening with your workspace today
          </p>
        </div>
        <div className="dashboard__roles">
          {roles.map((role: string) => (
            <Badge key={role} variant="primary" size="md">
              {role}
            </Badge>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard__stats">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dashboard__section">
        <h2 className="dashboard__section-title">Quick Actions</h2>
        <div className="dashboard__actions">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="action-card"
              hoverable
              onClick={() => (window.location.href = action.path)}
            >
              <CardBody>
                <div className="action-card__content">
                  <div
                    className={`action-card__icon action-card__icon--${action.color}`}
                  >
                    {action.icon}
                  </div>
                  <div className="action-card__info">
                    <h4 className="action-card__title">{action.title}</h4>
                    <p className="action-card__description">
                      {action.description}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Go →
                </Button>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <div className="dashboard__section">
        <h2 className="dashboard__section-title">Recent Activity</h2>
        <Card>
          <CardBody>
            <div className="dashboard__empty">
              <FileText size={48} className="dashboard__empty-icon" />
              <p className="dashboard__empty-text">
                No recent activity to display
              </p>
              <p className="dashboard__empty-subtext">
                Activity logs will appear here once you start using the system
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
