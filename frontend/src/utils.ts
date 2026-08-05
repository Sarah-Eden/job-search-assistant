import type { JobFilters } from "./types";

export function buildJobQueryString(jobFilters: JobFilters): string {
  const jobParams = new URLSearchParams();

  if (jobFilters.relevant !== null) {
    jobParams.set("is_relevant", jobFilters.relevant.toString());
  }
  if (jobFilters.status !== null) {
    jobParams.set("review_status", jobFilters.status);
  }
  if (jobFilters.dateType !== null) {
    jobParams.set("date_type", jobFilters.dateType);
  }
  if (jobFilters.startDate !== null) {
    jobParams.set(
      "start_date",
      jobFilters.startDate.toISOString().split("T")[0],
    );
  }
  if (jobFilters.endDate !== null) {
    jobParams.set("end_date", jobFilters.endDate.toISOString().split("T")[0]);
  }
  return jobParams.toString();
}
