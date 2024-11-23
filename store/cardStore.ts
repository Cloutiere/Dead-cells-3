"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CharacterId } from '@/types/character';

const MAX_HAND_CARDS = 3;
const MAX_ACTIVE_CARDS = 2;

interface CardState {
  id: string;
  playerId: string;
  number: number;
  zone: 'DECK' | 'HAND' | 'ACTIVE' | 'DISCARD';
  visibility: 'HIDDEN' | 'OWNER' | 'PUBLIC';
  position?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PlayerState {
  playerId: string;
  characterId: CharacterId;
  isFirstPlayer: boolean;
  zones: {
    DECK: { cards: CardState[]; count: number; };
    HAND: { cards: CardState[]; count: number; };
    ACTIVE: { cards: CardState[]; count: number; };
    DISCARD: { cards: CardState[]; count: number; };
  };
}

type PlayerStatesMap = Record<string, PlayerState>;

interface CardStore {
  playerStates: PlayerStatesMap;
  lastSaved: Date | null;
  
  initializePlayer: (playerId: string, characterId: CharacterId, isFirstPlayer: boolean) => Promise<void>;
  createInitialDeck: (playerId: string, characterId: CharacterId) => Promise<void>;
  shuffleDeck: (playerId: string) => Promise<void>;
  drawCards: (playerId: string, count: number) => Promise<void>;
  moveCardsToActive: (playerId: string, cardIds: string[]) => Promise<void>;
  moveActiveToDiscard: (playerId: string) => Promise<void>;
  moveDiscardToDeck: (playerId: string) => Promise<void>;
  attemptDrawCard: (playerId: string) => Promise<void>;
  
  getPlayerState: (playerId: string) => PlayerState | undefined;
  getVisibleCards: (playerId: string, zone: CardState['zone']) => CardState[];
  getCardCount: (playerId: string, zone: CardState['zone']) => number;
  canDrawCards: (playerId: string) => boolean;
  canPlayCard: (playerId: string, cardId: string) => boolean;
}

export const useCardStore = create<CardStore>()(
  persist(
    (set, get) => ({
      playerStates: {},
      lastSaved: null,

      canDrawCards: (playerId) => {
        const state = get().playerStates[playerId];
        if (!state) return false;
        
        if (state.zones.ACTIVE.cards.length > 0) return false;
        return state.zones.HAND.cards.length < MAX_HAND_CARDS;
      },

      canPlayCard: (playerId, cardId) => {
        const state = get().playerStates[playerId];
        if (!state) return false;

        const activeCards = state.zones.ACTIVE.cards.length;
        const handCards = state.zones.HAND.cards.length;

        // Si la zone active est vide, on doit avoir exactement 3 cartes en main
        if (activeCards === 0 && handCards < MAX_HAND_CARDS) {
          return false;
        }

        // Vérifier la limite de cartes actives
        if (activeCards >= MAX_ACTIVE_CARDS) {
          return false;
        }

        return true;
      },

      initializePlayer: async (playerId, characterId, isFirstPlayer) => {
        const initialState: PlayerState = {
          playerId,
          characterId,
          isFirstPlayer,
          zones: {
            DECK: { cards: [], count: 0 },
            HAND: { cards: [], count: 0 },
            ACTIVE: { cards: [], count: 0 },
            DISCARD: { cards: [], count: 0 },
          },
        };

        set((state) => ({
          playerStates: {
            ...state.playerStates,
            [playerId]: initialState,
          },
        }));

        await get().createInitialDeck(playerId, characterId);
        await get().drawCards(playerId, MAX_HAND_CARDS);
      },

      attemptDrawCard: async (playerId) => {
        const state = get().playerStates[playerId];
        if (!state) return;

        // Vérifier si on peut piger
        if (!get().canDrawCards(playerId)) return;

        // Si le deck est vide et qu'il y a des cartes dans la défausse
        if (state.zones.DECK.cards.length === 0 && state.zones.DISCARD.cards.length > 0) {
          await get().moveDiscardToDeck(playerId);
        }

        // Tenter de piger une carte
        if (state.zones.DECK.cards.length > 0) {
          await get().drawCards(playerId, 1);
        }
      },

      createInitialDeck: async (playerId, characterId) => {
        let start: number, end: number;
        
        switch (characterId) {
          case CharacterId.POISONED:
            start = 1;
            end = 6;
            break;
          case CharacterId.BURNED:
            start = 7;
            end = 12;
            break;
          case CharacterId.FLAYED:
            start = 13;
            end = 18;
            break;
          case CharacterId.QUARTERED:
            start = 19;
            end = 24;
            break;
        }

        const cards: CardState[] = Array.from(
          { length: end - start + 1 },
          (_, i) => ({
            id: `${playerId}-card-${start + i}`,
            playerId,
            number: start + i,
            zone: 'DECK',
            visibility: 'HIDDEN',
            position: i,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        );

        set((state) => ({
          playerStates: {
            ...state.playerStates,
            [playerId]: {
              ...state.playerStates[playerId],
              zones: {
                ...state.playerStates[playerId].zones,
                DECK: {
                  cards,
                  count: cards.length,
                },
              },
            },
          },
        }));

        await get().shuffleDeck(playerId);
      },

      shuffleDeck: async (playerId) => {
        set((state) => {
          const playerState = state.playerStates[playerId];
          if (!playerState) return state;

          const deckCards = [...playerState.zones.DECK.cards];
          for (let i = deckCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deckCards[i], deckCards[j]] = [deckCards[j], deckCards[i]];
          }

          return {
            playerStates: {
              ...state.playerStates,
              [playerId]: {
                ...playerState,
                zones: {
                  ...playerState.zones,
                  DECK: {
                    cards: deckCards,
                    count: deckCards.length,
                  },
                },
              },
            },
          };
        });
      },

      drawCards: async (playerId, count) => {
        set((state) => {
          const playerState = state.playerStates[playerId];
          if (!playerState) return state;

          const { canDrawCards } = get();
          
          if (!canDrawCards(playerId)) return state;

          let deckCards = [...playerState.zones.DECK.cards];
          const handCards = [...playerState.zones.HAND.cards];
          
          if (deckCards.length === 0 && playerState.zones.DISCARD.cards.length > 0) {
            get().moveDiscardToDeck(playerId);
            deckCards = [...playerState.zones.DECK.cards];
          }

          if (deckCards.length === 0) return state;

          const availableSpace = MAX_HAND_CARDS - handCards.length;
          const cardsToDraw = Math.min(count, availableSpace, deckCards.length);
          
          const drawnCards = deckCards.splice(0, cardsToDraw).map(card => ({
            ...card,
            zone: 'HAND' as const,
            visibility: 'OWNER' as const,
          }));

          return {
            playerStates: {
              ...state.playerStates,
              [playerId]: {
                ...playerState,
                zones: {
                  ...playerState.zones,
                  DECK: {
                    cards: deckCards,
                    count: deckCards.length,
                  },
                  HAND: {
                    cards: [...handCards, ...drawnCards],
                    count: handCards.length + drawnCards.length,
                  },
                },
              },
            },
          };
        });
      },

      moveCardsToActive: async (playerId, cardIds) => {
        set((state) => {
          const playerState = state.playerStates[playerId];
          if (!playerState) return state;

          const handCards = [...playerState.zones.HAND.cards];
          const activeCards = playerState.zones.ACTIVE.cards;
          if (activeCards.length >= MAX_ACTIVE_CARDS) return state;

          const movedCards = handCards
            .filter(card => cardIds.includes(card.id))
            .map(card => ({
              ...card,
              zone: 'ACTIVE' as const,
              visibility: 'PUBLIC' as const,
            }))
            .slice(0, MAX_ACTIVE_CARDS - activeCards.length);

          const remainingHandCards = handCards.filter(card => !cardIds.includes(card.id));

          return {
            playerStates: {
              ...state.playerStates,
              [playerId]: {
                ...playerState,
                zones: {
                  ...playerState.zones,
                  HAND: {
                    cards: remainingHandCards,
                    count: remainingHandCards.length,
                  },
                  ACTIVE: {
                    cards: [...activeCards, ...movedCards],
                    count: activeCards.length + movedCards.length,
                  },
                },
              },
            },
          };
        });
      },

      moveActiveToDiscard: async (playerId) => {
        set((state) => {
          const playerState = state.playerStates[playerId];
          if (!playerState) return state;

          const activeCards = [...playerState.zones.ACTIVE.cards];
          const discardCards = [...playerState.zones.DISCARD.cards];
          
          const movedCards = activeCards.map(card => ({
            ...card,
            zone: 'DISCARD' as const,
            visibility: 'HIDDEN' as const,
          }));

          const newState = {
            playerStates: {
              ...state.playerStates,
              [playerId]: {
                ...playerState,
                zones: {
                  ...playerState.zones,
                  ACTIVE: {
                    cards: [],
                    count: 0,
                  },
                  DISCARD: {
                    cards: [...discardCards, ...movedCards],
                    count: discardCards.length + movedCards.length,
                  },
                },
              },
            },
          };

          return newState;
        });
      },

      moveDiscardToDeck: async (playerId) => {
        set((state) => {
          const playerState = state.playerStates[playerId];
          if (!playerState) return state;

          const discardCards = [...playerState.zones.DISCARD.cards];
          
          const movedCards = discardCards.map(card => ({
            ...card,
            zone: 'DECK' as const,
            visibility: 'HIDDEN' as const,
          }));

          return {
            playerStates: {
              ...state.playerStates,
              [playerId]: {
                ...playerState,
                zones: {
                  ...playerState.zones,
                  DISCARD: {
                    cards: [],
                    count: 0,
                  },
                  DECK: {
                    cards: movedCards,
                    count: movedCards.length,
                  },
                },
              },
            },
          };
        });

        await get().shuffleDeck(playerId);
      },

      getPlayerState: (playerId) => {
        return get().playerStates[playerId];
      },

      getVisibleCards: (playerId, zone) => {
        const playerState = get().playerStates[playerId];
        if (!playerState) return [];

        return playerState.zones[zone].cards.filter(card => 
          card.visibility === 'PUBLIC' ||
          (card.visibility === 'OWNER' && card.playerId === playerId)
        );
      },

      getCardCount: (playerId, zone) => {
        const playerState = get().playerStates[playerId];
        if (!playerState) return 0;

        return playerState.zones[zone].count;
      },
    }),
    {
      name: 'card-store',
    }
  )
);