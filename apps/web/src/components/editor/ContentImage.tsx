import { memo } from "react";
import type { ContentEntry } from "@project/types";
import { ImageFilePreview } from "./ImageFilePreview";
import { ContentApiImage } from "./ContentApiImage";

export const ContentImage = memo(function ContentImage({
	entry,
	className,
}: {
	entry: Pick<ContentEntry, "contentType" | "type" | "name" | "path">;
	className?: string;
}) {
	if (entry.type === "base") {
		return <ContentApiImage type={entry.contentType} name={entry.name} className={className} />;
	}

	return <ImageFilePreview path={entry.path} className={className} />;
});
