import { createFileRoute } from "@tanstack/react-router";
import { EditorPage } from "#/components/editor";

export const Route = createFileRoute("/$lang/projects/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	return <EditorPage />;
}
