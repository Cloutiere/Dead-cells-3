"use client";

import { Card } from '@/types/cards';
import { Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardComponentProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  isFaceDown?: boolean;
}

export function CardComponent({
  card,
  onClick,
  disabled = false,
  className,
  isFaceDown = false
}: CardComponentProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative w-[100px] h-[160px] rounded-lg overflow-hidden',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2',
        'focus:ring-offset-2 focus:ring-offset-neutral-900',
        !disabled && 'hover:scale-105 hover:shadow-xl',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div 
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          isFaceDown ? 'bg-neutral-800' : 'bg-black'
        )}
      >
        {isFaceDown ? (
          <Skull className="w-12 h-12 text-red-500" />
        ) : (
          <div className="text-4xl font-bold text-white">
            {card.number}
          </div>
        )}
      </div>
    </button>
  );
}