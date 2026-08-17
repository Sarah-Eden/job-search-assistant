import { useState } from "react";
import JobList from "./JobList";
import Navigation from "./Navigation";

import type { Filters } from "@/types";
import DetailView from "./DetailView";

export default function Dashboard() {
  const [filters, setFilters] = useState<Filters>({
    view: "jobs",
    jobFilters: {
      relevant: null,
      status: null,
      dateType: null,
      startDate: null,
      endDate: null,
    },
    applicationFilters: {
      status: null,
      portalAvailable: null,
      responseReceived: null,
      dateAppliedStart: null,
      dateAppliedEnd: null,
    },
  });

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  function handleDataUpdate() {
    setRefreshCounter((prev) => prev + 1);
  }

  return (
    <div className="grid grid-rows-[5vh_1fr_5vh] h-screen bg-background gap-4">
      <div className="bg-primary text-primary-foreground">
        {/* Simple header bar */}
      </div>
      <div className="grid grid-cols-[16rem_2fr_3fr] gap-4 min-h-0">
        <div className="bg-sidebar rounded-xl shadow-sm">
          <Navigation filters={filters} onChange={setFilters} />
        </div>
        <div className="bg-card rounded-xl shadow-sm h-full min-h-0">
          <JobList
            filters={filters}
            onSelectJob={setSelectedJobId}
            refreshCounter={refreshCounter}
          />
        </div>
        <div className="bg-card rounded-xl shadow-sm h-full min-h-0">
          <DetailView
            selectedJobId={selectedJobId}
            onDataUpdate={handleDataUpdate}
          />
        </div>
      </div>
      <div className="by-muted text-muted-foreground">
        {/* Simple footer bar */}
      </div>
    </div>
  );
}
