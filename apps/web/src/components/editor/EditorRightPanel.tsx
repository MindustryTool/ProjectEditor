import { lazy, memo, Suspense } from "react";
import { Spinner } from "#/components/ui/spinner";

const ModHjsonPanel = lazy(() => import("./right/ModHjsonPanel").then((m) => ({ default: m.ModHjsonPanel })));
const ItemPanel = lazy(() => import("./right/ItemPanel").then((m) => ({ default: m.ItemPanel })));
const LiquidPanel = lazy(() => import("./right/LiquidPanel").then((m) => ({ default: m.LiquidPanel })));
const SectorPanel = lazy(() => import("./right/SectorPanel").then((m) => ({ default: m.SectorPanel })));
const StatusPanel = lazy(() => import("./right/StatusPanel").then((m) => ({ default: m.StatusPanel })));
const UnitPanel = lazy(() => import("./right/UnitPanel").then((m) => ({ default: m.UnitPanel })));
const BlockPanel = lazy(() => import("./right/BlockPanel").then((m) => ({ default: m.BlockPanel })));

const panelFallback = (
	<div className="flex h-full w-full items-center justify-center">
		<Spinner />
	</div>
);

interface EditorRightPanelProps {
	path: string | null;
}

export const EditorRightPanel = memo(function EditorRightPanel({ path }: EditorRightPanelProps) {
	if (path === null) {
		return null;
	}

	if (path === "mod.hjson" || path === "mod.json") {
		return (
			<Suspense fallback={panelFallback}>
				<ModHjsonPanel path={path} />
			</Suspense>
		);
	}

	if (path.startsWith("content/items") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<ItemPanel path={path} />
			</Suspense>
		);
	}

	if (path.startsWith("content/liquids") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<LiquidPanel path={path} />
			</Suspense>
		);
	}

	if (path.startsWith("content/sectors") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<SectorPanel path={path} />
			</Suspense>
		);
	}

	if (path.startsWith("content/status") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<StatusPanel path={path} />
			</Suspense>
		);
	}

	if (path.replace("sprite:", "").startsWith("content/units") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<UnitPanel path={path.replace("sprite:", "")} />
			</Suspense>
		);
	}

	if (path.startsWith("content/blocks") && (path.endsWith(".json") || path.endsWith(".hjson"))) {
		return (
			<Suspense fallback={panelFallback}>
				<BlockPanel path={path} />
			</Suspense>
		);
	}

	if (path.startsWith("content")) {
		return null;
	}
});
