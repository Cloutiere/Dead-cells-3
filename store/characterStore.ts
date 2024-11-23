"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CharacterId } from '@/types/character';

type CharacterSelections = Record<string, CharacterId>;

interface CharacterStore {
  selectedCharacters: CharacterSelections;
  setCharacter: (playerId: string, characterId: CharacterId) => void;
  getCharacter: (playerId: string) => CharacterId | undefined;
  isCharacterSelected: (characterId: CharacterId) => boolean;
  clearSelections: () => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      selectedCharacters: {},

      setCharacter: (playerId, characterId) => {
        set((state) => ({
          selectedCharacters: {
            ...state.selectedCharacters,
            [playerId]: characterId,
          },
        }));
      },

      getCharacter: (playerId) => {
        return get().selectedCharacters[playerId];
      },

      isCharacterSelected: (characterId) => {
        return Object.values(get().selectedCharacters).includes(characterId);
      },

      clearSelections: () => {
        set({ selectedCharacters: {} });
      },
    }),
    {
      name: 'character-store',
    }
  )
);