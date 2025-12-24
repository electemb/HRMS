import React, { useEffect, useState } from "react";
import { gradeService } from "../services";
import type { Grade } from "../types";
import { PageHeader, Card, CardBody, Table, type Column, Badge, Button, Drawer } from "../components/ui";
import GradeForm from "../components/forms/GradeForm";

const Grades: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Grade | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = await gradeService.getAll();
        setGrades(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="page-container">
      <PageHeader
        title="Grades"
        description="Manage employee grades and levels"
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null);
              setDrawerOpen(true);
            }}
          >
            Add Grade
          </Button>
        }
      />
      <Card>
        <CardBody>
          <Table<Grade>
            columns={[
              { key: "code", header: "Code", sortable: true },
              { key: "name", header: "Name", sortable: true },
              { key: "level", header: "Level", sortable: true },
              {
                key: "isActive",
                header: "Active",
                render: (g) => (
                  <Badge variant={g.isActive ? "success" : "default"}>
                    {g.isActive ? "Active" : "Inactive"}
                  </Badge>
                ),
              },
            ] as Column<Grade>[]}
            data={grades}
            loading={loading}
            emptyMessage="No grades found"
            keyExtractor={(g) => g.id}
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
        title={editing ? "Edit Grade" : "Add Grade"}
      >
        <GradeForm
          initialValues={editing ? { ...editing, isActive: editing.isActive } : undefined}
          onCancel={() => setDrawerOpen(false)}
          onSubmit={async (payload) => {
            if (editing) {
              await gradeService.update(editing.id, payload as import("../types").UpdateGradeDto);
            } else {
              await gradeService.create(payload as import("../types").CreateGradeDto);
            }
            setDrawerOpen(false);
            const data = await gradeService.getAll();
            setGrades(data);
          }}
        />
      </Drawer>
    </div>
  );
};

export default Grades;
