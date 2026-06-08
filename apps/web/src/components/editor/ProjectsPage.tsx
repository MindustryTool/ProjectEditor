import { memo } from "react";
import { ProjectPickerScreen } from "./ProjectPickerScreen";

interface ProjectsPageProps {
	onProjectSelected: (id: string) => void;
}

export const ProjectsPage = memo(function ProjectsPage({ onProjectSelected }: ProjectsPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
      <ProjectPickerScreen onProjectSelected={onProjectSelected} />
    </div>
  );
});
