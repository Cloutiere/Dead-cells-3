import { z } from 'zod';
import { CharacterId } from './character';

export enum CardZone {
  DECK = 'DECK',
  HAND = 'HAND',
  ACTIVE = 'ACTIVE',
  DISCARD = 'DISCARD',
}

export enum CardVisibility {
  HIDDEN = 'HIDDEN',
  OWNER = 'OWNER',
  PUBLIC = 'PUBLIC',
}

export const CardSchema = z.object({
  id: z.string(),
  playerId: z.string(),
  number: z.number().min(1).max(24),
  zone: z.nativeEnum(CardZone),
  visibility: z.nativeEnum(CardVisibility),
  position: z.number().optional(),
  properties: z.record(z.unknown()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Card = z.infer<typeof CardSchema>;

export interface CardLocation {
  cardId: string;
  playerId: string;
  zone: CardZone;
  position: number;
  visibility: CardVisibility;
}

export interface PlayerCardState {
  playerId: string;
  characterId: CharacterId;
  isFirstPlayer: boolean;
  zones: {
    [key in CardZone]: {
      cards: Card[];
      count: number;
    };
  };
}