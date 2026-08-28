import type { DetailViewOptions } from "@/types";
import JobDetails from "./JobDetails";
import Settings from "./Settings";

export default function DetailView({
  activeView,
  selectedJobId,
  onJobClose,
  onDataUpdate,
}: {
  activeView: DetailViewOptions;
  selectedJobId: number | null;
  onJobClose: () => void;
  onDataUpdate: () => void;
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

      {activeView === "settings" && <Settings />}
    </div>
  );
}
