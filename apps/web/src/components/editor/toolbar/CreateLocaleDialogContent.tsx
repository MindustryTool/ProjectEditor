import { useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useProjectSession, SUPPORTED_LOCALES, isBundleFilename, getLocaleFromFilename, parseBundle } from "@project/core";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { FLAG_MAP } from "@project/core";
import { FileIcon } from "#/components/editor/FileIcon";

interface CreateLocaleDialogContentProps {
	onClose: () => void;
}

export function CreateLocaleDialogContent({ onClose }: CreateLocaleDialogContentProps) {
	const { t } = useTranslation();
	const projectContext = useProjectSession((s) => s.projectContext);
	const treeSnapshot = useProjectSession((s) => s.treeSnapshot);

	const [selectedLocale, setSelectedLocale] = useState("");
	const [selectedSource, setSelectedSource] = useState("");

	const existingLocales = useMemo(() => {
		const locales = new Set<string>();
		const entries = treeSnapshot.getEntries();
		for (const entry of entries) {
			if (entry.kind === "file" && entry.path.startsWith("bundles/") && isBundleFilename(entry.name)) {
				const locale = getLocaleFromFilename(entry.name);
				if (locale) locales.add(locale);
			}
		}
		return locales;
	}, [treeSnapshot]);

	const availableLocales = useMemo(() => {
		return Object.entries(SUPPORTED_LOCALES).filter(([code]) => !existingLocales.has(code));
	}, [existingLocales]);

	const availableSourceBundles = useMemo(() => {
		return treeSnapshot.getEntries().filter((e) => e.kind === "file" && e.path.startsWith("bundles/") && isBundleFilename(e.name));
	}, [treeSnapshot]);

	const handleCreate = useCallback(async () => {
		if (!selectedLocale || !projectContext) return;

		let content = "";
		if (selectedSource) {
			const sourceContent = await projectContext.fs.readTextFile(selectedSource);
			const bundleFile = parseBundle(sourceContent);
			const keys = bundleFile.entries
				.filter((e): e is { type: "entry"; key: string; value: string; raw: string } => e.type === "entry" && e.key != null)
				.map((e) => e.key);

			if (keys.length > 0) {
				content = keys.map((key) => `${key} = `).join("\n") + "\n";
			}
		}

		const filename = selectedLocale === "en" ? "bundle.properties" : `bundle_${selectedLocale}.properties`;
		const newPath = `bundles/${filename}`;

		await projectContext.fs.writeTextFile(newPath, content);
		onClose();
	}, [selectedLocale, selectedSource, projectContext, onClose]);

	return (
		<>
			<DialogHeader>
				<DialogTitle>{t("create-locale-dialog.title")}</DialogTitle>
			</DialogHeader>
			<div className="flex flex-col gap-4 py-4">
				<div className="flex flex-col gap-2">
					<label className="text-xs font-medium text-muted-foreground">{t("create-locale-dialog.locale-picker")}</label>
					<Select value={selectedLocale} onValueChange={setSelectedLocale}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={t("create-locale-dialog.locale-picker")} />
						</SelectTrigger>
						<SelectContent>
							{availableLocales.map(([code, name]) => (
								<SelectItem key={code} value={code}>
									{FLAG_MAP[code as keyof typeof FLAG_MAP]} {code} — {name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex flex-col gap-2">
					<label className="text-xs font-medium text-muted-foreground">{t("create-locale-dialog.source-bundle-picker")}</label>
					<Select value={selectedSource} onValueChange={setSelectedSource}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder={t("create-locale-dialog.source-bundle-picker")} />
						</SelectTrigger>
						<SelectContent>
							{availableSourceBundles.map((bundle) => (
								<SelectItem key={bundle.path} value={bundle.path}>
									<FileIcon path={bundle.path} />
									{bundle.path}
								</SelectItem>
							))}
							{availableSourceBundles.length === 0 && (
								<div className="px-2 py-4 text-center text-xs text-muted-foreground">No bundle files found</div>
							)}
						</SelectContent>
					</Select>
				</div>
			</div>
			<DialogFooter>
				<Button variant="outline" onClick={onClose}>
					{t("create-locale-dialog.cancel")}
				</Button>
				<Button onClick={handleCreate} disabled={!selectedLocale}>
					{t("create-locale-dialog.create")}
				</Button>
			</DialogFooter>
		</>
	);
}
