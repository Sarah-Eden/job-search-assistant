import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { Filters, JobFilters } from "@/types";
import { buildJobQueryString } from "@/utils";

export default function JobList({ filters }: { filters: Filters }) {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const query = buildJobQueryString(filters.jobFilters);
    fetch(`http://localhost:8000/jobs?${query}`)
      .then((response) => response.json())
      .then((data) => setJobs(data));
  }, [filters]);

  const statusBorderColors: Record<string, string> = {
    accepted: "border-1-status-positive",
    declined: "border-2-status-negative",
    unreviewed: "border-1-border",
  };

  return (
    <Card>
      <CardHeader>{/* Filter name & count */}</CardHeader>
      <CardContent>
        {jobs.map((job) => (
          <Card
            key={job.id}
            className={`border-l-4 ${statusBorderColors[job.review_status]}`}
          >
            {job.company_name} - {job.title}
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
