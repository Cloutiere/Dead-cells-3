"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { CharacterSelect } from '@/components/character/CharacterSelect';
import { GameLayout } from '@/components/game/GameLayout';
import { SaveButton } from '@/components/game/SaveButton';
import { useCharacterStore } from '@/store/characterStore';
import { useCardStore } from '@/store/cardStore';
import { Loader2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);
  
  const { getCharacter, clearSelections } = useCharacterStore();
  const { initializePlayer } = useCardStore();

  useEffect(() => {
    const initializePlayers = async () => {
      setIsLoading(true);
      try {
        // Créer les joueurs avec des IDs uniques
        const initialPlayers = Array.from({ length: playerCount }, (_, i) => ({
          id: uuidv4(),
          name: `Player ${i + 1}`,
          isActive: i === 0,
        }));
        setPlayers(initialPlayers);
        clearSelections();
      } catch (error) {
        console.error('Failed to initialize players:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializePlayers();
  }, [playerCount, clearSelections]);

  const handleCharacterSelect = async () => {
    const currentPlayer = players[currentPlayerIndex];
    const selectedCharacter = getCharacter(currentPlayer.id);
    
    if (selectedCharacter) {
      setIsLoading(true);
      try {
        await initializePlayer(currentPlayer.id, selectedCharacter, currentPlayerIndex === 0);
        
        if (currentPlayerIndex < players.length - 1) {
          setCurrentPlayerIndex(prev => prev + 1);
        } else {
          setSetupComplete(true);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-400 text-lg">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!setupComplete) {
    const currentPlayer = players[currentPlayerIndex];
    return (
      <CharacterSelect
        playerId={currentPlayer.id}
        onSelect={handleCharacterSelect}
      />
    );
  }

  return (
    <>
      <GameLayout
        gameId={gameId}
        players={players}
        currentPlayerId={players[0].id}
      />
      <SaveButton onSave={async () => {}} />
    </>
  );
}