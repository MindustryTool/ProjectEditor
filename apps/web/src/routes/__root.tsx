import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { ThemeProvider } from "#/components/ThemeProvider";
import { Toaster } from "#/components/ui/sonner";
import i18n from "#/i18n/i18n";
import { PostHogProvider } from "@posthog/react";

import appCss from "#/styles.css?url";
import { createRootRoute } from "@tanstack/react-router";

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
		links: [
			{ rel: "stylesheet", href: appCss },
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const lang = i18n.language?.startsWith("vi") ? "vi" : "en";

	return (
		<html lang={lang} suppressHydrationWarning>
			<head>
				<HeadContent />
				{process.env.NODE_ENV === "development" && (
					<script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js"></script>
				)}
			</head>
			<body className="flex min-h-screen flex-col font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
				<main className="flex flex-1 flex-col">
					<PostHogProvider
						apiKey={"phc_pErvtJqBMrt9QtSCztsLPdUhmaKnz6UEjNCRSYJR3o7Y"}
						options={{
							api_host: "https://eu.i.posthog.com",
							defaults: "2026-01-30",
						}}
					>
						<ThemeProvider defaultTheme="system" storageKey="theme">
							{children}
						</ThemeProvider>
					</PostHogProvider>
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
