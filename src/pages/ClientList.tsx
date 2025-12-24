import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { fetchClients, deleteClient } from "../slices/clientsSlice";
import { PageHeader, Button, Table } from "../components/ui";
import type { Column } from "../components/ui";
import type { Client } from "../types";
import "./ClientList.css";

const ClientList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: clients,
    loading,
    error,
  } = useSelector(
    (state: RootState) =>
      state.clients as {
        items: Client[];
        loading: boolean;
        error?: string | null;
      }
  );

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      dispatch(deleteClient(id));
    }
  };

  const columns: Column<Client>[] = [
    {
      key: "name",
      header: "Client Name",
      render: (client) => <span className="client-name">{client.name}</span>,
    },
    {
      key: "code",
      header: "Code",
      render: (client) => <span className="text-muted">{client.code}</span>,
    },
    {
      key: "email",
      header: "Email",
      render: (client) => <span>{client.email}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      render: (client) => (
        <div className="client-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(client.id)}
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
        title="Clients"
        description="Manage client relationships and accounts"
        breadcrumbs={[
          { label: "Dashboard", path: "/dashboard" },
          { label: "CRM", path: "#" },
          { label: "Clients" },
        ]}
        actions={
          <Button variant="primary" size="md">
            + Add Client
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
        data={clients}
        loading={loading}
        emptyMessage="No clients found. Add your first client to get started."
        keyExtractor={(client) => client.id}
        searchable={true}
        searchPlaceholder="Search clients by name, code, or email..."
        paginated={true}
        pageSize={10}
      />
    </div>
  );
};

export default ClientList;
