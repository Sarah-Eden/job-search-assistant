import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

function JobList() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/new-jobs")
      .then((response) => response.json())
      .then((data) => setJobs(data));
  }, []);

  return (
    <Card>
      <CardHeader>{/* Filter name & count */}</CardHeader>
      <CardContent>
        {jobs.map((job) => (
          <div key={job.id} className="border-t py-2">
            {job.company_name} - {job.title}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default JobList;
