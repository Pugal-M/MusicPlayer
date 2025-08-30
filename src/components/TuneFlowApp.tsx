"use client";

import { PlayerProvider } from '@/context/PlayerContext';
import AppSidebar from '@/components/AppSidebar';
import SongList from '@/components/SongList';
import AudioPlayer from '@/components/AudioPlayer';
import { ScrollArea } from './ui/scroll-area';

export default function TuneFlowApp() {
  return (
    <PlayerProvider>
      <div className="grid h-screen w-full grid-cols-[280px_1fr] grid-rows-[1fr_auto] bg-background text-foreground">
        <AppSidebar />
        <div className="col-start-2 row-start-1 flex flex-col overflow-hidden">
            <SongList />
        </div>
        <div className="col-span-2 col-start-1 row-start-2">
          <AudioPlayer />
        </div>
      </div>
    </PlayerProvider>
  );
}
