"use client";

import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GameItemWithLocations } from '@/types/game';
import { cn } from '@/lib/utils';

interface DraggableItemProps {
  item: GameItemWithLocations;
  className?: string;
}

export function DraggableItem({ item, className }: DraggableItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: item.id,
    data: item,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'relative cursor-grab active:cursor-grabbing',
        'transition-all duration-200',
        isHovered && 'scale-105',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative rounded-lg overflow-hidden bg-white shadow-md">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-40 object-cover"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">{item.name}</span>
          </div>
        )}
        <div className="p-2">
          <h3 className="font-semibold text-sm">{item.name}</h3>
          <p className="text-xs text-gray-600">{item.type}</p>
        </div>
        {item.state !== 'ACTIVE' && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs bg-gray-800 text-white">
            {item.state}
          </div>
        )}
      </div>
    </div>
  );
}