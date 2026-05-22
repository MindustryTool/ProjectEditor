import { createFileRoute, redirect } from "@tanstack/react-router";
import { getDetectedLocale } from "../lib/locales";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		const detected = getDetectedLocale();
		throw redirect({ href: `/${detected}`, replace: true });
	},
	component: () => null,
});
