import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { ProjectLanguage } from "@project/core";
import { importProject, createProjectInfo, createEventBus } from "@project/core";
import type { ProjectEventMap } from "@project/core";
import { createProjectFileSystem } from "@project/fs";
import { TreeSnapshot, useAppStore, useProjectSession } from "@project/state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FolderOpen, Plus, Settings, Upload } from "lucide-react";
import { toast } from "sonner";
import { useProjectActions } from "./use-project-actions";
import { Separator } from "#/components/ui/separator";
import { ProjectSettingsDialog } from "~/components/editor/toolbar/ProjectSettingsDialog";
import { LANGUAGE_OPTIONS, LanguageBadge } from "./LanguageBadge";
import { Spinner } from "#/components/ui/spinner";

interface ProjectPickerScreenProps {
	onProjectSelected?: (id: string) => void;
}

function CreateProjectSection({ onProjectSelected }: { onProjectSelected: (id: string) => void }) {
	const { t } = useTranslation();
	const { createProject } = useProjectActions();
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
			const id = await createProject(trimmed, language);
			toast.success("Project created successfully");
			setName("");
			setLanguage("json");
			setNameError("");
			if (id) onProjectSelected(id);
		} catch (e) {
			toast.error(`Failed to create project ${e}`);
		}
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex gap-2 flex-col">
				<label className="text-xs font-medium text-muted-foreground">{t("projectPickerScreen.name")}</label>
				<Input
					placeholder={t("projectPickerScreen.namePlaceholder")}
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
				<label className="text-xs font-medium text-muted-foreground">{t("projectPickerScreen.language")}</label>
				<Select value={language} onValueChange={(v: ProjectLanguage) => setLanguage(v)}>
					<SelectTrigger className="h-7 w-32 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{LANGUAGE_OPTIONS.map((opt) => (
							<SelectItem key={opt.value} value={opt.value} className="text-xs">
								{opt.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Button onClick={handleCreate}>{t("projectPickerScreen.create")}</Button>
		</div>
	);
}

function ImportProjectSection({ onImported }: { onImported: (id: string) => void }) {
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
			const result = await importProject(new Uint8Array(buffer));
			const project = createProjectInfo(result.name, result.language);

			await useAppStore.getState().saveProject({
				id: project.id,
				name: project.name,
				language: project.language,
				createdAt: project.createdAt,
				updatedAt: project.updatedAt,
			});

			const events = createEventBus<ProjectEventMap>();
			const fs = await createProjectFileSystem(project, events, {
				onTreeSnapshotChange: (snapshot) => useProjectSession.setState({ treeSnapshot: new TreeSnapshot(snapshot) }),
			});

			const unsubscribe = events.on("file:changed", (path) => {
				if (path.kind === "write") {
					setPaths((prev) => [...prev, path.path]);
				}
			});

			await fs.writeFiles(result.entries);

			unsubscribe();

			useProjectSession.getState().setCurrentProject({ project, fs, events });

			toast.success(`Project imported successfully`);
			onImported(project.id);
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
			<p className="text-xs text-muted-foreground">{t("projectPickerScreen.importDescription")}</p>
			<input ref={fileInputRef} type="file" accept=".zip" className="hidden" onChange={handleFileSelected} />
			<Button onClick={() => fileInputRef.current?.click()} disabled={importing}>
				{importing ? <Spinner /> : t("projectPickerScreen.selectZip")}
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
					{t("projectPickerScreen.createNew")}
				</TabsTrigger>
				<TabsTrigger value="import" className="flex-1">
					<Upload className="size-4" />
					{t("projectPickerScreen.importProject")}
				</TabsTrigger>
			</TabsList>
			<TabsContent value="create" className="m-0 p-4">
				<CreateProjectSection onProjectSelected={onProjectSelected} />
			</TabsContent>
			<TabsContent value="import" className="m-0 p-4">
				<ImportProjectSection onImported={onProjectSelected} />
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
				{t("projectPickerScreen.recentProjects")}
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
	const handleCreated = onProjectSelected ?? (() => {});

	return (
		<div className="flex flex-1 items-center justify-center bg-background">
			<div className="w-full max-w-md space-y-4 px-4">
				<div className="space-y-2 text-center">
					<h1 className="text-xl font-medium text-foreground">{t("app.title")}</h1>
					<p className="text-xs text-muted-foreground">{t("projectPickerScreen.description")}</p>
				</div>
				<ProjectActionsSection onProjectSelected={handleCreated} />
				<Separator />
				<ProjectListSection onProjectSelected={handleCreated} />
			</div>
		</div>
	);
}
