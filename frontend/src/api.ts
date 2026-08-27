import type { JobDetailView } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

export async function getJobDetails(jobId: number): Promise<JobDetailView> {
  const response = await fetch(`http://localhost:8000/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}
