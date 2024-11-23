"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { CharacterSelect } from '@/components/character/CharacterSelect';
import { GameLayout } from '@/components/game/GameLayout';
import { SaveButton } from '@/components/game/SaveButton';
import { useCharacterStore } from '@/store/characterStore';
import { useCardStore } from '@/store/cardStore';

export default function GamePage() {
  const searchParams = useSearchParams();
  const playerCount = parseInt(searchParams.get('players') || '1', 10);
  
  const [gameId] = useState(() => uuidv4());
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [players, setPlayers] = useState<Array<{
    id: string;
    name: string;
    isActive: boolean;
  }>>([]);
  const [setupComplete, setSetupComplete] = useState(false);
  
  const { getCharacter, clearSelections } = useCharacterStore();
  const { initializePlayer, saveGameState } = useCardStore();

  useEffect(() => {
    // Initialize players
    const initialPlayers = Array.from({ length: playerCount }, (_, i) => ({
      id: uuidv4(),
      name: `Player ${i + 1}`,
      isActive: i === 0,
    }));
    setPlayers(initialPlayers);
    clearSelections();
  }, [playerCount, clearSelections]);

  const handleCharacterSelect = async () => {
    const currentPlayer = players[currentPlayerIndex];
    const selectedCharacter = getCharacter(currentPlayer.id);
    
    if (selectedCharacter) {
      // Initialize the player's cards with their character
      await initializePlayer(currentPlayer.id, selectedCharacter, currentPlayerIndex === 0);
      
      if (currentPlayerIndex < players.length - 1) {
        // Move to next player's character selection
        setCurrentPlayerIndex(prev => prev + 1);
      } else {
        // All players have selected their characters
        setSetupComplete(true);
      }
    }
  };

  const handleSave = async () => {
    await saveGameState();
  };

  if (!setupComplete) {
    const currentPlayer = players[currentPlayerIndex];
    return (
      <div className="min-h-screen bg-neutral-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Player {currentPlayerIndex + 1} Selection</h1>
            <p className="text-neutral-400">
              {currentPlayer.name}, choose your character
            </p>
          </div>
          
          <CharacterSelect
            playerId={currentPlayer.id}
            onSelect={handleCharacterSelect}
          />
          
          <div className="mt-8 flex justify-center gap-2">
            {players.map((player, index) => (
              <div
                key={player.id}
                className={cn(
                  'w-3 h-3 rounded-full',
                  index === currentPlayerIndex && 'bg-primary animate-pulse',
                  index < currentPlayerIndex && 'bg-primary/50',
                  index > currentPlayerIndex && 'bg-neutral-700'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <GameLayout
        gameId={gameId}
        players={players}
        currentPlayerId={players[0].id}
      />
      <SaveButton onSave={handleSave} />
    </>
  );
}