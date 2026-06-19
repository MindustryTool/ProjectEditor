import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useCanvasInteraction } from "#/components/editor/position-editor/use-canvas-interaction";

function createMockTouch(clientX: number, clientY: number): Touch {
	return { clientX, clientY } as Touch;
}

function createMockTouchEvent(touches: Touch[]): TouchEvent {
	return { touches, preventDefault: vi.fn() } as unknown as TouchEvent;
}

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

describe("useCanvasInteraction", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns the expected interface", () => {
		const { result } = renderHook(() => useCanvasInteraction(DEFAULT_WIDTH, DEFAULT_HEIGHT));

		expect(result.current.stageRef).toBeDefined();
		expect(result.current.scaleRef).toBeDefined();
		expect(result.current.posRef).toBeDefined();
		expect(typeof result.current.handleWheel).toBe("function");
		expect(typeof result.current.handleDragMove).toBe("function");
		expect(typeof result.current.handleDragEnd).toBe("function");
		expect(typeof result.current.handleTouchStart).toBe("function");
		expect(typeof result.current.handleTouchMove).toBe("function");
		expect(typeof result.current.handleTouchEnd).toBe("function");
	});

	it("initializes with default scale 1 and position (0,0)", () => {
		const { result } = renderHook(() => useCanvasInteraction(DEFAULT_WIDTH, DEFAULT_HEIGHT));

		expect(result.current.scaleRef.current).toBe(1);
		expect(result.current.posRef.current).toEqual({ x: 0, y: 0 });
	});

	it("handles single-finger touch start without crashing", () => {
		const { result } = renderHook(() => useCanvasInteraction(DEFAULT_WIDTH, DEFAULT_HEIGHT));

		const event = createMockTouchEvent([createMockTouch(100, 200)]);
		result.current.handleTouchStart({ evt: event } as never);

		expect(result.current.posRef.current).toEqual({ x: 0, y: 0 });
	});

	it("handles two-finger pinch start without crashing", () => {
		const { result } = renderHook(() => useCanvasInteraction(DEFAULT_WIDTH, DEFAULT_HEIGHT));

		const event = createMockTouchEvent([createMockTouch(100, 200), createMockTouch(150, 250)]);
		result.current.handleTouchStart({ evt: event } as never);

		expect(result.current.posRef.current).toEqual({ x: 0, y: 0 });
	});

	it("handles touch end without crashing", () => {
		const { result } = renderHook(() => useCanvasInteraction(DEFAULT_WIDTH, DEFAULT_HEIGHT));

		result.current.handleTouchStart({ evt: createMockTouchEvent([createMockTouch(100, 200)]) } as never);
		result.current.handleTouchEnd();
	});

	it("touch pan with movement below dead zone does not trigger pan", () => {
		const { result } = renderHook(() => useCanvasInteraction(DEFAULT_WIDTH, DEFAULT_HEIGHT));

		result.current.handleTouchStart({ evt: createMockTouchEvent([createMockTouch(100, 200)]) } as never);
		result.current.handleTouchMove({ evt: createMockTouchEvent([createMockTouch(102, 201)]) } as never);

		expect(result.current.posRef.current).toEqual({ x: 0, y: 0 });
	});

	it("returns forceRender as a function", () => {
		const { result } = renderHook(() => useCanvasInteraction(DEFAULT_WIDTH, DEFAULT_HEIGHT));

		expect(typeof result.current.forceRender).toBe("function");
	});
});
