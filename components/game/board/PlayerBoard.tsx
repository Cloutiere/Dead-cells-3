"use client";

import { Heart, Package, CircleDot, Shield, Cog, Beaker, Skull } from 'lucide-react';
import { useCardStore } from '@/store/cardStore';
import { CardComponent } from '../../cards/CardComponent';
import { cn } from '@/lib/utils';

interface PlayerBoardProps {
  health?: number;
  maxHealth?: number;
  playerName?: string;
  isActive?: boolean;
  deckCount?: number;
  discardCount?: number;
  handCards?: any[];
  activeCards?: any[];
  playerId: string;
  isCurrentPlayer: boolean;
}

export function PlayerBoard({ 
  health = 5, 
  maxHealth = 5,
  playerName = "Player",
  isActive = false,
  deckCount = 0,
  discardCount = 0,
  handCards = [],
  activeCards = [],
  playerId,
  isCurrentPlayer
}: PlayerBoardProps) {
  const { moveCardsToActive, moveActiveToDiscard, attemptDrawCard, canPlayCard, canDrawCards } = useCardStore();

  const handlePlayCard = async (cardId: string) => {
    if (!isCurrentPlayer || !canPlayCard(playerId, cardId)) return;
    await moveCardsToActive(playerId, [cardId]);
  };

  const handleDiscardActive = async () => {
    if (!isCurrentPlayer) return;
    await moveActiveToDiscard(playerId);
  };

  const handleDrawCard = async () => {
    if (!isCurrentPlayer) return;
    await attemptDrawCard(playerId);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {/* Top Section - Inventory and Color Bars */}
      <div className="flex gap-2 bg-neutral-800/50 p-2 rounded-lg">
        {/* Inventory Slots */}
        <div className="flex flex-col gap-1 shrink-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`inventory-${i}`}
              className="w-[50px] h-[65px] rounded-lg bg-neutral-800 shadow-inner border-2 border-dashed border-neutral-700 flex items-center justify-center"
            >
              <Skull className="w-5 h-5 text-neutral-600" />
            </div>
          ))}
        </div>

        {/* Color Bars Section */}
        <div className="flex-1 space-y-1">
          {/* Yellow Bar - Hearts */}
          <div className="p-1 rounded-lg bg-yellow-900/20 border border-yellow-500/40">
            <div className="flex gap-1 justify-center">
              {Array.from({ length: maxHealth }).map((_, i) => (
                <div key={`heart-${i}`} className="w-[30px] h-[30px] bg-neutral-800/80 rounded-lg shadow-inner flex items-center justify-center relative group">
                  <Heart className={`w-5 h-5 ${i < health ? 'text-yellow-500' : 'text-yellow-500/20'}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Green Bar */}
          <div className="p-1 rounded-lg bg-green-900/20 border border-green-500/40">
            <div className="flex gap-1 justify-center">
              {[
                { number: '3', prefix: '', icon: Heart },
                { number: '1', prefix: '+', icon: Heart },
                { number: '1', prefix: '+', icon: Heart }
              ].map((slot, i) => (
                <div
                  key={`green-${i}`}
                  className="w-[30px] h-[30px] bg-neutral-800 rounded-lg shadow-inner flex items-center justify-center relative"
                >
                  <slot.icon className="w-5 h-5 text-green-500/40 absolute" />
                  <div className="flex items-center text-green-400 font-bold relative z-10">
                    <span className="text-xs">{slot.prefix}</span>
                    <span className="text-xs">{slot.number}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purple Bar */}
          <div className="p-1 rounded-lg bg-purple-900/20 border border-purple-500/40">
            <div className="flex gap-1 justify-center">
              {[
                { icon: Cog },
                { icon: Cog, second: Shield },
                { icon: Cog, second: Shield },
                { icon: Cog, second: Cog }
              ].map((slot, i) => (
                <div
                  key={`purple-${i}`}
                  className="w-[70px] h-[25px] bg-neutral-800 rounded-lg shadow-inner flex items-center justify-center gap-1"
                >
                  <slot.icon className="w-4 h-4 text-purple-400" />
                  {slot.second && (
                    <>
                      <span className="text-purple-400">:</span>
                      <slot.second className="w-4 h-4 text-purple-400" />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Red Bar */}
          <div className="p-1 rounded-lg bg-red-900/20 border border-red-500/40">
            <div className="flex gap-1 justify-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`red-${i}`}
                  className="w-[70px] h-[25px] bg-neutral-800 rounded-lg shadow-inner border border-red-500/20"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Cards Area */}
      <div className="flex-1 bg-neutral-800/50 p-3 rounded-xl">
        <div className="flex justify-between items-center h-full">
          {/* Deck */}
          <div className="relative flex-shrink-0">
            <div 
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={handleDrawCard}
            >
              <CardComponent
                card={{ id: 'deck', number: 0, playerId, zone: 'DECK', visibility: 'HIDDEN', createdAt: new Date(), updatedAt: new Date() }}
                isFaceDown={true}
                disabled={!isCurrentPlayer || !canDrawCards(playerId)}
              />
            </div>
            <span className="mt-1 block text-center text-xs font-medium text-neutral-500">
              DECK ({deckCount})
            </span>
          </div>

          {/* Hand */}
          <div className="flex-1 mx-4">
            <div className="h-[160px] rounded-lg bg-neutral-800 shadow-inner border border-neutral-700 relative">
              <span className="absolute top-1 left-2 text-xs font-medium text-neutral-500">
                MAIN
              </span>
              <div className="absolute inset-0 flex justify-center items-center gap-2 p-2">
                {isCurrentPlayer && handCards.map((card) => (
                  <CardComponent
                    key={card.id}
                    card={card}
                    onClick={() => handlePlayCard(card.id)}
                    disabled={!canPlayCard(playerId, card.id)}
                  />
                ))}
                {(!isCurrentPlayer || handCards.length === 0) && (
                  <Skull className="w-12 h-12 text-neutral-600" />
                )}
              </div>
            </div>
          </div>

          {/* Active Zone */}
          <div className="relative flex-shrink-0">
            <div
              className={cn(
                "h-[160px] rounded-lg bg-neutral-800 shadow-inner",
                "border border-yellow-500/40 flex items-center justify-center",
                "transition-all duration-300 ease-in-out",
                activeCards.length > 1 ? "w-[210px]" : "w-[100px]"
              )}
            >
              <div className="flex gap-2 justify-center items-center">
                {activeCards.map((card) => (
                  <CardComponent
                    key={card.id}
                    card={card}
                    disabled={!isCurrentPlayer}
                  />
                ))}
                {activeCards.length === 0 && (
                  <Skull className="w-12 h-12 text-neutral-600" />
                )}
              </div>
            </div>
            {isCurrentPlayer && activeCards.length > 0 && (
              <button
                onClick={handleDiscardActive}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full text-xs bg-neutral-700/50 text-neutral-300 hover:bg-neutral-600/50 transition-colors"
              >
                Discard All
              </button>
            )}
          </div>

          {/* Discard */}
          <div className="relative flex-shrink-0">
            <CardComponent
              card={{ id: 'discard', number: 0, playerId, zone: 'DISCARD', visibility: 'HIDDEN', createdAt: new Date(), updatedAt: new Date() }}
              isFaceDown={true}
              disabled={true}
            />
            <span className="mt-1 block text-center text-xs font-medium text-neutral-500">
              DÉFAUSSE ({discardCount})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}