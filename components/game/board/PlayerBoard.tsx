"use client";

import { Heart, Package, CircleDot, Shield, Cog, Beaker, Skull } from 'lucide-react';

const HeartSlot = ({ filled = false }) => (
<div className="w-[35px] h-[35px] bg-neutral-800/80 rounded-lg shadow-inner flex items-center justify-center relative group">
<Heart className={`w-6 h-6 ${filled ? 'text-yellow-500' : 'text-yellow-500/20'}`} />
</div>
);

export function PlayerBoard({
health = 5,
maxHealth = 5,
playerName = "Player",
isActive = false,
deckCount = 0,
discardCount = 0,
handCards = [],
activeCards = []
}) {
return (
<div className="p-4 rounded-lg bg-neutral-900/50 w-full max-w-[1200px] mx-auto">
{/* En-tête du plateau */}
<div className="flex justify-between items-center mb-4">
<div className="text-neutral-200 font-medium">{playerName}</div>
<div className="flex items-center gap-1">
<Heart className="w-4 h-4 text-red-500" />
<span className="text-neutral-300">{health}/{maxHealth}</span>
</div>
</div>

<div className="flex flex-col gap-4">
{/* Rectangle du haut - Inventaire et barres de couleur */}
<div className="flex gap-4 bg-neutral-900/30 p-4 rounded-lg">
{/* Inventaire */}
<div className="flex flex-col gap-2">
{Array.from({ length: 3 }).map((_, i) => (
<div
key={`inventory-${i}`}
className="w-[60px] h-[80px] rounded-lg bg-neutral-800/80 shadow-inner border-2 border-dashed border-neutral-700 flex items-center justify-center"
>
<Package className="w-6 h-6 text-neutral-600" />
</div>
))}
</div>

{/* Barres de couleur */}
<div className="flex-1 space-y-2">
{/* Barre jaune avec les cœurs */}
<div className="p-2 rounded-lg bg-yellow-900/20 border border-yellow-500/40">
<div className="flex gap-2 justify-center">
{Array.from({ length: 7 }).map((_, i) => (
<HeartSlot key={`heart-${i}`} filled={i < health} />
))}
</div>
</div>

{/* Barre verte */}
<div className="p-2 rounded-lg bg-green-900/20 border border-green-500/40">
<div className="flex gap-2 justify-center">
{[
{ number: '3', prefix: '', icon: Heart },
{ number: '1', prefix: '+', icon: Heart },
{ number: '1', prefix: '+', icon: Heart }
].map((slot, i) => (
<div
key={`green-${i}`}
className="w-[35px] h-[35px] bg-neutral-800/80 rounded-lg shadow-inner flex items-center justify-center relative"
>
<slot.icon className="w-6 h-6 text-green-500/40 absolute" />
<div className="flex items-center text-green-400 font-bold relative z-10">
<span className="text-xs">{slot.prefix}</span>
<span className="text-xs">{slot.number}</span>
</div>
</div>
))}
</div>
</div>

{/* Barre violette */}
<div className="p-2 rounded-lg bg-purple-900/20 border border-purple-500/40">
<div className="flex gap-2 justify-center">
{[
{ icon: Cog },
{ icon: Cog, second: Shield },
{ icon: Cog, second: Shield },
{ icon: Cog, second: Cog }
].map((slot, i) => (
<div
key={`purple-${i}`}
className="w-[80px] h-[30px] bg-neutral-800/80 rounded-lg shadow-inner flex items-center justify-center gap-2"
>
<slot.icon className="w-4 h-4 text-purple-400" />
{slot.second && (
<>
<span className="text-purple-400">:</span>
<slot.second className="w-4 h-4 text-purple-400" />
</>
)}
</div>
))}
</div>
</div>

{/* Barre rouge */}
<div className="p-2 rounded-lg bg-red-900/20 border border-red-500/40">
<div className="flex gap-2 justify-center">
{Array.from({ length: 3 }).map((_, i) => (
<div
key={`red-${i}`}
className="w-[80px] h-[30px] bg-neutral-800/80 rounded-lg shadow-inner border border-red-500/20"
/>
))}
</div>
</div>
</div>
</div>

{/* Rectangle englobant toute la section des cartes */}
<div className="bg-neutral-800/50 p-6 rounded-xl relative overflow-x-auto">
<div className="flex justify-center gap-4 min-w-max px-4">
{/* DECK */}
<div className="flex flex-col items-center gap-2">
<div className="w-[100px] h-[160px] bg-black rounded-lg border border-neutral-700 flex items-center justify-center">
<div className="text-2xl font-bold text-neutral-600">{deckCount}</div>
</div>
<span className="text-sm font-medium text-neutral-500">DECK</span>
</div>

{/* MAIN */}
<div className="flex flex-col items-center gap-2">
<div className="w-[320px] h-[160px] bg-neutral-900 rounded-lg border border-neutral-700 flex items-center justify-center relative">
<span className="text-sm font-medium text-neutral-500 absolute top-2 left-2">
MAIN
</span>
<div className="flex gap-2 justify-center items-center h-full">
{handCards.length > 0 ? (
handCards.map((card, index) => (
<div key={index} className="w-[100px] h-[160px] bg-black rounded-lg border border-neutral-700 flex items-center justify-center">
<Skull className="w-12 h-12 text-red-500" />
</div>
))
) : (
Array.from({ length: 3 }).map((_, i) => (
<div
key={i}
className="w-[100px] h-[160px] rounded-lg border-2 border-dashed border-neutral-700/30"
/>
))
)}
</div>
</div>
<span className="text-sm font-medium text-neutral-500">MAIN</span>
</div>

{/* ACTIVE */}
<div className="flex flex-col items-center gap-2">
<div
className={`min-w-[100px] h-[160px] bg-black rounded-lg
border border-yellow-500/40 flex flex-col items-center justify-center relative
${activeCards.length > 1 ? 'w-[210px]' : 'w-[100px]'}`}
>
<div className="flex gap-2 justify-center items-center h-full">
{activeCards.map((card, index) => (
<div key={index} className="w-[100px] h-[160px] bg-black rounded-lg border border-neutral-700 flex items-center justify-center">
<Skull className="w-12 h-12 text-red-500" />
</div>
))}
</div>
</div>
<span className="text-sm font-medium text-neutral-500">ACTIVE</span>
</div>

{/* DÉFAUSSE */}
<div className="flex flex-col items-center gap-2">
<div className="w-[100px] h-[160px] bg-black rounded-lg border border-neutral-700 flex items-center justify-center">
<div className="text-2xl font-bold text-neutral-600">{discardCount}</div>
</div>
<span className="text-sm font-medium text-neutral-500">DÉFAUSSE</span>
</div>
</div>
</div>
</div>
</div>
);
}