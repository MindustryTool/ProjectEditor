import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { usePixelEditorStore } from "../store/pixel-editor-store";
import { useLayerStore } from "../store/layer-store";
import { useHistoryStore } from "../store/history-store";
import { PixelCanvas, setPixel, getPixel } from "../utils/pixel-canvas";
import { PixelToolbar } from "../components/PixelToolbar";
import { NewCanvasDialog } from "../components/NewCanvasDialog";
import { hexToRgba, rgbaToHex } from "../utils/drawing-tools";

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
    render(<PixelToolbar onSave={vi.fn()} />);
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
    render(<PixelToolbar onSave={vi.fn()} />);
    expect(screen.getByTitle("Pencil").className).toContain("bg-accent");
  });

  it("changes tool on click", () => {
    render(<PixelToolbar onSave={vi.fn()} />);
    fireEvent.click(screen.getByTitle("Eraser"));
    expect(usePixelEditorStore.getState().tool).toBe("eraser");
    fireEvent.click(screen.getByTitle("Line"));
    expect(usePixelEditorStore.getState().tool).toBe("line");
  });

  it("undo button is disabled when no history", () => {
    render(<PixelToolbar onSave={vi.fn()} />);
    expect(screen.getByTitle("Undo (Ctrl+Z)").hasAttribute("disabled")).toBe(true);
    expect(screen.getByTitle("Redo (Ctrl+Shift+Z)").hasAttribute("disabled")).toBe(true);
  });

  it("undo button is enabled after pushing history", () => {
    useHistoryStore.getState().pushCommand({ name: "Test", do: () => {}, undo: () => {} });
    render(<PixelToolbar onSave={vi.fn()} />);
    expect(screen.getByTitle("Undo (Ctrl+Z)").hasAttribute("disabled")).toBe(false);
  });

  it("triggers undo on click", () => {
    let undone = false;
    useHistoryStore.getState().pushCommand({ name: "Test", do: () => {}, undo: () => { undone = true; } });
    render(<PixelToolbar onSave={vi.fn()} />);
    fireEvent.click(screen.getByTitle("Undo (Ctrl+Z)"));
    expect(undone).toBe(true);
  });

  it("calls onSave when save button clicked", () => {
    const onSave = vi.fn();
    render(<PixelToolbar onSave={onSave} />);
    fireEvent.click(screen.getByTitle("Save (Ctrl+S)"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it("opens new canvas dialog", () => {
    render(<PixelToolbar onSave={vi.fn()} />);
    fireEvent.click(screen.getByTitle("New"));
    expect(usePixelEditorStore.getState().showNewCanvasDialog).toBe(true);
  });

  it("renders foreground and background color swatches", () => {
    render(<PixelToolbar onSave={vi.fn()} />);
    expect(screen.queryByTitle("Foreground Color")).toBeTruthy();
    expect(screen.queryByTitle("Background Color")).toBeTruthy();
  });

  it("swaps colors on swap button click", () => {
    usePixelEditorStore.setState({ foregroundColor: "#ff0000", backgroundColor: "#00ff00" });
    render(<PixelToolbar onSave={vi.fn()} />);
    fireEvent.click(screen.getByTitle("Swap (X)"));
    const state = usePixelEditorStore.getState();
    expect(state.foregroundColor).toBe("#00ff00");
    expect(state.backgroundColor).toBe("#ff0000");
  });

  it("toggles grid visibility", () => {
    render(<PixelToolbar onSave={vi.fn()} />);
    fireEvent.click(screen.getByTitle("Toggle Grid"));
    expect(usePixelEditorStore.getState().gridVisible).toBe(true);
    fireEvent.click(screen.getByTitle("Toggle Grid"));
    expect(usePixelEditorStore.getState().gridVisible).toBe(false);
  });

  it("toggles checkerboard visibility", () => {
    render(<PixelToolbar onSave={vi.fn()} />);
    fireEvent.click(screen.getByTitle("Toggle Transparency"));
    expect(usePixelEditorStore.getState().checkerboardVisible).toBe(false);
    fireEvent.click(screen.getByTitle("Toggle Transparency"));
    expect(usePixelEditorStore.getState().checkerboardVisible).toBe(true);
  });

  it("brush size slider updates brush size", () => {
    render(<PixelToolbar onSave={vi.fn()} />);
    const slider = document.querySelector('input[type="range"]') as HTMLInputElement;
    expect(slider).not.toBeNull();
    fireEvent.change(slider, { target: { value: "10" } });
    expect(usePixelEditorStore.getState().brushSize).toBe(10);
  });
});

describe("NewCanvasDialog", () => {
  afterEach(cleanup);
  beforeEach(() => {
    usePixelEditorStore.setState({ showNewCanvasDialog: true, width: 64, height: 64 });
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
    const data = new Uint8ClampedArray(8 * 8 * 4);
    setPixel(data, 8, 3, 4, 255, 128, 64, 255);
    const [r, g, b, a] = getPixel(data, 8, 3, 4);
    expect(r).toBe(255);
    expect(g).toBe(128);
    expect(b).toBe(64);
    expect(a).toBe(255);
  });

  it("serializes and deserializes canvas", () => {
    const canvas = new PixelCanvas(32, 32);
    canvas.addLayer("Colors");
    setPixel(canvas.currentLayer.data, 32, 10, 10, 100, 150, 200, 255);
    const serialized = canvas.serialize();
    const restored = PixelCanvas.deserialize(serialized);
    expect(restored.width).toBe(32);
    expect(restored.height).toBe(32);
    expect(restored.layerCount).toBe(2);
    const [r] = getPixel(restored.currentLayer.data, 32, 10, 10);
    expect(r).toBe(100);
  });

  it("composites layers correctly", () => {
    const canvas = new PixelCanvas(4, 4);
    setPixel(canvas.layers[0]!.data, 4, 0, 0, 255, 0, 0, 255);
    canvas.addLayer("Top");
    setPixel(canvas.layers[1]!.data, 4, 0, 0, 0, 255, 0, 128);
    const composite = canvas.getCompositeData();
    const [cr, cg] = getPixel(composite, 4, 0, 0);
    expect(cr).toBeGreaterThan(0);
    expect(cg).toBeGreaterThan(0);
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
    let executed = false;
    useHistoryStore.getState().pushCommand({ name: "Test", do: () => {}, undo: () => { executed = true; } });
    expect(useHistoryStore.getState().canUndo()).toBe(true);
    useHistoryStore.getState().undo();
    expect(executed).toBe(true);
  });

  it("redoes undone commands", () => {
    let executed = false;
    useHistoryStore.getState().pushCommand({ name: "Test", do: () => { executed = true; }, undo: () => {} });
    useHistoryStore.getState().undo();
    executed = false;
    useHistoryStore.getState().redo();
    expect(executed).toBe(true);
  });

  it("clears redo stack on new command after undo", () => {
    useHistoryStore.getState().pushCommand({ name: "A", do: () => {}, undo: () => {} });
    useHistoryStore.getState().pushCommand({ name: "B", do: () => {}, undo: () => {} });
    useHistoryStore.getState().undo();
    useHistoryStore.getState().pushCommand({ name: "C", do: () => {}, undo: () => {} });
    expect(useHistoryStore.getState().canRedo()).toBe(false);
  });

  it("limits history to 50", () => {
    for (let i = 0; i < 60; i++) {
      useHistoryStore.getState().pushCommand({ name: `C${i}`, do: () => {}, undo: () => {} });
    }
    expect(useHistoryStore.getState().undoStack.length).toBe(50);
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
