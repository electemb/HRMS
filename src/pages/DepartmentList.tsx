import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { 
  fetchDepartments, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from "../slices/departmentsSlice";
import { PageHeader, Button, Table, Drawer } from "../components/ui";
import type { Column } from "../components/ui";
import DepartmentForm from "../components/forms/DepartmentForm";
import type { DepartmentFormValues } from "../components/forms/DepartmentForm";
import type { Department } from "../types";
import "./DepartmentList.css";

const DepartmentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: departments,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.departments as {
        items: Department[];
        loading: boolean;
        error?: string | null;
      }
  );
  const [showModal, setShowModal] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      dispatch(deleteDepartment(id));
    }
  };

  const handleCreate = () => {
    setEditDepartment(null);
    setShowModal(true);
  };

  const handleEdit = (dep: Department) => {
    setEditDepartment(dep);
    setShowModal(true);
  };

  const handleFormSubmit = async (values: DepartmentFormValues) => {
    setIsSubmitting(true);
    try {
      if (editDepartment) {
        await dispatch(updateDepartment({ id: editDepartment.id, ...values })).unwrap();
      } else {
        await dispatch(createDepartment(values)).unwrap();
      }
      setShowModal(false);
      setEditDepartment(null);
      dispatch(fetchDepartments());
    } catch (error) {
      console.error("Failed to save department:", error);
      // Error will be shown via the error banner from Redux state
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Department>[] = [
    {
      key: "name",
      header: "Department Name",
      render: (dept) => <span className="department-name">{dept.name}</span>,
    },
    {
      key: "code",
      header: "Code",
      render: (dept) => <span className="text-muted">{dept.code}</span>,
    },
    {
      key: "parentDepartment",
      header: "Parent Department",
      render: (dept) => <span>{dept.parentDepartment || "-"}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (dept) => (
        <div className="department-actions">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}>
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(dept.id)}
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
          title="Departments"
          description="Manage organizational departments and hierarchy"
          breadcrumbs={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Human Resources", path: "#" },
            { label: "Departments" },
          ]}
          actions={
            <Button variant="primary" size="md" onClick={handleCreate}>
              + Add Department
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
          data={departments}
          loading={loading}
          emptyMessage="No departments found. Add your first department to get started."
          keyExtractor={(dept) => dept.id}
          searchable={true}
          searchPlaceholder="Search departments by name or code..."
          paginated={true}
          pageSize={10}
        />
      </div>

      <Drawer
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditDepartment(null);
        }}
        title={editDepartment ? "Edit Department" : "Add New Department"}
        size="sm"
      >
        <DepartmentForm
          initialValues={editDepartment || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowModal(false);
            setEditDepartment(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Drawer>
    </>
  );
};

export default DepartmentList;
