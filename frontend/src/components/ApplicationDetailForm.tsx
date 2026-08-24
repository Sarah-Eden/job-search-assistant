import { CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import type { ApplicationData } from "@/types";
import { useEffect, useState } from "react";
import InputWrapper, { inputStyle } from "./InputWrapper";

export default function ApplicationDetailForm({
  application,
  onApplicationUpdate,
}: {
  application: any;
  onApplicationUpdate: () => void;
}) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(
    null,
  );

  const { register, handleSubmit } = useForm<ApplicationData>({
    defaultValues: {
      portal_available: application.portal_available,
      status: application.status,
      date_applied: application.date_applied,
      response_received: application.response_received,
      response_date: application.response_date,
    },
  });

  function onApplicationSubmit(data: ApplicationData) {
    fetch(`http://localhost:8000/applications/${application.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        onApplicationUpdate();
        setStatusMessage("Application update success.");
        setMessageType("success");
      })
      .catch((error) => {
        console.error(error);
        setStatusMessage(`Error updating application: ${error.message}`);
        setMessageType("error");
      });
  }

  useEffect(() => {
    if (statusMessage === null) return;

    const timer = setTimeout(() => {
      setStatusMessage(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [statusMessage]);

  return (
    <div>
      <form
        onSubmit={handleSubmit(onApplicationSubmit)}
        className="flex flex-col gap-4 overflow-y-auto min-h-0"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <InputWrapper label="Status">
            <select
              {...register("status", {
                setValueAs: (v) => (v === "" ? null : v),
              })}
              className={inputStyle}
            >
              <option value="pending">Pending</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </InputWrapper>

          <InputWrapper label="Application Portal:">
            <select
              {...register("portal_available", {
                setValueAs: (v) => (v === "" ? null : v === "true"),
              })}
              className={inputStyle}
            >
              <option value=""></option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </InputWrapper>

          <InputWrapper label="Date Applied:">
            <input
              type="date"
              {...register("date_applied", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
              className={inputStyle}
            />
          </InputWrapper>

          <InputWrapper label="Response Received:">
            <select
              {...register("response_received", {
                setValueAs: (v) => (v === "" ? null : v === "true"),
              })}
              className={inputStyle}
            >
              <option value=""></option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </InputWrapper>

          <InputWrapper label="Response Date:">
            <input
              type="date"
              {...register("response_date", {
                setValueAs: (v) => (v === "" ? null : new Date(v)),
              })}
              className={inputStyle}
            />
          </InputWrapper>
        </div>
        <Button type="submit">Save</Button>
      </form>
      <div
        className={`text-center text-lg font-semibold ${messageType === "error" ? "text-error" : "text-success"}`}
      >
        {statusMessage !== null && statusMessage}
      </div>
    </div>
  );
}
