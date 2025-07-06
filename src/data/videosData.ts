
export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  type: 'youtube' | 'vimeo';
  aspectRatio: '16:9' | '9:16';
  category: 'featured' | 'stories' | 'activities' | 'behind-scenes';
  featured?: boolean;
}

// Featured videos for homepage
export const featuredVideos: VideoData[] = [
  {
    id: "1",
    title: "God loves you",
    description: "Get to know our beloved Maggie and her adventures",
    thumbnail: "https://img.youtube.com/vi/XVw8H0SgQ_Q/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/XVw8H0SgQ_Q",
    type: "youtube",
    aspectRatio: "16:9",
    category: "featured",
    featured: true
  },
  {
    id: "2", 
    title: "God is Awesome",
    description: "A sneak peek into Maggie's wonderful Bible story adventures",
    thumbnail: "https://img.youtube.com/vi/wY8ckoYlcaU/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/wY8ckoYlcaU",
    type: "youtube",
    aspectRatio: "16:9",
    category: "featured",
    featured: true
  },
  {
    id: "3",
    title: "Maggie talks about love",
    description: "See how Maggie's books come to life",
    thumbnail: "https://img.youtube.com/vi/WRB_SdUlG-g/hqdefault.jpg", 
    embedUrl: "https://www.youtube.com/embed/WRB_SdUlG-g",
    type: "youtube",
    aspectRatio: "16:9",
    category: "featured",
    featured: true
  }
];

// All videos (will expand as you add more)
export const allVideos: VideoData[] = [
  ...featuredVideos,
  // Add new videos here - just copy this format:
  // {
  //   id: "4",
  //   title: "Your Video Title",
  //   description: "Your video description",
  //   thumbnail: "https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg",
  //   embedUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID",
  //   type: "youtube",
  //   aspectRatio: "16:9", // or "9:16" for vertical videos
  //   category: "stories" // or "activities", "behind-scenes", etc.
  // },
];

export const videoCategories = [
  { id: 'all', label: 'All Videos' },
  { id: 'featured', label: 'Featured' },
  { id: 'stories', label: 'Bible Stories' },
  { id: 'activities', label: 'Activities' },
  { id: 'behind-scenes', label: 'Behind the Scenes' }
];
