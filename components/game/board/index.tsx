"use client";

import { Character } from '@/types/character';
import { Heart, Package, CircleDot, Flask, Shield, Cog } from 'lucide-react';
import { CardStack } from '@/components/cards/CardStack';
import { cn } from '@/lib/utils';

interface PlayerBoardProps {
  health: number;
  maxHealth: number;
  theme?: Character['theme'];
  deckCount: number;
  discardCount: number;
}

export function PlayerBoard({
  health,
  maxHealth,
  theme,
  deckCount,
  discardCount,
}: PlayerBoardProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Deck à gauche */}
      <CardStack
        zone="DECK"
        count={deckCount}
        label="Deck"
        theme={theme}
      />

      {/* Plateau central */}
      <div className="flex flex-col gap-4">
        {/* Barre de vie */}
        <div className="flex items-center gap-2">
          {Array.from({ length: maxHealth }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-4 h-4 rounded-full transition-colors',
                i < health ? 'bg-red-500' : 'bg-neutral-800'
              )}
            />
          ))}
        </div>

        {/* Zones de jeu */}
        <div className="grid grid-cols-3 gap-2">
          <div className="aspect-[2.5/3.5] bg-neutral-800/50 rounded-lg border border-neutral-700/50 flex items-center justify-center">
            <Package className="w-6 h-6 text-neutral-500" />
          </div>
          <div className="aspect-[2.5/3.5] bg-neutral-800/50 rounded-lg border border-neutral-700/50 flex items-center justify-center">
            <CircleDot className="w-6 h-6 text-neutral-500" />
          </div>
          <div className="aspect-[2.5/3.5] bg-neutral-800/50 rounded-lg border border-neutral-700/50 flex items-center justify-center">
            <Flask className="w-6 h-6 text-neutral-500" />
          </div>
          <div className="aspect-[2.5/3.5] bg-neutral-800/50 rounded-lg border border-neutral-700/50 flex items-center justify-center">
            <Shield className="w-6 h-6 text-neutral-500" />
          </div>
          <div className="aspect-[2.5/3.5] bg-neutral-800/50 rounded-lg border border-neutral-700/50 flex items-center justify-center">
            <Heart className="w-6 h-6 text-neutral-500" />
          </div>
          <div className="aspect-[2.5/3.5] bg-neutral-800/50 rounded-lg border border-neutral-700/50 flex items-center justify-center">
            <Cog className="w-6 h-6 text-neutral-500" />
          </div>
        </div>
      </div>

      {/* Défausse à droite */}
      <CardStack
        zone="DISCARD"
        count={discardCount}
        label="Discard"
        theme={theme}
      />
    </div>
  );
}