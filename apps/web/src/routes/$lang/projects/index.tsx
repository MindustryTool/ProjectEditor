import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ProjectsPage } from "#/components/editor/ProjectsPage";


export const Route = createFileRoute("/$lang/projects/")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { lang } = useParams({ from: "/$lang/projects/" });

	return (
		<ProjectsPage
			onProjectSelected={(id, path) => {
				navigate({ to: `/${lang}/projects/${id}`, replace: true, search: { path } });
			}}
		/>
	);
}
