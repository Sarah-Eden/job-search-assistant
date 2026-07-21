import { useState, useEffect } from "react";

function JobList() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/new-jobs")
      .then((response) => response.json())
      .then((data) => setJobs(data));
  }, []);

  return (
    <div>
      {jobs.map((job) => (
        <div key={job.id}>
          {job.company_name}: {job.title}
        </div>
      ))}
    </div>
  );
}

export default JobList;
