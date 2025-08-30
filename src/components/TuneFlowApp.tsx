"use client";

import { PlayerProvider } from '@/context/PlayerContext';
import AppSidebar from '@/components/AppSidebar';
import SongList from '@/components/SongList';
import AudioPlayer from '@/components/AudioPlayer';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from './ui/sidebar';

export default function TuneFlowApp() {
  return (
    <PlayerProvider>
      <SidebarProvider>
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <div className="flex h-screen w-full flex-col bg-background text-foreground">
          <header className="flex h-14 items-center gap-4 border-b bg-card/50 px-4 md:hidden">
            <SidebarTrigger />
            <h1 className="font-headline text-lg font-bold tracking-tight">RhythmicTunes</h1>
          </header>
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <SongList />
            </div>
            <div className="shrink-0">
              <AudioPlayer />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </PlayerProvider>
  );
}
