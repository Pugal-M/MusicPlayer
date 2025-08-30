
"use client";

import { usePlayer, type Playlist } from '@/context/PlayerContext';
import type { Song } from '@/lib/data';
import { formatDuration, cn } from '@/lib/utils';
import { MoreHorizontal, Music, Play, Plus, Pause, Volume2, Heart } from 'lucide-react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';

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

type SortKey = keyof Song | 'duration';
type SortDirection = 'asc' | 'desc';

export default function SongList() {
  const { allSongs, playlists, activePlaylistId, addSongToPlaylist, playSong, currentSong, isPlaying, togglePlayPause, favoriteSongIds, toggleFavorite, selectPlaylist } = usePlayer();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: SortDirection;
  } | null>(null);

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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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
  
  const handlePlayClick = (songId: string) => {
    if (currentSong?.id === songId) {
      togglePlayPause();
    } else {
      playSong(songId);
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
              <TableHead onClick={() => requestSort('artist')}>Artist</TableHead>
              <TableHead onClick={() => requestSort('album')}>Album</TableHead>
              <TableHead className="w-12 text-center">Favorite</TableHead>
              <TableHead className="text-right" onClick={() => requestSort('duration')}>
                Duration
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedSongs.map(song => (
              <TableRow key={song.id} className="group cursor-pointer" onDoubleClick={() => playSong(song.id)}>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handlePlayClick(song.id)}>
                    {currentSong?.id === song.id && isPlaying ? (
                       <Volume2 className="h-5 w-5 text-primary animate-pulse"/>
                    ) : (
                       <Play className="h-5 w-5 group-hover:text-primary"/>
                    )}
                  </Button>
                </TableCell>
                <TableCell className="flex items-center gap-4">
                   <SongImage 
                    song={song} 
                    width={40}
                    height={40}
                    className="aspect-square rounded-md object-cover"
                  />
                  <span className="font-medium">{song.title}</span>
                </TableCell>
                <TableCell>{song.artist}</TableCell>
                <TableCell>{song.album}</TableCell>
                <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={() => toggleFavorite(song.id)}>
                        <Heart className={cn("h-5 w-5", favoriteSongIds.includes(song.id) ? "text-red-500 fill-current" : "text-muted-foreground")}/>
                    </Button>
                </TableCell>
                <TableCell className="text-right">
                  {formatDuration(song.duration)}
                </TableCell>
                <TableCell>
                  <AddToPlaylistDropdown song={song} playlists={playlists} onAdd={addSongToPlaylist} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

function AddToPlaylistDropdown({ song, playlists, onAdd }: { song: Song, playlists: Playlist[], onAdd: (playlistId: string, songId: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
