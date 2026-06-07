import { initI18n } from "#/i18n/i18n";
import { getDetectedLocale, isSupportedLocale, setLocale } from "#/lib/locales";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang")({
	loader: async ({ params, location }) => {
        console.warn("loader", params.lang);
		if (!isSupportedLocale(params.lang)) {
			const detected = getDetectedLocale();
			throw redirect({ href: `/${detected}${location.pathname}`, replace: true });
		}

		await initI18n();
		setLocale(params.lang);
	},
	component: LayoutComponent,
});

function LayoutComponent() {
	return <Outlet />;
}
