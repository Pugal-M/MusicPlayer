
"use client";

import { usePlayer, type Playlist } from '@/context/PlayerContext';
import type { Song } from '@/lib/data';
import { formatDuration, cn } from '@/lib/utils';
import { MoreHorizontal, Music, Plus, Volume2, Heart, Info, X } from 'lucide-react';
import React, { useMemo, useState, useRef } from 'react';

import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import SongImage from './SongImage';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from './ui/separator';

type SortKey = keyof Song | 'duration';
type SortDirection = 'asc' | 'desc';

export default function SongList() {
  const { allSongs, playlists, activePlaylistId, addSongToPlaylist, playSong, currentSong, isPlaying, favoriteSongIds, toggleFavorite } from usePlayer();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);
  const [selectedSongForInfo, setSelectedSongForInfo] = useState<Song | null>(null);
  const isMobile = useIsMobile();
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = (song: Song) => {
    longPressTimeout.current = setTimeout(() => {
      setSelectedSongForInfo(song);
    }, 500); // 500ms for long press
  };

  const handleMouseUp = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };

  const handleTouchStart = (song: Song) => {
    longPressTimeout.current = setTimeout(() => {
      setSelectedSongForInfo(song);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
    }
  };


  const activePlaylist = useMemo(() => playlists.find(p => p.id === activePlaylistId), [playlists, activePlaylistId]);

  const getPlaylistName = () => {
    if (activePlaylistId === 'favorites') return 'Favorites';
    if (activePlaylist) return activePlaylist.name;
    return 'All Songs';
  }

  const displayedSongs = useMemo(() => {
    let songsToShow: Song[];

    if (activePlaylistId === 'favorites') {
      songsToShow = allSongs.filter(song => favoriteSongIds.includes(song.id));
    } else if (activePlaylistId) {
      const playlist = playlists.find(p => p.id === activePlaylistId);
      songsToShow = playlist ? allSongs.filter(song => playlist.songIds.includes(song.id)) : [];
    } else {
      songsToShow = allSongs;
    }


    if (searchTerm) {
      songsToShow = songsToShow.filter(
        song =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.album.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig !== null) {
      songsToShow.sort((a, b) => {
        const keyA = a[sortConfig.key as keyof Song];
        const keyB = b[sortConfig.key as keyof Song];
        if (keyA < keyB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (keyA > keyB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return songsToShow;
  }, [allSongs, activePlaylistId, playlists, favoriteSongIds, searchTerm, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const handlePlayClick = (songId: string, e: React.MouseEvent | React.TouchEvent) => {
    handleMouseUp(); // Clear long press timeout
    // Prevent playing if it was a long press that opened the dialog
    if (e.type !== 'touchend' || !longPressTimeout.current) {
       playSong(songId, activePlaylistId);
    }
  }


  return (
    <div className="flex h-full flex-col gap-4 p-4 lg:p-6">
      <header className="flex flex-col gap-2">
         <h2 className="text-3xl font-bold tracking-tight">{getPlaylistName()}</h2>
        <Input
          placeholder="Search songs, artists, or albums..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-sm bg-card"
        />
      </header>
      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead onClick={() => requestSort('title')}>Title</TableHead>
              <TableHead className="hidden md:table-cell" onClick={() => requestSort('artist')}>Artist</TableHead>
              <TableHead className="hidden md:table-cell" onClick={() => requestSort('album')}>Album</TableHead>
              <TableHead className="text-right hidden md:table-cell" onClick={() => requestSort('duration')}>
                Duration
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedSongs.map((song, index) => (
              <TableRow 
                key={song.id} 
                className={cn(
                  "group cursor-pointer",
                  currentSong?.id === song.id && "bg-primary/20 hover:bg-primary/30"
                )}
                onClick={(e) => handlePlayClick(song.id, e)}
                onMouseDown={() => handleMouseDown(song)}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={() => handleTouchStart(song)}
                onTouchEnd={handleTouchEnd}
              >
                <TableCell className="font-tabular text-right text-muted-foreground">
                  {currentSong?.id === song.id && isPlaying ? (
                    <Volume2 className="h-5 w-5 text-primary animate-pulse mx-auto" />
                  ) : (
                    <span className="group-hover:hidden">{index + 1}</span>
                  )}
                </TableCell>
                <TableCell className="flex items-center gap-4">
                   <SongImage 
                    song={song} 
                    width={40}
                    height={40}
                    className="aspect-square rounded-md object-cover"
                  />
                  <div>
                    <p className={cn("font-medium truncate", currentSong?.id === song.id && "text-primary")}>{song.title}</p>
                    <p className="text-muted-foreground md:hidden">{song.artist}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{song.artist}</TableCell>
                <TableCell className="hidden md:table-cell">{song.album}</TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {formatDuration(song.duration)}
                </TableCell>
                <TableCell>
                   <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                    <AddToPlaylistDropdown song={song} playlists={playlists} onAdd={addSongToPlaylist} />
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
       <SongInfoDialog 
          song={selectedSongForInfo} 
          open={!!selectedSongForInfo} 
          onOpenChange={() => setSelectedSongForInfo(null)}
          isFavorite={selectedSongForInfo ? favoriteSongIds.includes(selectedSongForInfo.id) : false}
          onFavoriteToggle={() => selectedSongForInfo && toggleFavorite(selectedSongForInfo.id)}
        >
        {selectedSongForInfo && (
          <div className="flex flex-col gap-4 pt-4">
              <AddToPlaylistDropdown song={selectedSongForInfo} playlists={playlists} onAdd={addSongToPlaylist} showTrigger />
          </div>
        )}
      </SongInfoDialog>
    </div>
  );
}

function AddToPlaylistDropdown({ song, playlists, onAdd, showTrigger = false }: { song: Song, playlists: Playlist[], onAdd: (playlistId: string, songId: string) => void, showTrigger?: boolean }) {
  const content = (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <Plus className="mr-2 h-4 w-4" />
          <span>Add to Playlist</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {playlists.length > 0 ? playlists.map(playlist => (
            <DropdownMenuItem key={playlist.id} onClick={() => onAdd(playlist.id, song.id)}>
              {playlist.name}
            </DropdownMenuItem>
          )) : <DropdownMenuItem disabled>No playlists yet</DropdownMenuItem>}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
  );

  if (showTrigger) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Add to Playlist</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {content}
            </DropdownMenuContent>
        </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SongInfoDialog({ 
  song, 
  open, 
  onOpenChange, 
  children,
  isFavorite,
  onFavoriteToggle
}: { 
  song: Song | null, 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  children?: React.ReactNode,
  isFavorite: boolean,
  onFavoriteToggle: () => void
}) {
  if (!song) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                <SongImage 
                  song={song} 
                  width={80}
                  height={80}
                  className="aspect-square rounded-md object-cover"
                />
                <div>
                  <DialogTitle className="text-2xl">{song.title}</DialogTitle>
                  <p className="text-lg text-muted-foreground">{song.artist}</p>
                </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => { e.stopPropagation(); onFavoriteToggle(); }}
              className="mt-1"
            >
                <Heart className={cn("h-6 w-6", isFavorite ? "text-red-500 fill-current" : "text-muted-foreground")}/>
            </Button>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 py-4">
            <div>
                <p className="font-semibold">Album</p>
                <p className="text-muted-foreground">{song.album}</p>
            </div>
            <div>
                <p className="font-semibold">Duration</p>
                <p className="text-muted-foreground">{formatDuration(song.duration)}</p>
            </div>
             <div>
                <p className="font-semibold">Genre</p>
                <p className="text-muted-foreground">{song.genre}</p>
            </div>
             <div>
                <p className="font-semibold">Tempo</p>
                <p className="text-muted-foreground">{song.tempo}</p>
            </div>
            <div className="col-span-2">
                <p className="font-semibold">Characteristics</p>
                <p className="text-muted-foreground">{song.characteristics}</p>
            </div>
        </div>
        <Separator />
        {children}
      </DialogContent>
    </Dialog>
  );
}
    

    
