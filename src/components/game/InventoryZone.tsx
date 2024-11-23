"use client";

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { InventoryWithItems, GameZoneWithItems } from '@/types/game';
import { DraggableItem } from './DraggableItem';
import { cn } from '@/lib/utils';

interface InventoryZoneProps {
  container: InventoryWithItems | GameZoneWithItems;
  type: 'inventory' | 'zone';
  className?: string;
}

export function InventoryZone({ container, type, className }: InventoryZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: container.id,
    data: { type, container },
  });

  const activeItems = container.items.filter(location => !location.leftAt);
  const itemIds = activeItems.map(location => location.itemId);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'p-4 rounded-lg border-2',
        isOver ? 'border-primary' : 'border-gray-200',
        'transition-colors duration-200',
        className
      )}
    >
      <h3 className="font-semibold mb-2">{container.name}</h3>
      <div className="relative min-h-[200px]">
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeItems.map(location => (
              <DraggableItem
                key={location.itemId}
                item={location.item}
                className="w-full"
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}