
export type Song = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  audioSrc: string;
  imageSrc: string;
  genre: string;
  tempo: string;
  characteristics: string;
};

export const songs: Song[] = [];
