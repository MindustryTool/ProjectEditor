import { AlertTriangle } from "lucide-react";

function ErrorDisplay({ message, onRetry }: { message?: string; onRetry?: () => void }) {
	return (
		<div className="flex flex-col items-center gap-2 py-8 text-xs text-muted-foreground">
			<AlertTriangle className="size-4" />
			<p>{message ?? "Something went wrong"}</p>
			{onRetry && (
				<button type="button" onClick={onRetry} className="underline hover:text-foreground">
					Retry
				</button>
			)}
		</div>
	);
}

export { ErrorDisplay };
