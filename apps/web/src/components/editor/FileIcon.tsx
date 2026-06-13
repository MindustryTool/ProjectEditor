import { ImageFilePreview } from "#/components/editor/ImageFilePreview";
import { FLAG_MAP, getLocaleFromFilename } from "@project/core";
import { hasContentSprite } from "@project/utils";
import { File } from "lucide-react";

export function FileIcon({ path }: { path: string }) {
	if (path.endsWith(".png")) {
		return <ImageFilePreview path={path} className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4 flex items-center justify-center" />;
	}

	if (path.endsWith(".mp3")) {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 64 64" fill="none">
				<path d="M16 4H40L52 16V56C52 58.2 50.2 60 48 60H16C13.8 60 12 58.2 12 56V8C12 5.8 13.8 4 16 4Z" fill="#2563EB" />
				<path d="M40 4V16H52" fill="#60A5FA" />
				<path
					d="M36 22V38.5C36 41 34 43 31.5 43C29 43 27 41.2 27 39C27 36.8 29 35 31.5 35C32.4 35 33.2 35.2 34 35.6V26L44 24V34.5C44 37 42 39 39.5 39C37 39 35 37.2 35 35C35 32.8 37 31 39.5 31C40.4 31 41.2 31.2 42 31.6V22L36 22Z"
					fill="white"
				/>
				<text x="32" y="54" textAnchor="middle" fill="white" fontSize="10" fontFamily="Arial" fontWeight="bold">
					MP3
				</text>
			</svg>
		);
	}

	if (path.endsWith(".ogg")) {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 64 64" fill="none">
				<path d="M16 4H40L52 16V56C52 58.2 50.2 60 48 60H16C13.8 60 12 58.2 12 56V8C12 5.8 13.8 4 16 4Z" fill="#16A34A" />
				<path d="M40 4V16H52" fill="#4ADE80" />
				<circle cx="32" cy="32" r="10" stroke="white" strokeWidth="3" />
				<circle cx="32" cy="32" r="3" fill="white" />
				<text x="32" y="54" textAnchor="middle" fill="white" fontSize="10" fontFamily="Arial" fontWeight="bold">
					OGG
				</text>
			</svg>
		);
	}

	if (path.endsWith(".wav")) {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 64 64" fill="none">
				<path d="M16 4H40L52 16V56C52 58.2 50.2 60 48 60H16C13.8 60 12 58.2 12 56V8C12 5.8 13.8 4 16 4Z" fill="#EA580C" />
				<path d="M40 4V16H52" fill="#FB923C" />
				<path
					d="M20 32H24L27 24L31 40L34 28L37 36L40 32H44"
					stroke="white"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
				<text x="32" y="54" text-anchor="middle" fill="white" fontSize="10" fontFamily="Arial" fontWeight="bold">
					WAV
				</text>
			</svg>
		);
	}
	const filename = path.split("/").pop() || "";

	const locale = getLocaleFromFilename(filename);

	if (locale) {
		return <span className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4 flex items-center justify-center">{FLAG_MAP[locale]}</span>;
	}

	const isContentSprite = hasContentSprite(path);

	if (isContentSprite) {
		return (
			<ImageFilePreview
				path={path}
				className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4 flex items-center justify-center"
				fallback={<File />}
			/>
		);
	}

	return <File className="h-3.5 w-3.5 shrink-0 text-muted-foreground ml-4 flex items-center justify-center" />;
}
