import React, { useEffect, useState } from "react";
import { financialYearService } from "../services";
import type { FinancialYear } from "../types";
import { PageHeader, Card, CardBody, Table, type Column, Button, Drawer } from "../components/ui";
import FinancialYearForm from "../components/forms/FinancialYearForm";

const FinancialYears: React.FC = () => {
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<FinancialYear | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await financialYearService.getAll();
        setYears(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="page-container">
      <PageHeader
        title="Financial Years"
        description="Manage financial year periods and current flag"
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null);
              setDrawerOpen(true);
            }}
          >
            Add Financial Year
          </Button>
        }
      />
      <Card>
        <CardBody>
          <Table<FinancialYear>
            columns={[
              { key: "code", header: "Code", sortable: true },
              { key: "startDate", header: "Start", render: (fy) => new Date(fy.startDate).toLocaleDateString() },
              { key: "endDate", header: "End", render: (fy) => new Date(fy.endDate).toLocaleDateString() },
              { key: "isCurrent", header: "Current", render: (fy) => (fy.isCurrent ? "Yes" : "No") },
            ] as Column<FinancialYear>[]}
            data={years}
            loading={loading}
            emptyMessage="No financial years found"
            keyExtractor={(fy) => fy.id}
            searchable
            paginated
            pageSize={10}
            onRowClick={(row) => { setEditing(row); setDrawerOpen(true); }}
          />
        </CardBody>
      </Card>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing ? "Edit Financial Year" : "Add Financial Year"}
      >
        <FinancialYearForm
          initialValues={editing ? { ...editing, isClosed: editing.isClosed } : undefined}
          onCancel={() => setDrawerOpen(false)}
          onSubmit={async (payload) => {
            if (editing) {
              await financialYearService.update(editing.id, payload as import("../types").UpdateFinancialYearDto);
            } else {
              await financialYearService.create(payload as import("../types").CreateFinancialYearDto);
            }
            setDrawerOpen(false);
            const data = await financialYearService.getAll();
            setYears(data);
          }}
        />
      </Drawer>
    </div>
  );
};

export default FinancialYears;
