import { memo } from "react";
import { ProjectPickerScreen } from "./ProjectPickerScreen";

export const NoProjectScreen = memo(function NoProjectScreen() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background text-foreground">
      <ProjectPickerScreen />
    </div>
  );
});
