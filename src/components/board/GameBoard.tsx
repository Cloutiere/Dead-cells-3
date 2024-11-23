"use client";

import { useEffect, useMemo } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useBoardStore } from '@/store/boardStore';
import { BoardZone } from './BoardZone';
import { LayerContainer } from './LayerContainer';
import { EffectOverlay } from './EffectOverlay';

interface GameBoardProps {
  gameId: string;
}

export function GameBoard({ gameId }: GameBoardProps) {
  const { boardState, setBoardState, moveItem } = useBoardStore();

  useEffect(() => {
    const loadBoardState = async () => {
      const response = await fetch(`/api/board/${gameId}`);
      const data = await response.json();
      setBoardState(data);
    };

    loadBoardState();
  }, [gameId, setBoardState]);

  const layers = useMemo(() => {
    if (!boardState) return [];
    return boardState.layers.sort((a, b) => a.order - b.order);
  }, [boardState]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const itemId = active.id as string;
    const fromZoneId = (active.data.current as any).zoneId;
    const toZoneId = over.id as string;
    
    if (fromZoneId === toZoneId) return;

    await moveItem(itemId, fromZoneId, toZoneId, {
      x: event.delta.x,
      y: event.delta.y,
      width: 1,
      height: 1,
    });
  };

  if (!boardState) {
    return <div>Loading board...</div>;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="relative w-full h-full min-h-[600px] bg-gray-100 rounded-lg overflow-hidden">
        {layers.map((layer) => (
          <LayerContainer key={layer.id} layer={layer}>
            {boardState.zones
              .filter((zone) => zone.layerId === layer.id)
              .map((zone) => (
                <BoardZone key={zone.id} zone={zone} />
              ))}
          </LayerContainer>
        ))}
        <EffectOverlay />
      </div>
    </DndContext>
  );
}