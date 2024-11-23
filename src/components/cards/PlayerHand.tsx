"use client";

import { useEffect } from 'react';
import { Card, CardZone } from '@/types/cards';
import { useCardStore } from '@/store/cardStore';
import { CardComponent } from './CardComponent';

interface PlayerHandProps {
  playerId: string;
  isCurrentPlayer: boolean;
}

export function PlayerHand({ playerId, isCurrentPlayer }: PlayerHandProps) {
  const { getVisibleCards, moveCardsToActive } = useCardStore();
  const handCards = getVisibleCards(playerId, CardZone.HAND);

  const handlePlayCard = async (card: Card) => {
    if (!isCurrentPlayer) return;
    await moveCardsToActive(playerId, [card.id]);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Hand</h3>
      <div className="grid grid-cols-3 gap-4">
        {handCards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            onClick={() => handlePlayCard(card)}
            disabled={!isCurrentPlayer}
          />
        ))}
      </div>
    </div>
  );
}