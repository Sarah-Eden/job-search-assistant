import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { Filters } from "@/types";
import { buildJobQueryString } from "@/utils";

type JobListProps = {
  filters: Filters;
  onSelectJob: (id: number) => void;
};

export default function JobList({ filters, onSelectJob }: JobListProps) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [filters]);

  const statusBorderColors: Record<string, string> = {
    accepted: "border-l-status-positive",
    declined: "border-l-status-negative",
    new: "border-l-border",
  };

  return (
    <Card>
      <CardHeader>{error !== null && error}</CardHeader>
      <CardContent>
        {jobs.map((job) => (
          <Card
            key={job.id}
            className={`border-l-4 ${statusBorderColors[job.review_status]}`}
            onClick={() => onSelectJob(job.id)}
          >
            {job.company_name} - {job.title}
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
