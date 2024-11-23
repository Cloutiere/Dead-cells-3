import { Game, GameItem, Inventory, GameZone, ItemLocation, ItemType, ItemState, InventoryType, ZoneType } from '@prisma/client';

export interface GameItemWithLocations extends GameItem {
  locations: ItemLocation[];
}

export interface InventoryWithItems extends Inventory {
  items: ItemLocation[];
}

export interface GameZoneWithItems extends GameZone {
  items: ItemLocation[];
}

export interface GameState {
  game: Game;
  items: GameItemWithLocations[];
  inventories: InventoryWithItems[];
  zones: GameZoneWithItems[];
}

export interface ItemMovement {
  itemId: string;
  fromInventoryId?: string;
  toInventoryId?: string;
  fromZoneId?: string;
  toZoneId?: string;
  position: number;
}

export interface ValidationRule {
  type: 'capacity' | 'itemType' | 'state' | 'custom';
  validate: (movement: ItemMovement, gameState: GameState) => boolean;
  message: string;
}

export type GameConfig = {
  inventoryRules: Record<InventoryType, ValidationRule[]>;
  zoneRules: Record<ZoneType, ValidationRule[]>;
  moveValidators: ValidationRule[];
};