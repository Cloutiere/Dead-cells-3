import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character, CharacterId } from '@/types/character';

interface CharacterStore {
  selectedCharacters: Map<string, CharacterId>;
  setCharacter: (playerId: string, characterId: CharacterId) => void;
  getCharacter: (playerId: string) => CharacterId | undefined;
  isCharacterSelected: (characterId: CharacterId) => boolean;
  clearSelections: () => void;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      selectedCharacters: new Map(),

      setCharacter: (playerId, characterId) => {
        set((state) => ({
          selectedCharacters: new Map(state.selectedCharacters).set(playerId, characterId),
        }));
      },

      getCharacter: (playerId) => {
        return get().selectedCharacters.get(playerId);
      },

      isCharacterSelected: (characterId) => {
        return Array.from(get().selectedCharacters.values()).includes(characterId);
      },

      clearSelections: () => {
        set({ selectedCharacters: new Map() });
      },
    }),
    {
      name: 'character-store',
    }
  )
);