import type { DetailViewOptions, SettingsView } from "@/types";
import JobDetails from "./JobDetails";
import SettingsDetails from "./settings/SettingsDetails";

export default function DetailView({
  activeView,
  selectedJobId,
  onJobClose,
  onDataUpdate,
  selectedSettings,
}: {
  activeView: DetailViewOptions;
  selectedJobId: number | null;
  onJobClose: () => void;
  onDataUpdate: () => void;
  selectedSettings: SettingsView;
}) {
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
      {activeView === "job" && selectedJobId !== null && (
        <JobDetails selectedJobId={selectedJobId} onDataUpdate={onDataUpdate} />
      )}

      {activeView === "settings" && (
        <SettingsDetails selectedSettings={selectedSettings} />
      )}
    </div>
  );
}
