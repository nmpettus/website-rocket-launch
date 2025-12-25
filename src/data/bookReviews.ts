import { Review } from "@/components/ReviewsModal";

// Book reviews data
const bookReviews: Record<string, Review[]> = {
  "gods-love": [
    {
      id: "1",
      author: "Maria S.",
      date: "May 20, 2025", 
      rating: 5,
      title: "Heartwarming and beautiful",
      content: "This book touched my heart! The way Maggie explains God's love is so gentle and perfect for children of all ages. The illustrations are absolutely stunning and my kids keep asking to read it again and again. A wonderful addition to our family library!",
      verified: true
    },
    {
      id: "2",
      author: "Pastor John",
      date: "May 15, 2025",
      rating: 5,
      title: "Perfect for teaching about God's love",
      content: "I use this book in our children's ministry and it's been incredibly effective in helping kids understand the depth of God's love. Maggie's storytelling approach makes complex concepts accessible to young minds. Highly recommend for Sunday school!",
      verified: true
    },
    {
      id: "3",
      author: "Catherine L.",
      date: "April 28, 2025",
      rating: 5,
      title: "A treasured bedtime story",
      content: "This has become our go-to bedtime story. My daughter loves Maggie and the way she explains how much God loves us. The book brings comfort and joy to our evening routine. Beautiful illustrations and meaningful message!",
      verified: true
    }
  ],
  "creation": [
    {
      id: "1",
      author: "Jennifer P.",
      date: "April 15, 2025",
      rating: 5,
      title: "Perfect for young readers!",
      content: "My 5-year-old loves this book! The illustrations are beautiful and the way Maggie tells the creation story is perfect for little ones. She asks questions throughout that keep kids engaged and thinking. My daughter now pretends to be Maggie when we read other books!",
      verified: true
    },
    {
      id: "2",
      author: "Michael T.",
      date: "March 28, 2025",
      rating: 5,
      title: "A modern take on a timeless story",
      content: "I bought this for my nephew and he absolutely loves it. The AI-enhanced storytelling is innovative yet respectful to the biblical narrative. The way Maggie guides children through the creation story is thoughtful and engaging. Highly recommend for Sunday school teachers too!",
      verified: true
    },
    {
      id: "3",
      author: "Sara L.",
      date: "February 12, 2025",
      rating: 5,
      title: "Beautifully illustrated",
      content: "The illustrations in this book are gorgeous! My kids enjoy the interactive nature of how Maggie tells the story. The innovative approach to biblical storytelling has made our family reading time even more special. Absolutely recommended!",
      verified: true
    },
    {
      id: "4",
      author: "Pastor David",
      date: "February 10, 2025",
      rating: 5,
      title: "Wonderful teaching tool",
      content: "I purchased several copies for our church's children's ministry. The kids are drawn to Maggie and the way she presents the creation story makes it accessible and fun while maintaining biblical accuracy. The questions she asks throughout are perfect conversation starters!",
      verified: true
    }
  ],
  "noah": [
    {
      id: "1",
      author: "Rebecca W.",
      date: "March 3, 2025",
      rating: 5,
      title: "Our new favorite!",
      content: "My son asks to read this every night before bed! The story of Noah as told by Maggie is engaging and the illustrations of all the animals are fantastic. I appreciate how it simplifies the biblical story without losing its meaning.",
      verified: true
    },
    {
      id: "2",
      author: "Thomas K.",
      date: "February 15, 2025",
      rating: 5,
      title: "Creative and educational",
      content: "What a clever way to present Noah's Ark! My kids love when Maggie asks them questions throughout the story. It makes them feel like they're part of the adventure. The illustrations are colorful and detailed - we keep finding new animals each time we read it!",
      verified: true
    },
    {
      id: "3",
      author: "Amanda J.",
      date: "February 8, 2025",
      rating: 5,
      title: "Great biblical storytelling",
      content: "This has become a staple in our bedtime routine. The AI-enhanced narrative is surprisingly warm and engaging. My children adore Maggie and how she guides them through the story of Noah's Ark with thoughtful questions and beautiful illustrations!",
      verified: true
    }
  ],
  "jonah": [
    {
      id: "1",
      author: "Rachel S.",
      date: "April 12, 2025",
      rating: 5,
      title: "Captures children's imagination",
      content: "The story of Jonah can be tricky to explain to young children, but this book does it beautifully! My 6-year-old was captivated by the adventure and the illustrations of Jonah inside the big fish are amazing without being scary. Maggie's narration makes the biblical lesson accessible and memorable.",
      verified: true
    },
    {
      id: "2",
      author: "Mark L.",
      date: "March 30, 2025",
      rating: 5,
      title: "Entertaining and faithful to scripture",
      content: "I appreciate how this book balances being entertaining for kids while staying true to the biblical story. The questions Maggie asks throughout help children understand the deeper messages about obedience and God's mercy. My kids ask for this one again and again!",
      verified: true
    },
    {
      id: "3",
      author: "Sunday School Teacher",
      date: "January 26, 2025",
      rating: 5,
      title: "Perfect teaching resource",
      content: "I use this in my Sunday School class and the children absolutely love it! The way Maggie explains Jonah's journey makes it relatable for young minds. The illustrations are engaging and the interactive questions throughout keep the children participating in the story. Highly recommend!",
      verified: true
    }
  ],
  "thanksgiving": [
    {
      id: "1",
      author: "Emily R.",
      date: "November 5, 2025",
      rating: 5,
      title: "Perfect for Thanksgiving season!",
      content: "What a delightful way to teach children about the First Thanksgiving! My kids absolutely love Maggie's perspective on the Pilgrims' journey. The illustrations are gorgeous and the story is both educational and entertaining. This will definitely become a Thanksgiving tradition in our home!",
      verified: true
    },
    {
      id: "2",
      author: "Daniel M.",
      date: "November 2, 2025",
      rating: 5,
      title: "Engaging historical storytelling",
      content: "I'm a history teacher and bought this for my classroom. The way Maggie narrates the First Thanksgiving makes it accessible and fun for young students while maintaining historical accuracy. The kids are captivated by her witty observations and the beautiful full-color illustrations!",
      verified: true
    },
    {
      id: "3",
      author: "Lisa K.",
      date: "October 28, 2025",
      rating: 5,
      title: "Heartwarming and educational",
      content: "This book beautifully teaches children about gratitude, friendship, and God's blessings through the story of the First Thanksgiving. Maggie's personality shines through every page, and my daughter asks to read it every night! The perfect addition to any family's holiday collection.",
      verified: true
    }
  ],
  "christmas": [
    {
      id: "1",
      author: "Sarah Johnson",
      date: "November 23, 2025",
      rating: 5,
      title: "A beautiful telling of the Christmas story!",
      content: "This book beautifully explains how Jesus' birth was promised long before it happened. My children were amazed to learn about God's perfect plan through the ages. Maggie's gentle storytelling makes complex prophecies accessible to young minds. The illustrations are stunning and capture the wonder of that holy night. This will definitely become part of our family's Christmas tradition!",
      verified: true
    }
  ]
};

export interface BookData {
  id: string;
  title: string;
  coverImage: string;
  languages: string[];
  description: string;
  reviewCount: number;
  amazonLink: string;
  kindleLink: string;
  isNew?: boolean;
  samplePages?: SamplePage[];
}

export interface SamplePage {
  src: string;
  pageNumber: number;
  alt: string;
}

export const booksData = [
  {
    id: "gods-love",
    coverImage: "/lovable-uploads/9915a45c-d79b-4a00-8e51-2d7c4ca0afd8.png",
    title: "God's Love - Christian Families Bible Devotional",
    languages: ["English"],
    description: "Discover \"God's Love\" by Maggie - a heartfelt Christian children's book that teaches kid's about God's never ending love through gentle faith-filled storytelling",
    reviewCount: 15,
    amazonLink: "https://a.co/d/a1KplpW",
    kindleLink: "https://a.co/d/a1KplpW",
    isNew: true,
    samplePages: [
      {
        src: "/lovable-uploads/6eafedb9-930e-4688-8ed6-23f6eea36ca1.png",
        pageNumber: 1,
        alt: "God's Love for MAGGIE - Cover Page"
      },
      {
        src: "/lovable-uploads/8ec2cc2f-dc37-43da-94eb-f2ef89193117.png",
        pageNumber: 2,
        alt: "God's Love for MAGGIE - Copyright Page"
      },
      {
        src: "/lovable-uploads/c760b8fc-403f-4fb4-ad94-4aa6ec255b71.png",
        pageNumber: 3,
        alt: "God's Love for MAGGIE - Dedication Page"
      },
      {
        src: "/lovable-uploads/6a8578d4-4d36-4b8f-ba26-1722c64f34ed.png",
        pageNumber: 4,
        alt: "God's Love for MAGGIE - Story Page"
      }
    ]
  },
  {
    id: "creation",
    coverImage: "/lovable-uploads/711c1342-427a-4191-91d3-7ebe4ec29df9.png",
    title: "Creation - A Christian children's book about God's Beautiful Beginning",
    languages: ["English", "Spanish", "Italian", "Kindle"],
    description: "Explore \"Creation\" by Maggie--a faith-filled children's book about God's creation. Simple, engaging Bible stories that delight young readers and teach Christian values.",
    reviewCount: 23,
    amazonLink: "https://a.co/d/8DoEE31",
    kindleLink: "https://a.co/d/8DoEE31",
    samplePages: [
      {
        src: "/lovable-uploads/8d195fa8-24a9-42f2-a494-52c93340a9b9.png",
        pageNumber: 1,
        alt: "Creation - Cover Page"
      },
      {
        src: "/lovable-uploads/0165e2d6-4d19-4daf-9f72-794452ed4037.png",
        pageNumber: 2,
        alt: "Creation - Copyright Page"
      },
      {
        src: "/lovable-uploads/ff6ad52c-6fc6-4e35-af7e-dfefc6b87b5f.png",
        pageNumber: 3,
        alt: "Creation - Dedication Page"
      },
      {
        src: "/lovable-uploads/5cbb2c6a-7961-43f1-913b-9a53e10e22b2.png",
        pageNumber: 4,
        alt: "Creation - Story Introduction"
      },
      {
        src: "/lovable-uploads/d2492465-6080-4845-94a9-9be588776161.png",
        pageNumber: 5,
        alt: "Creation - Maggie Character Introduction"
      }
    ]
  },
  {
    id: "noah",
    coverImage: "/lovable-uploads/83369923-a075-46d1-b5cf-54d226cab7da.png",
    title: "Noah's Ark - Christian Children's Book by Maggie",
    languages: ["English"],
    description: "Explore \"Noah's Ark\" by Maggie - a beautifully illustrated Christian children's book retelling God's promise, faith, and rescue in a way kids will love",
    reviewCount: 18,
    amazonLink: "https://a.co/d/5czEdgO",
    kindleLink: "https://a.co/d/5czEdgO",
    samplePages: [
      {
        src: "/lovable-uploads/c73e65b6-6177-4ca3-9d4f-e78852a5b3c5.png",
        pageNumber: 1,
        alt: "Noah's Ark - Cover Page"
      },
      {
        src: "/lovable-uploads/d6ebfbaf-dd9c-478a-ab61-6f5b9dbf33ab.png",
        pageNumber: 2,
        alt: "Noah's Ark - Copyright Page"
      },
      {
        src: "/lovable-uploads/e0245b65-92b9-4c0d-b1c0-af49a8ad5f26.png",
        pageNumber: 3,
        alt: "Noah's Ark - Dedication Page"
      },
      {
        src: "/lovable-uploads/06d172ae-e936-40dc-9af7-495715de4f7c.png",
        pageNumber: 4,
        alt: "Noah's Ark - Story Introduction"
      },
      {
        src: "/lovable-uploads/5e46c827-2b2e-4a14-af19-1422424c86c4.png",
        pageNumber: 5,
        alt: "Noah's Ark - Fun Fact Page"
      }
    ]
  },
  {
    id: "jonah",
    coverImage: "/lovable-uploads/b3639f34-6564-48eb-bba5-c7cb2a340f62.png",
    title: "Jonah - A Christian Children's Story About Obedience and God's Mercy",
    languages: ["English"],
    description: "Read \"Jonah\" by Maggie - a fun and faith-filled children's book teaching kids about obedience, God's mercy, and the power of second chances.",
    reviewCount: 12,
    amazonLink: "https://a.co/d/1NfnyaE",
    kindleLink: "https://a.co/d/1NfnyaE",
    samplePages: [
      {
        src: "/lovable-uploads/496293da-0424-49d9-82f7-962821154ce8.png",
        pageNumber: 1,
        alt: "Jonah - Cover Page"
      },
      {
        src: "/lovable-uploads/da0f40b4-0905-4295-947e-c1dcc4014b32.png",
        pageNumber: 2,
        alt: "Jonah - Copyright Page"
      },
      {
        src: "/lovable-uploads/69bc37f9-db15-4f1a-9192-ce4a16183cb4.png",
        pageNumber: 3,
        alt: "Jonah - Dedication Page"
      },
      {
        src: "/lovable-uploads/b958f7f4-9a0b-4232-bb78-200b80405755.png",
        pageNumber: 4,
        alt: "Jonah - Story Introduction"
      },
      {
        src: "/lovable-uploads/2541c224-1f8f-49ba-af72-b6d7d52bb1a7.png",
        pageNumber: 5,
      alt: "Jonah - Maggie with Bible"
    }
    ]
  },
  {
    id: "thanksgiving",
    coverImage: "/lovable-uploads/thanksgiving-cover.png",
    title: "The First Thanksgiving as told by Maggie: A Yorkie's Tail of History, Gratitude, and Unexpected Friendship",
    languages: ["English"],
    description: "Wag your tail into American history! Follow Maggie, an adorable Yorkie with a big heart and even bigger personality, as she takes you on a hilarious, heartwarming journey through the true story of the First Thanksgiving.",
    reviewCount: 10,
    amazonLink: "https://a.co/d/7Eqcogw",
    kindleLink: "https://a.co/d/7Eqcogw",
    isNew: true,
    samplePages: [
      {
        src: "/lovable-uploads/thanksgiving-cover.png",
        pageNumber: 1,
        alt: "The First Thanksgiving - Cover Page"
      },
      {
        src: "/lovable-uploads/thanksgiving-sample-1.png",
        pageNumber: 2,
        alt: "The First Thanksgiving - Sample Page 1"
      },
      {
        src: "/lovable-uploads/thanksgiving-sample-2.png",
        pageNumber: 3,
        alt: "The First Thanksgiving - Sample Page 2"
      }
    ]
  },
  {
    id: "christmas",
    coverImage: "/lovable-uploads/christmas-cover.jpg",
    title: "Christmas as told by Maggie: Discovering the Christmas Story Through God's Promises",
    languages: ["English", "Kindle"],
    description: "What if your child could see the Christmas story the way Heaven saw it—through God's promises, His prophecies, and His perfect plan? In Christmas as Told by Maggie, a lovable Yorkie Poo leads children on a heartwarming, faith-building adventure through the very first Christmas. Maggie gently peeks \"behind the scenes,\" showing young readers how God promised the Savior long before Bethlehem—and how every prophecy came true the night Jesus was born.",
    reviewCount: 1,
    amazonLink: "https://a.co/d/6Xkd4Ut",
    kindleLink: "https://www.amazon.com/dp/B0G3M8FXKH",
    isNew: true,
    samplePages: [
      {
        src: "/lovable-uploads/christmas-cover.jpg",
        pageNumber: 1,
        alt: "Christmas as told by Maggie - Cover Page"
      }
    ]
  },
  {
    id: "ai-adventures",
    coverImage: "/lovable-uploads/AI-Adventures-with-Maggie-new-cover.png",
    title: "AI Adventures with Maggie - The Smartest Dog in the World Meets the Smartest Technology",
    languages: ["English", "Kindle"],
    description: "Maggie the dog and Riley the tech-curious kid team up with Artie the AI robot to answer one big question: How do computers learn? Through laugh-out-loud moments and mind-expanding discoveries, they unlock the secrets of pixels, patterns, and what makes humans truly special.",
    reviewCount: 5,
    amazonLink: "https://a.co/d/4pL2gHD",
    kindleLink: "https://a.co/d/4pL2gHD",
    isNew: true,
    samplePages: [
      {
        src: "/lovable-uploads/AI-Adventures-with-Maggie-new-cover.png",
        pageNumber: 1,
        alt: "AI Adventures with Maggie - Cover Page"
      }
    ]
  }
];

export default bookReviews;
