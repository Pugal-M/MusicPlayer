"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Song } from '@/lib/data';
import { cn } from '@/lib/utils';
import jsmediatags from 'jsmediatags';

interface SongImageProps {
  song: Song;
  width: number;
  height: number;
  className?: string;
}

const songImageCache: Record<string, string> = {};


export default function SongImage({ song, width, height, className }: SongImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(song.imageSrc);

  useEffect(() => {
    if (songImageCache[song.id]) {
        setImageSrc(songImageCache[song.id]);
        return;
    }
  
    if (!song.audioSrc) {
      setImageSrc(song.imageSrc); // fallback
      return;
    }

    jsmediatags.read(song.audioSrc, {
      onSuccess: (tag) => {
        const { picture } = tag.tags;
        if (picture) {
          const base64String = btoa(
            new Uint8Array(picture.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          const dataUrl = `data:${picture.format};base64,${base64String}`;
          setImageSrc(dataUrl);
          songImageCache[song.id] = dataUrl;
        } else {
            setImageSrc(song.imageSrc); // fallback
        }
      },
      onError: (error) => {
        console.error('Error reading MP3 tags:', error);
        setImageSrc(song.imageSrc); // fallback on error
      },
    });
  }, [song.audioSrc, song.imageSrc, song.id]);

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
