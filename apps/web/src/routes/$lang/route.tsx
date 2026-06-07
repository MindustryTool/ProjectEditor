import { initI18n } from "#/i18n/i18n";
import { isSupportedLocale, setLocale } from "#/lib/locales";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$lang")({
	loader: async ({ params }) => {
		if (!isSupportedLocale(params.lang)) {
			throw redirect({ href: "/en", replace: true });
		}

		await initI18n();
		setLocale(params.lang);
	},
	component: LayoutComponent,
});

function LayoutComponent() {
	return <Outlet />;
}
