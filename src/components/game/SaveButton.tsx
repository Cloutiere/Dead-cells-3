"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.button
      onClick={handleSave}
      disabled={cooldown || isSaving}
      className={cn(
        'fixed top-4 right-4 z-50',
        'flex items-center space-x-2 px-4 py-2 rounded-lg',
        'bg-neutral-900/90 text-white',
        'shadow-lg backdrop-blur-sm',
        'transition-all duration-300',
        'hover:scale-105 hover:shadow-xl',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        (cooldown || isSaving) && 'opacity-50 cursor-not-allowed'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {isSaving ? (
          <motion.div
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
          />
        ) : (
          <motion.div
            key="save-icon"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Save className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
      <span className="text-sm font-medium">
        {isSaving ? 'Saving...' : 'Save Game'}
      </span>
    </motion.button>
  );
}