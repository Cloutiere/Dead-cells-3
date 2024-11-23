PlayerSection:
"use client";

import { motion } from 'framer-motion';
import { useCardStore } from '@/store/cardStore';
import { CardZone } from '@/types/cards';
import { Character } from '@/types/character';
import { PlayerHand } from '../cards/PlayerHand';
import { CardStack } from '../cards/CardStack';
import { ActiveZone } from '../cards/ActiveZone';
import { cn } from '@/lib/utils';

interface PlayerSectionProps {
player: {
id: string;
name: string;
isActive: boolean;
};
position: 'top' | 'bottom' | 'left' | 'right';
isCurrentPlayer: boolean;
theme?: Character['theme'];
}

export function PlayerSection({ player, position, isCurrentPlayer, theme }: PlayerSectionProps) {
const { getCardCount, moveActiveToDiscard } = useCardStore();

const handleDiscardActive = async () => {
if (!isCurrentPlayer) return;
await moveActiveToDiscard(player.id);
};

return (
<div className={cn(
'relative w-full h-full',
'flex flex-col',
position === 'bottom' && 'pt-8 pb-4',
position === 'top' && 'pb-8 pt-4',
position === 'left' && 'pr-8 pl-4',
position === 'right' && 'pl-8 pr-4',
'overflow-y-auto' // Allow vertical scrolling if content overflows
)}>
{/* Player Info */}
<div className={cn(
'sticky',
position === 'bottom' ? 'top-0' : 'bottom-0',
'z-10 px-4 py-2 backdrop-blur-sm'
)}>
<div className="flex items-center justify-between">
<span className="text-sm font-medium text-white/90">{player.name}</span>
{player.isActive && (
<motion.div
initial={{ scale: 0 }}
animate={{ scale: 1 }}
className="w-2 h-2 rounded-full"
style={{ backgroundColor: theme?.accent || '#fff' }}
/>
)}
</div>
</div>

{/* Game Content */}
<div className={cn(
'flex-1 flex',
position === 'bottom' && 'flex-col space-y-4',
position === 'top' && 'flex-col-reverse space-y-reverse space-y-4',
(position === 'left' || position === 'right') && 'flex-row space-x-4',
'overflow-visible' // Ensure content isn't clipped
)}>
{/* Board Area */}
<div className="flex-none">
<div className="grid grid-cols-2 gap-4 w-full max-w-xs">
<CardStack
zone={CardZone.DECK}
count={getCardCount(player.id, CardZone.DECK)}
label="DECK"
theme={theme}
/>
<CardStack
zone={CardZone.DISCARD}
count={getCardCount(player.id, CardZone.DISCARD)}
label="DÉFAUSSE"
theme={theme}
/>
</div>
</div>

{/* Cards Area */}
<div className="flex-1">
{isCurrentPlayer ? (
<div className="space-y-4">
<ActiveZone
playerId={player.id}
isCurrentPlayer={true}
onDiscard={handleDiscardActive}
theme={theme}
/>
<PlayerHand
playerId={player.id}
isCurrentPlayer={true}
theme={theme}
/>
</div>
) : (
<div className="flex items-center justify-center h-full">
<div className="text-sm text-white/60">
{getCardCount(player.id, CardZone.HAND)} cards in hand
</div>
</div>
)}
</div>
</div>
</div>
);
}