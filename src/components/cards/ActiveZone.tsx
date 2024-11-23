"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useCardStore } from '@/store/cardStore';
import { CardZone } from '@/types/cards';
import { CardComponent } from './CardComponent';
import { cn } from '@/lib/utils';

interface ActiveZoneProps {
  playerId: string;
  isCurrentPlayer: boolean;
  onDiscard?: () => void;
}

export function ActiveZone({ playerId, isCurrentPlayer, onDiscard }: ActiveZoneProps) {
  const { getVisibleCards } = useCardStore();
  const activeCards = getVisibleCards(playerId, CardZone.ACTIVE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-xl',
        'bg-gradient-to-b from-neutral-100/80 to-neutral-50/90',
        'backdrop-blur-sm shadow-zone-default',
        'transition-shadow duration-200',
        'hover:shadow-zone-hover'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-600">Active Zone</h3>
        {isCurrentPlayer && activeCards.length > 0 && (
          <button
            onClick={onDiscard}
            className={cn(
              'px-3 py-1 text-sm rounded-full',
              'bg-accent text-white',
              'hover:bg-accent-soft hover:text-accent',
              'transition-colors duration-200'
            )}
          >
            Discard All
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <AnimatePresence>
          {activeCards.map((card) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <CardComponent
                card={card}
                disabled={!isCurrentPlayer}
                className="transform hover:rotate-0"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}