"use client";

import { motion } from 'framer-motion';
import { useCardStore } from '@/store/cardStore';
import { CardZone } from '@/types/cards';
import { Character } from '@/types/character';
import { PlayerHand } from '../cards/PlayerHand';
import { CardStack } from '../cards/CardStack';
import { ActiveZone } from '../cards/ActiveZone';
import { cn } from '@/lib/utils';

interface PlayerSectionProps {
  player: {
    id: string;
    name: string;
    isActive: boolean;
  };
  position: 'top' | 'bottom' | 'left' | 'right';
  isCurrentPlayer: boolean;
  theme?: Character['theme'];
}

export function PlayerSection({ player, position, isCurrentPlayer, theme }: PlayerSectionProps) {
  const { getCardCount, moveActiveToDiscard } = useCardStore();

  const handleDiscardActive = async () => {
    if (!isCurrentPlayer) return;
    await moveActiveToDiscard(player.id);
  };

  return (
    <div className={cn(
      'relative w-full h-full p-4',
      'backdrop-blur-sm',
      position === 'bottom' && 'rounded-t-3xl',
      position === 'top' && 'rounded-b-3xl',
      position === 'left' && 'rounded-r-3xl',
      position === 'right' && 'rounded-l-3xl'
    )}>
      {/* Player Info */}
      <div className={cn(
        'absolute inset-x-0 px-4 py-2',
        position === 'bottom' ? 'top-2' : 'bottom-2'
      )}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white/90">{player.name}</span>
          {player.isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme?.accent || '#fff' }}
            />
          )}
        </div>
      </div>

      {/* Game Zones */}
      <div className={cn(
        'w-full h-full flex',
        position === 'bottom' && 'flex-col space-y-4 pt-8',
        position === 'top' && 'flex-col-reverse space-y-reverse space-y-4 pb-8',
        (position === 'left' || position === 'right') && 'flex-row space-x-4'
      )}>
        {/* Deck and Discard */}
        <div className="flex-none flex items-center justify-center">
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
            <CardStack
              zone={CardZone.DECK}
              count={getCardCount(player.id, CardZone.DECK)}
              label="DECK"
              theme={theme}
            />
            <CardStack
              zone={CardZone.DISCARD}
              count={getCardCount(player.id, CardZone.DISCARD)}
              label="DÉFAUSSE"
              theme={theme}
            />
          </div>
        </div>

        {/* Hand and Active Zone */}
        {isCurrentPlayer ? (
          <div className="flex-1 flex flex-col space-y-4">
            <ActiveZone
              playerId={player.id}
              isCurrentPlayer={true}
              onDiscard={handleDiscardActive}
              theme={theme}
            />
            <PlayerHand
              playerId={player.id}
              isCurrentPlayer={true}
              theme={theme}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-sm text-white/60">
              {getCardCount(player.id, CardZone.HAND)} cards in hand
            </div>
          </div>
        )}
      </div>
    </div>
  );
}