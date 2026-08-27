import type {
  ApplicationUpdate,
  JobDetailView,
  JobFilters,
  JobHeader,
  ReviewStatus,
} from "@/types";
import { buildJobQueryString } from "./utils";

const API_URL = import.meta.env.VITE_API_URL;

export async function getJobDetails(jobId: number): Promise<JobDetailView> {
  const response = await fetch(`${API_URL}/jobs/${jobId}`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function updateJobStatus(
  jobId: number,
  status: ReviewStatus,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/jobs/${jobId}?review_status=${status}`,
    { method: "PATCH" },
  );
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

export async function createApplication(jobId: number): Promise<void> {
  const response = await fetch(`${API_URL}/applications/${jobId}`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

export async function updateApplication(
  applicationId: number,
  data: ApplicationUpdate,
): Promise<void> {
  const response = await fetch(`${API_URL}/applications/${applicationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

export async function getJobs(jobFilters: JobFilters): Promise<JobHeader[]> {
  const query = buildJobQueryString(jobFilters);
  const response = await fetch(`${API_URL}/jobs?${query}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}
