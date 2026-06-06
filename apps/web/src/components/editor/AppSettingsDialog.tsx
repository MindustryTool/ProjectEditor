import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "#/components/ThemeProvider";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Slider } from "#/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "#/components/ui/toggle-group";
import { useIsDesktop } from "#/hooks/use-is-desktop";
import { useAppStore } from "@project/core";
import { Code2, Gauge, Layout, Monitor, Moon, Settings, Sun } from "lucide-react";

const FONT_SIZE_MIN = 8;
const FONT_SIZE_MAX = 32;
const PADDING_MIN = 0;
const PADDING_MAX = 32;
const TAB_SIZE_OPTIONS = [1, 2, 4, 6] as const;
const VALIDATION_DELAY_MIN = 100;
const VALIDATION_DELAY_MAX = 5000;
const VALIDATION_DELAY_STEP = 100;

type AppTheme = "light" | "dark" | "system";

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function getSliderPercentage(value: number, min: number, max: number) {
	return ((value - min) / (max - min)) * 100;
}

function SectionCard({
	icon,
	title,
	rightContent,
	children,
}: {
	icon: ReactNode;
	title: string;
	rightContent?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section className="grid gap-4 rounded-lg border p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="flex h-6 items-center justify-center rounded-md text-muted-foreground">{icon}</div>
					<h3 className="text-sm font-semibold">{title}</h3>
				</div>
				{rightContent}
			</div>
			{children}
		</section>
	);
}

export function AppSettingsDialog() {
	const settings = useAppStore((s) => s.settings);
	const updateSettings = useAppStore((s) => s.updateSettings);
	const { theme, setTheme } = useTheme();
	const [isDesktop, setIsDesktop] = useIsDesktop();
	const { t } = useTranslation();

	function handleThemeChange(nextTheme: string) {
		const value = nextTheme as AppTheme;
		setTheme(value);
		updateSettings({ theme: value });
	}

	function handleFontSizeChange(nextFontSize: number) {
		updateSettings({ fontSize: clamp(nextFontSize, FONT_SIZE_MIN, FONT_SIZE_MAX) });
	}

	function handleFontSizeInput(value: string) {
		const nextFontSize = Number(value);
		if (Number.isNaN(nextFontSize)) return;
		handleFontSizeChange(nextFontSize);
	}

	function handlePaddingChange(nextPadding: number) {
		updateSettings({ padding: clamp(nextPadding, PADDING_MIN, PADDING_MAX) });
	}

	function handleTabSizeChange(nextTabSize: string) {
		updateSettings({ tabSize: Number(nextTabSize) });
	}

	function handleValidationDelayChange(nextDelay: number) {
		updateSettings({
			validation: {
				...settings.validation,
				validationDelayMs: clamp(nextDelay, VALIDATION_DELAY_MIN, VALIDATION_DELAY_MAX),
			},
		});
	}

	function handleUIChange(nextUI: string) {
		setIsDesktop(nextUI === "desktop");
	}

	const ui = isDesktop ? "desktop" : "mobile";
	const fontSizePct = getSliderPercentage(settings.fontSize, FONT_SIZE_MIN, FONT_SIZE_MAX);
	const paddingPct = getSliderPercentage(settings.padding, PADDING_MIN, PADDING_MAX);
	const delayPct = getSliderPercentage(settings.validation.validationDelayMs, VALIDATION_DELAY_MIN, VALIDATION_DELAY_MAX);

	return (
		<Dialog defaultOpen={settings.firstTime} onOpenChange={() => updateSettings({ firstTime: false })}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon-sm" aria-label="Open app settings">
					<Settings />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>{t("app-settings.dialog-title")}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-5 max-h-[70dvh] overflow-y-auto">
					<SectionCard icon={<Layout className="size-3.5" />} title={t("app-settings.interface-section")}>
						<div className="grid gap-3">
							<div className="grid gap-2">
								<p className="text-sm text-muted-foreground">{t("app-settings.interface-description")}</p>
								<ToggleGroup
									type="single"
									value={ui}
									onValueChange={handleUIChange}
									className="w-full"
									spacing={0}
									variant="outline"
								>
									<ToggleGroupItem
										value="mobile"
										className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary"
									>
										{t("app-settings.ui-mobile")}
									</ToggleGroupItem>
									<ToggleGroupItem
										value="desktop"
										className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary"
									>
										{t("app-settings.ui-desktop")}
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
							<div className="grid gap-2">
								<Label className="text-xs font-medium">{t("app-settings.theme-label")}</Label>
								<p className="text-xs text-muted-foreground">{t("app-settings.theme-description")}</p>
								<ToggleGroup
									type="single"
									value={theme}
									onValueChange={handleThemeChange}
									className="w-full"
									spacing={0}
									variant="outline"
								>
									<ToggleGroupItem
										value="light"
										className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary"
									>
										<Sun className="size-3.5" /> {t("app-settings.theme-light")}
									</ToggleGroupItem>
									<ToggleGroupItem
										value="dark"
										className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary"
									>
										<Moon className="size-3.5" /> {t("app-settings.theme-dark")}
									</ToggleGroupItem>
									<ToggleGroupItem
										value="system"
										className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary"
									>
										<Monitor className="size-3.5" /> {t("app-settings.theme-system")}
									</ToggleGroupItem>
								</ToggleGroup>
							</div>
						</div>
					</SectionCard>

					<SectionCard icon={<Code2 className="size-3.5" />} title={t("app-settings.editor-section")}>
						<div className="grid gap-4">
							<div className="grid gap-2">
								<div className="flex items-start justify-between gap-3">
									<div className="grid gap-1">
										<Label htmlFor="font-size-input">{t("app-settings.font-size-label")}</Label>
										<p className="text-sm text-muted-foreground">{t("app-settings.font-size-description")}</p>
									</div>
									<Input
										id="font-size-input"
										type="number"
										min={FONT_SIZE_MIN}
										max={FONT_SIZE_MAX}
										value={settings.fontSize}
										onChange={(event) => handleFontSizeInput(event.target.value)}
										className="w-20"
									/>
								</div>
								<div className="relative pt-1">
									<div className="flex items-center gap-2">
										<span className="select-none text-xs font-semibold text-muted-foreground" style={{ fontSize: "11px" }}>
											A
										</span>
										<div className="relative flex-1">
											<Slider
												value={[settings.fontSize]}
												min={FONT_SIZE_MIN}
												max={FONT_SIZE_MAX}
												step={1}
												onValueChange={([value]) => value && handleFontSizeChange(value)}
											/>
											<div
												className="pointer-events-none absolute -top-1 z-10 -translate-y-1/2"
												style={{ left: `${fontSizePct}%`, transform: "translateX(-50%) translateY(-50%)" }}
											>
												<span className="whitespace-nowrap rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground">
													{settings.fontSize} px
												</span>
											</div>
										</div>
										<span className="select-none text-xs font-semibold text-muted-foreground" style={{ fontSize: "15px" }}>
											A
										</span>
									</div>
								</div>
								<p className="text-xs text-muted-foreground">
									{FONT_SIZE_MIN}-{FONT_SIZE_MAX} px
								</p>
							</div>
							<div className="grid gap-2">
								<div className="grid gap-1">
									<Label htmlFor="padding-input">{t("app-settings.padding-label")}</Label>
									<p className="text-sm text-muted-foreground">{t("app-settings.padding-description")}</p>
								</div>
								<div className="relative pt-1">
									<div className="flex items-center gap-2">
										<div className="relative flex-1">
											<Slider
												value={[settings.padding]}
												min={PADDING_MIN}
												max={PADDING_MAX}
												step={1}
												onValueChange={([value]) => value && handlePaddingChange(value)}
											/>
											<div
												className="pointer-events-none absolute -top-1 z-10 -translate-y-1/2"
												style={{ left: `${paddingPct}%`, transform: "translateX(-50%) translateY(-50%)" }}
											>
												<span className="whitespace-nowrap rounded bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground">
													{settings.padding} px
												</span>
											</div>
										</div>
									</div>
								</div>
								<p className="text-xs text-muted-foreground">
									{PADDING_MIN}-{PADDING_MAX} px
								</p>
							</div>
							<div className="grid gap-2">
								<Label className="text-xs font-medium">{t("app-settings.tab-size-label")}</Label>
								<p className="text-xs text-muted-foreground">{t("app-settings.tab-size-description")}</p>
								<ToggleGroup
									type="single"
									value={String(settings.tabSize)}
									onValueChange={handleTabSizeChange}
									className="w-full"
									spacing={0}
									variant="outline"
								>
									{TAB_SIZE_OPTIONS.map((size) => (
										<ToggleGroupItem
											key={size}
											value={String(size)}
											className="flex-1 data-[state=on]:bg-muted data-[state=on]:text-foreground"
										>
											{size}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
							</div>
						</div>
					</SectionCard>

					<SectionCard
						icon={<Gauge className="size-3.5" />}
						title={t("app-settings.validation-section")}
						rightContent={<span className="text-sm font-medium">{settings.validation.validationDelayMs} ms</span>}
					>
						<div className="grid gap-2">
							<p className="text-sm text-muted-foreground">
								{t("app-settings.validation-description", { min: VALIDATION_DELAY_MIN, max: VALIDATION_DELAY_MAX })}
							</p>
							<div className="relative pt-6 pb-1">
								<Slider
									value={[settings.validation.validationDelayMs]}
									min={VALIDATION_DELAY_MIN}
									max={VALIDATION_DELAY_MAX}
									step={VALIDATION_DELAY_STEP}
									onValueChange={([value]) => value && handleValidationDelayChange(value)}
								/>
								<div
									className="pointer-events-none absolute -top-1 z-10"
									style={{ left: `${delayPct}%`, transform: "translateX(-50%)" }}
								>
									<div className="flex flex-col items-center">
										<span className="whitespace-nowrap rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">
											{settings.validation.validationDelayMs} ms
										</span>
									</div>
								</div>
								<div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
									<span>{VALIDATION_DELAY_MIN} ms</span>
									<span>{VALIDATION_DELAY_MAX} ms</span>
								</div>
							</div>
						</div>
					</SectionCard>
				</div>
			</DialogContent>
		</Dialog>
	);
}
