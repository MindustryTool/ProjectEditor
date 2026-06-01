import { useTheme } from "#/components/ThemeProvider";

type Theme = "light" | "dark" | "system";

const CYCLE: Theme[] = ["light", "dark", "system"];

function nextTheme(current: Theme): Theme {
	const idx = CYCLE.indexOf(current);
	return CYCLE[(idx + 1) % CYCLE.length]!;
}

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme();

	function toggleMode() {
		setTheme(nextTheme(theme));
	}

	const label = theme === "system" ? "Theme mode: system. Click to switch to light mode." : `Theme mode: ${theme}. Click to switch mode.`;

	const display = theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light";

	return (
		<button
			type="button"
			onClick={toggleMode}
			aria-label={label}
			title={label}
			className="rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm font-semibold text-foreground shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
		>
			{display}
		</button>
	);
}
