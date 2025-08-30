
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
  favoriteSongIds: string[];
  playSong: (songId: string, playlistId?: string | null) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (volume: number) => void;
  seek: (progress: number) => void;
  createPlaylist: (name: string, songIds?: string[]) => void;
  deletePlaylist: (playlistId: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => void;
  selectPlaylist: (playlistId: string | null) => void;
  toggleFavorite: (songId: string) => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favoriteSongIds, setFavoriteSongIds] = useState<string[]>([]);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  
  // This state tracks the playlist that is currently being played from
  const [playingFromPlaylistId, setPlayingFromPlaylistId] = useState<string | null>(null);
  
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentSong = React.useMemo(() => songs.find(s => s.id === currentSongId) || null, [currentSongId]);
  
  const playbackList = React.useMemo(() => {
    if (playingFromPlaylistId === 'favorites') {
      return songs.filter(song => favoriteSongIds.includes(song.id));
    }
    const playlist = playlists.find(p => p.id === playingFromPlaylistId);
    if (playlist) {
      return songs.filter(song => playlist.songIds.includes(song.id));
    }
    return songs; // Default to all songs
  }, [playingFromPlaylistId, playlists, favoriteSongIds]);
  
  const currentSongIndexInPlaybackList = React.useMemo(() => {
    if (!currentSongId) return -1;
    return playbackList.findIndex(s => s.id === currentSongId);
  }, [currentSongId, playbackList]);


  useEffect(() => {
    const storedPlaylists = localStorage.getItem('tuneflow-playlists');
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists));
    }
    const storedFavorites = localStorage.getItem('tuneflow-favorites');
    if (storedFavorites) {
      setFavoriteSongIds(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tuneflow-playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('tuneflow-favorites', JSON.stringify(favoriteSongIds));
  }, [favoriteSongIds]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);
  
  const playSong = useCallback((songId: string, playlistIdToPlayFrom?: string | null) => {
    const songToPlay = songs.find(s => s.id === songId);
    if (songToPlay) {
      setCurrentSongId(songId);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = songToPlay.audioSrc;
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
      // If a playlist context is provided, set it as the current playback source
      if (playlistIdToPlayFrom !== undefined) {
         setPlayingFromPlaylistId(playlistIdToPlayFrom);
      }
    }
  }, []);

  const playNext = useCallback(() => {
    if (currentSongIndexInPlaybackList === -1 || playbackList.length === 0) return;
    const nextIndex = (currentSongIndexInPlaybackList + 1) % playbackList.length;
    playSong(playbackList[nextIndex].id);
  }, [currentSongIndexInPlaybackList, playbackList, playSong]);

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
    if (currentSongIndexInPlaybackList === -1 || playbackList.length === 0) return;
    const prevIndex = (currentSongIndexInPlaybackList - 1 + playbackList.length) % playbackList.length;
    playSong(playbackList[prevIndex].id);
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
  
  const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (activePlaylistId === playlistId) {
      setActivePlaylistId(null);
    }
     if (playingFromPlaylistId === playlistId) {
      setPlayingFromPlaylistId(null);
    }
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
  };

  const toggleFavorite = (songId: string) => {
    setFavoriteSongIds(prev =>
      prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
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
        favoriteSongIds,
        playSong,
        togglePlayPause,
        playNext,
        playPrev,
        setVolume,
        seek,
        createPlaylist,
        deletePlaylist,
        addSongToPlaylist,
        selectPlaylist,
        toggleFavorite
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
