export function CoordsDisplay({ x, y }: { x: number; y: number }) {
	return (
		<div className="absolute bottom-1 right-1 text-muted-foreground text-xs">
			({Math.round(x / 4)}, {Math.round(y / 4)})
		</div>
	);
}
