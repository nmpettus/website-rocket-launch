
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
    title: "God's Love for MAGGIE",
    languages: ["English"],
    description: "A heartwarming tale about God's unconditional love through the eyes of Maggie.",
    reviewCount: 15,
    amazonLink: "https://a.co/d/a1KplpW",
    isNew: true,
    samplePages: [
      // Add sample pages here when you upload them
    ]
  },
  {
    id: "creation",
    coverImage: "/lovable-uploads/711c1342-427a-4191-91d3-7ebe4ec29df9.png",
    title: "In the Beginning: MAGGIE and the Story of Creation",
    languages: ["English", "Spanish", "Italian"],
    description: "Join Maggie as she discovers the wonder of God's creation in this beautifully illustrated story.",
    reviewCount: 23,
    amazonLink: "https://a.co/d/8DoEE31",
    samplePages: [
      // Add sample pages here when you upload them
    ]
  },
  {
    id: "noah",
    coverImage: "/lovable-uploads/83369923-a075-46d1-b5cf-54d226cab7da.png",
    title: "MAGGIE and Noah's Ark Adventure",
    languages: ["English"],
    description: "Maggie learns about faith and obedience through the story of Noah's Ark.",
    reviewCount: 18,
    amazonLink: "https://a.co/d/5czEdgO",
    samplePages: [
      // Add sample pages here when you upload them
    ]
  },
  {
    id: "jonah",
    coverImage: "/lovable-uploads/b3639f34-6564-48eb-bba5-c7cb2a340f62.png",
    title: "MAGGIE and Jonah's Big Fish Story",
    languages: ["English"],
    description: "A tale of second chances and God's mercy as Maggie explores Jonah's journey.",
    reviewCount: 12,
    amazonLink: "https://a.co/d/1NfnyaE",
    samplePages: [
      // Add sample pages here when you upload them
    ]
  }
];

export default bookReviews;
