import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchLeaveTypes,
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  activateLeaveType,
  deactivateLeaveType,
} from "../slices/leaveTypesSlice";
import { PageHeader, Button, Table, Drawer } from "../components/ui";
import type { Column } from "../components/ui";
import LeaveTypeForm from "../components/forms/LeaveTypeForm";
import type { LeaveTypeFormValues } from "../components/forms/LeaveTypeForm";
import type { LeaveType } from "../types/leave";
import "./LeaveTypeList.css";

const LeaveTypeList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: leaveTypes,
    loading,
    error,
  } = useSelector((state: RootState) => state.leaveTypes);

  const [showModal, setShowModal] = useState(false);
  const [editLeaveType, setEditLeaveType] = useState<LeaveType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  useEffect(() => {
    dispatch(fetchLeaveTypes(showActiveOnly));
  }, [dispatch, showActiveOnly]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      dispatch(deleteLeaveType(id));
    }
  };

  const handleToggleActive = async (leaveType: LeaveType) => {
    try {
      if (leaveType.isActive) {
        await dispatch(deactivateLeaveType(leaveType.id)).unwrap();
      } else {
        await dispatch(activateLeaveType(leaveType.id)).unwrap();
      }
      dispatch(fetchLeaveTypes(showActiveOnly));
    } catch (error) {
      console.error("Failed to toggle leave type status:", error);
    }
  };

  const handleCreate = () => {
    setEditLeaveType(null);
    setShowModal(true);
  };

  const handleEdit = (leaveType: LeaveType) => {
    setEditLeaveType(leaveType);
    setShowModal(true);
  };

  const handleFormSubmit = async (values: LeaveTypeFormValues) => {
    setIsSubmitting(true);
    try {
      if (editLeaveType) {
        await dispatch(
          updateLeaveType({ id: editLeaveType.id, ...values })
        ).unwrap();
      } else {
        await dispatch(createLeaveType(values)).unwrap();
      }
      setShowModal(false);
      setEditLeaveType(null);
      dispatch(fetchLeaveTypes(showActiveOnly));
    } catch (error) {
      console.error("Failed to save leave type:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<LeaveType>[] = [
    {
      key: "name",
      header: "Leave Type",
      render: (lt) => (
        <div className="leave-type-info">
          <span className="leave-type-name">{lt.name}</span>
          <span className="leave-type-code">{lt.code}</span>
        </div>
      ),
    },
    {
      key: "maxDaysPerYear",
      header: "Max Days/Year",
      render: (lt) => (
        <span className="leave-days">{lt.maxDaysPerYear} days</span>
      ),
    },
    {
      key: "isPaidLeave",
      header: "Type",
      render: (lt) => (
        <span className={`badge ${lt.isPaidLeave ? "badge-success" : "badge-warning"}`}>
          {lt.isPaidLeave ? "Paid" : "Unpaid"}
        </span>
      ),
    },
    {
      key: "isCarryForwardAllowed",
      header: "Carry Forward",
      render: (lt) => (
        <span>
          {lt.isCarryForwardAllowed
            ? `${lt.maxCarryForwardDays} days`
            : "No"}
        </span>
      ),
    },
    {
      key: "accruesMonthly",
      header: "Accrual",
      render: (lt) => (
        <span>
          {lt.accruesMonthly
            ? `${lt.monthlyAccrualRate} days/month`
            : "Annual"}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (lt) => (
        <span className={`badge ${lt.isActive ? "badge-success" : "badge-secondary"}`}>
          {lt.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (lt) => (
        <div className="leave-type-actions">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(lt)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleActive(lt)}
          >
            {lt.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(lt.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-container">
        <PageHeader
          title="Leave Types"
          description="Manage leave type master data and policies"
          breadcrumbs={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Leave Management", path: "#" },
            { label: "Leave Types" },
          ]}
          actions={
            <div className="header-actions">
              <Button
                variant={showActiveOnly ? "primary" : "outline"}
                size="sm"
                onClick={() => setShowActiveOnly(!showActiveOnly)}
              >
                {showActiveOnly ? "Show All" : "Active Only"}
              </Button>
              <Button variant="primary" size="md" onClick={handleCreate}>
                + Add Leave Type
              </Button>
            </div>
          }
        />

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="leave-types-summary">
          <div className="summary-card">
            <h4>Total Leave Types</h4>
            <span className="summary-value">{leaveTypes.length}</span>
          </div>
          <div className="summary-card">
            <h4>Paid Leave Types</h4>
            <span className="summary-value">
              {leaveTypes.filter((lt) => lt.isPaidLeave).length}
            </span>
          </div>
          <div className="summary-card">
            <h4>Active Types</h4>
            <span className="summary-value">
              {leaveTypes.filter((lt) => lt.isActive).length}
            </span>
          </div>
        </div>

        <Table
          columns={columns}
          data={leaveTypes}
          loading={loading}
          emptyMessage="No leave types found. Add your first leave type to get started."
          keyExtractor={(lt) => lt.id}
          searchable={true}
          searchPlaceholder="Search leave types by name, code, or description..."
          paginated={true}
          pageSize={15}
        />
      </div>

      <Drawer
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditLeaveType(null);
        }}
        title={editLeaveType ? "Edit Leave Type" : "Add New Leave Type"}
        size="lg"
      >
        <LeaveTypeForm
          initialValues={editLeaveType || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditLeaveType(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Drawer>
    </>
  );
};

export default LeaveTypeList;
