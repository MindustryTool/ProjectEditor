import { cn } from "#/lib/utils";
import React from "react";

export const ItemGrid = React.memo(function ItemGrid({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"grid w-full overflow-x-hidden grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-1 max-h-[90dhv] md:max-h-[50dvh] overflow-y-auto",
				className,
			)}
			{...props}
		/>
	);
});
