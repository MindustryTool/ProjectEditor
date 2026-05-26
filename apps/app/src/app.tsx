import { Button } from "./components";
import { useAppStore, useProjectSession } from "@project/state";

export function App() {
  const projectContext = useProjectSession((s) => s.projectContext);
  const createNewProject = useAppStore((s) => s.createNewProject);

  return (
    <main>
      <h1>Project Editor App</h1>
      <p>App version</p>
      <Button onClick={() => createNewProject("Untitled")}>
        New Project
      </Button>
      {projectContext && (
        <p>Current project: {projectContext.project.name}</p>
      )}
    </main>
  );
}
