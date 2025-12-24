import React, { useState, useEffect } from "react";
import { organizationService, type Organization } from "../../services";
import "./OrganizationSelector.css";

interface OrganizationSelectorProps {
  className?: string;
}

export const OrganizationSelector: React.FC<OrganizationSelectorProps> = ({
  className = "",
}) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("OrganizationSelector: Loading organizations...");
        const orgs = await organizationService.getAll();
        console.log("OrganizationSelector: Loaded", orgs.length, "organizations", orgs);
        setOrganizations(orgs);
        
        // Load selected org from localStorage
        const stored = localStorage.getItem("currentOrgId");
        console.log("OrganizationSelector: Stored org ID:", stored);
        
        if (stored && orgs.some(o => o.id === stored)) {
          setCurrentOrgId(stored);
        } else if (orgs.length > 0) {
          // Auto-select first org if none selected or stored org not found
          console.log("OrganizationSelector: Auto-selecting first org:", orgs[0].id);
          setCurrentOrgId(orgs[0].id);
          localStorage.setItem("currentOrgId", orgs[0].id);
        }
      } catch (error) {
        console.error("OrganizationSelector: Failed to load organizations:", error);
        setError("Failed to load organizations");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleOrgChange = (orgId: string) => {
    console.log("OrganizationSelector: Changing to org:", orgId);
    setCurrentOrgId(orgId);
    localStorage.setItem("currentOrgId", orgId);
    // Reload to apply org filter
    window.location.reload();
  };

  if (loading) {
    return (
      <div className={`org-selector ${className}`}>
        <span className="org-label">Loading orgs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`org-selector ${className}`}>
        <span className="org-label error">
          {error}
        </span>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className={`org-selector ${className}`}>
        <span className="org-label">No organizations available</span>
      </div>
    );
  }

  const selectedOrg = organizations.find((o) => o.id === currentOrgId);

  return (
    <div className={`org-selector ${className}`}>
      <label htmlFor="org-select" className="org-label">
        Organization:
      </label>
      <select
        id="org-select"
        className="org-select"
        value={currentOrgId || ""}
        onChange={(e) => handleOrgChange(e.target.value)}
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name} ({org.code})
          </option>
        ))}
      </select>
      {selectedOrg && (
        <span className="org-badge" title={selectedOrg.name}>
          {selectedOrg.code}
        </span>
      )}
    </div>
  );
};
