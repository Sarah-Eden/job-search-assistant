import React from "react";
import type {
  NavigationProps,
  Filters,
  JobFilters,
  ApplicationFilters,
} from "@/types";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

function InputWrapper({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-sidebar-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function Navigation({ filters, onChange }: NavigationProps) {
  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const updated = { ...filters, view: event.target.value as Filters["view"] };
    onChange(updated);
  }
  const { register: registerJob, handleSubmit: handleJobSubmit } =
    useForm<JobFilters>();

  function onJobSubmit(data: JobFilters) {
    const updated = { ...filters, jobFilters: data };
    onChange(updated);
  }

  const {
    register: registerApplication,
    handleSubmit: handleApplicationSubmit,
  } = useForm<ApplicationFilters>();

  function onApplicationSubmit(data: ApplicationFilters) {
    const updated = { ...filters, applicationFilters: data };
    onChange(updated);
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <select
        value={filters.view}
        onChange={handleChange}
        className="border border-input rounded-md bg-card px-3 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="jobs">Jobs</option>
        <option value="applications">Applications</option>
      </select>
      {filters.view === "jobs" ? (
        <form
          onSubmit={handleJobSubmit(onJobSubmit)}
          className="flex flex-col gap-4"
        >
          <InputWrapper label="Status">
            <select
              {...registerJob("status", {
                setValueAs: (v) => (v === "" ? null : v),
              })}
              className="border border-input rounded-md bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value=""> </option>
              <option value="new">New</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </select>
          </InputWrapper>
          <InputWrapper label="Appropriate">
            <select
              {...registerJob("relevant", {
                setValueAs: (v) => (v === "" ? null : v === "true"),
              })}
              className="border border-input rounded-md bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value=""> </option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </InputWrapper>
          <InputWrapper label="Date Type">
            <select
              {...registerJob("dateType", {
                setValueAs: (v) => (v === "" ? null : v),
              })}
              className="border border-input rounded-md bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value=""> </option>
              <option value="created_at">Created</option>
              <option value="pub_date">Published</option>
              <option value="expiry_date">Expires</option>
            </select>
          </InputWrapper>

          <InputWrapper label="From:">
            <input
              type="date"
              {...registerJob("startDate", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
              className="border border-input rounded-md bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </InputWrapper>
          <InputWrapper label="To:">
            <input
              type="date"
              {...registerJob("endDate", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
              className="border border-input rounded-md bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </InputWrapper>
          <Button type="submit">Apply</Button>
        </form>
      ) : (
        <form
          onSubmit={handleApplicationSubmit(onApplicationSubmit)}
          className="flex flex-col gap-4"
        >
          <InputWrapper label="Status">
            <select
              {...registerApplication("status", {
                setValueAs: (v) => (v === "" ? null : v),
              })}
              className="border border-input rounded-md bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value=""> </option>
              <option value="pending">Pending</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </InputWrapper>
          <InputWrapper label="Application Portal:">
            <select
              {...registerApplication("portalAvailable", {
                setValueAs: (v) => (v === "" ? null : v === "true"),
              })}
              className="border border-input rounded-md bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value=""> </option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </InputWrapper>
          <InputWrapper label="Received Response:">
            <select
              {...registerApplication("responseReceived", {
                setValueAs: (v) => (v === "" ? null : v === "true"),
              })}
              className="border border-input rounded-md bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value=""> </option>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </InputWrapper>
          <InputWrapper label="From:">
            <input
              type="date"
              {...registerApplication("dateAppliedStart", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
              className="border border-input rounded-md bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </InputWrapper>
          <InputWrapper label="To:">
            <input
              type="date"
              {...registerApplication("dateAppliedEnd", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
              className="border border-input rounded-md bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </InputWrapper>
          <Button type="submit">Apply</Button>
        </form>
      )}
    </div>
  );
}
