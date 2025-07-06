
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
    thumbnail: "https://i.ytimg.com/vi/XVw8H0SgQ_Q/hqdefault.jpg",
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
    thumbnail: "https://i.ytimg.com/vi/WRB_SdUlG-g/hqdefault.jpg",
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
    thumbnail: "https://i.ytimg.com/vi/zTs_1PL3kEs/hqdefault.jpg", 
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
    thumbnail: "https://i.ytimg.com/vi/EBSBs0Rb7C0/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/EBSBs0Rb7C0",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "2",
    title: "Our Awesome God",
    description: "Maggie expresses her wonderful feelings about how awesome God truly is",
    thumbnail: "https://i.ytimg.com/vi/wY8ckoYlcaU/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/wY8ckoYlcaU",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "3",
    title: "Maggie and God",
    description: "Watch Maggie share her special relationship and connection with God",
    thumbnail: "https://i.ytimg.com/vi/aOhJ_T7hWao/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/aOhJ_T7hWao",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "6",
    title: "MaggieShout",
    description: "Join Maggie in this fun and energetic adventure filled with joy and excitement",
    thumbnail: "https://i.ytimg.com/vi/FJLnzYDA1T8/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/FJLnzYDA1T8",
    type: "youtube",
    aspectRatio: "16:9",
    category: "adventures"
  },
  {
    id: "7",
    title: "MaggieDig",
    description: "Follow along as Maggie goes on a digging adventure and discovers new things",
    thumbnail: "https://i.ytimg.com/vi/RUdgutpbc-g/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/RUdgutpbc-g",
    type: "youtube",
    aspectRatio: "16:9",
    category: "adventures"
  },
  {
    id: "9",
    title: "Maggie's Saturday",
    description: "Spend a delightful Saturday with Maggie and see what adventures await",
    thumbnail: "https://i.ytimg.com/vi/Af7fQTEbgDo/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/Af7fQTEbgDo",
    type: "youtube",
    aspectRatio: "16:9",
    category: "adventures"
  },
  // New Shorts - Featured Category
  {
    id: "short-1",
    title: "Maggie wants to be generous!",
    description: "Watch Maggie learn about the joy of generosity and sharing with others",
    thumbnail: "https://i.ytimg.com/vi/e_OofLSKnJk/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/e_OofLSKnJk",
    type: "youtube",
    aspectRatio: "9:16",
    category: "featured"
  },
  {
    id: "short-2",
    title: "Maggie increases in faith!",
    description: "Join Maggie as she grows stronger in her faith journey with God",
    thumbnail: "https://i.ytimg.com/vi/85POMjcqbkE/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/85POMjcqbkE",
    type: "youtube",
    aspectRatio: "9:16",
    category: "featured"
  },
  {
    id: "short-3",
    title: "Maggie and God's Love",
    description: "Experience the warmth of God's love through Maggie's perspective",
    thumbnail: "https://i.ytimg.com/vi/L632PZYJlHI/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/L632PZYJlHI",
    type: "youtube",
    aspectRatio: "9:16",
    category: "featured"
  },
  {
    id: "short-4",
    title: "Maggie God Forgives",
    description: "A touching short about forgiveness and God's mercy through Maggie's eyes",
    thumbnail: "https://i.ytimg.com/vi/Sb_oJ7T9U8U/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/Sb_oJ7T9U8U",
    type: "youtube",
    aspectRatio: "9:16",
    category: "featured"
  },
  // New Shorts - Stories Category
  {
    id: "short-5",
    title: "Maggie and Children",
    description: "See how Maggie connects with children in this heartwarming story",
    thumbnail: "https://i.ytimg.com/vi/6RPrnLwYap0/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/6RPrnLwYap0",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "short-6",
    title: "Maggie Loves Children",
    description: "Watch Maggie express her love and care for children everywhere",
    thumbnail: "https://i.ytimg.com/vi/nFm_fhAgOdg/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/nFm_fhAgOdg",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "short-7",
    title: "Maggie has a Friend",
    description: "Join Maggie as she celebrates the joy of friendship and companionship",
    thumbnail: "https://i.ytimg.com/vi/exMcr5IFjA0/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/exMcr5IFjA0",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "short-8",
    title: "Maggie and Truth",
    description: "Learn about honesty and truth through Maggie's important lesson",
    thumbnail: "https://i.ytimg.com/vi/4r2XKxgYkiM/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/4r2XKxgYkiM",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  // New Shorts - Activities Category
  {
    id: "short-9",
    title: "Maggie celebrates the 4th of July!",
    description: "Join Maggie's patriotic celebration of Independence Day with fun and joy",
    thumbnail: "https://i.ytimg.com/vi/WYJEBdfytXw/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/WYJEBdfytXw",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "short-10",
    title: "Maggie This is the day",
    description: "Follow Maggie through a special day filled with wonder and gratitude",
    thumbnail: "https://i.ytimg.com/vi/wkBPNGDUWiE/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/wkBPNGDUWiE",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  // New Shorts - Behind-scenes Category
  {
    id: "short-11",
    title: "Maggie Shows Compassion",
    description: "Watch Maggie demonstrate kindness and compassion in this touching moment",
    thumbnail: "https://i.ytimg.com/vi/cSKGgb_qbAQ/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/cSKGgb_qbAQ",
    type: "youtube",
    aspectRatio: "9:16",
    category: "behind-scenes"
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
