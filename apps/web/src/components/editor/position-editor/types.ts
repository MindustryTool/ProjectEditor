import type { PositionData, ShootPositionData } from "@project/schema";

export type DragHandler = (x: number, y: number) => void;

export interface SpriteItemProps {
	region: PositionData;
	data: string;
	write: (data: string) => void;
}

export interface ShootItemProps {
	region: ShootPositionData;
	data: string;
	write: (data: string) => void;
}
