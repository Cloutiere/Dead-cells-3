"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { CardZone } from '@/types/cards';
import { Character } from '@/types/character';
import { cn } from '@/lib/utils';
import { Skull } from 'lucide-react'; // Importez l'icône Skull

interface CardStackProps {
  zone: CardZone;
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
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'relative aspect-[2.5/3.5] rounded-lg overflow-hidden',
        'shadow-lg transition-shadow duration-200',
        'hover:shadow-xl',
        'w-24' // Ajoutez une largeur fixe
      )}
      style={{
        background: theme?.background || 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
      }}
    >
      {/* Icônes Skull */}
      <div className="absolute inset-x-0 top-2 flex justify-between px-2">
        <Skull className="w-4 h-4 text-neutral-500" />
        <Skull className="w-4 h-4 text-neutral-500" />
      </div>

      <AnimatePresence>
        {Array.from({ length: Math.min(count, 5) }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ x: 0, y: 0 }}
            animate={{
              x: index * 2,
              y: index * 2,
            }}
            exit={{ x: 0, y: 0, opacity: 0 }}
            className="absolute inset-0 rounded-lg border"
            style={{
              backgroundColor: theme?.primary || '#2a2a2a',
              borderColor: theme?.accent || '#3a3a3a',
              zIndex: index,
            }}
          />
        ))}
      </AnimatePresence>

      <div className={cn(
        'absolute inset-0 flex flex-col items-center justify-center',
        'text-white font-medium'
      )}>
        <span className="text-2xl" style={{ color: theme?.accent || '#fff' }}>
          {count}
        </span>
        <span className="text-xs mt-1 opacity-80">{label}</span>
      </div>
    </motion.div>
  );
}
