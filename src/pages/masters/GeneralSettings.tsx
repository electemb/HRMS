import React, { useState } from "react";
import { PageHeader, Card, Button, Badge } from "../../components/ui";
import "./GeneralSettings.css";

interface Shift {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  duration: number; // in hours
  isActive: boolean;
}

interface GeneralSettingsData {
  // Date & Time Settings
  dateFormat: string;
  timeFormat: "12" | "24";
  timezone: string;
  weekStartDay: string;

  // Currency Settings
  baseCurrency: string;
  currencyPosition: "before" | "after";
  thousandsSeparator: string;
  decimalSeparator: string;
  decimalPlaces: number;

  // Number Settings
  numberFormat: string;

  // Localization
  language: string;
  locale: string;

  // Business Settings
  financialYearStart: string;
  fiscalYearEnd: string;
  workingDaysPerWeek: number;
  workingHoursPerDay: number;
  shifts: Shift[];
}

const GeneralSettings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<GeneralSettingsData>({
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12",
    timezone: "Asia/Kolkata",
    weekStartDay: "Monday",

    baseCurrency: "INR",
    currencyPosition: "before",
    thousandsSeparator: ",",
    decimalSeparator: ".",
    decimalPlaces: 2,

    numberFormat: "en-IN",

    language: "English",
    locale: "en-IN",

    financialYearStart: "04-01",
    fiscalYearEnd: "03-31",
    workingDaysPerWeek: 5,
    workingHoursPerDay: 8,
    shifts: [
      {
        id: "1",
        name: "General Shift",
        code: "GEN",
        startTime: "09:00",
        endTime: "18:00",
        duration: 9,
        isActive: true,
      },
      {
        id: "2",
        name: "Morning Shift",
        code: "MOR",
        startTime: "06:00",
        endTime: "14:00",
        duration: 8,
        isActive: true,
      },
      {
        id: "3",
        name: "Evening Shift",
        code: "EVE",
        startTime: "14:00",
        endTime: "22:00",
        duration: 8,
        isActive: true,
      },
      {
        id: "4",
        name: "Night Shift",
        code: "NGT",
        startTime: "22:00",
        endTime: "06:00",
        duration: 8,
        isActive: true,
      },
    ],
  });

  const dateFormats = [
    "DD/MM/YYYY",
    "MM/DD/YYYY",
    "YYYY-MM-DD",
    "DD-MM-YYYY",
    "MM-DD-YYYY",
  ];

  const timezones = [
    "Asia/Kolkata",
    "America/New_York",
    "Europe/London",
    "Australia/Sydney",
    "Asia/Tokyo",
    "America/Los_Angeles",
  ];

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currencies = ["INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD"];

  const languages = ["English", "Hindi", "Spanish", "French", "German"];

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving general settings:", formData);
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
        title="General Settings"
        description="Configure system-wide preferences and defaults"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Masters", path: "/masters" },
          { label: "General Settings" },
        ]}
        actions={
          !isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Edit Settings
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

      <div className="settings-container">
        {/* Date & Time Settings */}
        <Card>
          <div className="section-header">
            <h3 className="section-title">📅 Date & Time Settings</h3>
          </div>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="setting-label">Date Format</label>
              <select
                name="dateFormat"
                value={formData.dateFormat}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Date Format"
              >
                {dateFormats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
              <span className="setting-example">
                Example: {new Date().toLocaleDateString("en-IN")}
              </span>
            </div>

            <div className="setting-item">
              <label className="setting-label">Time Format</label>
              <select
                name="timeFormat"
                value={formData.timeFormat}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Time Format"
              >
                <option value="12">12 Hour (AM/PM)</option>
                <option value="24">24 Hour</option>
              </select>
              <span className="setting-example">
                Example: {formData.timeFormat === "12" ? "02:30 PM" : "14:30"}
              </span>
            </div>

            <div className="setting-item">
              <label className="setting-label">Timezone</label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Timezone"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-item">
              <label className="setting-label">Week Start Day</label>
              <select
                name="weekStartDay"
                value={formData.weekStartDay}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Week Start Day"
              >
                {weekDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Currency Settings */}
        <Card>
          <div className="section-header">
            <h3 className="section-title">💱 Currency Settings</h3>
          </div>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="setting-label">Base Currency</label>
              <select
                name="baseCurrency"
                value={formData.baseCurrency}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Base Currency"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
              <span className="setting-badge">
                <Badge variant="primary" size="sm">
                  System Default
                </Badge>
              </span>
            </div>

            <div className="setting-item">
              <label className="setting-label">Currency Position</label>
              <select
                name="currencyPosition"
                value={formData.currencyPosition}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Currency Position"
              >
                <option value="before">Before Amount (₹1,000)</option>
                <option value="after">After Amount (1,000₹)</option>
              </select>
            </div>

            <div className="setting-item">
              <label className="setting-label">Thousands Separator</label>
              <select
                name="thousandsSeparator"
                value={formData.thousandsSeparator}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Thousands Separator"
              >
                <option value=",">, (Comma)</option>
                <option value=".">. (Period)</option>
                <option value=" ">(Space)</option>
                <option value="">None</option>
              </select>
              <span className="setting-example">Example: 1,000,000</span>
            </div>

            <div className="setting-item">
              <label className="setting-label">Decimal Separator</label>
              <select
                name="decimalSeparator"
                value={formData.decimalSeparator}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Decimal Separator"
              >
                <option value=".">. (Period)</option>
                <option value=",">, (Comma)</option>
              </select>
              <span className="setting-example">Example: 1000.50</span>
            </div>

            <div className="setting-item">
              <label className="setting-label">Decimal Places</label>
              <select
                name="decimalPlaces"
                value={formData.decimalPlaces}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Decimal Places"
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Localization Settings */}
        <Card>
          <div className="section-header">
            <h3 className="section-title">🌍 Localization</h3>
          </div>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="setting-label">Language</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Language"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="setting-item">
              <label className="setting-label">Locale</label>
              <select
                name="locale"
                value={formData.locale}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Locale"
              >
                <option value="en-IN">English (India)</option>
                <option value="en-US">English (United States)</option>
                <option value="en-GB">English (United Kingdom)</option>
                <option value="es-ES">Spanish (Spain)</option>
                <option value="fr-FR">French (France)</option>
              </select>
            </div>

            <div className="setting-item">
              <label className="setting-label">Number Format</label>
              <select
                name="numberFormat"
                value={formData.numberFormat}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Number Format"
              >
                <option value="en-IN">Indian (12,34,567.89)</option>
                <option value="en-US">US (1,234,567.89)</option>
                <option value="en-GB">UK (1,234,567.89)</option>
                <option value="de-DE">German (1.234.567,89)</option>
                <option value="fr-FR">French (1 234 567,89)</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Business Settings */}
        <Card>
          <div className="section-header">
            <h3 className="section-title">🏢 Business Settings</h3>
          </div>
          <div className="settings-grid">
            <div className="setting-item">
              <label className="setting-label">Financial Year Start</label>
              <input
                type="text"
                name="financialYearStart"
                value={formData.financialYearStart}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-input"
                placeholder="MM-DD"
              />
              <span className="setting-example">
                Format: MM-DD (e.g., 04-01 for April 1st)
              </span>
            </div>

            <div className="setting-item">
              <label className="setting-label">Fiscal Year End</label>
              <input
                type="text"
                name="fiscalYearEnd"
                value={formData.fiscalYearEnd}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-input"
                placeholder="MM-DD"
              />
              <span className="setting-example">
                Format: MM-DD (e.g., 03-31 for March 31st)
              </span>
            </div>

            <div className="setting-item">
              <label className="setting-label">Working Days Per Week</label>
              <select
                name="workingDaysPerWeek"
                value={formData.workingDaysPerWeek}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Working Days Per Week"
              >
                <option value={5}>5 Days</option>
                <option value={5.5}>5.5 Days</option>
                <option value={6}>6 Days</option>
                <option value={7}>7 Days</option>
              </select>
            </div>

            <div className="setting-item">
              <label className="setting-label">Working Hours Per Day</label>
              <select
                name="workingHoursPerDay"
                value={formData.workingHoursPerDay}
                onChange={handleChange}
                disabled={!isEditing}
                className="setting-select"
                title="Select Working Hours Per Day"
              >
                <option value={6}>6 Hours</option>
                <option value={7}>7 Hours</option>
                <option value={8}>8 Hours</option>
                <option value={9}>9 Hours</option>
                <option value={10}>10 Hours</option>
              </select>
            </div>
          </div>

          {/* Shift Management */}
          <div className="section-divider"></div>
          <div className="section-header">
            <h4 className="section-subtitle">⏰ Shift Configuration</h4>
            <p className="section-description">
              Configure work shifts for attendance and scheduling
            </p>
          </div>
          <div className="shifts-table">
            <table className="shift-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Shift Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Duration</th>
                  <th>Status</th>
                  {isEditing && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {formData.shifts.map((shift) => (
                  <tr key={shift.id}>
                    <td>
                      <span className="shift-code">{shift.code}</span>
                    </td>
                    <td>
                      <span className="shift-name">{shift.name}</span>
                    </td>
                    <td>
                      <span className="shift-time">{shift.startTime}</span>
                    </td>
                    <td>
                      <span className="shift-time">{shift.endTime}</span>
                    </td>
                    <td>
                      <span className="shift-duration">{shift.duration}h</span>
                    </td>
                    <td>
                      <Badge
                        variant={shift.isActive ? "success" : "default"}
                        size="sm"
                      >
                        {shift.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    {isEditing && (
                      <td>
                        <div className="shift-actions">
                          <button
                            className="action-btn edit"
                            title="Edit Shift"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn toggle"
                            title={
                              shift.isActive
                                ? "Deactivate Shift"
                                : "Activate Shift"
                            }
                          >
                            {shift.isActive ? "🚫" : "✅"}
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {isEditing && (
              <div className="shift-add-section">
                <Button variant="outline" size="sm">
                  + Add New Shift
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GeneralSettings;
