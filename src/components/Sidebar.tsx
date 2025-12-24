import React from "react";
import "./Sidebar.css";
import { useAuth } from "../auth/AuthContext";
import { NavLink } from "react-router-dom";

const links = [
  {
    path: "/employees",
    label: "Employees",
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
    roles: ["Admin", "HR Manager", "HR Executive"],
  },
  {
    path: "/designations",
    label: "Designations",
    roles: ["Admin", "HR Manager", "HR Executive"],
  },
  {
    path: "/projects",
    label: "Projects",
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
    path: "/clients",
    label: "Clients",
    roles: ["Admin", "Finance Manager", "Finance Executive", "Manager"],
  },
  {
    path: "/invoices",
    label: "Invoices",
    roles: ["Admin", "Finance Manager", "Finance Executive"],
  },
  {
    path: "/leave-types",
    label: "Leave Types",
    roles: ["Admin", "HR Manager", "HR Executive"],
  },
  {
    path: "/leave-balances",
    label: "Leave Balances",
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
    path: "/requirements",
    label: "Requirements",
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
];

const Sidebar: React.FC = () => {
  const { isAuthenticated, roles } = useAuth();
  if (!isAuthenticated) return null;
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {links
            .filter((link) => link.roles.some((r) => roles.includes(r)))
            .map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
