import React from "react";
import type {
  NavigationProps,
  Filters,
  JobFilters,
  ApplicationFilters,
} from "@/types";
import { useForm } from "react-hook-form";

function Navigation({ filters, onChange }: NavigationProps) {
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
    <div>
      <select value={filters.view} onChange={handleChange}>
        <option value="jobs">Jobs</option>
        <option value="applications">Applications</option>
      </select>
      {filters.view === "jobs" ? (
        <form onSubmit={handleJobSubmit(onJobSubmit)}>
          <select
            {...registerJob("status", {
              setValueAs: (v) => (v === "" ? null : v),
            })}
          >
            <option value=""></option>
            <option value="new">New</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
          </select>
          <select
            {...registerJob("relevant", {
              setValueAs: (v) => (v === "" ? null : v === "true"),
            })}
          >
            <option value=""></option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <select
            {...registerJob("dateType", {
              setValueAs: (v) => (v === "" ? null : v),
            })}
          >
            <option value=""></option>
            <option value="created_at">Created</option>
            <option value="pub_date">Published</option>
            <option value="expiry_date">Expires</option>
          </select>
          <label>
            From:{" "}
            <input
              type="date"
              {...registerJob("startDate", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
            />
          </label>
          <label>
            To:{" "}
            <input
              type="date"
              {...registerJob("endDate", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
            />
          </label>
          <button type="submit">Apply</button>
        </form>
      ) : (
        <form onSubmit={handleApplicationSubmit(onApplicationSubmit)}>
          <select
            {...registerApplication("status", {
              setValueAs: (v) => (v === "" ? null : v),
            })}
          >
            <option value=""></option>
            <option value="pending">Pending</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          <select
            {...registerApplication("portalAvailable", {
              setValueAs: (v) => (v === "" ? null : v === "true"),
            })}
          >
            <option value=""></option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <select
            {...registerApplication("responseReceived", {
              setValueAs: (v) => (v === "" ? null : v === "true"),
            })}
          >
            <option value=""></option>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
          <label>
            From:{" "}
            <input
              type="date"
              {...registerApplication("dateAppliedStart", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
            />
          </label>
          <label>
            To:{" "}
            <input
              type="date"
              {...registerApplication("dateAppliedEnd", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
            />
          </label>
          <button type="submit">Apply</button>
        </form>
      )}
    </div>
  );
}

export default Navigation;
