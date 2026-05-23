import { memo } from "react";
import { ProjectPickerScreen } from "./ProjectPickerScreen";
import type { ProjectRecord } from "@project/storage";

interface NoProjectScreenProps {
  onCreateProject: (name: string) => void;
  onOpenProject: (record: ProjectRecord) => void;
}

export const NoProjectScreen = memo(function NoProjectScreen({
  onCreateProject,
  onOpenProject,
}: NoProjectScreenProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
      <ProjectPickerScreen
        onCreateProject={onCreateProject}
        onOpenProject={onOpenProject}
      />
    </div>
  );
});
