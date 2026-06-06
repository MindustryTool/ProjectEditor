import { HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { ThemeProvider } from "#/components/ThemeProvider";
import { Toaster } from "~/components/ui/sonner";
import i18n from "#/i18n/i18n";
import { PostHogProvider } from "@posthog/react";

import appCss from "#/styles.css?url";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
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

const queryClient = new QueryClient();

function RootDocument({ children }: { children: React.ReactNode }) {
	const lang = i18n.language?.startsWith("vi") ? "vi" : "en";
	return (
		<html lang={lang} suppressHydrationWarning>
			<head>
				<HeadContent />
				<script crossOrigin="anonymous" src="//unpkg.com/react-scan/dist/auto.global.js"></script>
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
						<NuqsAdapter>
							<QueryClientProvider client={queryClient}>
								<ThemeProvider defaultTheme="system" storageKey="theme">
									{children}
								</ThemeProvider>
							</QueryClientProvider>
						</NuqsAdapter>
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
