export type JobFilters = {
  relevant: boolean | null;
  status: "new" | "accepted" | "declined" | null;
  dateType: "created_at" | "pub_date" | "expiry_date" | null;
  startDate: Date | null;
  endDate: Date | null;
};

export type ApplicationFilters = {
  status:
    "pending" | "applied" | "interviewing" | "rejected" | "withdrawn" | null;
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

export type ApplicationData = {
  portal_available: boolean | null;
  status:
    "pending" | "applied" | "interviewing" | "rejected" | "withdrawn" | null;
  date_applied: Date | null;
  response_received: boolean | null;
  response_date: Date | null;
};
