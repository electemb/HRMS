import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchProjects, deleteProject } from "../slices/projectsSlice";
import { PageHeader, Button, Table } from "../components/ui";
import type { Column } from "../components/ui";
import type { Project } from "../types";
import "./ProjectList.css";

const ProjectList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: projects,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.projects as {
        items: Project[];
        loading: boolean;
        error?: string | null;
      }
  );

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      dispatch(deleteProject(id));
    }
  };

  const columns: Column<Project>[] = [
    {
      key: "name",
      header: "Project Name",
      render: (proj) => <span className="project-name">{proj.name}</span>,
    },
    {
      key: "code",
      header: "Code",
      render: (proj) => <span className="text-muted">{proj.code}</span>,
    },
    {
      key: "client",
      header: "Client",
      render: (proj) => <span>{proj.client || "-"}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (proj) => (
        <div className="project-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(proj.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Projects"
        description="Manage projects and deliverables"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "Project Management", path: "#" },
          { label: "Projects" },
        ]}
        actions={
          <Button variant="primary" size="md">
            + Add Project
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
        data={projects}
        loading={loading}
        emptyMessage="No projects found. Add your first project to get started."
        keyExtractor={(proj) => proj.id}
        searchable={true}
        searchPlaceholder="Search projects by name, code, or client..."
        paginated={true}
        pageSize={10}
      />
    </div>
  );
};

export default ProjectList;
