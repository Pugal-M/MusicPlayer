
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
    artist: 'Lesfm',
    album: 'Single',
    duration: 161,
    audioSrc: '/music/Inspiring-Cinematic-Ambient.mp3',
    imageSrc: 'https://picsum.photos/seed/1/300/300',
    genre: 'Ambient',
    tempo: 'Slow',
    characteristics: 'Calm, atmospheric, uplifting',
  },
  {
    id: '2',
    title: 'The Podcast Intro',
    artist: 'Music Unlimited',
    album: 'Sounds for Creators',
    duration: 57,
    audioSrc: '/music/The-Podcast-Intro.mp3',
    imageSrc: 'https://picsum.photos/seed/2/300/300',
    genre: 'Electronic',
    tempo: 'Medium',
    characteristics: 'Upbeat, modern, engaging',
  },
  {
    id: '3',
    title: 'Lofi Chill',
    artist: 'BoDleasons',
    album: 'Chill Vibes',
    duration: 133,
    audioSrc: '/music/Lofi-Chill.mp3',
    imageSrc: 'https://picsum.photos/seed/3/300/300',
    genre: 'Lo-fi',
    tempo: 'Slow',
    characteristics: 'Relaxing, mellow, jazzy',
  },
  {
    id: '4',
    title: 'Spirit Blossom',
    artist: 'RomanBelov',
    album: 'Mystic Journeys',
    duration: 213,
    audioSrc: '/music/Spirit-Blossom.mp3',
    imageSrc: 'https://picsum.photos/seed/4/300/300',
    genre: 'Orchestral',
    tempo: 'Medium',
    characteristics: 'Mysterious, fantasy, Asian-inspired',
  },
  {
    id: '5',
    title: 'Happy African Village',
    artist: 'John Bartmann',
    album: 'World Sounds',
    duration: 131,
    audioSrc: '/music/Happy-African-Village.mp3',
    imageSrc: 'https://picsum.photos/seed/5/300/300',
    genre: 'World',
    tempo: 'Fast',
    characteristics: 'Joyful, rhythmic, tribal',
  },
  {
    id: '6',
    title: 'Just Relax',
    artist: 'Lesfm',
    album: 'Mindfulness',
    duration: 153,
    audioSrc: '/music/Just-Relax.mp3',
    imageSrc: 'https://picsum.photos/seed/6/300/300',
    genre: 'Ambient',
    tempo: 'Slow',
    characteristics: 'Peaceful, meditative, soothing',
  },
];
