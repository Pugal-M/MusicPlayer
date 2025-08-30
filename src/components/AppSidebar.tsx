
"use client";

import { Music, Plus, ListMusic, Music2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useSidebar } from './ui/sidebar';

export default function AppSidebar() {
  const { playlists, createPlaylist, selectPlaylist, activePlaylistId } = usePlayer();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { state } = useSidebar();


  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <aside className="flex h-full flex-col gap-8 bg-card/50 p-4">
      <div className="flex items-center gap-2 px-2">
        <Music2 className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight group-data-[collapsible=icon]:hidden">RhythmicTunes</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
            <Button
              variant={!activePlaylistId ? "secondary" : "ghost"}
              className="justify-start gap-2"
              onClick={() => selectPlaylist(null)}
            >
              <Music className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">All Songs</span>
            </Button>
            <Button
              variant={activePlaylistId === 'favorites' ? "secondary" : "ghost"}
              className="justify-start gap-2"
              onClick={() => selectPlaylist('favorites')}
            >
              <Heart className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Favorites</span>
            </Button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">Playlists</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            {playlists.map((playlist) => (
              <Button
                key={playlist.id}
                variant={activePlaylistId === playlist.id ? "secondary" : "ghost"}
                className="justify-start gap-2"
                onClick={() => selectPlaylist(playlist.id)}
              >
                <ListMusic className="h-4 w-4" />
                <span className="truncate group-data-[collapsible=icon]:hidden">{playlist.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </nav>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="My Awesome Mix"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePlaylist}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
