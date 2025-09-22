
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
    thumbnail: "/lovable-uploads/b3639f34-6564-48eb-bba5-c7cb2a340f62.png",
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
    thumbnail: "/lovable-uploads/9915a45c-d79b-4a00-8e51-2d7c4ca0afd8.png",
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
    thumbnail: "/lovable-uploads/83369923-a075-46d1-b5cf-54d226cab7da.png", 
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
    thumbnail: "/lovable-uploads/711c1342-427a-4191-91d3-7ebe4ec29df9.png",
    embedUrl: "https://www.youtube.com/embed/EBSBs0Rb7C0",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "2",
    title: "Our Awesome God",
    description: "Maggie expresses her wonderful feelings about how awesome God truly is",
    thumbnail: "/lovable-uploads/maggie1.jpg",
    embedUrl: "https://www.youtube.com/embed/wY8ckoYlcaU",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "3",
    title: "Maggie and God",
    description: "Watch Maggie share her special relationship and connection with God",
    thumbnail: "/illustrations/mSmile1.jpg",
    embedUrl: "https://www.youtube.com/embed/aOhJ_T7hWao",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "6",
    title: "MaggieShout",
    description: "Join Maggie in this fun and energetic adventure filled with joy and excitement",
    thumbnail: "/illustrations/mSur4.jpg",
    embedUrl: "https://www.youtube.com/embed/FJLnzYDA1T8",
    type: "youtube",
    aspectRatio: "16:9",
    category: "adventures"
  },
  {
    id: "7",
    title: "MaggieDig",
    description: "Follow along as Maggie goes on a digging adventure and discovers new things",
    thumbnail: "/illustrations/msweet.jpg",
    embedUrl: "https://www.youtube.com/embed/RUdgutpbc-g",
    type: "youtube",
    aspectRatio: "16:9",
    category: "adventures"
  },
  {
    id: "9",
    title: "Maggie's Saturday",
    description: "Spend a delightful Saturday with Maggie and see what adventures await",
    thumbnail: "/illustrations/mI.jpg",
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
    thumbnail: "/lovable-uploads/a44b3fc6-baa0-48bd-8f0c-4a126c20bf46.png",
    embedUrl: "https://www.youtube.com/embed/e_OofLSKnJk",
    type: "youtube",
    aspectRatio: "9:16",
    category: "featured"
  },
  {
    id: "short-2",
    title: "Maggie increases in faith!",
    description: "Join Maggie as she grows stronger in her faith journey with God",
    thumbnail: "/lovable-uploads/2bb063a8-6edf-46ca-a3e5-cd04628b9c5f.png",
    embedUrl: "https://www.youtube.com/embed/85POMjcqbkE",
    type: "youtube",
    aspectRatio: "9:16",
    category: "featured"
  },
  {
    id: "short-3",
    title: "Maggie and God's Love",
    description: "Experience the warmth of God's love through Maggie's perspective",
    thumbnail: "/lovable-uploads/c970bc57-998b-46d1-ae91-2a990f12a72e.png",
    embedUrl: "https://www.youtube.com/embed/L632PZYJlHI",
    type: "youtube",
    aspectRatio: "9:16",
    category: "featured"
  },
  {
    id: "short-4",
    title: "Maggie God Forgives",
    description: "A touching short about forgiveness and God's mercy through Maggie's eyes",
    thumbnail: "/lovable-uploads/d00d299e-c0ab-4a09-b21b-b420928858df.png",
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
    thumbnail: "/lovable-uploads/f4274bb3-080b-4d69-a6d8-a7f1b5555ea7.png",
    embedUrl: "https://www.youtube.com/embed/6RPrnLwYap0",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "short-7",
    title: "Maggie has a Friend",
    description: "Join Maggie as she celebrates the joy of friendship and companionship",
    thumbnail: "/lovable-uploads/0d625ec4-62bb-4472-a4db-e229fdb5047a.png",
    embedUrl: "https://www.youtube.com/embed/exMcr5IFjA0",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "short-8",
    title: "Maggie and Truth",
    description: "Learn about honesty and truth through Maggie's important lesson",
    thumbnail: "/lovable-uploads/69bc37f9-db15-4f1a-9192-ce4a16183cb4.png",
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
    thumbnail: "/illustrations/stars2.jpg",
    embedUrl: "https://www.youtube.com/embed/WYJEBdfytXw",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "short-10",
    title: "Maggie This is the day",
    description: "Follow Maggie through a special day filled with wonder and gratitude",
    thumbnail: "/lovable-uploads/e8b41255-0345-45a0-b4d3-1c5bfb1d42e7.png",
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
    thumbnail: "/lovable-uploads/18ecb8c6-00a6-471e-8f35-ffbb961b8f6c.png",
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
    thumbnail: "/lovable-uploads/AI Adventures with Maggie.jpg",
    embedUrl: "https://www.youtube.com/embed/BuQQeOqMrRA",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-2",
    title: "Maggie explains what Input is? #shorts #ai #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "/lovable-uploads/62a614b9-872b-4627-aa30-98d723add3dc.png",
    embedUrl: "https://www.youtube.com/embed/fvLuhIzI6u8",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-3",
    title: "Maggie explains QR codes! #shorts #ai #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "/lovable-uploads/6eafedb9-930e-4688-8ed6-23f6eea36ca1.png",
    embedUrl: "https://www.youtube.com/embed/Aq0SCPkZPA8",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-4",
    title: "Maggie explains Data. #shorts #ai #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "/lovable-uploads/1161ce18-0828-45cc-b55c-d4a92af47337.png",
    embedUrl: "https://www.youtube.com/embed/C4QIzr6EM08",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-5",
    title: "Maggie talks about programs. #shorts #AI #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "/lovable-uploads/2219969e-6923-417c-91ad-63508ac18d29.png",
    embedUrl: "https://www.youtube.com/embed/DUgyWrmwuec",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-6",
    title: "Maggie explains algorithms! #shorts #AI #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "/lovable-uploads/6fbae857-85fa-459d-a309-a8c44e28ebc0.png",
    embedUrl: "https://www.youtube.com/embed/F_J-qH3C-Vc",
    type: "youtube",
    aspectRatio: "9:16",
    category: "activities"
  },
  {
    id: "ai-7",
    title: "Maggie gives AI definitions! #shorts #AI #artificialintelligence",
    description: "Dive into the innovative world of MaggieDefinesAI in this captivating video! Witness how Maggie demystifies artificial intelligence, breaking down complex concepts into engaging, digestible segments.",
    thumbnail: "/lovable-uploads/364bbd24-7845-448a-b4fc-8425b58d471c.png",
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
    thumbnail: "/lovable-uploads/30df7f29-250a-4621-93de-e0bf5a5d9497.png",
    embedUrl: "https://www.youtube.com/embed/jysZiH5JlrM",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-2",
    title: "Maggie helps others!",
    description: "Get ready for a heartwarming and inspirational adventure with our latest animated kids' story, \"The Little Dog with a Big Heart!\" Join a cute and courageous Yorkshire Terrier on his mission to help his elderly neighbor.",
    thumbnail: "/lovable-uploads/a30b516d-17c3-44e1-bd65-120f84bc64a2.png",
    embedUrl: "https://www.youtube.com/embed/eg-sGOpFg_Y",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-3",
    title: "Maggie knows how to deal with sin!",
    description: "In this powerful and heart-tugging video, Maggie the Yorkie Poo shares a kid-friendly explanation of what sin is and how it separates us from God—but also how Jesus' love brings us back.",
    thumbnail: "/lovable-uploads/96d18d5d-f08b-4f0c-bbd6-48259e4a9477.png",
    embedUrl: "https://www.youtube.com/embed/DSFQnAxa2m8",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-4",
    title: "Maggie sees the truth as best!",
    description: "Join Maggie the Yorkie Poo in this heartwarming 16x9 animated journey as she chooses the path of truth, kindness, and character! Perfect for Christian families, kids, and parents looking for inspirational Bible-based children's content.",
    thumbnail: "/lovable-uploads/aab438b1-7b4b-4651-9909-e016edaae8f4.png",
    embedUrl: "https://www.youtube.com/embed/1W3aWd-PAkU",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-5",
    title: "Maggie is faithful in all things!",
    description: "Join Maggie the Yorkie Poo as she puts faith in action, serving, helping and sharing love with every wag of her tail! This adorable dog video brings Bible-based moral lessons and Christian values to life.",
    thumbnail: "/lovable-uploads/b958f7f4-9a0b-4232-bb78-200b80405755.png",
    embedUrl: "https://www.youtube.com/embed/AedEORsLCsY",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-6",
    title: "Maggie lets go of her worries!",
    description: "Are you trapped in a cycle of worry and anxiety? In this faith-filled devotional video, we unpack Jesus' powerful promise in Matthew 6:34—\"Do not worry about tomorrow\"—and discover how to trade our \"what ifs\" for prayer.",
    thumbnail: "/lovable-uploads/6a8578d4-4d36-4b8f-ba26-1722c64f34ed.png",
    embedUrl: "https://www.youtube.com/embed/DBtpQgAqJWA",
    type: "youtube",
    aspectRatio: "16:9",
    category: "faith"
  },
  {
    id: "faith-7",
    title: "Maggie finds her real purpose?",
    description: "Experience faith, fun, and furry cuteness with Maggie the Yorkie Poo in \"Maggie Is Happy\" – a heartwarming puppy video featuring Maggie's personal stories, adorable dog antics, and Bible-based lessons told from a kid's perspective.",
    thumbnail: "/lovable-uploads/0165e2d6-4d19-4daf-9f72-794452ed4037.png",
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
    thumbnail: "/lovable-uploads/da0f40b4-0905-4295-947e-c1dcc4014b32.png",
    embedUrl: "https://www.youtube.com/embed/-5j9Mt3pKSc",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-2",
    title: "Maggie is confident!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/ee284f2e-846d-493e-8ea4-a50ff148afcb.png",
    embedUrl: "https://www.youtube.com/embed/vcgAXZY6z5s",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-3",
    title: "Maggie is all alone but....",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/ef212f53-b76f-4faf-a907-e22eefffaaac.png",
    embedUrl: "https://www.youtube.com/embed/qI7SArxhNDk",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-4",
    title: "Maggie is valuable! #love #godslove #christianfaith",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/e1ee0666-1406-48a0-8c15-87612af92b91.png",
    embedUrl: "https://www.youtube.com/embed/CEnHogpTfHU",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "character-5",
    title: "Maggie sees her true worth!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/8eb8d306-89d0-44c9-9ad6-cb7068e47e38.png",
    embedUrl: "https://www.youtube.com/embed/FGKHWqnnuXo",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-6",
    title: "Maggie scared but hopeful!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/5e46c827-2b2e-4a14-af19-1422424c86c4.png",
    embedUrl: "https://www.youtube.com/embed/x71n6_25kOA",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-7",
    title: "Maggie knows respect and reverance!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/3ee6ed53-27c6-4ce7-8a58-f7c581ddf74c.png",
    embedUrl: "https://www.youtube.com/embed/ZtEWfcysUng",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-8",
    title: "Maggie is courageous!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/5b72a1e2-6f38-49a3-bc95-07d7cf70ad0d.png",
    embedUrl: "https://www.youtube.com/embed/0WMtIa2VsBE",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-9",
    title: "Maggie feels the rainbow! #love #religiousquote #christianfaith",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/4958326d-4295-4646-9be0-852d9214fc71.png",
    embedUrl: "https://www.youtube.com/embed/S2PBNa43Fao",
    type: "youtube",
    aspectRatio: "9:16",
    category: "stories"
  },
  {
    id: "character-10",
    title: "Maggie's Honesty",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/27f76749-2345-41b0-a238-588bcd409ec7.png",
    embedUrl: "https://www.youtube.com/embed/T5vPYaK_w1s",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-11",
    title: "Maggie keeps her promise!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/c73e65b6-6177-4ca3-9d4f-e78852a5b3c5.png",
    embedUrl: "https://www.youtube.com/embed/OBb3lIeqAiw",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-12",
    title: "Maggie shows trust!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/60eb3c02-eb74-49dc-9a7a-858da37fc00e.png",
    embedUrl: "https://www.youtube.com/embed/7sg0XfxL9fY",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-13",
    title: "Maggie Waits Patiently!",
    description: "Maggie gives an account of her experiences in life from a kids perspective. Maggie has lived in a Christian home for over 15 years. She has listened and learned to love God.",
    thumbnail: "/lovable-uploads/44c9e724-adb0-47cf-bc9a-4836ae3a2679.png",
    embedUrl: "https://www.youtube.com/embed/I_la2Ypqxk4",
    type: "youtube",
    aspectRatio: "16:9",
    category: "stories"
  },
  {
    id: "character-14",
    title: "Maggie Loves Children",
    description: "Maggie's Advice - see how Maggie connects with and loves children in this heartwarming video.",
    thumbnail: "/lovable-uploads/8ec2cc2f-dc37-43da-94eb-f2ef89193117.png",
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
