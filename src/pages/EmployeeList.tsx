import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  fetchEmployees,
  deleteEmployee,
  addEmployee,
  updateEmployee,
} from "../slices/employeesSlice";
import { PageHeader, Button, Table, Badge, Drawer } from "../components/ui";
import type { Column } from "../components/ui";
import { EmployeeForm } from "../components/forms/EmployeeForm";
import type { EmployeeFormData } from "../components/forms/EmployeeForm";
import type { Employee } from "../types";
import { employeeSalaryService, leaveBalanceService } from "../services";
import "./EmployeeList.css";

const EmployeeList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: employees,
    loading,
    error,
  } = useSelector((state: RootState) => state.employees);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      dispatch(deleteEmployee(id));
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setDrawerOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingEmployee(null);
  };

  const handleSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      // Clean the data - convert empty strings to undefined for optional GUID fields
      const cleanedData = {
        ...data,
        departmentId: data.departmentId || undefined,
        designationId: data.designationId || undefined,
        salaryTemplateId: data.salaryTemplateId || undefined,
      };

      let employeeId: string;

      if (editingEmployee?.id) {
        await dispatch(
          updateEmployee({ id: editingEmployee.id, data: cleanedData })
        ).unwrap();
        employeeId = editingEmployee.id;
      } else {
        const result = await dispatch(addEmployee(cleanedData)).unwrap();
        employeeId = result.id;
      }

      // If salary template and structure are configured, save salary configuration
      if (cleanedData.salaryTemplateId && data.salaryStructure) {
        try {
          await employeeSalaryService.create({
            employeeId,
            salaryTemplateId: cleanedData.salaryTemplateId,
            annualCTC: data.salaryStructure.ctc,
            effectiveFrom: data.dateOfJoining || new Date().toISOString(),
            isActive: true,
            componentOverrides: JSON.stringify(data.salaryStructure.components),
            remarks: "Initial salary configuration",
          });
        } catch (salaryError) {
          console.error("Failed to save salary configuration:", salaryError);
          alert(
            "Employee created but salary configuration failed. Please configure salary separately."
          );
        }
      }

      // Auto-assign leave balances for new employees
      if (!editingEmployee?.id) {
        try {
          await leaveBalanceService.assignToEmployee(employeeId);
          console.log("Leave balances assigned successfully");
        } catch (leaveError) {
          console.error("Failed to assign leave balances:", leaveError);
          // Don't alert - this is not critical, can be done manually later
        }
      }

      handleCloseDrawer();
      dispatch(fetchEmployees());
    } catch (err) {
      console.error("Failed to save employee:", err);
      alert("Failed to save employee. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: Column<Employee>[] = [
    {
      key: "name",
      header: "Name",
      render: (emp) => (
        <div className="employee-name">
          <div className="employee-avatar">
            {emp.firstName?.[0]}
            {emp.lastName?.[0]}
          </div>
          <span className="employee-name-text">
            {emp.firstName} {emp.lastName}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "department",
      header: "Department",
      render: (emp) =>
        emp.department || <span className="text-muted">Not assigned</span>,
    },
    {
      key: "designation",
      header: "Designation",
      render: (emp) =>
        emp.designation || <span className="text-muted">Not assigned</span>,
    },
    {
      key: "status",
      header: "Status",
      align: "center" as const,
      render: (emp) => (
        <Badge 
          variant={emp.employeeStatus === "Active" ? "success" : "default"} 
          size="sm"
        >
          {emp.employeeStatus || "Active"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right" as const,
      sortable: false,
      searchable: false,
      render: (emp) => (
        <div className="employee-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditEmployee(emp);
            }}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(emp.id);
            }}
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
          title="Employees"
          description="Manage your team members and their information"
          breadcrumbs={[
            { label: "Dashboard", path: "/dashboard" },
            { label: "Employees" },
          ]}
          actions={
            <>
              <Button variant="outline" size="md">
                Export
              </Button>
              <Button variant="primary" size="md" onClick={handleAddEmployee}>
                + Add Employee
              </Button>
            </>
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
          data={employees}
          loading={loading}
          emptyMessage="No employees found. Add your first employee to get started."
          keyExtractor={(emp) => emp.id}
          searchable={true}
          searchPlaceholder="Search employees by name, email, department..."
          paginated={true}
          pageSize={10}
        />
      </div>

      <Drawer
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
        title={editingEmployee ? "Edit Employee" : "Add New Employee"}
        size="md"
      >
        <EmployeeForm
          initialData={editingEmployee || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseDrawer}
          isSubmitting={isSubmitting}
        />
      </Drawer>
    </>
  );
};

export default EmployeeList;
