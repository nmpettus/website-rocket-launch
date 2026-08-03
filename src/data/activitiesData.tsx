
import React from "react";
import { Puzzle, BookText, PenSquare, Search, Map, FileText } from "lucide-react";
import { ActivityCategory } from "@/components/activities/ActivityCard";

export const getActivities = (): ActivityCategory[] => [
  {
    id: "mazes",
    title: "Bible Story Mazes",
    description: "Navigate through exciting mazes based on favorite Bible stories",
    icon: <Puzzle className="h-10 w-10 text-indigo-600" />,
    items: [
      {
        id: "creation-maze",
        title: "Creation Maze",
        description: "Find your way through the 7 days of creation",
        imagePath: "/lovable-uploads/6947ab9e-a034-4dd3-85df-4f275595e32e.png",
        viewText: "View Maze"
      },
      {
        id: "jonah-maze",
        title: "Jonah and the Whale Maze",
        description: "Help Jonah find his way to Nineveh",
        imagePath: "/lovable-uploads/3f1f64aa-45fc-4001-acf4-8c05095ad3d0.png",
        viewText: "View Maze"
      }
    ]
  },
  {
    id: "coloring-pages",
    title: "Coloring Pages",
    description: "Beautiful illustrations from Bible stories to color and enjoy",
    icon: <PenSquare className="h-10 w-10 text-amber-500" />,
    items: [
      {
        id: "creation-coloring",
        title: "Creation Coloring Page",
        description: "Color the beautiful world God created",
        imagePath: "/lovable-uploads/0891c43e-560b-4086-9b45-82b1fa6f6d0d.png",
        viewText: "View Page"
      }
    ]
  },
  {
    id: "word-puzzles",
    title: "Fun Puzzles",
    description: "Word searches, crosswords, and more based on Biblical themes",
    icon: <Puzzle className="h-10 w-10 text-emerald-500" />,
    items: [
      {
        id: "creation-puzzle",
        title: "Creation Word Search",
        description: "Find words related to the creation story",
        imagePath: "/lovable-uploads/f4bbd70d-20b4-4e4a-b742-88b1baec4926.png",
        viewText: "View Puzzle"
      }
    ]
  },
  {
    id: "bible-questions",
    title: "Noah's Ark Questions",
    description: "Interactive questions about Noah's Ark story for kids to learn and have fun",
    icon: <BookText className="h-10 w-10 text-purple-600" />,
    items: [
      {
        id: "noah-questions",
        title: "Noah's Ark Questions",
        description: "Test your knowledge about Noah's Ark",
        imagePath: "/lovable-uploads/04df8ac3-a67b-4169-b2e7-8cdc0d78b0a3.png",
        viewText: "View Questions"
      }
    ]
  },
  {
    id: "good-samaritan-word-search",
    title: "The Good Samaritan Word Search",
    description: "A Bible word search puzzle based on the story of the Good Samaritan",
    icon: <Search className="h-10 w-10 text-rose-500" />,
    items: [
      {
        id: "good-samaritan-search",
        title: "The Good Samaritan Word Search",
        description: "Find words from the Good Samaritan story in this fun Bible word search",
        imagePath: "/lovable-uploads/8b65e3fb-e245-481e-b3a4-c49e6889363d.png",
        viewText: "View Word Search"
      }
    ]
  },
  {
    id: "psalm-23-fill-in",
    title: "Psalm 23 Fill-in-the-Blank",
    description: "Complete Psalm 23 using the word bank in this Bible activity for kids",
    icon: <FileText className="h-10 w-10 text-emerald-600" />,
    items: [
      {
        id: "psalm-23-fill-in",
        title: "Psalm 23 Fill-in-the-Blank",
        description: "Fill in the blanks to complete Psalm 23 and read it aloud!",
        imagePath: "/lovable-uploads/psalm-23-fill-in.png",
        viewText: "View Activity"
      }
    ]
  },
  {
    id: "lost-sheep-maze",
    title: "The Lost Sheep Maze",
    description: "Help the shepherd find his lost sheep in this fun Bible maze",
    icon: <Map className="h-10 w-10 text-sky-500" />,
    items: [
      {
        id: "lost-sheep-maze",
        title: "The Lost Sheep Maze",
        description: "Help the shepherd find his lost sheep",
        imagePath: "/lovable-uploads/lost-sheep-maze.png",
        viewText: "View Maze"
      }
    ]
  }
];
