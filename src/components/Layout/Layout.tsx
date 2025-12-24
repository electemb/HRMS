import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { Button, OrganizationSelector } from "../ui";
import "./Layout.css";

interface NavItem {
  path?: string;
  label: string;
  icon: string;
  roles: string[];
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "📊",
    roles: [
      "Admin",
      "HR Manager",
      "Finance Manager",
      "Project Manager",
      "Sales Manager",
      "Developer",
      "Employee",
    ],
  },
  {
    label: "Human Resources",
    icon: "👥",
    roles: [
      "Admin",
      "HR Manager",
      "HR Executive",
      "Manager",
      "Employee",
      "Developer",
    ],
    subItems: [
      {
        path: "/employees",
        label: "Employees",
        icon: "👤",
        roles: [
          "Admin",
          "HR Manager",
          "HR Executive",
          "Manager",
          "Employee",
          "Developer",
        ],
      },
      {
        path: "/departments",
        label: "Departments",
        icon: "🏢",
        roles: ["Admin", "HR Manager", "HR Executive"],
      },
      {
        path: "/designations",
        label: "Designations",
        icon: "🎯",
        roles: ["Admin", "HR Manager", "HR Executive"],
      },
      {
        path: "/leave-types",
        label: "Leave Types",
        icon: "📋",
        roles: ["Admin", "HR Manager", "HR Executive"],
      },
      {
        path: "/leave-balances",
        label: "Leave Balances",
        icon: "📊",
        roles: [
          "Admin",
          "HR Manager",
          "HR Executive",
          "Manager",
          "Employee",
          "Developer",
        ],
      },
      {
        path: "/leaves",
        label: "Leave Applications",
        icon: "📅",
        roles: [
          "Admin",
          "HR Manager",
          "HR Executive",
          "Manager",
          "Employee",
          "Developer",
        ],
      },
      {
        path: "/holidays",
        label: "Holidays",
        icon: "🏖️",
        roles: ["Admin", "HR Manager", "HR Executive"],
      },
      {
        path: "/attendance",
        label: "Attendance",
        icon: "⏰",
        roles: ["Admin", "HR Manager", "HR Executive", "Manager"],
      },
    ],
  },
  {
    label: "Payroll",
    icon: "💰",
    roles: ["Admin", "HR Manager", "Finance Manager"],
    subItems: [
      {
        path: "/payroll/processing",
        label: "Payroll Processing",
        icon: "⚙️",
        roles: ["Admin", "HR Manager", "Finance Manager"],
      },
      {
        path: "/payroll/components",
        label: "Salary Components",
        icon: "📝",
        roles: ["Admin", "HR Manager"],
      },
      {
        path: "/payroll/templates",
        label: "Salary Templates",
        icon: "📋",
        roles: ["Admin", "HR Manager"],
      },
      {
        path: "/payroll/reports",
        label: "Payroll Reports",
        icon: "📊",
        roles: ["Admin", "HR Manager", "Finance Manager"],
      },
    ],
  },
  {
    label: "Project Management",
    icon: "📁",
    roles: [
      "Admin",
      "Project Manager",
      "PMO",
      "Tech Lead",
      "Manager",
      "Employee",
      "Developer",
      "QA",
      "BA",
    ],
    subItems: [
      {
        path: "/projects",
        label: "Projects",
        icon: "📂",
        roles: [
          "Admin",
          "Project Manager",
          "PMO",
          "Tech Lead",
          "Manager",
          "Employee",
          "Developer",
        ],
      },
      {
        path: "/requirements",
        label: "Requirements",
        icon: "📋",
        roles: [
          "Admin",
          "Project Manager",
          "PMO",
          "Tech Lead",
          "Manager",
          "Employee",
          "Developer",
          "QA",
          "BA",
        ],
      },
      {
        path: "/tasks",
        label: "Tasks",
        icon: "✅",
        roles: [
          "Admin",
          "Project Manager",
          "Tech Lead",
          "Manager",
          "Employee",
          "Developer",
          "QA",
        ],
      },
      {
        path: "/timesheet",
        label: "Timesheet",
        icon: "⏱️",
        roles: ["Admin", "Project Manager", "Manager", "Employee", "Developer"],
      },
    ],
  },
  {
    label: "CRM",
    icon: "🤝",
    roles: [
      "Admin",
      "Sales Manager",
      "Sales Executive",
      "Business Development",
      "Manager",
    ],
    subItems: [
      {
        path: "/crm/leads",
        label: "Leads",
        icon: "🎯",
        roles: [
          "Admin",
          "Sales Manager",
          "Sales Executive",
          "Business Development",
        ],
      },
      {
        path: "/crm/clients",
        label: "Clients",
        icon: "👥",
        roles: [
          "Admin",
          "Sales Manager",
          "Sales Executive",
          "Business Development",
          "Manager",
        ],
      },
      {
        path: "/crm/opportunities",
        label: "Opportunities",
        icon: "💼",
        roles: ["Admin", "Sales Manager", "Sales Executive"],
      },
      {
        path: "/crm/campaigns",
        label: "Campaigns",
        icon: "📢",
        roles: ["Admin", "Sales Manager", "Marketing"],
      },
      {
        path: "/crm/contacts",
        label: "Contacts",
        icon: "📇",
        roles: ["Admin", "Sales Manager", "Sales Executive"],
      },
    ],
  },
  {
    label: "Finance",
    icon: "💵",
    roles: ["Admin", "Finance Manager", "Finance Executive", "Manager"],
    subItems: [
      {
        path: "/finance/invoices",
        label: "Invoices (AR)",
        icon: "🧾",
        roles: ["Admin", "Finance Manager", "Finance Executive"],
      },
      {
        path: "/finance/receipts",
        label: "Receipts (AR)",
        icon: "💳",
        roles: ["Admin", "Finance Manager", "Finance Executive"],
      },
      {
        path: "/finance/credit-notes",
        label: "Credit Notes (AR)",
        icon: "📝",
        roles: ["Admin", "Finance Manager", "Finance Executive"],
      },
      {
        path: "/finance/bills",
        label: "Bills (AP)",
        icon: "📄",
        roles: ["Admin", "Finance Manager", "Finance Executive"],
      },
      {
        path: "/finance/payments",
        label: "Payments (AP)",
        icon: "💰",
        roles: ["Admin", "Finance Manager", "Finance Executive"],
      },
      {
        path: "/finance/debit-notes",
        label: "Debit Notes (AP)",
        icon: "📋",
        roles: ["Admin", "Finance Manager", "Finance Executive"],
      },
      {
        path: "/finance/expenses",
        label: "Expenses",
        icon: "💸",
        roles: [
          "Admin",
          "Finance Manager",
          "Finance Executive",
          "Manager",
          "Employee",
        ],
      },
      {
        path: "/finance/reports",
        label: "Financial Reports",
        icon: "📊",
        roles: ["Admin", "Finance Manager", "Manager"],
      },
    ],
  },
  {
    label: "Masters",
    icon: "⚙️",
    roles: ["Admin", "HR Manager", "Finance Manager"],
    subItems: [
      {
        path: "/masters/financial-years",
        label: "Financial Years",
        icon: "📆",
        roles: ["Admin", "HR Manager"],
      },
      {
        path: "/masters/grades",
        label: "Grades",
        icon: "🏷️",
        roles: ["Admin", "HR Manager"],
      },
      {
        path: "/masters/grade-policies",
        label: "Grade Leave Policies",
        icon: "🧩",
        roles: ["Admin", "HR Manager"],
      },
      {
        path: "/masters/countries",
        label: "Countries",
        icon: "🌍",
        roles: ["Admin"],
      },
      {
        path: "/masters/states",
        label: "States/Provinces",
        icon: "🗺️",
        roles: ["Admin"],
      },
      {
        path: "/masters/cities",
        label: "Cities",
        icon: "🏙️",
        roles: ["Admin"],
      },
      {
        path: "/masters/currencies",
        label: "Currencies",
        icon: "💱",
        roles: ["Admin", "Finance Manager"],
      },
      {
        path: "/masters/identity-types",
        label: "Identity Types",
        icon: "🆔",
        roles: ["Admin", "HR Manager"],
      },
      {
        path: "/masters/organizations",
        label: "Organizations",
        icon: "🏢",
        roles: ["Admin"],
      },
      {
        path: "/masters/organization",
        label: "Organization Info",
        icon: "🏢",
        roles: ["Admin"],
      },
      {
        path: "/masters/general-settings",
        label: "General Settings",
        icon: "🔧",
        roles: ["Admin"],
      },
    ],
  },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );
  const { user, roles, logout } = useAuth();
  const navigate = useNavigate();

  const filteredNav = navItems.filter((item) => {
    // For items with subItems, check if user can access any sub-item
    if (item.subItems) {
      return item.subItems.some((subItem) =>
        subItem.roles.some((role) => roles.includes(role))
      );
    }
    // For regular items, check parent roles
    return item.roles.some((role) => roles.includes(role));
  });

  // Debug: Log Leave Management item
  const leaveManagementItem = filteredNav.find(item => item.label === "Leave Management");
  console.log("Leave Management in filteredNav:", leaveManagementItem);
  console.log("Has subItems?", leaveManagementItem?.subItems ? "Yes" : "No");

  const toggleSubmenu = (label: string) => {
    setExpandedMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userInitials =
    user && "email" in user && typeof user.email === "string"
      ? user.email.substring(0, 2).toUpperCase()
      : "U";

  return (
    <div className="app-layout">
      <aside
        className={`app-sidebar ${collapsed ? "app-sidebar--collapsed" : ""} ${
          mobileOpen ? "app-sidebar--mobile-open" : ""
        }`}
      >
        <div className="app-sidebar__header">
          <div className="app-sidebar__logo">E</div>
          <span className="app-sidebar__title">Enterprise</span>
        </div>

        <nav className="app-sidebar__nav">
          <ul className="app-sidebar__nav-list">
            {filteredNav.map((item) => (
              <li
                key={item.path || item.label}
                className="app-sidebar__nav-item"
              >
                {item.subItems ? (
                  // Menu with submenu
                  <>
                    <button
                      className={`app-sidebar__nav-link ${
                        expandedMenus[item.label] ? "active" : ""
                      }`}
                      onClick={() => toggleSubmenu(item.label)}
                    >
                      <span className="app-sidebar__nav-icon">{item.icon}</span>
                      <span className="app-sidebar__nav-text">
                        {item.label}
                      </span>
                      <span className="app-sidebar__nav-arrow">
                        {expandedMenus[item.label] ? "▼" : "▶"}
                      </span>
                    </button>
                    {expandedMenus[item.label] && (
                      <ul className="app-sidebar__submenu">
                        {item.subItems
                          .filter((subItem) =>
                            subItem.roles.some((role) => roles.includes(role))
                          )
                          .map((subItem) => (
                            <li
                              key={subItem.path}
                              className="app-sidebar__submenu-item"
                            >
                              <NavLink
                                to={subItem.path!}
                                className={({ isActive }) =>
                                  `app-sidebar__submenu-link ${
                                    isActive ? "active" : ""
                                  }`
                                }
                                onClick={() => setMobileOpen(false)}
                              >
                                <span className="app-sidebar__nav-icon">
                                  {subItem.icon}
                                </span>
                                <span className="app-sidebar__nav-text">
                                  {subItem.label}
                                </span>
                              </NavLink>
                            </li>
                          ))}
                      </ul>
                    )}
                  </>
                ) : (
                  // Regular menu item
                  <NavLink
                    to={item.path!}
                    className={({ isActive }) =>
                      `app-sidebar__nav-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="app-sidebar__nav-icon">{item.icon}</span>
                    <span className="app-sidebar__nav-text">{item.label}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="app-sidebar__footer">
          {!collapsed && (
            <Button variant="ghost" size="sm" fullWidth onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </aside>

      <main className="app-main">
        <header className="app-header">
          <button
            className="app-header__toggle"
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? "☰" : "✕"}
          </button>

          <div className="app-header__breadcrumb">
            {/* Breadcrumbs will go here */}
          </div>

          {/* Organization Selector - Admin only */}
          {roles.includes("Admin") && <OrganizationSelector />}

          <div className="app-header__user">
            <div className="app-header__user-info">
              <span className="app-header__user-name">
                {user && "email" in user ? String(user.email) : "User"}
              </span>
              <span className="app-header__user-role">{roles.join(", ")}</span>
            </div>
            <div className="app-header__avatar">{userInitials}</div>
          </div>
        </header>

        <div className="app-content">{children}</div>
      </main>
    </div>
  );
};

export { Layout };
