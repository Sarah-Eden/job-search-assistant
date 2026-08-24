import { useEffect, useState } from "react";
import JobList from "./JobList";
import Navigation from "./Navigation";
import type { Filters } from "@/types";
import DetailView from "./DetailView";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Sun, Moon } from "lucide-react";

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
  const [displayTheme, setDisplayTheme] = useState<"light" | "dark">("dark");

  function handleDataUpdate() {
    setRefreshCounter((prev) => prev + 1);
  }

  function handleJobClose() {
    setSelectedJobId(null);
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", displayTheme === "dark");
  }, [displayTheme]);

  return (
    <div className="grid grid-rows-[5vh_1fr_5vh] h-screen bg-background border-2 border-border">
      <div className="bg-card border-2 border-border text-primary-foreground flex items-center justify-between">
        <Sheet open={isNavOpen} onOpenChange={setIsNavOpen}>
          <SheetTrigger className="md:hidden pl-4">Filters</SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className={"sr-only"}>Job Filters</SheetTitle>
            </SheetHeader>
            <Navigation filters={filters} onChange={setFilters} />
          </SheetContent>
        </Sheet>
        <Button
          className={"ml-auto"}
          onClick={() =>
            setDisplayTheme(displayTheme === "dark" ? "light" : "dark")
          }
        >
          {displayTheme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>
      <div className="flex min-h-0">
        <div className="bg-card border-2 border-border rounded-xl hidden md:block flex-1 max-w-64">
          <Navigation filters={filters} onChange={setFilters} />
        </div>
        <div
          className={`bg-background border-2 border-border ${selectedJobId === null ? "block" : "hidden"} sm:block h-full min-h-0 flex-2`}
        >
          <JobList
            filters={filters}
            onSelectJob={setSelectedJobId}
            selectedJobId={selectedJobId}
            refreshCounter={refreshCounter}
          />
        </div>
        <div
          className={`${selectedJobId === null ? "hidden" : "block"} sm:block bg-background rounded-xl shadow-sm h-full min-h-0 flex-3`}
        >
          <DetailView
            selectedJobId={selectedJobId}
            onDataUpdate={handleDataUpdate}
            onJobClose={handleJobClose}
          />
        </div>
      </div>
      <div className="by-muted text-muted-foreground">
        {/* Simple footer bar */}
      </div>
    </div>
  );
}
