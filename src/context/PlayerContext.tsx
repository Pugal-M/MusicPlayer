
"use client";

import { songs, type Song } from '@/lib/data';
import type { ReactNode } from 'react';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export type Playlist = {
  id: string;
  name: string;
  songIds: string[];
};

type PlayerContextType = {
  allSongs: Song[];
  playlists: Playlist[];
  activePlaylistId: string | null;
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  playSong: (songId: string) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (volume: number) => void;
  seek: (progress: number) => void;
  createPlaylist: (name: string, songIds?: string[]) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  selectPlaylist: (playlistId: string | null) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const activeSongList = React.useMemo(() => {
    if (!activePlaylistId) return songs;
    const playlist = playlists.find(p => p.id === activePlaylistId);
    if (!playlist) return songs;
    return songs.filter(song => playlist.songIds.includes(song.id));
  }, [activePlaylistId, playlists]);

  const currentSong = currentSongIndex > -1 ? activeSongList[currentSongIndex] : null;

  useEffect(() => {
    const storedPlaylists = localStorage.getItem('tuneflow-playlists');
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tuneflow-playlists', JSON.stringify(playlists));
  }, [playlists]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);
  
  const playSong = useCallback((songId: string) => {
    const songIndex = activeSongList.findIndex(s => s.id === songId);
    if (songIndex > -1) {
      setCurrentSongIndex(songIndex);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = activeSongList[songIndex].audioSrc;
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
    }
  }, [activeSongList]);

  const playNext = useCallback(() => {
    if (!currentSong) return;
    const nextIndex = (currentSongIndex + 1) % activeSongList.length;
    playSong(activeSongList[nextIndex].id);
  }, [currentSong, currentSongIndex, activeSongList, playSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playNext]);

  const togglePlayPause = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.error("Error playing audio:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const playPrev = () => {
    if (!currentSong) return;
    const prevIndex = (currentSongIndex - 1 + activeSongList.length) % activeSongList.length;
    playSong(activeSongList[prevIndex].id);
  };
  
  const seek = (newProgress: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress;
      setProgress(newProgress);
    }
  };

  const createPlaylist = (name: string, songIds: string[] = []) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songIds,
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  };

  const addSongToPlaylist = (playlistId: string, songId: string) => {
    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId] }
          : p
      )
    );
  };
  
  const selectPlaylist = (playlistId: string | null) => {
    setActivePlaylistId(playlistId);
    setCurrentSongIndex(-1);
    setIsPlaying(false);
    setProgress(0);
    if(audioRef.current) audioRef.current.src = "";
  };

  return (
    <PlayerContext.Provider
      value={{
        allSongs: songs,
        playlists,
        activePlaylistId,
        currentSong,
        isPlaying,
        volume,
        progress,
        duration,
        playSong,
        togglePlayPause,
        playNext,
        playPrev,
        setVolume,
        seek,
        createPlaylist,
        addSongToPlaylist,
        selectPlaylist,
      }}
    >
      {children}
      <audio ref={audioRef} />
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
