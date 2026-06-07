import { getDetectedLocale, isSupportedLocale, setLocale } from "#/lib/locales";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang")({
	loader: async ({ params, location }) => {
		if (!isSupportedLocale(params.lang)) {
			const detected = getDetectedLocale();
			throw redirect({ href: `/${detected}${location.pathname}`, replace: true });
		}

		setLocale(params.lang);
	},
	component: LayoutComponent,
});

function LayoutComponent() {
	return <Outlet />;
}
