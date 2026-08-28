import { useEffect, useState } from "react";
import type { JobDetailView } from "@/types";
import { getJobDetails, updateJobStatus, createApplication } from "@/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import ApplicationDetailForm from "./ApplicationDetailForm";

export default function JobDetails({
  selectedJobId,
  onDataUpdate,
}: {
  selectedJobId: number;
  onDataUpdate: () => void;
}) {
  const [record, setRecord] = useState<JobDetailView | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshJobDetails() {
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

  async function handleJobStatusUpdate(status: "accepted" | "declined") {
    try {
      await updateJobStatus(selectedJobId, status);
      await refreshJobDetails();
      onDataUpdate();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : `An unknown error occurred.`,
      );
    }
  }

  async function handleCreateApplication() {
    try {
      await createApplication(selectedJobId);
      await refreshJobDetails();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : `An unexpected error occurred`,
      );
    }
  }

  if (error !== null) {
    return <div className="font-bold text-error">{error}</div>;
  }
  if (record === null) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between text-foreground font-heading">
        <span>{record.job.title}</span>
        <span>{record.job.company_name}</span>
      </div>

      <div className="flex justify-between text-foreground-muted">
        <span>
          <b>Posted:</b> {record.job.pub_date}
        </span>
        <span>
          <a
            href={record.job.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-background border-b text-foreground-muted cursor-pointer"
          >
            View Job Posting
          </a>
        </span>
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
            className="bg-background border border-foreground-secondary hover:bg-foreground-muted text-foreground-secondary rounded-md px-3 py-2"
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
          <div className="flex flex-col gap-4 overflow-y-auto min-h-0 p-8 border border-border rounded-2xl bg-card text-card-foreground">
            <div className="border-b-2 border-border">
              <span className="block mb-4">
                <b>AI Score:</b> {record.score ? record.score.score : "N/A"}
              </span>
              {record.score && (
                <>
                  <p className="font-semibold mb-2">Score Details:</p>
                  <p className="leading-relaxed mb-6">
                    {record.score.score_details}
                  </p>
                </>
              )}
            </div>

            <div>
              <p className="font-semibold mb-2">Job Description:</p>
              <p className="leading-relaxed">{record.job.description}</p>
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
    </>
  );
}
