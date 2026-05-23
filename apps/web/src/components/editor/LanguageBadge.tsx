import type { ProjectLanguage } from "@project/core";

export const LANGUAGE_OPTIONS: { value: ProjectLanguage; label: string; short: string; color: string }[] = [
	{ value: "json", label: "JSON", short: "JSON", color: "text-blue-600" },
	{ value: "java", label: "Java", short: "Java", color: "text-orange-600" },
	{ value: "javascript", label: "JavaScript", short: "JS", color: "text-yellow-600" },
];

export function LanguageBadge({ language }: { language?: string }) {
	const opt = LANGUAGE_OPTIONS.find((o) => o.value === (language ?? "json")) ?? LANGUAGE_OPTIONS[0]!;
	return (
		<span
			className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase leading-none ${opt.color} bg-current/10`}
		>
			{opt.short}
		</span>
	);
}
