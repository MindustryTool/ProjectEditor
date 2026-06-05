import { useTheme } from "#/components/ThemeProvider";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import { Slider } from "#/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { useIsDesktop } from "#/hooks/use-is-desktop";
import { useAppStore } from "@project/core";
import { Settings } from "lucide-react";

const FONT_SIZE_MIN = 8;
const FONT_SIZE_MAX = 32;
const TAB_SIZE_OPTIONS = [1, 2, 4, 6] as const;
const VALIDATION_DELAY_MIN = 100;
const VALIDATION_DELAY_MAX = 5000;
const VALIDATION_DELAY_STEP = 100;

type AppTheme = "light" | "dark" | "system";

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function AppSettingsDialog() {
	const settings = useAppStore((s) => s.settings);
	const updateSettings = useAppStore((s) => s.updateSettings);
	const { theme, setTheme } = useTheme();
	const [isDesktop, setIsDesktop] = useIsDesktop();

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

	return (
		<Dialog defaultOpen={settings.firstTime} onOpenChange={() => updateSettings({ firstTime: false })}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon-sm" aria-label="Open app settings">
					<Settings />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Settings</DialogTitle>
					<DialogDescription>Update editor appearance and validation behavior.</DialogDescription>
				</DialogHeader>
				<div className="grid gap-5">
					<section className="grid gap-3 rounded-lg border p-4">
						<div className="grid gap-1">
							<Label>UI</Label>
						</div>
						<RadioGroup value={ui} onValueChange={handleUIChange} className="grid gap-2 grid-cols-2">
							{[
								{ value: "mobile", label: "Mobile" },
								{ value: "desktop", label: "Desktop" },
							].map((option) => (
								<Label
									key={option.value}
									htmlFor={`app-theme-${option.value}`}
									className="flex items-center gap-3 rounded-md border px-3 py-2 hover:bg-accent/50"
								>
									<RadioGroupItem id={`app-theme-${option.value}`} value={option.value} />
									<span>{option.label}</span>
								</Label>
							))}
						</RadioGroup>
					</section>

					<section className="grid gap-3 rounded-lg border p-4">
						<div className="grid gap-1">
							<Label>Theme</Label>
							<p className="text-sm text-muted-foreground">Choose app theme.</p>
						</div>
						<RadioGroup value={theme} onValueChange={handleThemeChange} className="grid gap-2 sm:grid-cols-3">
							{[
								{ value: "light", label: "Light" },
								{ value: "dark", label: "Dark" },
								{ value: "system", label: "System" },
							].map((option) => (
								<Label
									key={option.value}
									htmlFor={`app-theme-${option.value}`}
									className="flex items-center gap-3 rounded-md border px-3 py-2 hover:bg-accent/50"
								>
									<RadioGroupItem id={`app-theme-${option.value}`} value={option.value} />
									<span>{option.label}</span>
								</Label>
							))}
						</RadioGroup>
					</section>

					<section className="grid gap-3 rounded-lg border p-4">
						<div className="flex items-start justify-between gap-3">
							<div className="grid gap-1">
								<Label htmlFor="font-size-input">Font Size</Label>
								<p className="text-sm text-muted-foreground">Set editor font size between 8 and 32.</p>
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
						<Slider
							value={[settings.fontSize]}
							min={FONT_SIZE_MIN}
							max={FONT_SIZE_MAX}
							step={1}
							onValueChange={([value]) => value && handleFontSizeChange(value)}
						/>
					</section>

					<section className="grid gap-3 rounded-lg border p-4">
						<div className="grid gap-1">
							<Label>Tab Size</Label>
							<p className="text-sm text-muted-foreground">Choose indentation width for editor tabs.</p>
						</div>
						<Tabs value={String(settings.tabSize)} onValueChange={handleTabSizeChange}>
							<TabsList className="grid w-full grid-cols-4">
								{TAB_SIZE_OPTIONS.map((size) => (
									<TabsTrigger key={size} value={String(size)}>
										{size}
									</TabsTrigger>
								))}
							</TabsList>
						</Tabs>
					</section>

					<section className="grid gap-3 rounded-lg border p-4">
						<div className="flex items-start justify-between gap-3">
							<div className="grid gap-1">
								<Label>Validation Delay</Label>
								<p className="text-sm text-muted-foreground">Delay automatic validation after edits.</p>
							</div>
							<div className="min-w-20 text-right text-sm font-medium">{settings.validation.validationDelayMs} ms</div>
						</div>
						<Slider
							value={[settings.validation.validationDelayMs]}
							min={VALIDATION_DELAY_MIN}
							max={VALIDATION_DELAY_MAX}
							step={VALIDATION_DELAY_STEP}
							onValueChange={([value]) => value && handleValidationDelayChange(value)}
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>{VALIDATION_DELAY_MIN} ms</span>
							<span>{VALIDATION_DELAY_MAX} ms</span>
						</div>
					</section>
				</div>
			</DialogContent>
		</Dialog>
	);
}
