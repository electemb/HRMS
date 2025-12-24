import React from "react";
import { useAuth } from "../../auth/AuthContext";
import { OrganizationSelector } from "../ui";

export const DebugOrgSelector: React.FC = () => {
  const { user, roles } = useAuth();

  return (
    <div style={{ padding: "2rem", background: "#f5f5f5", margin: "2rem" }}>
      <h2>Organization Selector Debug</h2>
      
      <div style={{ marginBottom: "1rem" }}>
        <strong>User:</strong> {user ? JSON.stringify(user) : "Not logged in"}
      </div>
      
      <div style={{ marginBottom: "1rem" }}>
        <strong>Roles:</strong> {roles.join(", ") || "None"}
      </div>
      
      <div style={{ marginBottom: "1rem" }}>
        <strong>Is Admin:</strong> {roles.includes("Admin") ? "✓ YES" : "✗ NO"}
      </div>
      
      <div style={{ marginBottom: "1rem" }}>
        <strong>localStorage.currentOrgId:</strong> {localStorage.getItem("currentOrgId") || "Not set"}
      </div>
      
      <hr style={{ margin: "1rem 0" }} />
      
      <div>
        <strong>OrganizationSelector Component:</strong>
        <div style={{ marginTop: "1rem", padding: "1rem", background: "white", border: "1px solid #ddd" }}>
          <OrganizationSelector />
        </div>
      </div>
      
      <hr style={{ margin: "1rem 0" }} />
      
      <div>
        <strong>Conditional Render Test:</strong>
        <div style={{ marginTop: "1rem", padding: "1rem", background: "white", border: "1px solid #ddd" }}>
          {roles.includes("Admin") ? (
            <>
              <p style={{ color: "green" }}>✓ Admin check passed - OrganizationSelector should render:</p>
              <OrganizationSelector />
            </>
          ) : (
            <p style={{ color: "red" }}>✗ Admin check failed - User is not Admin</p>
          )}
        </div>
      </div>
    </div>
  );
};
