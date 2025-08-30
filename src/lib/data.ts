
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

export const songs: Song[] = [
    {
    id: '1',
    title: 'Inspiring Cinematic Ambient',
    artist: 'Lexin Music',
    album: 'Single',
    duration: 188,
    audioSrc: '/music/Inspiring-Cinematic-Ambient.mp3',
    imageSrc: 'https://picsum.photos/seed/1/200/200',
    genre: 'Ambient',
    tempo: 'Slow',
    characteristics: 'Inspiring, Cinematic'
  },
  {
    id: '2',
    title: 'The Podcast Intro',
    artist: 'Music Unlimited',
    album: 'Podcast Pack',
    duration: 60,
    audioSrc: '/music/The-Podcast-Intro.mp3',
    imageSrc: 'https://picsum.photos/seed/2/200/200',
    genre: 'Podcast',
    tempo: 'Medium',
    characteristics: 'Upbeat, Modern'
  },
  {
    id: '3',
    title: 'Modern Vlog',
    artist: 'Asepirawan',
    album: 'Vlog Beats',
    duration: 120,
    audioSrc: '/music/Modern-Vlog.mp3',
    imageSrc: 'https://picsum.photos/seed/3/200/200',
    genre: 'Electronic',
    tempo: 'Medium',
    characteristics: 'Catchy, Energetic'
  }
];
