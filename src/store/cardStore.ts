"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Card, CardZone, CardVisibility, PlayerCardState } from '@/types/cards';
import { CharacterId } from '@/types/character';

interface CardStore {
  playerStates: Map<string, PlayerCardState>;
  lastSaved: Date | null;
  
  // Card Management
  initializePlayer: (playerId: string, characterId: CharacterId, isFirstPlayer: boolean) => Promise<void>;
  createInitialDeck: (playerId: string, characterId: CharacterId) => Promise<void>;
  shuffleDeck: (playerId: string) => Promise<void>;
  
  // Card Movement
  drawCards: (playerId: string, count: number) => Promise<void>;
  moveCardsToActive: (playerId: string, cardIds: string[]) => Promise<void>;
  moveActiveToDiscard: (playerId: string) => Promise<void>;
  moveDiscardToDeck: (playerId: string) => Promise<void>;
  
  // State Management
  saveGameState: () => Promise<void>;
  loadGameState: () => Promise<void>;
  
  // State Queries
  getPlayerState: (playerId: string) => PlayerCardState | undefined;
  getVisibleCards: (playerId: string, zone: CardZone) => Card[];
  getCardCount: (playerId: string, zone: CardZone) => number;
}

export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      playerStates: new Map(),
      lastSaved: null,

      initializePlayer: async (playerId, characterId, isFirstPlayer) => {
        const initialState: PlayerCardState = {
          playerId,
          characterId,
          isFirstPlayer,
          zones: {
            [CardZone.DECK]: { cards: [], count: 0 },
            [CardZone.HAND]: { cards: [], count: 0 },
            [CardZone.ACTIVE]: { cards: [], count: 0 },
            [CardZone.DISCARD]: { cards: [], count: 0 },
          },
        };

        set((state) => ({
          playerStates: new Map(state.playerStates).set(playerId, initialState),
        }));

        await get().createInitialDeck(playerId, characterId);
        await get().drawCards(playerId, 3);
      },

      createInitialDeck: async (playerId, characterId) => {
        // Generate character-specific cards based on character ID
        const getCardRange = (characterId: CharacterId) => {
          switch (characterId) {
            case CharacterId.POISONED: return { start: 1, end: 6 };
            case CharacterId.BURNED: return { start: 7, end: 12 };
            case CharacterId.FLAYED: return { start: 13, end: 18 };
            case CharacterId.QUARTERED: return { start: 19, end: 24 };
          }
        };

        const range = getCardRange(characterId);
        const cards: Card[] = Array.from(
          { length: range.end - range.start + 1 },
          (_, i) => ({
            id: `${playerId}-card-${range.start + i}`,
            playerId,
            number: range.start + i,
            zone: CardZone.DECK,
            visibility: CardVisibility.HIDDEN,
            position: i,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        );

        set((state) => {
          const playerState = state.playerStates.get(playerId);
          if (!playerState) return state;

          const newState = {
            ...playerState,
            zones: {
              ...playerState.zones,
              [CardZone.DECK]: {
                cards,
                count: cards.length,
              },
            },
          };

          return {
            playerStates: new Map(state.playerStates).set(playerId, newState),
          };
        });

        await get().shuffleDeck(playerId);
      },

      shuffleDeck: async (playerId) => {
        set((state) => {
          const playerState = state.playerStates.get(playerId);
          if (!playerState) return state;

          const deckCards = [...playerState.zones[CardZone.DECK].cards];
          for (let i = deckCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deckCards[i], deckCards[j]] = [deckCards[j], deckCards[i]];
          }

          const newState = {
            ...playerState,
            zones: {
              ...playerState.zones,
              [CardZone.DECK]: {
                cards: deckCards,
                count: deckCards.length,
              },
            },
          };

          return {
            playerStates: new Map(state.playerStates).set(playerId, newState),
          };
        });
      },

      drawCards: async (playerId, count) => {
        set((state) => {
          const playerState = state.playerStates.get(playerId);
          if (!playerState) return state;

          const deckCards = [...playerState.zones[CardZone.DECK].cards];
          const handCards = [...playerState.zones[CardZone.HAND].cards];
          
          const drawnCards = deckCards.splice(0, count).map(card => ({
            ...card,
            zone: CardZone.HAND,
            visibility: CardVisibility.OWNER,
          }));

          const newState = {
            ...playerState,
            zones: {
              ...playerState.zones,
              [CardZone.DECK]: {
                cards: deckCards,
                count: deckCards.length,
              },
              [CardZone.HAND]: {
                cards: [...handCards, ...drawnCards],
                count: handCards.length + drawnCards.length,
              },
            },
          };

          return {
            playerStates: new Map(state.playerStates).set(playerId, newState),
          };
        });
      },

      moveCardsToActive: async (playerId, cardIds) => {
        set((state) => {
          const playerState = state.playerStates.get(playerId);
          if (!playerState) return state;

          const handCards = [...playerState.zones[CardZone.HAND].cards];
          const activeCards = [...playerState.zones[CardZone.ACTIVE].cards];
          
          const movedCards = handCards
            .filter(card => cardIds.includes(card.id))
            .map(card => ({
              ...card,
              zone: CardZone.ACTIVE,
              visibility: CardVisibility.PUBLIC,
            }));

          const remainingHandCards = handCards.filter(card => !cardIds.includes(card.id));

          const newState = {
            ...playerState,
            zones: {
              ...playerState.zones,
              [CardZone.HAND]: {
                cards: remainingHandCards,
                count: remainingHandCards.length,
              },
              [CardZone.ACTIVE]: {
                cards: [...activeCards, ...movedCards],
                count: activeCards.length + movedCards.length,
              },
            },
          };

          return {
            playerStates: new Map(state.playerStates).set(playerId, newState),
          };
        });
      },

      moveActiveToDiscard: async (playerId) => {
        set((state) => {
          const playerState = state.playerStates.get(playerId);
          if (!playerState) return state;

          const activeCards = [...playerState.zones[CardZone.ACTIVE].cards];
          const discardCards = [...playerState.zones[CardZone.DISCARD].cards];
          
          const movedCards = activeCards.map(card => ({
            ...card,
            zone: CardZone.DISCARD,
            visibility: CardVisibility.HIDDEN,
          }));

          const newState = {
            ...playerState,
            zones: {
              ...playerState.zones,
              [CardZone.ACTIVE]: {
                cards: [],
                count: 0,
              },
              [CardZone.DISCARD]: {
                cards: [...discardCards, ...movedCards],
                count: discardCards.length + movedCards.length,
              },
            },
          };

          return {
            playerStates: new Map(state.playerStates).set(playerId, newState),
          };
        });
      },

      moveDiscardToDeck: async (playerId) => {
        set((state) => {
          const playerState = state.playerStates.get(playerId);
          if (!playerState) return state;

          const discardCards = [...playerState.zones[CardZone.DISCARD].cards];
          
          const movedCards = discardCards.map(card => ({
            ...card,
            zone: CardZone.DECK,
            visibility: CardVisibility.HIDDEN,
          }));

          const newState = {
            ...playerState,
            zones: {
              ...playerState.zones,
              [CardZone.DISCARD]: {
                cards: [],
                count: 0,
              },
              [CardZone.DECK]: {
                cards: movedCards,
                count: movedCards.length,
              },
            },
          };

          return {
            playerStates: new Map(state.playerStates).set(playerId, newState),
          };
        });

        await get().shuffleDeck(playerId);
      },

      saveGameState: async () => {
        set({ lastSaved: new Date() });
      },

      loadGameState: async () => {
        // State is automatically loaded by zustand/persist
      },

      getPlayerState: (playerId) => {
        return get().playerStates.get(playerId);
      },

      getVisibleCards: (playerId, zone) => {
        const playerState = get().playerStates.get(playerId);
        if (!playerState) return [];

        return playerState.zones[zone].cards.filter(card => 
          card.visibility === CardVisibility.PUBLIC ||
          (card.visibility === CardVisibility.OWNER && card.playerId === playerId)
        );
      },

      getCardCount: (playerId, zone) => {
        const playerState = get().playerStates.get(playerId);
        if (!playerState) return 0;

        return playerState.zones[zone].count;
      },
    }),
    {
      name: 'card-store',
    }
  )
);