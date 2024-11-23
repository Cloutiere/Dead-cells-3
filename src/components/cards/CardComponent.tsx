"use client";

import { Card } from '@/types/cards';
import { cn } from '@/lib/utils';

interface CardComponentProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function CardComponent({
  card,
  onClick,
  disabled = false,
  className,
}: CardComponentProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative w-full aspect-[2/3] rounded-lg overflow-hidden',
        'transition-transform duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        !disabled && 'hover:scale-105',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10" />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <span className="text-4xl font-bold text-primary">{card.number}</span>
        {card.properties && Object.entries(card.properties).map(([key, value]) => (
          <span key={key} className="text-sm text-gray-600 mt-2">
            {key}: {value as string}
          </span>
        ))}
      </div>
    </button>
  );
}