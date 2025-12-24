import React, { useEffect, useState } from "react";
import { holidayService, financialYearService, countryService, stateService } from "../services";
import type { FinancialYear, Country, State, Holiday } from "../types";
import { PageHeader, Card, CardBody, Table, type Column, Select, FilterBar, Button, Drawer } from "../components/ui";
import HolidayForm from "../components/forms/HolidayForm";

interface FilterState {
  financialYearId?: string;
  countryId?: string;
  stateId?: string;
}

const Holidays: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [items, setItems] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Holiday | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      const [fyList, countryList] = await Promise.all([
        financialYearService.getAll(),
        countryService.getAll(),
      ]);
      setYears(fyList);
      setCountries(countryList);
      const current = await financialYearService.getCurrent();
      setFilters((prev) => ({ ...prev, financialYearId: current?.id || fyList[0]?.id }));
    };
    bootstrap();
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        if (filters.countryId) {
          const st = await stateService.getByCountry(filters.countryId);
          setStates(st);
        } else {
          setStates([]);
        }
        const data = await holidayService.getByFilters(filters);
        setItems(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [filters]);

  return (
    <div className="page-container">
      <PageHeader
        title="Holidays"
        description="Manage holiday calendars by financial year and region"
        actions={
          <Button
            variant="primary"
            onClick={() => {
              setEditing(null);
              setDrawerOpen(true);
            }}
          >
            Add Holiday
          </Button>
        }
      />
      <FilterBar>
        <Select
          label="Financial Year"
          value={filters.financialYearId || ""}
          onChange={(e) => setFilters((f) => ({ ...f, financialYearId: e.target.value || undefined }))}
          options={[{ value: "", label: "All Financial Years" }, ...years.map((y) => ({ value: y.id, label: y.code }))]}
        />
        <Select
          label="Country"
          value={filters.countryId || ""}
          onChange={(e) => setFilters((f) => ({ ...f, countryId: e.target.value || undefined, stateId: undefined }))}
          options={[{ value: "", label: "All Countries" }, ...countries.map((c) => ({ value: c.id, label: c.name }))]}
        />
        <Select
          label="State"
          value={filters.stateId || ""}
          onChange={(e) => setFilters((f) => ({ ...f, stateId: e.target.value || undefined }))}
          disabled={!filters.countryId}
          options={[{ value: "", label: "All States" }, ...states.map((s) => ({ value: s.id, label: s.name }))]}
        />
      </FilterBar>
      <Card>
        <CardBody>
          <Table<Holiday>
            columns={[
              { key: "date", header: "Date", render: (h) => new Date(h.date).toLocaleDateString(), sortable: true },
              { key: "name", header: "Name", sortable: true },
              { key: "type", header: "Type", sortable: true },
              {
                key: "countryId",
                header: "Country",
                render: (h) => (h.countryId ? countries.find((c) => c.id === h.countryId)?.name ?? h.countryId : "-"),
              },
              {
                key: "stateId",
                header: "State",
                render: (h) => (h.stateId ? states.find((s) => s.id === h.stateId)?.name ?? h.stateId : "-"),
              },
            ] as Column<Holiday>[]}
            data={items}
            loading={loading}
            emptyMessage="No holidays found"
            keyExtractor={(h) => h.id}
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
        title={editing ? "Edit Holiday" : "Add Holiday"}
      >
        <HolidayForm
          initialValues={editing ? { ...editing, isActive: editing.isActive } : undefined}
          onCancel={() => setDrawerOpen(false)}
          onSubmit={async (payload) => {
            if (editing) {
              await holidayService.update(editing.id, payload as import("../types").UpdateHolidayDto);
            } else {
              await holidayService.create(payload as import("../types").CreateHolidayDto);
            }
            setDrawerOpen(false);
            const data = await holidayService.getByFilters(filters);
            setItems(data);
          }}
        />
      </Drawer>
    </div>
  );
};

export default Holidays;
