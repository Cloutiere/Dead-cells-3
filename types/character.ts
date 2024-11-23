import { z } from 'zod';

export enum CharacterId {
  POISONED = 'POISONED',
  BURNED = 'BURNED',
  FLAYED = 'FLAYED',
  QUARTERED = 'QUARTERED',
}

export const CharacterSchema = z.object({
  id: z.nativeEnum(CharacterId),
  name: z.string(),
  description: z.string(),
  cardRange: z.object({
    start: z.string(),
    end: z.string(),
  }),
  theme: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string(),
    background: z.string(),
  }),
});

export type Character = z.infer<typeof CharacterSchema>;

export const CHARACTERS: Character[] = [
  {
    id: CharacterId.POISONED,
    name: "L'EMPOISONNÉ",
    description: "Je me disais bien aussi que cette pomme avait l'air un peu trop rouge !",
    cardRange: {
      start: 'ST-01',
      end: 'ST-06',
    },
    theme: {
      primary: '#2D5A27',
      secondary: '#1A3D1F',
      accent: '#4CAF50',
      background: 'linear-gradient(135deg, #1A3D1F 0%, #2D5A27 100%)',
    },
  },
  {
    id: CharacterId.BURNED,
    name: "L'IMMOLÉ",
    description: "Quelqu'un d'autre sent une odeur de pain qui brule ?",
    cardRange: {
      start: 'ST-07',
      end: 'ST-12',
    },
    theme: {
      primary: '#CF4520',
      secondary: '#8B2B09',
      accent: '#FF5722',
      background: 'linear-gradient(135deg, #8B2B09 0%, #CF4520 100%)',
    },
  },
  {
    id: CharacterId.FLAYED,
    name: "L'ÉCORCHÉ",
    description: "Toute cette histoire me met les nerfs à vif.",
    cardRange: {
      start: 'ST-13',
      end: 'ST-18',
    },
    theme: {
      primary: '#B71C1C',
      secondary: '#7F0000',
      accent: '#F44336',
      background: 'linear-gradient(135deg, #7F0000 0%, #B71C1C 100%)',
    },
  },
  {
    id: CharacterId.QUARTERED,
    name: "L'ÉCARTELLÉ",
    description: "Et avec mes propres chevaux en plus...",
    cardRange: {
      start: 'ST-19',
      end: 'ST-24',
    },
    theme: {
      primary: '#4A148C',
      secondary: '#311B92',
      accent: '#7C4DFF',
      background: 'linear-gradient(135deg, #311B92 0%, #4A148C 100%)',
    },
  },
];