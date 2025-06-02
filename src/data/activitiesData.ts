
import React from "react";
import { Puzzle, BookText, PenSquare } from "lucide-react";
import { ActivityItem } from "@/components/activities/ActivityCard";

// Create icon components separately as functions that return JSX
const createPuzzleIcon = (className: string) => React.createElement(Puzzle, { className });
const createPenSquareIcon = (className: string) => React.createElement(PenSquare, { className });
const createBookTextIcon = (className: string) => React.createElement(BookText, { className });

export const getActivities = (): ActivityItem[] => [
  {
    id: "bible-mazes",
    title: "Bible Story Mazes",
    description: "Navigate through exciting mazes based on favorite Bible stories",
    viewText: "View Mazes",
    imagePath: "/lovable-uploads/6947ab9e-a034-4dd3-85df-4f275595e32e.png"
  },
  {
    id: "coloring",
    title: "Coloring Pages",
    description: "Beautiful illustrations from Bible stories to color and enjoy",
    viewText: "View Pages",
    imagePath: "/lovable-uploads/0891c43e-560b-4086-9b45-82b1fa6f6d0d.png"
  },
  {
    id: "puzzles",
    title: "Fun Puzzles",
    description: "Word searches, crosswords, and more based on Biblical themes",
    viewText: "View Puzzles",
    imagePath: "/lovable-uploads/f4bbd70d-20b4-4e4a-b742-88b1baec4926.png"
  },
  {
    id: "fact-cards",
    title: "Noah's Ark Questions",
    description: "Interactive questions about Noah's Ark story for kids to learn and have fun",
    viewText: "View Questions",
    imagePath: "/lovable-uploads/04df8ac3-a67b-4169-b2e7-8cdc0d78b0a3.png"
  }
];
