"use client";

import { useDroppable } from '@dnd-kit/core';
import { BoardZone as BoardZoneType } from '@prisma/client';
import { useBoardStore } from '@/store/boardStore';
import { cn } from '@/lib/utils';
import { DraggableItem } from '../game/DraggableItem';

interface BoardZoneProps {
  zone: BoardZoneType;
}

export function BoardZone({ zone }: BoardZoneProps) {
  const { selectedZoneId, selectZone, getActiveEffects } = useBoardStore();
  const { setNodeRef, isOver } = useDroppable({
    id: zone.id,
    data: { type: 'zone', zone },
  });

  const zoneEffects = getActiveEffects({ zoneId: zone.id });
  const isSelected = selectedZoneId === zone.id;

  const position = zone.position as { x: number; y: number; width: number; height: number };
  const style = {
    gridColumn: `span ${position.width}`,
    gridRow: `span ${position.height}`,
    transform: `translate(${position.x}px, ${position.y}px)`,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative p-2 border-2 rounded-lg transition-colors duration-200',
        isOver && 'border-primary bg-primary/10',
        isSelected && 'border-secondary bg-secondary/10',
        !isOver && !isSelected && 'border-gray-200 hover:border-gray-300'
      )}
      onClick={() => selectZone(isSelected ? null : zone.id)}
    >
      <div className="absolute top-2 left-2 text-sm font-medium text-gray-700">
        {zone.name}
      </div>
      
      {zoneEffects.length > 0 && (
        <div className="absolute top-2 right-2 flex gap-1">
          {zoneEffects.map((effect) => (
            <div
              key={effect.id}
              className="w-2 h-2 rounded-full bg-primary animate-pulse"
              title={effect.name}
            />
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2">
        {zone.items.map((location) => (
          <DraggableItem
            key={location.itemId}
            item={location.item}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
}