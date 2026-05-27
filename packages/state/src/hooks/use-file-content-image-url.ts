import { useMemo, useEffect } from "react";

export function useFileContentImageUrl(data: ArrayBuffer | null): string | null {
	const objectUrl = useMemo(() => {
		if (!data || data.byteLength === 0) return null;
		const blob = new Blob([data], { type: "image/png" });
		return URL.createObjectURL(blob);
	}, [data]);

	useEffect(() => {
		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [objectUrl]);

	return objectUrl;
}
