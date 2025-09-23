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
    thumbnail: "https://img.youtube.com/vi/XVw8H0SgQ_Q/hqdefault.jpg",
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
    thumbnail: "https://img.youtube.com/vi/WRB_SdUlG-g/hqdefault.jpg",
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
    thumbnail: "https://img.youtube.com/vi/zTs_1PL3kEs/hqdefault.jpg", 
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
    thumbnail: "https://img.youtube.com/vi/EBSBs0Rb7C0/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/EBSBs0Rb7C0",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "2",
    title: "Our Awesome God",
    description: "Maggie expresses her wonderful feelings about how awesome God truly is",
    thumbnail: "https://img.youtube.com/vi/wY8ckoYlcaU/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/wY8ckoYlcaU",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "3",
    title: "Maggie and God",
    description: "Watch Maggie share her special relationship and connection with God",
    thumbnail: "https://img.youtube.com/vi/aOhJ_T7hWao/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/aOhJ_T7hWao",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "6",
    title: "MaggieShout",
    description: "Join Maggie in this fun and energetic adventure filled with joy and excitement",
    thumbnail: "https://img.youtube.com/vi/FJLnzYDA1T8/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/FJLnzYDA1T8",
    type: "youtube",
    aspectRatio: "16:9",
    category: "adventures"
  },
  {
    id: "7",
    title: "MaggieDig",
    description: "Follow along as Maggie goes on a digging adventure and discovers new things",
    thumbnail: "https://img.youtube.com/vi/RUdgutpbc-g/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/RUdgutpbc-g",
    type: "youtube",
    aspectRatio: "16:9",
    category: "adventures"
  },
  {
    id: "9",
    title: "Maggie's Saturday",
    description: "Spend a delightful Saturday with Maggie and see what adventures await",
    thumbnail: "https://img.youtube.com/vi/Af7fQTEbgDo/hqdefault.jpg",
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
    thumbnail: "https://img.youtube.com/vi/e_OofLSKnJk/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/e_OofLSKnJk",
    type: "youtube",
    aspectRatio: "9:16",
    category: "featured"
  },
  {
    id: "short-2",
    title: "Maggie increases in faith!",
    description: "Join Maggie as she grows stronger in her faith journey with God",
    thumbnail: "https://img.youtube.com/vi/85POMjcqbkE/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/85POMjcqbkE",
    type: "youtube",
    aspectRatio: "9:16",
    category: "featured"
  },
  {
    id: "short-3",
    title: "Maggie and God's Love",
    description: "Experience the warmth of God's love through Maggie's perspective",
    thumbnail: "https://img.youtube.com/vi/L632PZYJlHI/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/L632PZYJlHI",
    type: "youtube",
    aspectRatio: "9:16",
    category: "featured"
  },
  {
    id: "short-4",
    title: "Maggie God Forgives",
    description: "A touching short about forgiveness and God's mercy through Maggie's eyes",
    thumbnail: "https://img.youtube.com/vi/Sb_oJ7T9U8U/hqdefault.jpg",
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
    thumbnail: "https://img.youtube.com/vi/6RPrnLwYap0/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/6RPrnLwYap0",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "short-7",
    title: "Maggie has a Friend",
    description: "Join Maggie as she celebrates the joy of friendship and companionship",
    thumbnail: "https://img.youtube.com/vi/exMcr5IFjA0/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/exMcr5IFjA0",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "short-8",
    title: "Maggie and Truth",
    description: "Learn about honesty and truth through Maggie's important lesson",
    thumbnail: "https://img.youtube.com/vi/4r2XKxgYkiM/hqdefault.jpg",
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
    thumbnail: "https://img.youtube.com/vi/WYJEBdfytXw/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/WYJEBdfytXw",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "short-10",
    title: "Maggie This is the day",
    description: "Follow Maggie through a special day filled with wonder and gratitude",
    thumbnail: "https://img.youtube.com/vi/wkBPNGDUWiE/hqdefault.jpg",
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
    thumbnail: "https://img.youtube.com/vi/cSKGgb_qbAQ/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/cSKGgb_qbAQ",
    type: "youtube",
    aspectRatio: "9:16",
    category: "behind-scenes"
  },
  // AI Education Series
  {
    id: "ai-1",
    title: "Maggie explains Output! #shorts #ai #artificialintelligence #stemeducation #stemforkids",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "https://img.youtube.com/vi/BuQQeOqMrRA/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/BuQQeOqMrRA",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-2",
    title: "Maggie explains what Input is? #shorts #ai #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "https://img.youtube.com/vi/fvLuhIzI6u8/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/fvLuhIzI6u8",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-3",
    title: "Maggie explains QR codes! #shorts #ai #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "https://img.youtube.com/vi/Aq0SCPkZPA8/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/Aq0SCPkZPA8",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-4",
    title: "Maggie explains Data. #shorts #ai #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "https://img.youtube.com/vi/C4QIzr6EM08/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/C4QIzr6EM08",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-5",
    title: "Maggie talks about programs. #shorts #AI #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "https://img.youtube.com/vi/DUgyWrmwuec/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/DUgyWrmwuec",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-6",
    title: "Maggie explains algorithms! #shorts #AI #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "https://img.youtube.com/vi/F_J-qH3C-Vc/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/F_J-qH3C-Vc",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-7",
    title: "Maggie gives AI definitions! #shorts #AI #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "https://img.youtube.com/vi/EB9AX2J1_YA/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/EB9AX2J1_YA",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  // Faith & Character Stories
  {
    id: "faith-1",
    title: "Maggie tells why she is happy!",
    description: "Get ready for a heartwarming and inspirational adventure with our latest animated kids' story, \"The Little Dog with a Big Heart!\" Join a cute and courageous Yorkshire Terrier expressing her happiness.",
    thumbnail: "https://img.youtube.com/vi/jysZiH5JlrM/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/jysZiH5JlrM",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-2",
    title: "Maggie helps others!",
    description: "Get ready for a heartwarming and inspirational adventure with our latest animated kids' story, \"The Little Dog with a Big Heart!\" Join a cute and courageous Yorkshire Terrier on his mission to help his elderly neighbor.",
    thumbnail: "https://img.youtube.com/vi/eg-sGOpFg_Y/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/eg-sGOpFg_Y",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-3",
    title: "Maggie knows how to deal with sin!",
    description: "In this powerful and heart-tugging video, Maggie the Yorkie Poo shares a kid-friendly explanation of what sin is and how it separates us from God—but also how Jesus' love brings us back.",
    thumbnail: "https://img.youtube.com/vi/DSFQnAxa2m8/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/DSFQnAxa2m8",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-4",
    title: "Maggie sees the truth as best!",
    description: "Join Maggie the Yorkie Poo in this heartwarming 16x9 animated journey as she chooses the path of truth, kindness, and character! Perfect for Christian families, kids, and parents looking for inspirational Bible-based children's content.",
    thumbnail: "https://img.youtube.com/vi/1W3aWd-PAkU/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/1W3aWd-PAkU",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-5",
    title: "Maggie is faithful in all things!",
    description: "Join Maggie the Yorkie Poo as she puts faith in action, serving, helping and sharing love with every wag of her tail! This adorable dog video brings Bible-based moral lessons and Christian values to life.",
    thumbnail: "https://img.youtube.com/vi/AedEORsLCsY/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/AedEORsLCsY",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-6",
    title: "Maggie lets go of her worries!",
    description: "Are you trapped in a cycle of worry and anxiety? In this faith-filled devotional video, we unpack Jesus' powerful promise in Matthew 6:34—\"Do not worry about tomorrow\"—and discover how to trade our \"what ifs\" for prayer.",
    thumbnail: "https://img.youtube.com/vi/DBtpQgAqJWA/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/DBtpQgAqJWA",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-7",
    title: "Maggie finds her real purpose?",
    description: "Experience faith, fun, and furry cuteness with Maggie the Yorkie Poo in \"Maggie Is Happy\" – a heartwarming puppy video featuring Maggie's personal stories, adorable dog antics, and Bible-based lessons told from a kid's perspective.",
    thumbnail: "https://img.youtube.com/vi/F7w6itzMAKY/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/F7w6itzMAKY",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  // Character Trait Stories
  {
    id: "character-1",
    title: "Maggie shows her loyalty!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/-5j9Mt3pKSc/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/-5j9Mt3pKSc",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-2",
    title: "Maggie is confident!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/vcgAXZY6z5s/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/vcgAXZY6z5s",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-3",
    title: "Maggie is all alone but....",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/qI7SArxhNDk/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/qI7SArxhNDk",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-4",
    title: "Maggie is valuable! #love #godslove #christianfaith",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/CEnHogpTfHU/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/CEnHogpTfHU",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "character-5",
    title: "Maggie sees her true worth!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/FGKHWqnnuXo/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/FGKHWqnnuXo",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-6",
    title: "Maggie scared but hopeful!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/x71n6_25kOA/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/x71n6_25kOA",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-7",
    title: "Maggie knows respect and reverance!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/ZtEWfcysUng/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/ZtEWfcysUng",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-8",
    title: "Maggie is courageous!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/0WMtIa2VsBE/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/0WMtIa2VsBE",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-9",
    title: "Maggie feels the rainbow! #love #religiousquote #christianfaith",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/S2PBNa43Fao/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/S2PBNa43Fao",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "character-10",
    title: "Maggie's Honesty",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/T5vPYaK_w1s/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/T5vPYaK_w1s",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-11",
    title: "Maggie keeps her promise!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/OBb3lIeqAiw/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/OBb3lIeqAiw",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-12",
    title: "Maggie shows trust!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/7sg0XfxL9fY/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/7sg0XfxL9fY",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-13",
    title: "Maggie Waits Patiently!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "https://img.youtube.com/vi/I_la2Ypqxk4/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/I_la2Ypqxk4",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-14",
    title: "Maggie Loves Children",
    description: "Maggie's Advice - see how Maggie connects with and loves children in this heartwarming video.",
    thumbnail: "https://img.youtube.com/vi/nFm_fhAgOdg/hqdefault.jpg",
    embedUrl: "https://www.youtube.com/embed/nFm_fhAgOdg",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
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