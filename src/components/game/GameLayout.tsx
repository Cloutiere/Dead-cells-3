"use client";

import { useCardStore } from '@/store/cardStore';
import { PlayerSection } from './PlayerSection';
import { GameControls } from './GameControls';
import { cn } from '@/lib/utils';

interface GameLayoutProps {
gameId: string;
players: Array<{
id: string;
name: string;
isActive: boolean;
}>;
currentPlayerId: string;
}

export function GameLayout({ gameId, players, currentPlayerId }: GameLayoutProps) {
const getPlayerPosition = (index: number, total: number) => {
if (index === players.findIndex(p => p.id === currentPlayerId)) {
return 'bottom';
}

if (total === 2) return 'top';
if (total === 3) {
return ['left', 'right'][index > players.findIndex(p => p.id === currentPlayerId) ? index - 1 : index];
}
return ['top', 'left', 'right'][index > players.findIndex(p => p.id === currentPlayerId) ? index - 1 : index];
};

return (
<div className="relative w-full h-screen bg-neutral-900 overflow-hidden">
{players.map((player, index) => (
<div
key={player.id}
className={cn(
'absolute',
getPlayerPosition(index, players.length) === 'bottom' && 'bottom-0 h-[45vh] w-full',
getPlayerPosition(index, players.length) === 'top' && 'top-0 h-[25vh] w-full',
getPlayerPosition(index, players.length) === 'left' && 'left-0 w-[25vw] h-full',
getPlayerPosition(index, players.length) === 'right' && 'right-0 w-[25vw] h-full'
)}
>
<PlayerSection
player={player}
position={getPlayerPosition(index, players.length)}
isCurrentPlayer={player.id === currentPlayerId}
/>
</div>
))}

<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
<GameControls gameId={gameId} currentPlayerId={currentPlayerId} />
</div>
</div>
);
}