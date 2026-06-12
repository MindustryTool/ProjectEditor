import { memo, useEffect, useRef, useState, useCallback } from "react";
import { useFile } from "@project/core";
import { PixelStage } from "./components/PixelStage";
import { PixelToolbar } from "./components/PixelToolbar";
import { NewCanvasDialog } from "./components/NewCanvasDialog";
import { LayerPanel } from "./components/LayerPanel";
import { usePixelEditorStore } from "./store/pixel-editor-store";
import { useLayerStore } from "./store/layer-store";
import { useHistoryStore } from "./store/history-store";
import { useDrawingTools } from "./hooks/use-drawing-tools";
import { useSelectionTools } from "./hooks/use-selection-tools";
import { useSavePixel } from "./hooks/use-save-pixel";
import { decodePngToPixelData } from "./utils/png-codec";
import { PixelCanvas, PixelDocument } from "./utils/pixel-canvas";
import type { SerializedCanvas, SerializedLayer } from "./utils/pixel-canvas";
import type { ToolType } from "./store/pixel-editor-store";
import type { HistoryEntry } from "./utils/canvas-state";
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

	const {
		handlePointerDown: drawDown,
		handlePointerMove: drawMove,
		handlePointerUp: drawUp,
		setRenderFn,
		finalizeCurve,
	} = useDrawingTools();
	const selTools = useSelectionTools();
	const {
		handleSelectionDown: selDown,
		handleSelectionMove: selMove,
		handleSelectionUp: selUp,
		deleteSelection,
		fillSelection,
		copySelection,
		cutSelection,
		pasteSelection,
		selectAll,
		deselect,
		handleScaleDown,
		handleScaleMove,
		handleScaleUp,
		applyRotate,
		applyFlip,
	} = selTools;
	const { save } = useSavePixel(path);
	const saveRef = useRef(save);
	saveRef.current = save;

	const isSelectTool = (t: string) =>
		t === "select-rect" ||
		t === "select-ellipse" ||
		t === "magic-wand" ||
		t === "color-select" ||
		t === "lasso" ||
		t === "polygon" ||
		t === "move" ||
		t === "scale";

	const handlePointerDown = useCallback(
		(x: number, y: number, button: number) => {
			const tool = usePixelEditorStore.getState().tool;
			if (isSelectTool(tool)) {
				const canvas = useLayerStore.getState().canvas;
				if (canvas && tool === "move" && canvas.selectionMask) {
					canvas.selectionOriginalData = new Uint32Array(canvas.currentLayer.canvas.pixels);
				}
				if (tool === "scale") {
					handleScaleDown(x, y);
				} else {
					selDown(x, y, button);
				}
			} else {
				drawDown(x, y, button);
			}
		},
		[drawDown, selDown, handleScaleDown],
	);

	const handlePointerMove = useCallback(
		(x: number, y: number) => {
			const tool = usePixelEditorStore.getState().tool;
			if (isSelectTool(tool)) {
				if (tool === "scale") {
					handleScaleMove(x, y);
				} else {
					selMove(x, y);
				}
			} else {
				drawMove(x, y);
			}
		},
		[drawMove, selMove, handleScaleMove],
	);

	const handlePointerUp = useCallback(() => {
		const tool = usePixelEditorStore.getState().tool;
		if (isSelectTool(tool)) {
			if (tool === "scale") {
				handleScaleUp();
			} else {
				selUp();
			}
		} else {
			drawUp();
		}
	}, [drawUp, selUp, handleScaleUp]);

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
					const serializeMetaLayer = (ml: (typeof metaFile.layers)[number]): SerializedLayer => ({
						id: ml.id,
						name: ml.name,
						canvas: {
							width: metaWidth,
							height: metaWidth,
							pixels: (() => {
								const count = metaWidth * metaWidth;
								const arr = new Uint32Array(count);
								for (let i = 0; i < count; i++) {
									const off = i * 4;
									arr[i] =
										((ml.pixelData[off + 3]! & 0xff) << 24) |
										((ml.pixelData[off + 2]! & 0xff) << 16) |
										((ml.pixelData[off + 1]! & 0xff) << 8) |
										(ml.pixelData[off]! & 0xff);
								}
								return Array.from(arr);
							})(),
						},
						visible: ml.visible,
						opacity: ml.opacity,
						blendMode: ml.blendMode,
						locked: ml.locked,
						children: (ml.children ?? []).map((c) => serializeMetaLayer(c)),
						expanded: ml.expanded ?? true,
					});
				const serializedLayers = metaFile.layers.map((l) => serializeMetaLayer(l));
				const serialized: SerializedCanvas = {
					width: metaWidth,
					height: metaWidth,
					layers: serializedLayers,
					currentLayerIndex: 0,
					currentLayerId: serializedLayers[0]?.id || "",
				};
					newCanvas = PixelCanvas.deserialize(serialized);
					const config = metaFile.uiConfig;
					uiState.setTool(config.tool as ToolType);
					uiState.setForegroundColor(config.foregroundColor);
					uiState.setBackgroundColor(config.backgroundColor);
					uiState.setBrushSize(config.brushSize);
					uiState.setBrushOpacity(config.brushOpacity);
					uiState.setTolerance(config.tolerance);
					uiState.setSprayDensity(config.sprayDensity);
					uiState.setSprayRadius(config.sprayRadius);
					uiState.setPixelPerfect(config.pixelPerfect);
					uiState.setSymmetry(config.symmetry as "none" | "horizontal" | "vertical" | "radial");
					uiState.setSymmetrySegments(config.symmetrySegments);
					uiState.setGridVisible(config.gridVisible);
					uiState.setPixelGridVisible(config.pixelGridVisible);
					uiState.setRulersVisible(config.rulersVisible);
					uiState.setGuidesVisible(config.guidesVisible);
					uiState.setLayerBoundsVisible(config.layerBoundsVisible);
					uiState.setOnionSkinVisible(config.onionSkinVisible);
					uiState.setCheckerboardVisible(config.checkerboardVisible);
				} else {
					newCanvas.layers[0]!.canvas.pixels.set(result.data);
				}

				const doc = new PixelDocument(newCanvas, path);
				doc.markClean();
				setDocument(doc);

			} catch (e) {
				const msg = e instanceof Error ? e.message : "Failed to load PNG";
				console.error("Failed to load PNG:", e);
				setLoadError(msg);
			}
		})();
	}, [data, metaData, path, setDocument, setLoadError]);

  const applyHistoryEntry = useCallback((entry: HistoryEntry | null, reverse: boolean) => {
    if (!entry || !canvas) return;
    if (entry.type !== "pixel") return; // Only pixel entries can be reversed
    
    const layer = entry.layerId ? canvas.findLayerById(entry.layerId) : null;
    if (!layer) return;
    const cs = layer.canvas;
    for (const change of entry.changes) {
      if (change.index >= 0 && change.index < cs.pixels.length) {
        cs.pixels[change.index] = reverse ? change.before : change.after;
      }
    }
    useLayerStore.getState().forceRender();
    usePixelEditorStore.getState().setDirty(true);
  }, [canvas]);

  const handleUndo = useCallback(() => {
    const entry = useHistoryStore.getState().undo();
    applyHistoryEntry(entry, true);
  }, [applyHistoryEntry]);

  const handleRedo = useCallback(() => {
    const entry = useHistoryStore.getState().redo();
    applyHistoryEntry(entry, false);
  }, [applyHistoryEntry]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const editorState = usePixelEditorStore.getState();
      const isCtrl = e.ctrlKey || e.metaKey;

      if (isCtrl && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }

		if (e.key === "Delete" || e.key === "Backspace") {
			if (canvas?.selectionMask) {
				e.preventDefault();
				deleteSelection();
				return;
			}
		}

		if (isCtrl && e.key === "a") {
			e.preventDefault();
			selectAll();
			return;
		}

		if (isCtrl && e.key === "d") {
			if (canvas?.selectionMask) {
				e.preventDefault();
				deselect();
				return;
			}
		}

		if (isCtrl && e.key === "c") {
			if (canvas?.selectionMask) {
				e.preventDefault();
				copySelection();
				return;
			}
		}

		if (isCtrl && e.key === "x") {
			if (canvas?.selectionMask) {
				e.preventDefault();
				cutSelection();
				return;
			}
		}

			if (isCtrl && e.key === "v") {
				e.preventDefault();
				pasteSelection();
				return;
			}

			if (isCtrl && e.key === "r") {
				e.preventDefault();
				applyRotate(e.shiftKey ? -90 : 90);
				return;
			}

			if (isCtrl && e.key === "h") {
				e.preventDefault();
				applyFlip(e.shiftKey ? "vertical" : "horizontal");
				return;
			}

			if (e.key === "Enter" && editorState.tool === "scale") {
				handleScaleUp();
			}

			if (e.key === "x" && !isCtrl) {
				editorState.swapColors();
			}
			if (e.key === "d" && !isCtrl) {
				editorState.resetColors();
			}
			if (e.key === "Enter") {
				if (editorState.tool === "polygon") {
					selUp();
				} else if (editorState.tool === "curve") {
					finalizeCurve();
				}
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [
		deleteSelection,
		selectAll,
		deselect,
		copySelection,
		cutSelection,
		pasteSelection,
		applyRotate,
		applyFlip,
		handleScaleUp,
		finalizeCurve,
		selUp,
		handleUndo,
		handleRedo,
		canvas,
	]);

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
			<PixelToolbar
				onSave={save}
				onUndo={handleUndo}
				onRedo={handleRedo}
				selectionTools={{
					deleteSelection,
					fillSelection,
					copySelection,
					cutSelection,
					pasteSelection,
					selectAll,
					deselect,
					applyRotate,
					applyFlip,
				}}
			/>
			<div className="flex min-h-0 flex-1 flex-col md:flex-row overflow-hidden">
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
				<div className="hidden md:flex flex-col gap-0 overflow-y-auto w-48 shrink-0 border-l">
					<LayerPanel />
				</div>
			</div>
			<NewCanvasDialog />
		</div>
	);
});
