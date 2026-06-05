import { AppSettingsDialog } from "#/components/editor/AppSettingsDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#/components/ui/dropdown-menu";
import { CircleQuestionMark, Send } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface ToolbarProps {
	children: ReactNode;
	className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
	return (
		<div className={cn("flex h-9 min-h-9 max-h-9 border-b bg-muted text-sm overflow-x-auto w-full", className)}>
			<div className="flex items-center gap-1 px-2">{children}</div>
			<div className="ml-auto pr-1 items-center flex gap-1">
				<HelpMenu />
				<AppSettingsDialog />
			</div>
		</div>
	);
}

function HelpMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<CircleQuestionMark className="size-4" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-44">
				<DropdownMenuItem>
					<Send />
					<a href="https://your-choice-seven.vercel.app/projects/cmm8tccmc0001vlucyj8bn6s1">Feedback</a>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<DiscordIcon className="text-[#5865F2] hover:text-[#5865F2] focus:text-[#5865F2]" />
					<a href="https://mindustry-tool.com/links/mindustry-tool">Discord</a>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function DiscordIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 127.14 96.36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0a105.89 105.89 0 0 0-26.24 8.08C2.79 32.65-1.71 56.6.54 80.21A105.73 105.73 0 0 0 32.71 96.36a77.7 77.7 0 0 0 6.89-11.14 68.42 68.42 0 0 1-10.84-5.18c.91-.66 1.8-1.34 2.66-2.04a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2.04a68.68 68.68 0 0 1-10.86 5.19 77.02 77.02 0 0 0 6.89 11.13A105.25 105.25 0 0 0 126.6 80.22c2.64-27.35-4.51-51.08-18.9-72.15ZM42.45 65.69c-6.27 0-11.41-5.73-11.41-12.8s5.02-12.8 11.41-12.8c6.39 0 11.52 5.79 11.41 12.8 0 7.07-5.03 12.8-11.41 12.8Zm42.24 0c-6.27 0-11.41-5.73-11.41-12.8s5.02-12.8 11.41-12.8c6.39 0 11.52 5.79 11.41 12.8 0 7.07-5.02 12.8-11.41 12.8Z" />
		</svg>
	);
}
