import { useState } from "react";
import JobList from "./JobList";
import Navigation from "./Navigation";
import type { Filters } from "@/types";

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

  return (
    <div className="grid grid-rows-[5vh_1fr_5vh] h-screen bg-background">
      <div className="bg-primary text-primary-foreground">
        {/* Simple header bar */}
      </div>
      <div className="grid grid-cols-[16rem_2fr_3fr] gap-4">
        <div className="bg-sidebar rounded-xl shadow-sm">
          <Navigation filters={filters} onChange={setFilters} />
        </div>
        <div className="bg-card rounded-xl shadow-sm">
          <JobList filters={filters} />
        </div>
        <div>{/* Details */}</div>
      </div>
      <div className="by-muted text-muted-foreground">
        {/* Simple footer bar */}
      </div>
    </div>
  );
}
