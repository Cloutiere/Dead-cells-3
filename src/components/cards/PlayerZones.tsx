"use client";

import { CardZone } from '@/types/cards';
import { useCardStore } from '@/store/cardStore';
import { CardStack } from './CardStack';
import { PlayerHand } from './PlayerHand';
import { ActiveZone } from './ActiveZone';

interface PlayerZonesProps {
  playerId: string;
  isCurrentPlayer: boolean;
}

export function PlayerZones({ playerId, isCurrentPlayer }: PlayerZonesProps) {
  const { getCardCount, moveActiveToDiscard } = useCardStore();

  const handleDiscardActive = async () => {
    if (!isCurrentPlayer) return;
    await moveActiveToDiscard(playerId);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <CardStack
          zone={CardZone.DECK}
          count={getCardCount(playerId, CardZone.DECK)}
          label="Deck"
        />
        <CardStack
          zone={CardZone.DISCARD}
          count={getCardCount(playerId, CardZone.DISCARD)}
          label="Discard"
        />
      </div>
      
      <PlayerHand playerId={playerId} isCurrentPlayer={isCurrentPlayer} />
      
      <ActiveZone
        playerId={playerId}
        isCurrentPlayer={isCurrentPlayer}
        onDiscard={handleDiscardActive}
      />
    </div>
  );
}