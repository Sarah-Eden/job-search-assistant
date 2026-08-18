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

export default function DetailView({
  selectedJobId,
  onDataUpdate,
}: {
  selectedJobId: number | null;
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
    <Card className="flex flex-col gap-4 h-full">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{record.job.title}</span>
          <span>{record.job.company_name}</span>
        </CardTitle>
        <CardDescription className="flex justify-between">
          <span>{record.job.employment_type}</span>
          <span>{record.job.location?.join(", ")}</span>
        </CardDescription>
        {record.job.review_status === "new" && (
          <div className="flex justify-between sticky top-0">
            <Button
              className={"bg-status-positive-foreground hover:opacity-80"}
              onClick={() => updateJobStatus("accepted")}
            >
              Accept
            </Button>
            <Button
              className={"bg-status-negative-foreground"}
              onClick={() => updateJobStatus("declined")}
            >
              Declined
            </Button>
          </div>
        )}
        {record.job.review_status === "accepted" && !record.application && (
          <Button
            className="bg-status-positive-foreground"
            onClick={() => createApplication()}
          >
            Create Application
          </Button>
        )}
      </CardHeader>

      <Tabs defaultValue="details" className="flex-1 min-h-0 overflow-y-auto">
        <TabsList className="mx-auto">
          <TabsTrigger value="details">Job Details</TabsTrigger>
          {record.job.review_status === "accepted" && record.application && (
            <TabsTrigger value="application">Application</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details">
          <CardContent className="flex flex-col gap-4 overflow-y-auto min-h-0">
            <div className="flex justify-between">
              <span>
                <b>AI Score:</b> {record.score ? record.score.score : "N/A"}
              </span>
              <span>
                <b>Posted:</b> {record.job.pub_date}
              </span>
            </div>

            {record.score && (
              <div className="col-span-2">
                <p className="font-semibold">Score Details:</p>
                <p className="leading-relaxed">{record.score.score_details}</p>
              </div>
            )}
            <div className="col-span-2">
              <p className="font-semibold">Job Description</p>
              <p className="leading-relaxed">{record.job.description}</p>
            </div>
          </CardContent>
        </TabsContent>
        {record.job.review_status === "accepted" && record.application && (
          <TabsContent value="application">
            {/* Placeholder for application fields */}
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}
