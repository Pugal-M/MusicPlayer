"use client";

import { Music, Plus, ListMusic, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function AppSidebar() {
  const { playlists, createPlaylist, selectPlaylist, activePlaylistId } = usePlayer();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsDialogOpen(false);
    }
  };

  return (
    <aside className="col-start-1 row-span-1 flex flex-col gap-8 border-r bg-card/50 p-4">
      <div className="flex items-center gap-2 px-2">
        <Music2 className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight">TuneFlow</h1>
      </div>
      <nav className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1">
            <Button
              variant={!activePlaylistId ? "secondary" : "ghost"}
              className="justify-start gap-2"
              onClick={() => selectPlaylist(null)}
            >
              <Music className="h-4 w-4" />
              All Songs
            </Button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold tracking-tight">Playlists</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col gap-1">
            {playlists.map((playlist) => (
              <Button
                key={playlist.id}
                variant={activePlaylistId === playlist.id ? "secondary" : "ghost"}
                className="justify-start gap-2 truncate"
                onClick={() => selectPlaylist(playlist.id)}
              >
                <ListMusic className="h-4 w-4" />
                {playlist.name}
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
