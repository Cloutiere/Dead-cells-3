"use client";

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCardStore } from '@/store/cardStore';
import { useCharacterStore } from '@/store/characterStore';
import { CHARACTERS } from '@/types/character';
import { PlayerSection } from './PlayerSection';
import { GameControls } from './GameControls';
import { cn } from '@/lib/utils';

interface GameLayoutProps {
  gameId: string;
  players: Array<{
    id: string;
    name: string;
    isActive: boolean;
  }>;
  currentPlayerId: string;
}

export function GameLayout({ gameId, players, currentPlayerId }: GameLayoutProps) {
  const { getCharacter } = useCharacterStore();

  const getPlayerPosition = (index: number, total: number) => {
    if (index === players.findIndex(p => p.id === currentPlayerId)) {
      return 'bottom';
    }
    
    if (total === 2) return 'top';
    if (total === 3) {
      return ['left', 'right'][index > players.findIndex(p => p.id === currentPlayerId) ? index - 1 : index];
    }
    return ['top', 'left', 'right'][index > players.findIndex(p => p.id === currentPlayerId) ? index - 1 : index];
  };

  const getPlayerTheme = (playerId: string) => {
    const characterId = getCharacter(playerId);
    return CHARACTERS.find(c => c.id === characterId)?.theme;
  };

  return (
    <div className="relative w-full h-screen bg-neutral-900 overflow-hidden">
      <AnimatePresence>
        {players.map((player, index) => {
          const theme = getPlayerTheme(player.id);
          const position = getPlayerPosition(index, players.length);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                'absolute',
                position === 'bottom' && 'bottom-0 left-0 right-0 h-[45vh]',
                position === 'top' && 'top-0 left-0 right-0 h-[25vh]',
                position === 'left' && 'left-0 top-0 bottom-0 w-[25vw]',
                position === 'right' && 'right-0 top-0 bottom-0 w-[25vw]'
              )}
              style={{
                background: theme?.background || 'transparent',
              }}
            >
              <PlayerSection
                player={player}
                position={position}
                isCurrentPlayer={player.id === currentPlayerId}
                theme={theme}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <GameControls gameId={gameId} currentPlayerId={currentPlayerId} />
      </motion.div>
    </div>
  );
}