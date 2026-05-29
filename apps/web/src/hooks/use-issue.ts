import { Severity, useValidationStore } from "@project/state";
import { useMemo } from "react";

export function useIssues() {
	const resultsByPath = useValidationStore((s) => s.resultsByPath);

	return useMemo(() => {
		const result: Record<string, { error: number; warning: number }> = {};
		for (const [path, results] of Object.entries(resultsByPath)) {
			const segments = path.split("/").filter(Boolean);

			let currentPath = "";
			
            for (let i = 0; i < segments.length; i++) {
				const segment = segments[i];
				if (i > 0) currentPath += "/";
				currentPath += segment;

				if (result[currentPath] == null) result[currentPath] = { error: 0, warning: 0 };

				result[currentPath]!.error += results.filter((r) => r.severity === Severity.error).length;
				result[currentPath]!.warning += results.filter((r) => r.severity === Severity.warning).length;
			}
		}

		return result;
	}, [resultsByPath]);
}
