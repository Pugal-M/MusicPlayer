
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Song } from '@/lib/data';
import { cn } from '@/lib/utils';
import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';
import { Skeleton } from './ui/skeleton';

interface SongImageProps {
  song: Song;
  width: number;
  height: number;
  className?: string;
}

const songImageCache: Record<string, string> = {};


export default function SongImage({ song, width, height, className }: SongImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    
    if (songImageCache[song.id]) {
      if (!isCancelled) {
        setImageSrc(songImageCache[song.id]);
        setLoading(false);
      }
      return;
    }

    if (!song.audioSrc) {
      if (!isCancelled) {
        setImageSrc(song.imageSrc);
        setLoading(false);
      }
      return;
    }

    const fetchAndReadTags = async () => {
      try {
        const response = await fetch(song.audioSrc);
        if (!response.ok) {
          throw new Error('Failed to fetch audio file');
        }
        const blob = await response.blob();

        jsmediatags.read(blob, {
          onSuccess: (tag) => {
            if (isCancelled) return;
            const { picture } = tag.tags;
            if (picture) {
              const base64String = btoa(
                new Uint8Array(picture.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
              );
              const dataUrl = `data:${picture.format};base64,${base64String}`;
              songImageCache[song.id] = dataUrl;
              setImageSrc(dataUrl);
            } else {
              songImageCache[song.id] = song.imageSrc; // cache fallback
              setImageSrc(song.imageSrc); // fallback
            }
            setLoading(false);
          },
          onError: (error) => {
            if (isCancelled) return;
            console.error('Error reading MP3 tags from blob:', error);
            songImageCache[song.id] = song.imageSrc; // cache fallback on error
            setImageSrc(song.imageSrc); // fallback on error
            setLoading(false);
          },
        });
      } catch (error) {
        if (isCancelled) return;
        console.error('Error fetching audio file:', error);
        songImageCache[song.id] = song.imageSrc; // cache fallback on error
        setImageSrc(song.imageSrc); // fallback on error
        setLoading(false);
      }
    };
    
    fetchAndReadTags();

    return () => {
      isCancelled = true;
    };
  }, [song.id, song.audioSrc, song.imageSrc]);

  if (loading || !imageSrc) {
    return <Skeleton className={cn("aspect-square", className)} style={{width, height}} />;
  }

  return (
    <Image
      src={imageSrc}
      alt={song.title}
      width={width}
      height={height}
      className={cn(className)}
      data-ai-hint="album cover"
      unoptimized={imageSrc.startsWith('data:')} // unoptimize base64 images
    />
  );
}
