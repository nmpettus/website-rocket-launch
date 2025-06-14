
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Maximize2, Printer } from "lucide-react"; // Removed ChevronDown, ChevronUp
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  imagePath: string;
  viewText: string;
}

export interface ActivityCategory {
  id:string;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: ActivityItem[];
}

interface ActivityCardProps {
  category: ActivityCategory;
  viewedActivities: string[];
  onView: (activityId: string) => void;
  onPrint: (imagePath: string) => void;
  className?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  category, 
  viewedActivities, 
  onView, 
  onPrint,
  className 
}) => {
  const items = category?.items || [];
  const firstActivityItem = items.length > 0 ? items[0] : null;

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg flex flex-col ${className}`}>
      <CardHeader className="flex items-center">
        <div className="p-3 rounded-full bg-gray-100 mb-4">
          {category.icon}
        </div>
        {/* Changed text-xl to text-lg for CardTitle */}
        <CardTitle className="text-lg font-['Comic_Neue'] text-center">{category.title}</CardTitle>
        <CardDescription className="text-center">{category.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow px-4 pb-4 pt-0"> {/* Adjusted padding */}
        {firstActivityItem && (
          <div className="mt-2"> {/* Adjusted margin */}
            <ActivityItemCard 
              key={firstActivityItem.id}
              activity={firstActivityItem}
              isViewed={viewedActivities.includes(firstActivityItem.id)}
              onView={() => onView(firstActivityItem.id)}
              onPrint={() => onPrint(firstActivityItem.imagePath)}
            />
          </div>
        )}
      </CardContent>
      {/* CardFooter can be removed if not needed or kept for consistent spacing */}
      <CardFooter className="pt-0 pb-4"> 
        {/* Intentionally empty or can be used for other elements if needed in future */}
      </CardFooter>
    </Card>
  );
};

interface ActivityItemCardProps {
  activity: ActivityItem;
  isViewed: boolean;
  onView: () => void;
  onPrint: () => void;
}

const ActivityItemCard: React.FC<ActivityItemCardProps> = ({ activity, isViewed, onView, onPrint }) => {
  return (
    <Card className="overflow-hidden border border-gray-200 bg-white"> {/* Added bg-white for better contrast if card itself has a bg */}
      <CardHeader className="p-3">
        <CardTitle className="text-base font-medium">{activity.title}</CardTitle>
        <CardDescription className="text-xs">{activity.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Dialog>
          <DialogTrigger asChild>
            {/* Changed h-32 to h-28 for the image container */}
            <div className="h-28 bg-gray-200 rounded-md flex items-center justify-center mb-3 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <img 
                src={activity.imagePath} 
                alt={`${activity.title} preview`}
                className="w-full h-full object-cover"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-[90vw]">
            <DialogTitle>{activity.title} Preview</DialogTitle>
            <DialogDescription>
              Preview of {activity.title}
            </DialogDescription>
            <AspectRatio ratio={4/3} className="bg-muted">
              <img 
                src={activity.imagePath} 
                alt={activity.title} 
                className="w-full h-full object-contain"
              />
            </AspectRatio>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={onPrint}
              >
                <Printer size={16} />
                Print Page
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 p-3 pt-0">
        <Button 
          size="sm"
          className={`w-full flex items-center justify-center gap-2 ${isViewed ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`} // Updated default colors for View button
          onClick={onView}
        >
          {isViewed ? (
            <>
              <Check size={14} />
              Viewed
            </>
          ) : (
            <>
              <Maximize2 size={14} />
              {activity.viewText}
            </>
          )}
        </Button>
        <Button 
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={onPrint}
        >
          <Printer size={14} />
          Print Activity
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;
