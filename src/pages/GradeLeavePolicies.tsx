import React, { useEffect, useState } from "react";
import { gradeService, gradeLeavePolicyService, financialYearService, leaveTypeService } from "../services";
import type { Grade, GradeLeavePolicy, FinancialYear, LeaveType } from "../types";
import { PageHeader, Card, CardBody, Table, type Column, FilterBar, Select } from "../components/ui";

const GradeLeavePolicies: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [years, setYears] = useState<FinancialYear[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [policies, setPolicies] = useState<GradeLeavePolicy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      const [g, fy, lt] = await Promise.all([
        gradeService.getAll(),
        financialYearService.getAll(),
        leaveTypeService.getAll(),
      ]);
      setGrades(g);
      setYears(fy);
      setLeaveTypes(lt);
      if (g.length) setSelectedGrade(g[0].id);
      const current = await financialYearService.getCurrent();
      setSelectedYear(current?.id || fy[0]?.id || "");
    };
    bootstrap();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!selectedGrade) return;
      setLoading(true);
      try {
        const data = await gradeLeavePolicyService.getByGrade(selectedGrade, selectedYear || undefined);
        setPolicies(data);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [selectedGrade, selectedYear]);

  return (
    <div className="page-container">
      <PageHeader title="Grade Leave Policies" description="Configure leave entitlements per grade" />
      <FilterBar>
        <Select
          label="Grade"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          options={grades.map((g) => ({ value: g.id, label: `${g.name} (${g.code})` }))}
        />
        <Select
          label="Financial Year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          options={[{ value: "", label: "All" }, ...years.map((y) => ({ value: y.id, label: y.code }))]}
        />
      </FilterBar>
      <Card>
        <CardBody>
          <Table<GradeLeavePolicy>
            columns={[
              { key: "leaveTypeId", header: "Leave Type", render: (p) => leaveTypes.find((lt) => lt.id === p.leaveTypeId)?.name ?? p.leaveTypeId },
              { key: "year", header: "Year" },
              { key: "maxDaysPerYear", header: "Max Days" },
              { key: "accrualStrategy", header: "Accrual" },
              { key: "proRataMethod", header: "Pro Rata" },
              { key: "carryForwardLimit", header: "Carry Fwd Limit", render: (p) => p.carryForwardLimit ?? "-" },
              { key: "isActive", header: "Active", render: (p) => (p.isActive ? "Yes" : "No") },
            ] as Column<GradeLeavePolicy>[]}
            data={policies}
            loading={loading}
            emptyMessage="No policies found"
            keyExtractor={(p) => p.id}
            searchable
            paginated
            pageSize={10}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default GradeLeavePolicies;
