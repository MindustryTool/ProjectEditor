import { useRef, useEffect } from "react";

interface TreeNodeRenameInputProps {
	defaultValue: string;
	onConfirm: (value: string) => void;
	onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function TreeNodeRenameInput({ defaultValue, onConfirm, onKeyDown }: TreeNodeRenameInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, []);

	return (
		<input
			ref={inputRef}
			defaultValue={defaultValue}
			className="min-w-0 flex-1 rounded border border-border bg-background px-1 py-0 text-sm outline-none"
			onKeyDown={onKeyDown}
			onBlur={(e) => onConfirm(e.target.value)}
			onClick={(e) => e.stopPropagation()}
		/>
	);
}
