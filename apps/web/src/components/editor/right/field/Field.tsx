import { cn } from "#/lib/utils";
import type { SchemaMetadata } from "@project/schema";

export function Field({
	className,
	jsonPath,
	metadata,
	...props
}: React.ComponentProps<"div"> & { jsonPath: string; metadata: SchemaMetadata | null | undefined }) {
	return (
		<div
			id={jsonPath}
			className={cn(
				"flex flex-col gap-2",
				{
					"opacity-50": metadata?.disabled,
				},
				className,
			)}
			{...props}
		/>
	);
}

export function FieldControl({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("[&>input]:w-full [&>select]:w-full", className)} {...props} />;
}
