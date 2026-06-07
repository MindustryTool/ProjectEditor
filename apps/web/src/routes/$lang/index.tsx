import { createFileRoute, Link } from "@tanstack/react-router";
import ThemeToggle from "#/components/ThemeToggle";
import { LocalePicker } from "#/components/LocalePicker";
import i18n from "#/i18n/i18n";
import { useTranslation } from "react-i18next";
import {
	Package,
	FileCode2,
	Image,
	Languages,
	FileJson,
	FolderOpen,
	FileArchive,
	Clock,
	Box,
	Palette,
	Layout,
	FileCheck,
	FilePen,
	Grid2x2,
	ListTree,
	FormInput,
	Paintbrush,
	Upload,
	AlertCircle,
	Bug,
	GitBranch,
	Monitor,
	WrapText,
	ArrowRight,
	Wrench,
	Blocks,
	Sparkles,
	ShieldCheck,
	Workflow,
} from "lucide-react";

export const Route = createFileRoute("/$lang/")({
	component: HomePage,
});

const lang = () => (i18n.language?.startsWith("vi") ? "vi" : "en");

const featureGroups = [
	{
		title: "Visual Content Editor",
		icon: FormInput,
		tag: "forms",
		items: [
			{ label: "Schema-driven form editor", icon: FormInput },
			{ label: "Mod metadata form (mod.hjson)", icon: FilePen },
			{ label: "Array & object field editors", icon: Grid2x2 },
			{ label: "Color picker with preview swatch", icon: Paintbrush },
			{ label: "Sprite picker with upload & replace", icon: Upload },
			{ label: "Content grid with sprite previews", icon: Image },
		],
	},
	{
		title: "Code Editor",
		icon: FileCode2,
		tag: "code",
		items: [
			{ label: "Monaco-based code editor", icon: FileCode2 },
			{ label: "HJSON / JSON syntax highlighting", icon: FileJson },
			{ label: "Mindustry color tag support", icon: Palette },
			{ label: "Inline validation markers", icon: AlertCircle },
			{ label: "Lazy-loaded for fast startup", icon: Clock },
		],
	},
	{
		title: "File Explorer",
		icon: ListTree,
		tag: "files",
		items: [
			{ label: "Collapsible directory tree", icon: ListTree },
			{ label: "Validation badges & status dots", icon: Bug },
			{ label: "Create, rename & delete files", icon: FilePen },
			{ label: "Recently opened files bar (tabs)", icon: FolderOpen },
			{ label: "Extensible file tree root node", icon: GitBranch },
		],
	},
	{
		title: "Validation & Quality",
		icon: ShieldCheck,
		tag: "quality",
		items: [
			{ label: "Real-time validation via web workers", icon: FileCheck },
			{ label: "Per-file error & warning badges", icon: AlertCircle },
			{ label: "Inline markers in Monaco editor", icon: FileCode2 },
			{ label: "Pre-export validation gate", icon: FileArchive },
			{ label: "Clickable error navigation", icon: Bug },
		],
	},
	{
		title: "Project Management",
		icon: Package,
		tag: "project",
		items: [
			{ label: "Create, open, close & switch projects", icon: FolderOpen },
			{ label: "Import / export ZIP with validation", icon: FileArchive },
			{ label: "Project settings & delete project", icon: FilePen },
			{ label: "Auto-save & session recovery", icon: Clock },
			{ label: "OPFS-based local filesystem", icon: WrapText },
		],
	},
	{
		title: "Offline & Cross-platform",
		icon: Monitor,
		tag: "platform",
		items: [
			{ label: "Installable PWA (offline-first)", icon: Box },
			{ label: "Theme switching: Light, Dark & Auto", icon: Monitor },
			{ label: "i18n: English & Vietnamese", icon: Languages },
			{ label: "Resizable three-column layout", icon: Layout },
			{ label: "Status bar with live project info", icon: WrapText },
		],
	},
];

const iconIndex: Record<string, typeof Package> = {
	Package,
	FileCode2,
	Image,
	Languages,
	FileJson,
	FolderOpen,
	FileArchive,
	Clock,
	Box,
	Palette,
	Layout,
	FileCheck,
	FilePen,
	Grid2x2,
	ListTree,
	FormInput,
	Paintbrush,
	Upload,
	AlertCircle,
	Bug,
	GitBranch,
	Monitor,
	WrapText,
	ArrowRight,
	Wrench,
	Blocks,
	Sparkles,
	ShieldCheck,
	Workflow,
};

function HomePage() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-1 flex-col">
			<SiteNav />
			<Hero />
			<Features />
			<CTA />
			<SiteFooter />
		</div>
	);
}

function SiteNav() {
	const { t } = useTranslation();

	return (
		<header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 px-4 backdrop-blur-xl">
			<nav className="mx-auto flex max-w-6xl items-center gap-3 py-3 sm:py-3.5">
				<Link
					to="/$lang"
					params={{ lang: lang() }}
					className="mr-2 inline-flex items-center gap-2 rounded-lg border border-border/60 px-2.5 py-1 text-sm font-semibold text-foreground no-underline shadow-xs sm:px-3"
				>
					<Wrench className="h-3.5 w-3.5 text-amber-500" />
					<span className="font-['Fraunces']">{t("app.title")}</span>
				</Link>

				<Link
					to="/$lang"
					params={{ lang: lang() }}
					className="text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
				>
					Home
				</Link>
				<Link
					to="/$lang/projects"
					params={{ lang: lang() }}
					className="text-sm font-medium text-muted-foreground no-underline transition-colors hover:text-foreground"
				>
					Projects
				</Link>

				<div className="ml-auto flex items-center gap-1.5">
					<LocalePicker />
					<ThemeToggle />
				</div>
			</nav>
		</header>
	);
}

function Hero() {
	const { t } = useTranslation();

	return (
		<section className="relative overflow-hidden px-4">
			<div className="pointer-events-none absolute inset-0 select-none">
				<div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
				<div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-sky-500/5 blur-3xl" />
			</div>

			<div className="mx-auto max-w-6xl pb-8 pt-14 sm:pb-14 sm:pt-20">
				<div className="max-w-3xl">
					<div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3.5 py-1 text-xs font-medium text-amber-500">
						<Sparkles className="h-3 w-3" />
						Mindustry Mod Development Environment
					</div>

					<h1
						className="mb-4 text-5xl leading-[1.05] font-bold tracking-tight text-foreground sm:text-7xl"
						style={{ fontFamily: "Fraunces, serif" }}
					>
						Build Mindustry
						<br />
						<span className="bg-linear-to-r from-amber-500 to-amber-400 bg-clip-text text-transparent">Mods in the Browser</span>
					</h1>

					<p className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
						A full-featured offline editor for Mindustry mods. Edit content with schema-driven forms and a Monaco code editor, manage
						assets with a sprite picker, validate in real-time, and export your mod — no server required.
					</p>

					<div className="flex flex-wrap items-center gap-3">
						<Link
							to="/$lang/projects"
							params={{ lang: lang() }}
							className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-amber-950 no-underline shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/30 active:scale-[0.97]"
						>
							<Package className="h-4 w-4" />
							New Project
						</Link>
						<Link
							to="/$lang/projects"
							params={{ lang: lang() }}
							className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-foreground no-underline transition-all hover:bg-accent active:scale-[0.97]"
						>
							Browse Projects
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}

function Features() {
	return (
		<section className="px-4 py-8 sm:py-12">
			<div className="mx-auto max-w-6xl">
				<div className="mb-10 text-center">
					<h2
						className="mb-3 text-3xl font-bold text-foreground sm:text-4xl"
						style={{ fontFamily: "Fraunces, serif" }}
					>
						Everything you need to mod
					</h2>
					<p className="text-muted-foreground">
						Six toolkits, one offline editor. Pick what you need.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{featureGroups.map((group) => (
						<FeatureCard key={group.title} group={group} />
					))}
				</div>
			</div>
		</section>
	);
}

function FeatureCard({ group }: { group: (typeof featureGroups)[number] }) {
	const Icon = group.icon;

	return (
		<div className="group/card rounded-2xl border border-border/50 bg-card p-5 transition-all hover:border-amber-500/30 hover:shadow-md hover:shadow-amber-500/5">
			<div className="mb-4 flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
					<Icon className="h-4.5 w-4.5" />
				</div>
				<div>
					<h3 className="m-0 text-sm font-bold text-foreground">{group.title}</h3>
					<p className="m-0 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/50">
						{group.tag}
					</p>
				</div>
			</div>

			<ul className="m-0 flex flex-col gap-1.5">
				{group.items.map((item) => {
					const ItemIcon = iconIndex[item.icon.name as string] ?? item.icon;
					return (
						<li key={item.label} className="flex items-center gap-2.5 text-sm text-muted-foreground">
							<span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-secondary text-[10px] text-foreground/40">
								<ItemIcon className="h-3 w-3" />
							</span>
							{item.label}
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function CTA() {
	return (
		<section className="px-4 py-12 sm:py-16">
			<div className="mx-auto max-w-6xl">
				<div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card px-6 py-10 text-center sm:px-12 sm:py-14">
					<div className="pointer-events-none absolute inset-0 select-none">
						<div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
						<div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
					</div>

					<div className="relative">
						<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
							<Workflow className="h-3 w-3" />
							Ready to build?
						</div>
						<h2
							className="mb-3 text-3xl font-bold text-foreground sm:text-4xl"
							style={{ fontFamily: "Fraunces, serif" }}
						>
							Start building your mod
						</h2>
						<p className="mb-7 text-muted-foreground">
							No sign-up, no server, no fuss. Everything runs locally in your browser.
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							<Link
								to="/$lang/projects"
								params={{ lang: lang() }}
								className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-amber-950 no-underline shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/30 active:scale-[0.97]"
							>
								<Blocks className="h-4 w-4" />
								Browse All Projects
							</Link>
							<Link
								to="/$lang/projects"
								params={{ lang: lang() }}
								className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-foreground no-underline transition-all hover:bg-accent active:scale-[0.97]"
							>
								<FolderOpen className="h-4 w-4" />
								Open Existing
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function SiteFooter() {
	return (
		<footer className="border-t border-border/40 px-4 pb-12 pt-8 text-foreground sm:pb-16">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
				<div className="flex items-center gap-2">
					<Wrench className="h-4 w-4 text-amber-500" />
					<p className="m-0 text-sm text-muted-foreground">
						Project Editor &mdash; Mindustry Mod Editor
					</p>
				</div>
				<p className="m-0 text-xs text-muted-foreground/60">
					Fully offline &middot; No server &middot; PWA ready
				</p>
			</div>
		</footer>
	);
}
