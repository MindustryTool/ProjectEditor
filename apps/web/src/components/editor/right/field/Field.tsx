import { cn } from "#/lib/utils";

export function Field({ className, jsonPath, ...props }: React.ComponentProps<"div"> & { jsonPath: string }) {
	return <div id={jsonPath} className={cn("space-y-2", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
	return (
		<label
			className={cn(
				"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export function FieldControl({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("[&>input]:w-full [&>select]:w-full", className)} {...props} />;
}

export function FieldMessage({ className, ...props }: React.ComponentProps<"p">) {
	return <p className={cn("text-xs text-destructive", className)} {...props} />;
}
