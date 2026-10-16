import type { ApiSearchParams, SettingsView } from "@/types";
import { Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { getApiSearchParams } from "@/api";
import SearchSettingsForm from "./SearchSettingsForm";
import SearchTermsForm from "./SearchTermsForm";

export default function SettingsDetails({
  selectedSettings,
}: {
  selectedSettings: SettingsView;
}) {
  const settingsMap = {
    general: ["General"],
    jobApi: ["Job API"],
    himalayas: ["Job API", "Himalayas"],
    searchTerms: ["Job API", "Search Terms"],
    jobicy: ["Job API", "Jobicy"],
    scorer: ["Job Scorer"],
    profile: ["Job Scorer", "Profile"],
    prompt: ["Job Scorer", "Prompt"],
  };

  const currentLocation =
    selectedSettings === null ? [] : settingsMap[selectedSettings];

  const [apiSettings, setApiSettings] = useState<ApiSearchParams[] | null>(
    null,
  );
  const searchTermsSetting = apiSettings?.find(
    (setting) => setting.source === "query",
  );

  async function getSettings() {
    try {
      const data = await getApiSearchParams();
      setApiSettings(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div className="flex flex-col gap-4 px-10 pt-4 h-full">
      <div>
        <span
          className={
            currentLocation.length === 0
              ? "text-foreground"
              : "text-foreground-muted"
          }
        >
          Settings
        </span>
        {currentLocation.map((value, index) => (
          <Fragment key={value}>
            <span className="mx-3 text-foreground-muted">&gt;</span>
            <span
              className={`${index === currentLocation.length - 1 ? "text-foreground" : "text-foreground-muted"}`}
            >
              {value}
            </span>
          </Fragment>
        ))}
      </div>

      <div className="flex flex-col flex-1 gap-4 min-h-0 overflow-y-auto">
        {searchTermsSetting &&
          (selectedSettings === "jobApi" ||
            selectedSettings === "searchTerms") && (
            <div className="flex flex-col p-8 border border-border rounded-2xl bg-card text-card-foreground">
              <SearchTermsForm settings={searchTermsSetting} />
            </div>
          )}
        {apiSettings !== null &&
          (selectedSettings === "jobApi" ||
            selectedSettings === "himalayas") && (
            <div className="flex flex-col p-8 border border-border rounded-2xl bg-card text-card-foreground">
              <SearchSettingsForm
                settings={apiSettings.filter(
                  (settings) => settings.source === "himalayas",
                )}
              />
            </div>
          )}

        {(selectedSettings === "jobApi" || selectedSettings === "jobicy") && (
          <div className="flex flex-col p-8 border border-border rounded-2xl bg-card text-card-foreground">
            <span className="text-foreground font-light">Jobicy</span>
          </div>
        )}

        {(selectedSettings === "scorer" || selectedSettings === "prompt") && (
          <div className="flex flex-col p-8 border border-border rounded-2xl bg-card text-card-foreground">
            <span className="text-foreground font-light">Prompt</span>
          </div>
        )}

        {(selectedSettings === "scorer" || selectedSettings === "profile") && (
          <div className="flex flex-col p-8 border border-border rounded-2xl bg-card text-card-foreground">
            <span className="text-foreground font-light">Profile</span>
          </div>
        )}
      </div>
    </div>
  );
}
