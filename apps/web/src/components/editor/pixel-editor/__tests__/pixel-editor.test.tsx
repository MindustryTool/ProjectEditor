/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useLayerStore } from "../store/layer-store";
import { useHistoryStore } from "../store/history-store";
import { PixelCanvas } from "../utils/pixel-canvas";
import { PixelToolbar } from "../components/PixelToolbar";
import { NewCanvasDialog } from "../components/NewCanvasDialog";
import { CanvasState, rgbaToUint32, uint32ToRgba, hexToRgba, rgbaToHex } from "../utils/canvas-state";

vi.mock("react-konva", () => ({
  Stage: ({ children, ...props }: any) => <div data-testid="konva-stage" data-props={JSON.stringify(props)}>{children}</div>,
  Layer: ({ children }: any) => <div data-testid="konva-layer">{children}</div>,
  Image: (props: any) => <div data-testid="konva-image" data-props={JSON.stringify(props)} />,
  Rect: (props: any) => <div data-testid="konva-rect" data-props={JSON.stringify(props)} />,
}));

vi.mock("#/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: any) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <div data-testid="dialog-title">{children}</div>,
  DialogFooter: ({ children }: any) => <div data-testid="dialog-footer">{children}</div>,
}));

vi.mock("#/components/ui/button", () => ({
  Button: ({ children, onClick, variant, size, ...props }: any) => (
    <button onClick={onClick} data-variant={variant} data-size={size} {...props}>{children}</button>
  ),
}));

vi.mock("#/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

vi.mock("#/components/ui/label", () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

const mockSelectionTools = {
  deleteSelection: vi.fn(),
  fillSelection: vi.fn(),
  copySelection: vi.fn(),
  cutSelection: vi.fn(),
  pasteSelection: vi.fn(),
  selectAll: vi.fn(),
  deselect: vi.fn(),
};

vi.mock("../hooks/use-pixel-image", () => ({
  usePixelImage: () => ({
    getCanvas: () => document.createElement("canvas"),
    updatePixels: vi.fn(),
    version: 0,
    dispose: vi.fn(),
  }),
}));

describe("PixelToolbar", () => {
  afterEach(cleanup);
  beforeEach(() => {
    usePixelEditorStore.setState({
      tool: "pencil",
      foregroundColor: "#000000",
      backgroundColor: "#ffffff",
      gridVisible: false,
      checkerboardVisible: true,
      brushSize: 1,
      showNewCanvasDialog: false,
    });
    useHistoryStore.getState().clear();
  });

  it("renders all 13 tool buttons + action buttons", () => {
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    expect(screen.getByTitle("Pencil")).toBeDefined();
    expect(screen.getByTitle("Eraser")).toBeDefined();
    expect(screen.getByTitle("Fill")).toBeDefined();
    expect(screen.getByTitle("Picker")).toBeDefined();
    expect(screen.getByTitle("Line")).toBeDefined();
    expect(screen.getByTitle("Rect")).toBeDefined();
    expect(screen.getByTitle("Fill Rect")).toBeDefined();
    expect(screen.getByTitle("Circle")).toBeDefined();
    expect(screen.getByTitle("Fill Circ")).toBeDefined();
    expect(screen.getByTitle("Ellipse")).toBeDefined();
    expect(screen.getByTitle("Fill Ellip")).toBeDefined();
    expect(screen.getByTitle("Spray")).toBeDefined();
    expect(screen.getByTitle("Hand")).toBeDefined();
    expect(screen.getByTitle("New")).toBeDefined();
    expect(screen.getByTitle("Save (Ctrl+S)")).toBeDefined();
    expect(screen.getByTitle("Undo (Ctrl+Z)")).toBeDefined();
    expect(screen.getByTitle("Redo (Ctrl+Shift+Z)")).toBeDefined();
  });

  it("pencil tool is active by default", () => {
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    expect(screen.getByTitle("Pencil").className).toContain("bg-accent");
  });

  it("changes tool on click", () => {
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    fireEvent.click(screen.getByTitle("Eraser"));
    expect(usePixelEditorStore.getState().tool).toBe("eraser");
    fireEvent.click(screen.getByTitle("Line"));
    expect(usePixelEditorStore.getState().tool).toBe("line");
  });

  it("undo button is disabled when no history", () => {
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    expect(screen.getByTitle("Undo (Ctrl+Z)").hasAttribute("disabled")).toBe(true);
    expect(screen.getByTitle("Redo (Ctrl+Shift+Z)").hasAttribute("disabled")).toBe(true);
  });

  it("undo button is enabled after pushing history", () => {
    useHistoryStore.getState().pushEntry({ type: "pixel", id: "test", name: "Test", timestamp: Date.now(), changes: [], layerId: "layer1" });
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    expect(screen.getByTitle("Undo (Ctrl+Z)").hasAttribute("disabled")).toBe(false);
  });

  it("triggers undo on click", () => {
    useHistoryStore.getState().pushEntry({ type: "pixel", id: "test", name: "Test", timestamp: Date.now(), changes: [], layerId: "layer1" });
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    expect(useHistoryStore.getState().canUndo()).toBe(true);
    fireEvent.click(screen.getByTitle("Undo (Ctrl+Z)"));
    expect(useHistoryStore.getState().canUndo()).toBe(false);
  });

  it("calls onSave when save button clicked", () => {
    const onSave = vi.fn();
    render(<PixelToolbar onSave={onSave} selectionTools={mockSelectionTools as any} />);
    fireEvent.click(screen.getByTitle("Save (Ctrl+S)"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("opens new canvas dialog", () => {
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    fireEvent.click(screen.getByTitle("New"));
    expect(usePixelEditorStore.getState().showNewCanvasDialog).toBe(true);
  });

  it("renders foreground and background color swatches", () => {
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    expect(screen.queryByTitle("Foreground Color")).toBeTruthy();
    expect(screen.queryByTitle("Background Color")).toBeTruthy();
  });

  it("swaps colors on swap button click", () => {
    usePixelEditorStore.setState({ foregroundColor: "#ff0000", backgroundColor: "#00ff00" });
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    fireEvent.click(screen.getByTitle("Swap (X)"));
    const state = usePixelEditorStore.getState();
    expect(state.foregroundColor).toBe("#00ff00");
    expect(state.backgroundColor).toBe("#ff0000");
  });

  it("toggles grid visibility", () => {
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    fireEvent.click(screen.getByTitle("Toggle Grid"));
    expect(usePixelEditorStore.getState().gridVisible).toBe(true);
    fireEvent.click(screen.getByTitle("Toggle Grid"));
    expect(usePixelEditorStore.getState().gridVisible).toBe(false);
  });

  it("toggles checkerboard visibility", () => {
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    fireEvent.click(screen.getByTitle("Toggle Transparency"));
    expect(usePixelEditorStore.getState().checkerboardVisible).toBe(false);
    fireEvent.click(screen.getByTitle("Toggle Transparency"));
    expect(usePixelEditorStore.getState().checkerboardVisible).toBe(true);
  });

  it("brush size slider updates brush size", () => {
    render(<PixelToolbar onSave={vi.fn()} selectionTools={mockSelectionTools as any} />);
    const slider = document.querySelector('input[type="range"]') as HTMLInputElement;
    expect(slider).not.toBeNull();
    fireEvent.change(slider, { target: { value: "10" } });
    expect(usePixelEditorStore.getState().brushSize).toBe(10);
  });
});

describe("NewCanvasDialog", () => {
  afterEach(cleanup);
  beforeEach(() => {
    usePixelEditorStore.setState({ showNewCanvasDialog: true });
    useLayerStore.getState().setCanvas(new PixelCanvas(64, 64));
  });

  it("renders when showNewCanvasDialog is true", () => {
    render(<NewCanvasDialog />);
    expect(screen.getByText("New Canvas")).toBeDefined();
  });

  it("does not render when showNewCanvasDialog is false", () => {
    usePixelEditorStore.setState({ showNewCanvasDialog: false });
    const { container } = render(<NewCanvasDialog />);
    expect(container.querySelector('[data-testid="dialog"]')).toBeNull();
  });

  it("renders all preset buttons", () => {
    render(<NewCanvasDialog />);
    expect(screen.getAllByText("16×16").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("32×32").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("64×64").length).toBeGreaterThanOrEqual(1);
  });

  it("creates a canvas when the first preset is clicked", () => {
    render(<NewCanvasDialog />);
    fireEvent.click(screen.getAllByText("16×16")[0]!);
    const canvas = useLayerStore.getState().canvas;
    expect(canvas?.width).toBe(16);
    expect(canvas?.height).toBe(16);
    expect(usePixelEditorStore.getState().showNewCanvasDialog).toBe(false);
  });

  it("custom size inputs exist", () => {
    render(<NewCanvasDialog />);
    expect(document.querySelectorAll('input[type="number"]').length).toBeGreaterThanOrEqual(2);
  });

  it("Cancel closes dialog", () => {
    render(<NewCanvasDialog />);
    fireEvent.click(screen.getAllByText("Cancel")[0]!);
    expect(usePixelEditorStore.getState().showNewCanvasDialog).toBe(false);
  });
});

describe("PixelCanvas core operations", () => {
  it("draws and reads back pixels", () => {
    const canvas = new CanvasState(8, 8);
    canvas.setPixel(3, 4, rgbaToUint32(255, 128, 64, 255));
    const pixel = canvas.getPixel(3, 4);
    const { r, g, b, a } = uint32ToRgba(pixel);
    expect(r).toBe(255);
    expect(g).toBe(128);
    expect(b).toBe(64);
    expect(a).toBe(255);
  });

  it("serializes and deserializes canvas", () => {
    const canvas = new PixelCanvas(32, 32);
    canvas.addLayer("Colors");
    canvas.currentLayer.canvas.setPixel(10, 10, rgbaToUint32(100, 150, 200, 255));
    const serialized = canvas.serialize();
    const restored = PixelCanvas.deserialize(serialized);
    expect(restored.width).toBe(32);
    expect(restored.height).toBe(32);
    expect(restored.layerCount).toBe(2);
    const pixel = restored.currentLayer.canvas.getPixel(10, 10);
    const { r } = uint32ToRgba(pixel);
    expect(r).toBe(100);
  });

  it("composites layers correctly", () => {
    const canvas = new PixelCanvas(4, 4);
    canvas.layers[0]!.canvas.setPixel(0, 0, rgbaToUint32(255, 0, 0, 255));
    canvas.addLayer("Top");
    canvas.layers[1]!.canvas.setPixel(0, 0, rgbaToUint32(0, 255, 0, 128));
    const composite = canvas.getCompositeData();
    expect(composite[0]).toBeGreaterThan(0);
    expect(composite[1]).toBeGreaterThan(0);
  });
});

describe("LayerStore integration", () => {
  afterEach(cleanup);
  beforeEach(() => {
    useLayerStore.getState().setCanvas(new PixelCanvas(16, 16));
  });

  it("starts with one layer", () => {
    expect(useLayerStore.getState().canvas?.layerCount).toBe(1);
  });

  it("adds a new layer", () => {
    useLayerStore.getState().addLayer();
    expect(useLayerStore.getState().canvas?.layerCount).toBe(2);
  });

  it("prevents removing last layer", () => {
    expect(() => useLayerStore.getState().removeLayer(0)).toThrow();
  });

  it("sets current layer", () => {
    const store = useLayerStore.getState();
    store.canvas?.addLayer();
    store.canvas?.addLayer();
    store.setCurrentLayer(1);
    expect(store.canvas?.currentLayerIndex).toBe(1);
  });

  it("toggles layer visibility", () => {
    useLayerStore.getState().setLayerVisibility(0, false);
    expect(useLayerStore.getState().canvas?.layers[0]?.visible).toBe(false);
  });

  it("sets layer opacity", () => {
    useLayerStore.getState().setLayerOpacity(0, 0.5);
    expect(useLayerStore.getState().canvas?.layers[0]?.opacity).toBe(0.5);
  });

  it("moves layer", () => {
    const store = useLayerStore.getState();
    store.canvas!.addLayer("Layer 2");
    store.canvas!.addLayer("Layer 3");
    store.moveLayer(2, 0);
    expect(store.canvas?.layers[0]?.name).toBe("Layer 3");
  });
});

describe("HistoryStore integration", () => {
  afterEach(cleanup);
  beforeEach(() => {
    useHistoryStore.getState().clear();
  });

  it("pushes and undoes commands", () => {
    useHistoryStore.getState().pushEntry({ type: "pixel", id: "test", name: "Test", timestamp: Date.now(), changes: [], layerId: "layer1" });
    expect(useHistoryStore.getState().canUndo()).toBe(true);
    const entry = useHistoryStore.getState().undo();
    expect(entry).not.toBeNull();
    expect(entry!.name).toBe("Test");
  });

  it("redoes undone commands", () => {
    useHistoryStore.getState().pushEntry({ type: "pixel", id: "test", name: "Test", timestamp: Date.now(), changes: [], layerId: "layer1" });
    useHistoryStore.getState().undo();
    expect(useHistoryStore.getState().canRedo()).toBe(true);
    const entry = useHistoryStore.getState().redo();
    expect(entry).not.toBeNull();
  });

  it("clears redo stack on new command after undo", () => {
    useHistoryStore.getState().pushEntry({ type: "pixel", id: "a", name: "A", timestamp: 1, changes: [], layerId: "layer1" });
    useHistoryStore.getState().pushEntry({ type: "pixel", id: "b", name: "B", timestamp: 2, changes: [], layerId: "layer1" });
    useHistoryStore.getState().undo();
    useHistoryStore.getState().pushEntry({ type: "pixel", id: "c", name: "C", timestamp: 3, changes: [], layerId: "layer1" });
    expect(useHistoryStore.getState().canRedo()).toBe(false);
  });

  it("limits history to 50", () => {
    for (let i = 0; i < 60; i++) {
      useHistoryStore.getState().pushEntry({ type: "pixel", id: `c${i}`, name: `C${i}`, timestamp: i, changes: [], layerId: "layer1" });
    }
    expect(useHistoryStore.getState().entries.length).toBe(50);
  });
});

describe("hexToRgba / rgbaToHex", () => {
  it("converts hex to RGBA", () => {
    const result = hexToRgba("#FF00AA");
    expect(result.r).toBe(255);
    expect(result.g).toBe(0);
    expect(result.b).toBe(170);
    expect(result.a).toBe(255);
  });

  it("converts RGBA to hex", () => {
    expect(rgbaToHex(255, 0, 170)).toBe("#ff00aa");
    expect(rgbaToHex(255, 0, 170, 128)).toBe("#ff00aa80");
  });
});
