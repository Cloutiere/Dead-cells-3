"use client";

import { useState } from 'react';
import { Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  onSave: () => Promise<void>;
}

export function SaveButton({ onSave }: SaveButtonProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (cooldown || isSaving) return;

    setIsSaving(true);
    try {
      await onSave();
      toast({
        title: "Game Saved",
        description: "Your progress has been saved successfully.",
      });
      setCooldown(true);
      setTimeout(() => setCooldown(false), 2000);
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save game progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={cooldown || isSaving}
      className={cn(
        'fixed top-4 right-4 z-50',
        'flex items-center space-x-2 px-4 py-2 rounded-lg',
        'bg-neutral-900/90 text-white',
        'shadow-lg backdrop-blur-sm',
        (cooldown || isSaving) && 'opacity-50 cursor-not-allowed'
      )}
    >
      {isSaving ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Save className="w-5 h-5" />
      )}
      <span className="text-sm font-medium">
        {isSaving ? 'Saving...' : 'Save Game'}
      </span>
    </button>
  );
}