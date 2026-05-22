import { Button } from "@project/ui";
import { useProjectStore } from "@project/state";

export function App() {
  const currentProject = useProjectStore((s) => s.currentProject);
  const createNewProject = useProjectStore((s) => s.createNewProject);

  return (
    <main>
      <h1>Project Editor App</h1>
      <p>App version</p>
      <Button onClick={() => createNewProject("Untitled")}>
        New Project
      </Button>
      {currentProject && (
        <p>Current project: {currentProject.name}</p>
      )}
    </main>
  );
}
