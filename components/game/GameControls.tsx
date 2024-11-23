"use client";

import { cn } from '@/lib/utils';

interface GameControlsProps {
  gameId: string;
  currentPlayerId: string;
}

export function GameControls({ gameId, currentPlayerId }: GameControlsProps) {
  return (
    <div className={cn(
      'p-4 rounded-xl',
      'bg-white/90 backdrop-blur-sm',
      'shadow-lg'
    )}>
      <div className="flex items-center space-x-4">
        <button
          className={cn(
            'px-4 py-2 rounded-lg',
            'bg-primary text-white',
            'hover:bg-primary-600',
            'transition-colors duration-200'
          )}
        >
          End Turn
        </button>
        <button
          className={cn(
            'px-4 py-2 rounded-lg',
            'bg-neutral-100 text-neutral-700',
            'hover:bg-neutral-200',
            'transition-colors duration-200'
          )}
        >
          Pass
        </button>
      </div>
    </div>
  );
}