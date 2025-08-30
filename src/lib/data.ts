
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
    title: 'Aalaporan Thamizhan',
    artist: 'A.R. Rahman',
    album: 'Mersal',
    duration: 188, // update if you want exact duration
    audioSrc: '/music/Aalaporan-Thamizhan-MassTamilan.com.mp3',
    imageSrc: 'https://picsum.photos/seed/1/200/200',
    genre: 'Tamil',
    tempo: 'Fast',
    characteristics: 'Patriotic, Energetic'
  },  
  {
    id: '6',
    title: 'Nenjukkule',
    artist: 'A.R. Rahman',
    album: 'Kadal',
    duration: 290, // replace with actual duration when available
    audioSrc: '/music/Nenjukkule.mp3',  
    imageSrc: 'https://picsum.photos/seed/6/200/200',
    genre: 'Tamil',
    tempo: 'Slow',
    characteristics: 'Romantic, Emotional'
  },  
  {
    id: '2',
    title: 'Hayyoda',
    artist: 'A.R. Rahman',
    album: 'Jawan',
    duration: 200,
    audioSrc: '/music/Hayyoda-MassTamilan.dev.mp3',
    imageSrc: 'https://picsum.photos/seed/2/200/200',
    genre: 'Tamil',
    tempo: 'Medium',
    characteristics: 'Romantic, Melodic'
  },

  {
    id: '3',
    title: 'Powerhouse',
    artist: 'Anirudh ',
    album: 'Coolie',
    duration: 206,
    audioSrc: '/music/Powerhouse.mp3',
    imageSrc: 'https://picsum.photos/seed/3/200/200',
    genre: 'Instrumental',
    tempo: 'Fast',
    characteristics: 'Energetic, Rhythmic'
  }
  ,
  {
    id: '4',
    title: 'Muththa Mazhai',
    artist: 'ARR',
    album: 'Thug Life',
    duration: 241,
    audioSrc: '/music/Muththa Mazhai.mp3',
    imageSrc: 'https://picsum.photos/seed/4/200/200',
    genre: 'Tamil',
    tempo: 'Slow',
    characteristics: 'Melodic, Emotional'
  },

  {
    id: '5',
    title: 'Arabic Kuthu - Halamithi Habibo',
    artist: 'Anirudh Ravichander',
    album: 'Beast',
    duration: 279, // replace with actual duration when available
    audioSrc: '/music/Arabic-Kuthu---Halamithi-Habibo-MassTamilan.so.mp3',
    imageSrc: 'https://picsum.photos/seed/5/200/200',
    genre: 'Tamil',
    tempo: 'Fast',
    characteristics: 'Dance, Energetic'
  },
  
  {
    id: '7',
    title: 'Tum Tum',
    artist: 'Thaman S',
    album: 'Enemy',
    duration: 228, // replace with actual duration when available
    audioSrc: '/music/Tum-Tum-MassTamilan.fm.mp3',
    imageSrc: 'https://picsum.photos/seed/7/200/200',
    genre: 'Tamil',
    tempo: 'Medium',
    characteristics: 'Romantic, Catchy'
  }  
  
];
