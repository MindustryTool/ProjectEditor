import { Spinner } from "#/components/ui/spinner";
import { apiClient } from "@project/api";
import { useFile } from "@project/core";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

export const SchematicMapPreview = React.memo(function SchematicMapPreview({ path, type }: { path: string; type: "schematic" | "map" }) {
	const { data, isLoading } = useFile(path);
	
    if (isLoading) {
		return (
			<div className="flex justify-center items-center h-full w-full overflow-hidden">
				<Spinner />
			</div>
		);
	}

	if (!data) {
		return null;
	}

    return <SchematicMapLoader data={data} type={type} />
});

const SchematicMapLoader = React.memo(function SchematicMapLoader({ data, type }: { data: ArrayBuffer; type: "schematic" | "map" }) {
	const {
		data: image,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: [type, data],
		queryFn: () => (type === "schematic" ? apiClient.getSchematicPreview(data) : apiClient.getMapPreview(data)),
	});

	const imageUrl = useMemo(() => {
		if (!image) return null;
		const blob = new Blob([Buffer.from(image)], { type: "image/jpeg" });
		return URL.createObjectURL(blob);
	}, [image]);

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

    if (!imageUrl) {
        return null;
    }

	return (
		<img className="w-full h-full object-contain" src={imageUrl} alt={type === "schematic" ? "Schematic" : "Map"} />
	);
});
