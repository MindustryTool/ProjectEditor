import { useCallback, useEffect, useRef, useState } from "react";
import type { PositionEditHandler } from "./PositionPreview";

export function usePositionEdit(
	position: { x: { value: number; path: string }; y: { value: number; path: string } },
	onPositionChange?: PositionEditHandler,
) {
	const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

	const [editX, setEditX] = useState(String(position.x.value));
	const [editY, setEditY] = useState(String(position.y.value));

	useEffect(() => {
		setEditX(String(position.x.value));
		setEditY(String(position.y.value));
	}, [position.x.value, position.y.value]);

	const debouncedCommit = useCallback(
		(xVal: number, yVal: number) => {
			clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				onPositionChange?.(position.x.path, position.y.path, xVal, yVal);
			}, 200);
		},
		[onPositionChange, position.x.path, position.y.path],
	);

	const commitX = useCallback(() => {
		clearTimeout(debounceRef.current);
		const val = Number(editX);
		if (!isNaN(val)) {
			onPositionChange?.(position.x.path, position.y.path, val, position.y.value);
		}
	}, [editX, onPositionChange, position.x.path, position.y.path, position.y.value]);

	const commitY = useCallback(() => {
		clearTimeout(debounceRef.current);
		const val = Number(editY);
		if (!isNaN(val)) {
			onPositionChange?.(position.x.path, position.y.path, position.x.value, val);
		}
	}, [editY, onPositionChange, position.x.path, position.y.path, position.x.value]);

	const handleChangeX = useCallback(
		(value: string) => {
			setEditX(value);
			const val = Number(value);
			if (!isNaN(val)) {
				debouncedCommit(val, position.y.value);
			}
		},
		[debouncedCommit, position.y.value],
	);

	const handleChangeY = useCallback(
		(value: string) => {
			setEditY(value);
			const val = Number(value);
			if (!isNaN(val)) {
				debouncedCommit(position.x.value, val);
			}
		},
		[debouncedCommit, position.x.value],
	);

	const scrollTo = useCallback((id: string) => {
		requestAnimationFrame(() => {
			let current = "";
			for (const segment of id.split(".")) {
				current += segment;
				const element = document.getElementById(current);
				if (element) {
					element.scrollIntoView({ behavior: "smooth" });
					element.focus();
				}
				current += ".";
			}
		});
	}, []);

	return {
		editX,
		setEditX,
		editY,
		setEditY,
		commitX,
		commitY,
		handleChangeX,
		handleChangeY,
		scrollTo,
		position,
	};
}
