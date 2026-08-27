import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import ApplicationDetailForm from "./ApplicationDetailForm";
import type { JobDetailView } from "@/types";
import { getJobDetails, updateJobStatus, createApplication } from "@/api";

export default function DetailView({
  selectedJobId,
  onJobClose,
  onDataUpdate,
}: {
  selectedJobId: number | null;
  onJobClose: () => void;
  onDataUpdate: () => void;
}) {
  const [record, setRecord] = useState<JobDetailView | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshJobDetails() {
    if (selectedJobId === null) return;

    try {
      setError(null);
      const data = await getJobDetails(selectedJobId);
      setRecord(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
      console.error(error);
    }
  }
  useEffect(() => {
    refreshJobDetails();
  }, [selectedJobId]);

  if (error !== null) {
    return <div>{error}</div>;
  }
  if (record === null) {
    return null;
  }

  async function handleJobStatusUpdate(status: "accepted" | "declined") {
    if (selectedJobId === null) return;

    try {
      await updateJobStatus(selectedJobId, status);
      await refreshJobDetails();
      onDataUpdate();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateApplication() {
    if (selectedJobId === null) return;

    try {
      await createApplication(selectedJobId);
      await refreshJobDetails();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full px-10 pt-4">
      <div className="flex justify-end">
        <button
          className="sm:hidden text-foreground hover:bg-muted hover:text-foreground"
          onClick={onJobClose}
        >
          X
        </button>
      </div>

      <div className="font-heading text-foreground font-medium flex justify-between">
        <span>{record.job.title}</span>
        <span>{record.job.company_name}</span>
      </div>

      <div className="flex justify-between text-sm text-foreground-muted">
        <span>
          {" "}
          <b>Posted:</b> {record.job.pub_date}
        </span>
        <a
          href={record.job.application_url}
          target="_blank"
          rel="noopener noreferrer"
          className={
            "bg-background border-b text-muted-foreground cursor-pointer"
          }
        >
          View Job Posting
        </a>
      </div>

      {record.job.review_status === "new" && (
        <div className="flex justify-between sticky top-0">
          <button
            className="bg-primary hover:bg-secondary-foreground rounded-md px-3 py-2"
            onClick={() => handleJobStatusUpdate("accepted")}
          >
            Accept
          </button>
          <button
            className={
              "bg-background border border-foreground-secondary hover:bg-foreground-muted text-foreground-secondary rounded-md px-3 py-2"
            }
            onClick={() => handleJobStatusUpdate("declined")}
          >
            Decline
          </button>
        </div>
      )}
      {record.job.review_status === "accepted" && !record.application && (
        <button
          className="bg-primary hover:bg-secondary-foreground rounded-md px-3 py-2"
          onClick={handleCreateApplication}
        >
          Create Application
        </button>
      )}

      <Tabs
        key={selectedJobId}
        defaultValue="details"
        className="flex-1 min-h-0 overflow-y-auto"
      >
        <TabsList className="mx-auto">
          <TabsTrigger value="details">Job Details</TabsTrigger>
          {record.job.review_status === "accepted" && record.application && (
            <TabsTrigger value="application">Application</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details">
          <div className="border border-border rounded-2xl bg-card text-card-foreground">
            <div className="flex flex-col gap-4 overflow-y-auto min-h-0 p-8">
              <div className="flex justify-between">
                <span>
                  <b>AI Score:</b> {record.score ? record.score.score : "N/A"}
                </span>
              </div>

              {record.score && (
                <div>
                  <p className="font-semibold">Score Details:</p>
                  <p className="leading-relaxed">
                    {record.score.score_details}
                  </p>
                </div>
              )}
              <div className="border-t-2 border-border pt-6 mt-6"></div>
              <div className="flex justify-between">
                <span>{record.job.employment_type}</span>
                <span>{record.job.location?.join(", ")}</span>
              </div>

              <div>
                <p className="font-semibold">Job Description</p>
                <p className="leading-relaxed">{record.job.description}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        {record.job.review_status === "accepted" && record.application && (
          <TabsContent value="application">
            <ApplicationDetailForm
              application={record.application}
              onApplicationUpdate={refreshJobDetails}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
