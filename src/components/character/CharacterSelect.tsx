"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Character, CHARACTERS } from '@/types/character';
import { useCharacterStore } from '@/store/characterStore';
import { cn } from '@/lib/utils';

interface CharacterSelectProps {
  playerId: string;
  onSelect: () => void;
}

export function CharacterSelect({ playerId, onSelect }: CharacterSelectProps) {
  const { setCharacter, isCharacterSelected } = useCharacterStore();

  const handleSelect = (character: Character) => {
    if (isCharacterSelected(character.id)) return;
    setCharacter(playerId, character.id);
    onSelect();
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <h1 className="text-4xl font-bold text-center mb-12">Choose Your Character</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <AnimatePresence>
          {CHARACTERS.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <button
                onClick={() => handleSelect(character)}
                disabled={isCharacterSelected(character.id)}
                className={cn(
                  'w-full aspect-[3/4] rounded-lg overflow-hidden',
                  'relative group transition-all duration-300',
                  'hover:scale-105 hover:shadow-2xl',
                  isCharacterSelected(character.id) && 'opacity-50 cursor-not-allowed',
                  'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-neutral-900'
                )}
                style={{
                  background: character.theme.background,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-center">
                  <h2 className="text-2xl font-bold mb-2">{character.name}</h2>
                  <p className="text-sm text-neutral-300 mb-4">{character.description}</p>
                  <div
                    className={cn(
                      'px-4 py-2 rounded-full text-sm',
                      'bg-white/10 backdrop-blur-sm',
                      'transition-all duration-300',
                      'group-hover:bg-white/20'
                    )}
                  >
                    Cards {character.cardRange.start} - {character.cardRange.end}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}