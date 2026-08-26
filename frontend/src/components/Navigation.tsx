import React from "react";
import type {
  NavigationProps,
  Filters,
  JobFilters,
  ApplicationFilters,
} from "@/types";
import { useForm } from "react-hook-form";
import InputWrapper, { inputStyle } from "./InputWrapper";

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
    <div className="flex flex-col gap-4 p-4 h-full">
      <select
        value={filters.view}
        onChange={handleChange}
        className={inputStyle}
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
              className={inputStyle}
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
              className={inputStyle}
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
              className={inputStyle}
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
              className={inputStyle}
            />
          </InputWrapper>
          <InputWrapper label="To:">
            <input
              type="date"
              {...registerJob("endDate", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
              className={inputStyle}
            />
          </InputWrapper>
          <button
            className="bg-primary hover:bg-secondary-foreground rounded-md px-3 py-2"
            type="submit"
          >
            Apply
          </button>
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
              className={inputStyle}
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
              className={inputStyle}
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
              className={inputStyle}
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
              className={inputStyle}
            />
          </InputWrapper>
          <InputWrapper label="To:">
            <input
              type="date"
              {...registerApplication("dateAppliedEnd", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
              className={inputStyle}
            />
          </InputWrapper>
          <button
            className="bg-primary hover:bg-secondary-foreground rounded-md px-3 py-2"
            type="submit"
          >
            Apply
          </button>
        </form>
      )}
      <button className="bg-card hover:bg-background-secondary rounded-md px-3 py-2 text-foreground border border-border mt-auto">
        Settings
      </button>
    </div>
  );
}
