import { create } from 'zustand';
import { GameState, ItemMovement, ValidationRule, GameConfig } from '@/types/game';

interface GameStateStore {
  gameState: GameState | null;
  config: GameConfig | null;
  movementHistory: ItemMovement[];
  setGameState: (state: GameState) => void;
  setConfig: (config: GameConfig) => void;
  moveItem: (movement: ItemMovement) => Promise<boolean>;
  undoLastMove: () => Promise<boolean>;
  validateMove: (movement: ItemMovement) => boolean;
}

export const useGameStateStore = create<GameStateStore>((set, get) => ({
  gameState: null,
  config: null,
  movementHistory: [],

  setGameState: (state) => set({ gameState: state }),
  
  setConfig: (config) => set({ config: config }),

  moveItem: async (movement) => {
    const { gameState, config, validateMove } = get();
    
    if (!gameState || !config || !validateMove(movement)) {
      return false;
    }

    try {
      // API call to update item location
      const response = await fetch('/api/game/move-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movement),
      });

      if (!response.ok) {
        throw new Error('Failed to move item');
      }

      const updatedState = await response.json();
      set((state) => ({
        gameState: updatedState,
        movementHistory: [...state.movementHistory, movement],
      }));

      return true;
    } catch (error) {
      console.error('Error moving item:', error);
      return false;
    }
  },

  undoLastMove: async () => {
    const { movementHistory } = get();
    if (movementHistory.length === 0) return false;

    const lastMove = movementHistory[movementHistory.length - 1];
    const reverseMove: ItemMovement = {
      itemId: lastMove.itemId,
      fromInventoryId: lastMove.toInventoryId,
      toInventoryId: lastMove.fromInventoryId,
      fromZoneId: lastMove.toZoneId,
      toZoneId: lastMove.fromZoneId,
      position: lastMove.position,
    };

    try {
      const response = await fetch('/api/game/undo-move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reverseMove),
      });

      if (!response.ok) {
        throw new Error('Failed to undo move');
      }

      const updatedState = await response.json();
      set((state) => ({
        gameState: updatedState,
        movementHistory: state.movementHistory.slice(0, -1),
      }));

      return true;
    } catch (error) {
      console.error('Error undoing move:', error);
      return false;
    }
  },

  validateMove: (movement) => {
    const { gameState, config } = get();
    if (!gameState || !config) return false;

    const allRules: ValidationRule[] = [
      ...config.moveValidators,
      ...(movement.toInventoryId
        ? config.inventoryRules[gameState.inventories.find(i => i.id === movement.toInventoryId)?.type!] || []
        : []),
      ...(movement.toZoneId
        ? config.zoneRules[gameState.zones.find(z => z.id === movement.toZoneId)?.type!] || []
        : []),
    ];

    return allRules.every(rule => rule.validate(movement, gameState));
  },
}));