"use client";

import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { suggestSongs, type SuggestSongsInput } from '@/ai/flows/ai-song-suggestions';
import type { Song } from '@/lib/data';
import { Skeleton } from './ui/skeleton';
import { Sparkles } from 'lucide-react';

interface AISuggestionsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSong: Song | null;
}

export default function AISuggestions({ open, onOpenChange, currentSong }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && currentSong) {
      const fetchSuggestions = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions([]);

        try {
          const input: SuggestSongsInput = {
            currentTrackGenre: currentSong.genre,
            currentTrackTempo: currentSong.tempo,
            currentTrackCharacteristics: currentSong.characteristics,
          };
          const result = await suggestSongs(input);
          setSuggestions(result.suggestedSongs);
        } catch (e) {
          console.error('AI suggestion error:', e);
          setError('Could not fetch suggestions. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchSuggestions();
    }
  }, [open, currentSong]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="text-accent"/>
            AI Song Suggestions
          </SheetTitle>
          <SheetDescription>
            Based on &quot;{currentSong?.title}&quot; by {currentSong?.artist}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-8">
          {isLoading && (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          )}
          {error && <p className="text-destructive">{error}</p>}
          {!isLoading && !error && (
            <ul className="space-y-3 list-disc list-inside">
              {suggestions.map((song, index) => (
                <li key={index} className="text-foreground/90">{song}</li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
