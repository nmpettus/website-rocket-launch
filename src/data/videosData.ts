
export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  embedUrl: string;
  type: 'youtube' | 'vimeo';
  aspectRatio: '16:9' | '9:16';
  category: 'featured' | 'stories' | 'activities' | 'behind-scenes' | 'faith' | 'adventures';
  featured?: boolean;
}

// Featured videos for homepage
export const featuredVideos: VideoData[] = [
  {
    id: "4",
    title: "Books By Maggie",
    description: "Get to know our beloved Maggie and discover her wonderful book collection",
    thumbnail: "https://img.youtube.com/vi/XVw8H0SgQ_Q/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/XVw8H0SgQ_Q",
    type: "youtube",
    aspectRatio: "16:9",
    category: "featured",
    featured: true
  },
  {
    id: "5", 
    title: "Maggie Shares Bible Wisdom",
    description: "Join Maggie as she shares important Bible wisdom and life lessons",
    thumbnail: "https://img.youtube.com/vi/WRB_SdUlG-g/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/WRB_SdUlG-g",
    type: "youtube",
    aspectRatio: "16:9",
    category: "featured",
    featured: true
  },
  {
    id: "8",
    title: "Maggie's Trust",
    description: "Watch as Maggie demonstrates the importance of trust and faith in Jesus",
    thumbnail: "https://img.youtube.com/vi/zTs_1PL3kEs/maxresdefault.jpg", 
    embedUrl: "https://www.youtube.com/embed/zTs_1PL3kEs",
    type: "youtube",
    aspectRatio: "16:9",
    category: "featured",
    featured: true
  }
];

// All videos (includes featured + all others)
export const allVideos: VideoData[] = [
  ...featuredVideos,
  {
    id: "1",
    title: "Maggie God Forgives",
    description: "A heartwarming message about God's forgiveness through Maggie's perspective",
    thumbnail: "https://img.youtube.com/vi/EBSBs0Rb7C0/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/EBSBs0Rb7C0",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "2",
    title: "Our Awesome God",
    description: "Maggie expresses her wonderful feelings about how awesome God truly is",
    thumbnail: "https://img.youtube.com/vi/wY8ckoYlcaU/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/wY8ckoYlcaU",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "3",
    title: "Maggie and God",
    description: "Watch Maggie share her special relationship and connection with God",
    thumbnail: "https://img.youtube.com/vi/aOhJ_T7hWao/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/aOhJ_T7hWao",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "6",
    title: "MaggieShout",
    description: "Join Maggie in this fun and energetic adventure filled with joy and excitement",
    thumbnail: "https://img.youtube.com/vi/FJLnzYDA1T8/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/FJLnzYDA1T8",
    type: "youtube",
    aspectRatio: "16:9",
    category: "adventures"
  },
  {
    id: "7",
    title: "MaggieDig",
    description: "Follow along as Maggie goes on a digging adventure and discovers new things",
    thumbnail: "https://img.youtube.com/vi/RUdgutpbc-g/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/RUdgutpbc-g",
    type: "youtube",
    aspectRatio: "16:9",
    category: "adventures"
  },
  {
    id: "9",
    title: "Maggie's Saturday",
    description: "Spend a delightful Saturday with Maggie and see what adventures await",
    thumbnail: "https://img.youtube.com/vi/Af7fQTEbgDo/maxresdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/Af7fQTEbgDo",
    type: "youtube",
    aspectRatio: "16:9",
    category: "adventures"
  }
];

export const videoCategories = [
  { id: 'all', label: 'All Videos' },
  { id: 'featured', label: 'Featured' },
  { id: 'faith', label: 'Faith & Bible' },
  { id: 'adventures', label: 'Maggie\'s Adventures' },
  { id: 'stories', label: 'Bible Stories' },
  { id: 'activities', label: 'Activities' },
  { id: 'behind-scenes', label: 'Behind the Scenes' }
];
