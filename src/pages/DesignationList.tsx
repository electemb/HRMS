import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { 
  fetchDesignations, 
  createDesignation, 
  updateDesignation, 
  deleteDesignation 
} from "../slices/designationsSlice";
import { PageHeader, Button, Table, Drawer } from "../components/ui";
import type { Column } from "../components/ui";
import DesignationForm from "../components/forms/DesignationForm";
import type { DesignationFormValues } from "../components/forms/DesignationForm";
import type { Designation } from "../types";
import "./DesignationList.css";

const DesignationList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: designations,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.designations as {
        items: Designation[];
        loading: boolean;
        error?: string | null;
      }
  );

  const [showModal, setShowModal] = useState(false);
  const [editDesignation, setEditDesignation] = useState<Designation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDesignations());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      dispatch(deleteDesignation(id));
    }
  };

  const handleCreate = () => {
    setEditDesignation(null);
    setShowModal(true);
  };

  const handleEdit = (des: Designation) => {
    setEditDesignation(des);
    setShowModal(true);
  };

  const handleFormSubmit = async (values: DesignationFormValues) => {
    setIsSubmitting(true);
    try {
      if (editDesignation) {
        await dispatch(updateDesignation({ id: editDesignation.id, ...values })).unwrap();
      } else {
        await dispatch(createDesignation(values)).unwrap();
      }
      setShowModal(false);
      setEditDesignation(null);
      dispatch(fetchDesignations());
    } catch (error) {
      console.error("Failed to save designation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const columns: Column<Designation>[] = [
    {
      key: "title",
      header: "Designation",
      render: (des) => (
        <div>
          <div className="designation-title">{des.title}</div>
          <div className="designation-code text-muted">{des.code}</div>
        </div>
      ),
    },
    {
      key: "departmentName",
      header: "Department",
      render: (des) => (
        <div>
          <div>{des.departmentName || "-"}</div>
          {des.departmentCode && (
            <div className="text-muted text-sm">{des.departmentCode}</div>
          )}
        </div>
      ),
    },
    {
      key: "level",
      header: "Level",
      render: (des) => <span className="designation-level">{des.level}</span>,
    },
    {
      key: "minSalary",
      header: "Salary Range",
      render: (des) => (
        <div className="salary-range">
          <span className="text-sm">
            {formatCurrency(des.minSalary)} - {formatCurrency(des.maxSalary)}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (des) => (
        <div className="designation-actions">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(des)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(des.id)}
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
          title="Designations"
          description="Manage job titles, positions, and career levels"
          breadcrumbs={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Human Resources", path: "#" },
            { label: "Designations" },
          ]}
          actions={
            <Button variant="primary" size="md" onClick={handleCreate}>
              + Add Designation
            </Button>
          }
        />

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <Table
          columns={columns}
          data={designations}
          loading={loading}
          emptyMessage="No designations found. Add your first designation to get started."
          keyExtractor={(des) => des.id}
          searchable={true}
          searchPlaceholder="Search designations by title, code, or department..."
          paginated={true}
          pageSize={10}
        />
      </div>

      <Drawer
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditDesignation(null);
        }}
        title={editDesignation ? "Edit Designation" : "Add New Designation"}
        size="md"
      >
        <DesignationForm
          initialValues={editDesignation || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditDesignation(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Drawer>
    </>
  );
};

export default DesignationList;
