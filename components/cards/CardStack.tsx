"use client";

import { Skull } from 'lucide-react';
import { CardZone } from '@/types/cards';
import { Character } from '@/types/character';
import { cn } from '@/lib/utils';

interface CardStackProps {
  zone: CardZone;  // Updated: Now using CardZone enum instead of string
  count: number;
  label: string;
  theme?: Character['theme'];
  orientation?: 'top' | 'bottom' | 'left' | 'right';
}

export function CardStack({
  zone,
  count,
  label,
  theme,
  orientation = 'bottom'
}: CardStackProps) {
  const isEmpty = count === 0;

  return (
    <div className="relative">
      {/* Card Stack Container */}
      <div
        className={cn(
          'relative w-[120px] aspect-[2.5/3.5] rounded-lg overflow-hidden',
          'transition-all duration-300',
          isEmpty ? 'bg-neutral-800' : 'bg-neutral-700',
          'shadow-lg hover:shadow-xl'
        )}
        style={{
          background: isEmpty ? '#2a2a2a' : theme?.background || 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.1)_100%)]" />

        {/* Card Back Logo */}
        <div className={cn(
          'absolute inset-0 flex items-center justify-center',
          'transition-all duration-300',
          isEmpty ? 'opacity-15' : 'opacity-100'
        )}>
          <Skull
            className={cn(
              'w-16 h-16 transition-all duration-300',
              isEmpty ? 'text-neutral-600' : 'text-white'
            )}
            style={{
              color: isEmpty ? '#444' : theme?.accent || '#fff',
            }}
          />
        </div>

        {/* Stacked Cards Effect */}
        {count > 1 && (
          <div className="absolute inset-0">
            {Array.from({ length: Math.min(count, 3) }).map((_, index) => (
              <div
                key={index}
                className="absolute inset-0 border-2 rounded-lg transition-transform duration-300"
                style={{
                  borderColor: theme?.accent || '#fff',
                  opacity: 0.1 + (index * 0.1),
                  transform: `translate(${index * 2}px, ${index * 2}px)`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Label and Counter */}
      <div className={cn(
        'absolute -bottom-6 left-0 right-0 text-center',
        'transition-all duration-300'
      )}>
        <div className="text-xs font-medium text-neutral-400 mb-1">{label}</div>
        <div
          className={cn(
            'text-lg font-bold',
            isEmpty ? 'text-neutral-600' : 'text-white'
          )}
          style={{
            color: isEmpty ? '#666' : theme?.accent || '#fff',
          }}
        >
          {count}
        </div>
      </div>
    </div>
  );
}