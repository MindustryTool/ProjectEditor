import { Spinner } from "#/components/ui/spinner";
import { apiClient } from "@project/api";
import { useFile } from "@project/core";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";

export const SchematicMapPreview = React.memo(function SchematicMapPreview({ path, type }: { path: string; type: "schematic" | "map" }) {
	const { data, isLoading } = useFile(path);
	const { data: preview, isLoading: previewLoading, write: writePreview } = useFile(path + ".preview");

	const imageUrl = useMemo(() => {
		if (!preview) {
			return null;
		}

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

	if (!data) {
		return "No data";
	}

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
	const {
		data: image,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: [type, data],
		queryFn: () => (type === "schematic" ? apiClient.getSchematicPreview(data) : apiClient.getMapPreview(data)),
	});

	useEffect(() => {
		if (image) {
			writePreview(new Uint8Array(image.data).slice().buffer);
		}
	}, [image, writePreview]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-full w-full overflow-hidden">
				<Spinner />
			</div>
		);
	}

	if (isError) {
		return <div className="flex justify-center items-center h-full w-full overflow-hidden">{String(error)}</div>;
	}

	return null;
});
