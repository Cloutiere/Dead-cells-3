"use client";

import { Card } from '@/types/cards';
import { Character } from '@/types/character';
import { cn } from '@/lib/utils';

interface CardComponentProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  theme?: Character['theme'];
  className?: string;
}

export function CardComponent({
  card,
  onClick,
  disabled = false,
  theme,
  className,
}: CardComponentProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative w-full aspect-[2.5/3.5] rounded-lg overflow-hidden',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2',
        'focus:ring-offset-2 focus:ring-offset-neutral-900',
        !disabled && 'hover:scale-105 hover:shadow-xl',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{
        background: theme?.background || 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        borderColor: theme?.accent || '#3a3a3a',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <span 
          className="text-4xl font-bold"
          style={{ color: theme?.accent || '#fff' }}
        >
          {card.number}
        </span>
        
        {card.properties && Object.entries(card.properties).map(([key, value]) => (
          <span key={key} className="text-sm text-neutral-400 mt-2">
            {key}: {value as string}
          </span>
        ))}
      </div>
    </button>
  );
}