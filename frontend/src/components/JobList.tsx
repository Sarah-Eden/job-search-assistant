import { useState, useEffect } from "react";
import type { Filters, JobHeader } from "@/types";
import { buildJobQueryString } from "@/utils";
import { getJobs } from "@/api";

export default function JobList({
  filters,
  onSelectJob,
  selectedJobId,
  refreshCounter,
}: {
  filters: Filters;
  onSelectJob: (id: number) => void;
  selectedJobId: number | null;
  refreshCounter: number;
}) {
  const [jobs, setJobs] = useState<JobHeader[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSetJobs() {
    try {
      const data = await getJobs(filters.jobFilters);
      setJobs(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
      console.error(error);
    }
  }

  useEffect(() => {
    handleSetJobs();
    const query = buildJobQueryString(filters.jobFilters);
    fetch(`http://localhost:8000/jobs?${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setJobs(data))
      .catch((error) => {
        setError(error.message);
        console.error(error);
      });
  }, [filters, refreshCounter]);

  const statusDotColors: Record<string, string> = {
    accepted: "bg-success/50 text-background",
    declined: "bg-error/50 text-background",
    new: "bg-foreground-muted/70 text-background",
  };

  return (
    <div className="h-full overflow-y-auto bg-background">
      {error !== null && error}
      <div>
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`border-b border-border p-4 cursor-pointer flex flex-col hover:bg-background-secondary ${job.id === selectedJobId ? "bg-secondary" : ""}`}
            onClick={() => onSelectJob(job.id)}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-foreground">{job.title}</span>
              <span
                className={`w-6 h-3 rounded-full ${statusDotColors[job.review_status]}`}
              ></span>
            </div>
            <span className="text-sm text-foreground-secondary">
              {job.company_name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
