import { Card, Game, Player, Inventory, User } from '@prisma/client';

export type SafeUser = Omit<
  User,
  "emailVerified" | "hashedPassword" | "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};

export type GameWithRelations = Game & {
  cards: Card[];
  players: Player[];
};

export type CardWithGame = Card & {
  game: Game;
};

export type PlayerWithInventory = Player & {
  inventory: Inventory | null;
};

export type InventoryWithCards = Inventory & {
  cards: Card[];
};