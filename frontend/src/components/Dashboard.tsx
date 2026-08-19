import { useState } from "react";
import JobList from "./JobList";
import Navigation from "./Navigation";

import type { Filters } from "@/types";
import DetailView from "./DetailView";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

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
  const [isNavOpen, setIsNavOpen] = useState(false);

  function handleDataUpdate() {
    setRefreshCounter((prev) => prev + 1);
  }

  return (
    <div className="grid grid-rows-[5vh_1fr_5vh] h-screen bg-background gap-4">
      <div className="bg-primary text-primary-foreground flex items-center">
        <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
          <SheetTrigger className="md:hidden pl-4">Filters</SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className={"sr-only"}>Job Filters</SheetTitle>
            </SheetHeader>
            <Navigation filters={filters} onChange={setFilters} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="flex gap-4 min-h-0">
        <div className="bg-sidebar rounded-xl shadow-sm hidden md:block flex-1 max-w-64">
          <Navigation filters={filters} onChange={setFilters} />
        </div>
        <div className="bg-card rounded-xl shadow-sm h-full min-h-0 flex-2">
          <JobList
            filters={filters}
            onSelectJob={setSelectedJobId}
            refreshCounter={refreshCounter}
          />
        </div>
        <div className="bg-card rounded-xl shadow-sm h-full min-h-0 flex-3">
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
