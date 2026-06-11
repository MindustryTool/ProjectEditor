import { memo, useEffect, useRef, useState } from "react";
import { useFile } from "@project/core";
import { PixelStage } from "./components/PixelStage";
import { PixelToolbar } from "./components/PixelToolbar";
import { NewCanvasDialog } from "./components/NewCanvasDialog";
import { LayerPanel } from "./components/LayerPanel";
import { PalettePanel } from "./components/PalettePanel";
import { HistoryPanel } from "./components/HistoryPanel";
import { usePixelEditorStore } from "./store/pixel-editor-store";
import { useLayerStore } from "./store/layer-store";
import { useHistoryStore } from "./store/history-store";
import { useDrawingTools } from "./hooks/use-drawing-tools";
import { useSavePixel } from "./hooks/use-save-pixel";
import { decodePngToPixelData } from "./utils/png-codec";
import { PixelCanvas, PixelDocument } from "./utils/pixel-canvas";
import { deserializeMeta, getMetaPath } from "./utils/pixel-meta";

interface PixelEditorProps {
	path: string;
}

export const PixelEditor = memo(function PixelEditor({ path }: PixelEditorProps) {
	const { data } = useFile(path);
	const metaData = useFile(getMetaPath(path)).data;
	const canvas = useLayerStore((s) => s.canvas);
	const document = useLayerStore((s) => s.document);
	const setDocument = useLayerStore((s) => s.setDocument);
	const lastPathRef = useRef<string | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);

	const { handlePointerDown, handlePointerMove, handlePointerUp, setRenderFn } = useDrawingTools();
	const { save } = useSavePixel(path);
	const saveRef = useRef(save);
	saveRef.current = save;

	useEffect(() => {
		if (!document) return;
		document.setOnAutoSave(() => {
			saveRef.current();
		});
		return () => document?.dispose();
	}, [document]);

	useEffect(() => {
		if (!data) return;
		if (lastPathRef.current !== path) {
			setDocument(null);
			setLoadError(null);
			useHistoryStore.getState().clear();
			lastPathRef.current = path;
		}
		(async () => {
			try {
				const d = data!;
				const result = await decodePngToPixelData(d);
				let newCanvas = new PixelCanvas(result.width, result.height);
				const uiState = usePixelEditorStore.getState();

				let metaFile: ReturnType<typeof deserializeMeta> = null;
				if (metaData) {
					const decoder = new TextDecoder();
					const metaJson = decoder.decode(metaData);
					metaFile = deserializeMeta(metaJson);
				}

				if (metaFile) {
					const firstLayer = metaFile.layers[0];
					const metaWidth = firstLayer ? Math.round(Math.sqrt(firstLayer.pixelData.length / 4)) : result.width;
					const serializeMetaLayer = (ml: typeof metaFile.layers[number]): import("./utils/pixel-canvas").SerializedLayer => ({
						id: ml.id,
						name: ml.name,
						data: Array.from(ml.pixelData),
						visible: ml.visible,
						opacity: ml.opacity,
						blendMode: ml.blendMode,
						locked: ml.locked,
						children: (ml.children ?? []).map((c) => serializeMetaLayer(c as any)),
						expanded: ml.expanded ?? true,
					});
					const serializedLayers = metaFile.layers.map((l) => serializeMetaLayer(l as any));
					const restoreLayerId = metaFile.uiConfig.currentLayerId || serializedLayers[metaFile.uiConfig.currentLayerIndex]?.id || serializedLayers[0]?.id || "";
					const serialized: import("./utils/pixel-canvas").SerializedCanvas = {
						width: metaWidth,
						height: metaWidth,
						layers: serializedLayers,
						currentLayerIndex: metaFile.uiConfig.currentLayerIndex,
						currentLayerId: restoreLayerId,
					};
					newCanvas = PixelCanvas.deserialize(serialized);
					const config = metaFile.uiConfig;
					uiState.setTool(config.tool as any);
					uiState.setForegroundColor(config.foregroundColor);
					uiState.setBackgroundColor(config.backgroundColor);
					uiState.setBrushSize(config.brushSize);
					uiState.setBrushOpacity(config.brushOpacity);
					uiState.setTolerance(config.tolerance);
					uiState.setSprayDensity(config.sprayDensity);
					uiState.setSprayRadius(config.sprayRadius);
					uiState.setPixelPerfect(config.pixelPerfect);
					uiState.setSymmetry(config.symmetry as any);
					uiState.setSymmetrySegments(config.symmetrySegments);
					if (config.gridVisible) uiState.toggleGrid();
					if (config.pixelGridVisible) uiState.togglePixelGrid();
					if (config.rulersVisible) uiState.toggleRulers();
					if (config.guidesVisible) uiState.toggleGuides();
					if (config.layerBoundsVisible) uiState.toggleLayerBounds();
					if (config.onionSkinVisible) uiState.toggleOnionSkin();
					if (!config.checkerboardVisible) uiState.toggleCheckerboard();
					if (config.palette) {
						uiState.setPalette(config.palette);
					}
					if (config.lockedColors) {
						uiState.setLockedColors(config.lockedColors);
					}
				} else {
					newCanvas.layers[0]!.data = result.data;
				}

				const doc = new PixelDocument(newCanvas, path);
				doc.markClean();
				setDocument(doc);
				uiState.resetCanvas(newCanvas.width, newCanvas.height);
			} catch (e) {
				const msg = e instanceof Error ? e.message : "Failed to load PNG";
				console.error("Failed to load PNG:", e);
				setLoadError(msg);
			}
		})();
	}, [data, metaData, path, setDocument, setLoadError]);

	useEffect(() => {
		if (!canvas) return;
		usePixelEditorStore.getState().setWidth(canvas.width);
		usePixelEditorStore.getState().setHeight(canvas.height);
	}, [canvas?.width, canvas?.height]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.ctrlKey || e.metaKey) && e.key === "z") {
				e.preventDefault();
				if (e.shiftKey) {
					useHistoryStore.getState().redo();
				} else {
					useHistoryStore.getState().undo();
				}
				return;
			}
			const editorState = usePixelEditorStore.getState();
			if (e.key === "x" && !e.ctrlKey && !e.metaKey) {
				editorState.swapColors();
			}
			if (e.key === "d" && !e.ctrlKey && !e.metaKey) {
				editorState.resetColors();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, []);

	if (!canvas) {
		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
				{loadError ? (
					<>
						<p className="text-destructive font-medium">Failed to load image</p>
						<p className="text-muted-foreground text-sm text-center max-w-md">{loadError}</p>
						<p className="text-muted-foreground text-xs mt-2">The image is too large or in an unsupported format.</p>
					</>
				) : (
					<p className="text-muted-foreground">Loading pixel editor...</p>
				)}
			</div>
		);
	}

	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			<PixelToolbar onSave={save} />
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <PalettePanel />
        <div className="flex min-h-0 flex-1 flex-col">
          <PixelStage
            width={canvas.width}
            height={canvas.height}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            setRenderFn={setRenderFn}
          />
        </div>
        <LayerPanel />
        <HistoryPanel />
      </div>
			<NewCanvasDialog />
		</div>
	);
});


