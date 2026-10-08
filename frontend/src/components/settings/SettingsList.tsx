import type { SettingsView } from "@/types";

export default function SettingsList({
  onSelectSettings,
  selectedSettings,
}: {
  onSelectSettings: (setting: SettingsView) => void;
  selectedSettings: SettingsView;
}) {
  const sectionButtonStyle =
    "text-base text-foreground-muted w-full text-left px-6 py-1.5";
  const childButtonStyle =
    "text-base text-foreground-secondary w-full text-left px-8 py-1.5";

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg text-foreground font-semibold px-4 mt-4">
        Settings
      </h1>
      <div className="flex flex-col">
        <button
          className={`${sectionButtonStyle} ${selectedSettings === "general" ? "bg-background-muted/50" : ""}`}
          onClick={() => onSelectSettings("general")}
        >
          General
        </button>
      </div>
      <div className="flex flex-col">
        <button
          className={`${sectionButtonStyle} ${selectedSettings === "jobApi" ? "bg-background-muted/50" : ""}`}
          onClick={() => onSelectSettings("jobApi")}
        >
          Job API
        </button>
        <button
          className={`${childButtonStyle} ${selectedSettings === "himalayas" ? "bg-background-muted/50" : ""}`}
          onClick={() => onSelectSettings("himalayas")}
        >
          Himalayas
        </button>
        <button
          className={`${childButtonStyle} ${selectedSettings === "jobicy" ? "bg-background-muted/50" : ""}`}
          onClick={() => onSelectSettings("jobicy")}
        >
          Jobicy
        </button>
      </div>
      <div className="flex flex-col">
        <button
          className={`${sectionButtonStyle} ${selectedSettings === "scorer" ? "bg-background-muted/50" : ""}`}
          onClick={() => onSelectSettings("scorer")}
        >
          Scorer
        </button>
        <button
          className={`${childButtonStyle} ${selectedSettings === "prompt" ? "bg-background-muted/50" : ""}`}
          onClick={() => onSelectSettings("prompt")}
        >
          Prompt
        </button>
        <button
          className={`${childButtonStyle} ${selectedSettings === "profile" ? "bg-background-muted/50" : ""}`}
          onClick={() => onSelectSettings("profile")}
        >
          Profile
        </button>
      </div>
    </div>
  );
}
