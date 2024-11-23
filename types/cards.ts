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

export interface Card {
  id: string;
  playerId: string;
  number: number;
  zone: CardZone;
  visibility: CardVisibility;
  position?: number;
  properties?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}