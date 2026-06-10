import { useCallback } from "react";
import { useProjectSession } from "@project/core";
import { useNavigate, useParams } from "@tanstack/react-router";

export function useProjectActions() {
	const reset = useProjectSession((state) => state.reset);
	const navigate = useNavigate();
	const { lang } = useParams({ strict: false });

	const close = useCallback(() => {
		if (!lang) {
			throw new Error("lang is not set");
		}
		navigate({ to: `/$lang/projects`, params: { lang } });
		reset();
	}, [reset, navigate, lang]);

	return { close };
}
