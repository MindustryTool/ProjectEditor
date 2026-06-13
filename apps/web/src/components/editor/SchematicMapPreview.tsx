import { Spinner } from "#/components/ui/spinner";
import { apiClient } from "@project/api";
import { useFile } from "@project/core";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export const SchematicMapPreview = React.memo(function SchematicMapPreview({ path, type }: { path: string; type: "schematic" | "map" }) {
	const { data, isLoading } = useFile(path);
	const { data: preview, isLoading: previewLoading, write: writePreview } = useFile(path + ".preview");

	const imageUrl = useMemo(() => {
		if (!preview) return null;
		const blob = new Blob([preview], { type: "image/png" });
		return URL.createObjectURL(blob);
	}, [preview]);

	if (isLoading || previewLoading) {
		return (
			<div className="flex justify-center items-center h-full w-full overflow-hidden">
				<Spinner />
			</div>
		);
	}

	if (!data) return "No data";

	if (imageUrl) {
		return <img className="w-full h-full object-contain" src={imageUrl} alt={type === "schematic" ? "Schematic" : "Map"} />;
	}

	return <SchematicMapLoader data={data} type={type} writePreview={writePreview} />;
});

const SchematicMapLoader = React.memo(function SchematicMapLoader({
	data,
	type,
	writePreview,
}: {
	data: ArrayBuffer;
	type: "schematic" | "map";
	writePreview: (preview: ArrayBuffer) => void;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const loadImage = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const response = type === "schematic" ? await apiClient.getSchematicPreview(data) : await apiClient.getMapPreview(data);
			const result = new Uint8Array(response.data).slice().buffer;
			writePreview(result);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setIsLoading(false);
		}
	}, [data, type, writePreview]);

	useEffect(() => {
		loadImage();
	}, [loadImage]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-full w-full overflow-hidden">
				<Spinner />
			</div>
		);
	}

	if (error) {
		return <div className="flex justify-center items-center h-full w-full overflow-hidden">{error}</div>;
	}

	return null;
});
