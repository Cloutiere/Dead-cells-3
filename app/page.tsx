"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePlayerSelect = async (count: number) => {
    setIsLoading(true);
    try {
      router.push(`/game?players=${count}`);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Skull className="w-16 h-16 text-red-600 mr-4" />
            <h1 className={cn(
              "text-7xl font-bold",
              "bg-clip-text text-transparent",
              "bg-gradient-to-b from-red-500 to-red-800"
            )}>
              DEAD CELLS
            </h1>
            <Skull className="w-16 h-16 text-red-600 ml-4" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl text-neutral-200 mb-8">
            Select Number of Players
          </h2>
          <div className="flex items-center justify-center gap-6">
            {[1, 2, 3, 4].map((count) => (
              <button
                key={`player-${count}`}
                onClick={() => handlePlayerSelect(count)}
                disabled={isLoading}
                className={cn(
                  "w-20 h-20 rounded-full",
                  "bg-neutral-800 border-2 border-neutral-700",
                  "text-2xl font-bold text-neutral-400",
                  "transition-colors duration-200",
                  "hover:border-red-500 hover:text-red-500",
                  "focus:outline-none focus:ring-2 focus:ring-red-500",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}