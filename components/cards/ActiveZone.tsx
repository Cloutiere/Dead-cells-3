"use client";

import { useCardStore } from '@/store/cardStore';
import { CardZone } from '@/types/cards';
import { Character } from '@/types/character';
import { CardComponent } from './CardComponent';
import { cn } from '@/lib/utils';

interface ActiveZoneProps {
  playerId: string;
  isCurrentPlayer: boolean;
  onDiscard?: () => void;
  theme?: Character['theme'];
}

export function ActiveZone({ playerId, isCurrentPlayer, onDiscard, theme }: ActiveZoneProps) {
  const { getVisibleCards } = useCardStore();
  const activeCards = getVisibleCards(playerId, CardZone.ACTIVE);

  return (
    <div className={cn(
      'p-4 rounded-xl',
      'bg-neutral-800/50 backdrop-blur-sm',
      'border border-neutral-700/50'
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-400">Active Zone</h3>
        {isCurrentPlayer && activeCards.length > 0 && (
          <button
            onClick={onDiscard}
            className={cn(
              'px-3 py-1 rounded-full text-sm',
              'bg-neutral-700/50 text-neutral-300',
              'hover:bg-neutral-600/50',
              'transition-colors duration-200'
            )}
          >
            Discard All
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {activeCards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            theme={theme}
            disabled={!isCurrentPlayer}
          />
        ))}
      </div>
    </div>
  );
}