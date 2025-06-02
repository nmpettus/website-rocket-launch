
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
}

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle: string;
  reviews: Review[];
}

const ReviewsModal = ({ isOpen, onClose, bookTitle, reviews }: ReviewsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">{bookTitle} Reviews</DialogTitle>
          <DialogDescription>
            Actual Amazon reviews from readers
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          {reviews.map((review) => (
            <div key={review.id} className="mb-6 pb-6 border-b">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{review.title}</h3>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center mb-3 text-sm text-gray-600">
                <span className="mr-2">By {review.author}</span>
                <span className="mr-2">•</span>
                <span>{review.date}</span>
                {review.verified && (
                  <>
                    <span className="mx-2">•</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                      Verified Purchase
                    </Badge>
                  </>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-line">{review.content}</p>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewsModal;
