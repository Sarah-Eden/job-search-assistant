import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import ApplicationDetailForm from "./ApplicationDetailForm";

export default function DetailView({
  selectedJobId,
  onJobClose,
  onDataUpdate,
}: {
  selectedJobId: number | null;
  onJobClose: () => void;
  onDataUpdate: () => void;
}) {
  const [record, setRecord] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  function getJobDetails() {
    fetch(`http://localhost:8000/jobs/${selectedJobId}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        return response.json();
      })
      .then((data) => setRecord(data))
      .catch((error) => {
        setError(error.message);
        console.error(error);
      });
  }

  useEffect(() => {
    if (selectedJobId === null) return;
    getJobDetails();
  }, [selectedJobId]);

  if (error !== null) {
    return <div>{error}</div>;
  }
  if (record === null) {
    return null;
  }

  function updateJobStatus(status: "accepted" | "declined") {
    fetch(
      `http://localhost:8000/jobs/${selectedJobId}?review_status=${status}`,
      {
        method: "PATCH",
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        getJobDetails();
        onDataUpdate();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function createApplication() {
    fetch(`http://localhost:8000/applications/${selectedJobId}`, {
      method: "POST",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }
        getJobDetails();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div className="flex flex-col gap-4 h-full px-10 pt-4">
      <div className="flex justify-end">
        <Button
          className="sm:hidden"
          variant={"ghost"}
          size="icon"
          onClick={onJobClose}
        >
          X
        </Button>
      </div>

      <div className="font-heading text-foreground font-medium flex justify-between">
        <span>{record.job.title}</span>
        <span>{record.job.company_name}</span>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
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
          <Button
            className={"bg-primary"}
            onClick={() => updateJobStatus("accepted")}
          >
            Accept
          </Button>
          <Button
            className={
              "bg-background-secondary hover:bg-foreground-muted text-foreground-secondary"
            }
            onClick={() => updateJobStatus("declined")}
          >
            Declined
          </Button>
        </div>
      )}
      {record.job.review_status === "accepted" && !record.application && (
        <Button className="bg-primary" onClick={() => createApplication()}>
          Create Application
        </Button>
      )}

      <Tabs defaultValue="details" className="flex-1 min-h-0 overflow-y-auto">
        <TabsList className="mx-auto">
          <TabsTrigger value="details">Job Details</TabsTrigger>
          {record.job.review_status === "accepted" && record.application && (
            <TabsTrigger value="application">Application</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details">
          <Card className="border border-border rounded-2xl">
            <CardContent className="flex flex-col gap-4 overflow-y-auto min-h-0 px-8">
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
            </CardContent>
          </Card>
        </TabsContent>
        {record.job.review_status === "accepted" && record.application && (
          <TabsContent value="application">
            <ApplicationDetailForm
              application={record.application}
              onApplicationUpdate={getJobDetails}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
