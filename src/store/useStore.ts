import { create } from 'zustand';
import { GameWithRelations, CardWithGame, PlayerWithInventory } from '@/types';

interface GameStore {
  games: GameWithRelations[];
  selectedGame: GameWithRelations | null;
  setGames: (games: GameWithRelations[]) => void;
  setSelectedGame: (game: GameWithRelations | null) => void;
  addGame: (game: GameWithRelations) => void;
  updateGame: (game: GameWithRelations) => void;
  deleteGame: (gameId: string) => void;
}

interface CardStore {
  cards: CardWithGame[];
  selectedCard: CardWithGame | null;
  setCards: (cards: CardWithGame[]) => void;
  setSelectedCard: (card: CardWithGame | null) => void;
  addCard: (card: CardWithGame) => void;
  updateCard: (card: CardWithGame) => void;
  deleteCard: (cardId: string) => void;
}

interface PlayerStore {
  players: PlayerWithInventory[];
  selectedPlayer: PlayerWithInventory | null;
  setPlayers: (players: PlayerWithInventory[]) => void;
  setSelectedPlayer: (player: PlayerWithInventory | null) => void;
  addPlayer: (player: PlayerWithInventory) => void;
  updatePlayer: (player: PlayerWithInventory) => void;
  deletePlayer: (playerId: string) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  games: [],
  selectedGame: null,
  setGames: (games) => set({ games }),
  setSelectedGame: (game) => set({ selectedGame: game }),
  addGame: (game) => set((state) => ({ games: [...state.games, game] })),
  updateGame: (game) =>
    set((state) => ({
      games: state.games.map((g) => (g.id === game.id ? game : g)),
    })),
  deleteGame: (gameId) =>
    set((state) => ({
      games: state.games.filter((g) => g.id !== gameId),
    })),
}));

export const useCardStore = create<CardStore>((set) => ({
  cards: [],
  selectedCard: null,
  setCards: (cards) => set({ cards }),
  setSelectedCard: (card) => set({ selectedCard: card }),
  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  updateCard: (card) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === card.id ? card : c)),
    })),
  deleteCard: (cardId) =>
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== cardId),
    })),
}));

export const usePlayerStore = create<PlayerStore>((set) => ({
  players: [],
  selectedPlayer: null,
  setPlayers: (players) => set({ players }),
  setSelectedPlayer: (player) => set({ selectedPlayer: player }),
  addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
  updatePlayer: (player) =>
    set((state) => ({
      players: state.players.map((p) => (p.id === player.id ? player : p)),
    })),
  deletePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    })),
}));