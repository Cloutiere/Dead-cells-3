"use client";

import { useCardStore } from '@/store/cardStore';
import { CardZone } from '@/types/cards';
import { Character } from '@/types/character';
import { CardComponent } from './CardComponent';
import { cn } from '@/lib/utils';

interface PlayerHandProps {
  playerId: string;
  isCurrentPlayer: boolean;
  theme?: Character['theme'];
}

export function PlayerHand({ playerId, isCurrentPlayer, theme }: PlayerHandProps) {
  const { getVisibleCards, moveCardsToActive } = useCardStore();
  const handCards = getVisibleCards(playerId, CardZone.HAND);

  const handlePlayCard = async (cardId: string) => {
    if (!isCurrentPlayer) return;
    await moveCardsToActive(playerId, [cardId]);
  };

  if (!isCurrentPlayer) return null;

  return (
    <div className={cn(
      'p-4 rounded-xl',
      'bg-neutral-800/50 backdrop-blur-sm',
      'border border-neutral-700/50'
    )}>
      <h3 className="text-sm font-medium text-neutral-400 mb-4">Hand</h3>
      <div className="grid grid-cols-4 gap-4">
        {handCards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            onClick={() => handlePlayCard(card.id)}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
}