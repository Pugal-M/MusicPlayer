
"use client";

import { usePlayer } from '@/context/PlayerContext';
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { formatDuration } from '@/lib/utils';
import SongImage from './SongImage';

export default function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrev,
    volume,
    setVolume,
    progress,
    duration,
    seek,
  } = usePlayer();

  if (!currentSong) {
    return (
      <footer className="border-t bg-card/30">
        <div className="container mx-auto flex h-24 items-center justify-center p-4">
          <p className="text-muted-foreground">No song selected.</p>
        </div>
      </footer>
    );
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleProgressChange = (value: number[]) => {
    seek(value[0]);
  };
  
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;


  return (
    <footer className="border-t bg-card/30">
      <div className="container mx-auto grid h-24 grid-cols-[1fr_auto_1fr] items-center gap-4 p-4 md:grid-cols-3">
        {/* Now Playing */}
        <div className="flex items-center gap-4 truncate">
          <SongImage 
            song={currentSong} 
            width={64}
            height={64}
            className="aspect-square rounded-md object-cover"
          />
          <div className="hidden truncate md:block">
            <p className="font-semibold truncate">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" onClick={playPrev}>
              <SkipBack />
            </Button>
            <Button size="icon" className="h-12 w-12" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext}>
              <SkipForward />
            </Button>
          </div>
          <div className="flex w-full max-w-md items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatDuration(progress)}</span>
            <Slider
              value={[progress]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
            />
            <span className="text-xs text-muted-foreground">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Volume & Extras */}
        <div className="flex items-center justify-end gap-4">
          <div className="flex w-32 items-center gap-2">
            <VolumeIcon className="h-5 w-5" />
            <Slider
              value={[volume]}
              max={1}
              step={0.01}
              onValueValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
