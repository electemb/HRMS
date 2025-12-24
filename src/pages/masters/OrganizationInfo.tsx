import React, { useState } from "react";
import { PageHeader, Card, Input, Button } from "../../components/ui";
import "./OrganizationInfo.css";

interface OrganizationData {
  name: string;
  legalName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  founded: string;
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  description: string;
}

const OrganizationInfo: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OrganizationData>({
    name: "Enterprise Solutions Inc.",
    legalName: "Enterprise Solutions Private Limited",
    registrationNumber: "U72900MH2015PTC265456",
    taxId: "27AABCE1234F1Z5",
    industry: "Information Technology",
    founded: "2015-01-15",
    email: "contact@enterprise.com",
    phone: "+91-22-12345678",
    website: "https://www.enterprise.com",
    addressLine1: "Tower A, Tech Park",
    addressLine2: "MIDC, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postalCode: "400093",
    description:
      "Leading provider of enterprise software solutions, specializing in HRM, CRM, and project management systems.",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving organization info:", formData);
    setIsEditing(false);
    // Here you would make an API call to save the data
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally reload the original data
  };

  return (
    <div className="page-container">
      <PageHeader
        title="Organization Information"
        description="Manage your organization's profile and legal information"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Masters", path: "/masters" },
          { label: "Organization Info" },
        ]}
        actions={
          !isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit Information
            </Button>
          ) : (
            <div className="action-buttons">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )
        }
      />

      <div className="organization-form">
        {/* Basic Information */}
        <Card>
          <div className="section-header">
            <h3 className="section-title">Basic Information</h3>
          </div>
          <div className="form-grid">
            <Input
              label="Organization Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <Input
              label="Legal Name"
              name="legalName"
              value={formData.legalName}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <Input
              label="Registration Number"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Tax ID / GSTIN"
              name="taxId"
              value={formData.taxId}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <Input
              label="Founded Date"
              type="date"
              name="founded"
              value={formData.founded}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </Card>

        {/* Contact Information */}
        <Card>
          <div className="section-header">
            <h3 className="section-title">Contact Information</h3>
          </div>
          <div className="form-grid">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <Input
              label="Website"
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              disabled={!isEditing}
              className="full-width"
            />
          </div>
        </Card>

        {/* Address Information */}
        <Card>
          <div className="section-header">
            <h3 className="section-title">Address Information</h3>
          </div>
          <div className="form-grid">
            <Input
              label="Address Line 1"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className="full-width"
            />
            <Input
              label="Address Line 2"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              disabled={!isEditing}
              className="full-width"
            />
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <Input
              label="State/Province"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
            <Input
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              disabled={!isEditing}
              required
            />
          </div>
        </Card>

        {/* Description */}
        <Card>
          <div className="section-header">
            <h3 className="section-title">Description</h3>
          </div>
          <div className="form-field">
            <label className="form-label">About Organization</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              className="form-textarea"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationInfo;
