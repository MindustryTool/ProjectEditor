import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import i18n from "../i18n/i18n";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{
				name: "description",
				content:
					"Offline Mindustry mod editor — edit metadata, manage assets, build logic graphs, and pack your mod from your browser.",
			},
			{ title: "Project Editor — Mindustry Mod Editor" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const lang = i18n.language?.startsWith("vi") ? "vi" : "en";
	return (
		<html lang={lang} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="flex min-h-screen flex-col font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
				<main className="flex flex-1 flex-col">
					<NuqsAdapter>
						<ThemeProvider defaultTheme="system" storageKey="theme">
							{children}
						</ThemeProvider>
					</NuqsAdapter>
				</main>
				<Toaster />
				<TanStackDevtools
					config={{ position: "bottom-right" }}
					plugins={[{ name: "Tanstack Router", render: <TanStackRouterDevtoolsPanel /> }]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
