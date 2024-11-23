import { create } from 'zustand';
import { BoardState, Position, ValidationResult } from '@/types/board';
import { Effect, ItemType, ZoneType } from '@prisma/client';

interface BoardStore {
  boardState: BoardState | null;
  selectedZoneId: string | null;
  activeEffects: Effect[];
  
  // Board State Management
  setBoardState: (state: BoardState) => void;
  updateZone: (zoneId: string, updates: Partial<BoardZone>) => void;
  selectZone: (zoneId: string | null) => void;
  
  // Item Placement
  placeItem: (itemId: string, zoneId: string, position: Position) => Promise<boolean>;
  removeItem: (itemId: string, zoneId: string) => Promise<boolean>;
  moveItem: (itemId: string, fromZoneId: string, toZoneId: string, position: Position) => Promise<boolean>;
  
  // Effect Management
  addEffect: (effect: Effect) => void;
  removeEffect: (effectId: string) => void;
  getActiveEffects: (params: {
    zoneId?: string;
    playerId?: string;
    type?: EffectType;
  }) => Effect[];
  
  // Validation
  validatePlacement: (itemId: string, zoneId: string, position: Position) => ValidationResult;
  getValidZones: (itemId: string) => string[];
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  boardState: null,
  selectedZoneId: null,
  activeEffects: [],

  setBoardState: (state) => set({ boardState: state }),

  updateZone: (zoneId, updates) => {
    set((state) => ({
      boardState: state.boardState ? {
        ...state.boardState,
        zones: state.boardState.zones.map((zone) =>
          zone.id === zoneId ? { ...zone, ...updates } : zone
        ),
      } : null,
    }));
  },

  selectZone: (zoneId) => set({ selectedZoneId: zoneId }),

  placeItem: async (itemId, zoneId, position) => {
    const { validatePlacement } = get();
    const validation = validatePlacement(itemId, zoneId, position);

    if (!validation.valid) {
      return false;
    }

    try {
      const response = await fetch('/api/board/place-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, zoneId, position }),
      });

      if (!response.ok) {
        throw new Error('Failed to place item');
      }

      const updatedState = await response.json();
      set({ boardState: updatedState });
      return true;
    } catch (error) {
      console.error('Error placing item:', error);
      return false;
    }
  },

  removeItem: async (itemId, zoneId) => {
    try {
      const response = await fetch('/api/board/remove-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, zoneId }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      const updatedState = await response.json();
      set({ boardState: updatedState });
      return true;
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  },

  moveItem: async (itemId, fromZoneId, toZoneId, position) => {
    const { validatePlacement } = get();
    const validation = validatePlacement(itemId, toZoneId, position);

    if (!validation.valid) {
      return false;
    }

    try {
      const response = await fetch('/api/board/move-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, fromZoneId, toZoneId, position }),
      });

      if (!response.ok) {
        throw new Error('Failed to move item');
      }

      const updatedState = await response.json();
      set({ boardState: updatedState });
      return true;
    } catch (error) {
      console.error('Error moving item:', error);
      return false;
    }
  },

  addEffect: (effect) => {
    set((state) => ({
      activeEffects: [...state.activeEffects, effect],
    }));
  },

  removeEffect: (effectId) => {
    set((state) => ({
      activeEffects: state.activeEffects.filter((effect) => effect.id !== effectId),
    }));
  },

  getActiveEffects: ({ zoneId, playerId, type }) => {
    const { activeEffects } = get();
    return activeEffects.filter((effect) => {
      if (zoneId && effect.zoneId !== zoneId) return false;
      if (playerId && effect.playerId !== playerId) return false;
      if (type && effect.type !== type) return false;
      return true;
    });
  },

  validatePlacement: (itemId, zoneId, position) => {
    const { boardState, activeEffects } = get();
    if (!boardState) {
      return { valid: false, errors: ['Board state not initialized'] };
    }

    const zone = boardState.zones.find((z) => z.id === zoneId);
    if (!zone) {
      return { valid: false, errors: ['Invalid zone'] };
    }

    // Implement validation logic considering:
    // 1. Zone type restrictions
    // 2. Active effects
    // 3. Position validity
    // 4. Item-specific rules

    return { valid: true, errors: [] };
  },

  getValidZones: (itemId) => {
    const { boardState, validatePlacement } = get();
    if (!boardState) return [];

    return boardState.zones
      .filter((zone) => {
        const validation = validatePlacement(itemId, zone.id, { x: 0, y: 0, width: 1, height: 1 });
        return validation.valid;
      })
      .map((zone) => zone.id);
  },
}));