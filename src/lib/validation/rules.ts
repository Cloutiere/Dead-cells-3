import { ValidationRule, GameState, ItemMovement } from '@/types/game';
import { InventoryType, ZoneType, ItemType, ItemState } from '@prisma/client';

export const createCapacityRule = (maxItems: number): ValidationRule => ({
  type: 'capacity',
  validate: (movement: ItemMovement, gameState: GameState) => {
    const targetInventory = gameState.inventories.find(i => i.id === movement.toInventoryId);
    if (!targetInventory) return true;
    return targetInventory.items.filter(i => !i.leftAt).length < maxItems;
  },
  message: `Inventory cannot contain more than ${maxItems} items`,
});

export const createItemTypeRule = (allowedTypes: ItemType[]): ValidationRule => ({
  type: 'itemType',
  validate: (movement: ItemMovement, gameState: GameState) => {
    const item = gameState.items.find(i => i.id === movement.itemId);
    if (!item) return false;
    return allowedTypes.includes(item.type);
  },
  message: `Only ${allowedTypes.join(', ')} items are allowed in this location`,
});

export const createStateRule = (allowedStates: ItemState[]): ValidationRule => ({
  type: 'state',
  validate: (movement: ItemMovement, gameState: GameState) => {
    const item = gameState.items.find(i => i.id === movement.itemId);
    if (!item) return false;
    return allowedStates.includes(item.state);
  },
  message: `Item must be in one of these states: ${allowedStates.join(', ')}`,
});

export const defaultGameConfig = {
  inventoryRules: {
    [InventoryType.PLAYER_HAND]: [
      createCapacityRule(10),
      createItemTypeRule([ItemType.CARD]),
      createStateRule([ItemState.ACTIVE]),
    ],
    [InventoryType.PLAYER_DECK]: [
      createItemTypeRule([ItemType.CARD]),
      createStateRule([ItemState.INACTIVE, ItemState.ACTIVE]),
    ],
    [InventoryType.SHARED_POOL]: [
      createItemTypeRule([ItemType.TOKEN]),
      createStateRule([ItemState.ACTIVE]),
    ],
    // Add rules for other inventory types...
  },
  zoneRules: {
    [ZoneType.PLAY_AREA]: [
      createStateRule([ItemState.ACTIVE]),
    ],
    [ZoneType.MARKET]: [
      createCapacityRule(5),
      createItemTypeRule([ItemType.CARD]),
      createStateRule([ItemState.ACTIVE]),
    ],
    // Add rules for other zone types...
  },
  moveValidators: [
    {
      type: 'custom',
      validate: (movement: ItemMovement, gameState: GameState) => {
        const item = gameState.items.find(i => i.id === movement.itemId);
        return item?.state !== ItemState.DESTROYED;
      },
      message: 'Cannot move destroyed items',
    },
  ],
};