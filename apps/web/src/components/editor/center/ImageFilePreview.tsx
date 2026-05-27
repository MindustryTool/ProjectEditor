import { useFileContent, useFileContentImageUrl } from "@project/state";

export function ImageFilePreview({ path }: { path: string }) {
	const { data } = useFileContent(path);
	const objectUrl = useFileContentImageUrl(data);

	if (objectUrl === null) {
		return <div className="flex h-full w-full" />;
	}

	return <img className="object-cover text-xs w-full h-full" src={objectUrl} alt={path} />;
}
