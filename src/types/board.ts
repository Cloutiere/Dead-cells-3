import { Board, BoardLayer, BoardZone, Effect, ItemType, ZoneType } from '@prisma/client';

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoardState {
  board: Board;
  layers: BoardLayer[];
  zones: BoardZone[];
  activeEffects: Effect[];
}

export interface ZoneValidation {
  canPlaceItem: (itemId: string, zoneId: string) => boolean;
  getValidZones: (itemId: string) => BoardZone[];
  validateItemPlacement: (itemId: string, zoneId: string) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface BoardConfig {
  dimensions: {
    width: number;
    height: number;
  };
  gridSize: number;
  layers: LayerConfig[];
}

export interface LayerConfig {
  name: string;
  zones: ZoneConfig[];
}

export interface ZoneConfig {
  name: string;
  type: ZoneType;
  position: Position;
  allowedTypes: ItemType[];
  properties?: Record<string, unknown>;
}