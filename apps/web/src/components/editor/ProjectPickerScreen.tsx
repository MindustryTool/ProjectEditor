import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import type { ProjectLanguage } from "@project/core";
import { useAppStore } from "@project/core";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { FolderOpen, Plus, Settings, Upload } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "#/components/ui/separator";
import { ProjectSettingsDialog } from "#/components/editor/toolbar/ProjectSettingsDialog";
import { LANGUAGE_OPTIONS, LanguageBadge } from "./LanguageBadge";
import { Spinner } from "#/components/ui/spinner";
import { README } from "#/components/editor/example/readme";
import { icon } from "#/components/editor/example/icon";

interface ProjectPickerScreenProps {
	onProjectSelected: (id: string) => void;
}

function CreateProjectSection({ onProjectSelected }: { onProjectSelected: (id: string) => void }) {
	const { t } = useTranslation();
	const createProject = useAppStore((s) => s.createNewProject);
	const [name, setName] = useState("");
	const [language, setLanguage] = useState<ProjectLanguage>("json");
	const [nameError, setNameError] = useState("");

	async function handleCreate() {
		const trimmed = name.trim();
		if (!trimmed) {
			setNameError("Name is required");
			return;
		}
		try {
			const context = await createProject(trimmed, language);

			try {
				await context.fs.writeJsonFile("/mod.hjson", {
					displayName: "[cyan]Example",
					name: "example",
					author: "[blue]Your name",
					description: "A mod that adds in a butt load of content",
					minGameVersion: "158",
					version: "[#00ff00]1.0.0",
				});

				await context.fs.writeJsonFile("/content/items/test-item.hjson", {
                    name: 'test-item',
					hardness: 8,
					cost: 7,
					charge: 0.9,
					color: "FFF861FF",
					research: {
						parent: "copper",
						requirements: ["copper/200"],
					},
				});

				await context.fs.writeTextFile("/README.md", README);
				await context.fs.writeFile("/icon.png", Buffer.from(icon, "base64"));
			} catch (e) {
				toast.error(`Failed to create project ${e}`);
			}

			toast.success("Project created successfully");

			setName("");
			setLanguage("json");
			setNameError("");

			onProjectSelected(context.project.id);
		} catch (e) {
			toast.error(`Failed to create project ${e}`);
		}
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-2 flex-col">
				<label className="text-xs font-medium text-muted-foreground">{t("project-picker-screen.name")}</label>
				<Input
					className="w-full text-sm"
					placeholder={t("project-picker-screen.name-placeholder")}
					value={name}
					onChange={(e) => {
						setName(e.target.value);
						setNameError("");
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleCreate();
					}}
				/>
			</div>
			{nameError && <p className="text-xs text-destructive">{nameError}</p>}
			<div className="flex flex-col gap-2">
				<label className="text-xs font-medium text-muted-foreground">{t("project-picker-screen.language")}</label>
				<Select value={language} onValueChange={(v: ProjectLanguage) => setLanguage(v)}>
					<SelectTrigger className="h-7 w-32 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{LANGUAGE_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value} className="text-xs" disabled={opt.value !== "json"}>
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Button onClick={handleCreate}>{t("project-picker-screen.create")}</Button>
		</div>
	);
}

function ImportProjectSection({ onProjectSelected }: { onProjectSelected: (id: string) => void }) {
	const { t } = useTranslation();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [importing, setImporting] = useState(false);
	const [paths, setPaths] = useState<string[]>([]);
	const listRef = useRef<HTMLDivElement>(null);

	async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setImporting(true);
		setPaths([]);

		try {
			const buffer = await file.arrayBuffer();
			const project = await useAppStore.getState().importProject(buffer, (path) => {
				setPaths((prev) => [...prev, path]);
			});

			toast.success(`Project imported successfully`);
			onProjectSelected(project.id);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to import project");
		}
		setImporting(false);
		e.target.value = "";
	}

	useEffect(() => {
		if (listRef.current) {
			listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
		}
	}, [paths]);

	return (
		<div className="flex flex-col gap-3">
			<p className="text-xs text-muted-foreground">{t("project-picker-screen.import-description")}</p>
			<input ref={fileInputRef} type="file" accept=".zip" className="hidden" onChange={handleFileSelected} />
			<Button onClick={() => fileInputRef.current?.click()} disabled={importing}>
				{importing ? <Spinner /> : t("project-picker-screen.select-zip")}
			</Button>
			{importing && paths.length > 0 && (
				<div className="grid gap-1 p-2 rounded-md border max-h-[200px] overflow-y-auto" ref={listRef}>
					{paths.map((path, index) => (
						<div key={path} className="text-xs text-muted-foreground">
							{`${index + 1}. ${path}`}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function ProjectActionsSection({ onProjectSelected }: { onProjectSelected: (id: string) => void }) {
	const { t } = useTranslation();

	return (
		<Tabs defaultValue="create" className="rounded-lg border bg-card">
			<TabsList className="w-full">
				<TabsTrigger value="create" className="flex-1">
					<Plus className="size-4" />
					{t("project-picker-screen.create-new")}
				</TabsTrigger>
				<TabsTrigger value="import" className="flex-1">
					<Upload className="size-4" />
					{t("project-picker-screen.import-project")}
				</TabsTrigger>
			</TabsList>
			<TabsContent value="create" className="m-0 p-4">
				<CreateProjectSection onProjectSelected={onProjectSelected} />
			</TabsContent>
			<TabsContent value="import" className="m-0 p-4">
				<ImportProjectSection onProjectSelected={onProjectSelected} />
			</TabsContent>
		</Tabs>
	);
}

function ProjectListSection({ onProjectSelected }: { onProjectSelected: (id: string) => void }) {
	const { t } = useTranslation();
	const projects = useAppStore((s) => s.projects);

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-2 text-sm font-medium text-foreground">
				<FolderOpen className="h-4 w-4" />
				{t("project-picker-screen.recent-projects")}
			</div>
			<div className="space-y-1">
				{Object.values(projects).map((project) => (
					<div key={project.id} className="relative rounded-md border bg-card px-3 py-2 transition-colors hover:bg-accent">
						<button
							type="button"
							className="w-full text-left text-xs"
							onClick={() => {
								onProjectSelected(project.id);
							}}
						>
							<div className="flex items-center gap-2 font-medium text-foreground">
								{project.name}
								<LanguageBadge language={project.language} />
							</div>
							<div className="text-muted-foreground">{new Date(project.updatedAt).toLocaleDateString()}</div>
						</button>
						<ProjectSettingsDialog
							project={project}
							trigger={
								<Button className="absolute right-2 top-2" variant="ghost" size="icon">
									<Settings className="size-3.5" />
								</Button>
							}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export function ProjectPickerScreen({ onProjectSelected }: ProjectPickerScreenProps) {
	const { t } = useTranslation();

	return (
		<div className="flex flex-1 items-center justify-center bg-background">
			<div className="w-full max-w-md space-y-4 px-4">
				<div className="space-y-2 text-center">
					<h1 className="text-xl font-medium text-foreground">{t("app.title")}</h1>
					<p className="text-xs text-muted-foreground">{t("project-picker-screen.description")}</p>
				</div>
				<ProjectActionsSection onProjectSelected={onProjectSelected} />
				<Separator />
				<ProjectListSection onProjectSelected={onProjectSelected} />
			</div>
		</div>
	);
}
