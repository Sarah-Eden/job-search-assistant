export type ApplicationStatus =
  "pending" | "applied" | "interviewing" | "rejected" | "withdrawn";

export type ReviewStatus = "new" | "accepted" | "declined";

export type JobHeader = {
  id: number;
  title: string;
  company_name: string | null;
  review_status: ReviewStatus;
};

export type JobRecord = {
  id: number;
  title: string;
  description: string;
  company_name: string | null;
  employment_type: string | null;
  experience_level: string[] | null;
  location: string[] | null;
  categories: string[] | null;
  pub_date: string | null;
  expiry_date: string | null;
  created_at: string;
  is_relevant: boolean | null;
  review_status: ReviewStatus;
  application_url: string;
};

export type ScoreRecord = {
  id: number;
  score: number;
  score_details: string;
};

export type ApplicationRecord = {
  id: number;
  portal_available: boolean | null;
  status: ApplicationStatus;
  date_applied: string | null;
  response_received: boolean | null;
  response_date: string | null;
};

export type JobDetailView = {
  job: JobRecord;
  score: ScoreRecord | null;
  application: ApplicationRecord | null;
};

export type JobFilters = {
  relevant: boolean | null;
  status: ReviewStatus | null;
  dateType: "created_at" | "pub_date" | "expiry_date" | null;
  startDate: Date | null;
  endDate: Date | null;
};

export type ApplicationFilters = {
  status: ApplicationStatus | null;
  portalAvailable: boolean | null;
  responseReceived: boolean | null;
  dateAppliedStart: Date | null;
  dateAppliedEnd: Date | null;
};

export type Filters = {
  view: "jobs" | "applications";
  jobFilters: JobFilters;
  applicationFilters: ApplicationFilters;
};

export type NavigationProps = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};
