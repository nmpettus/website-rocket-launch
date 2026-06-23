
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
    <Card className={`transition-all duration-300 hover:shadow-lg flex flex-col h-full ${className}`}>
      <CardHeader className="flex items-center">
        <div className="p-3 rounded-full bg-gray-100 mb-4">
          {category.icon}
        </div>
        <CardTitle className="text-lg font-['Comic_Neue'] text-center min-h-[3.5rem] flex items-center justify-center">{category.title}</CardTitle>
        <CardDescription className="text-center min-h-[2.5rem]">{category.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex px-4 pb-4 pt-0">
        {firstActivityItem && (
          <div className="mt-2 w-full flex">
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
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleViewClick = () => {
    onView();
    setDialogOpen(true);
  };

  return (
    <Card className="overflow-hidden border border-gray-200 bg-white flex flex-col w-full h-full">
      <CardHeader className="p-3">
        <CardTitle className="text-base font-medium min-h-[2.5rem]">{activity.title}</CardTitle>
        <CardDescription className="text-xs min-h-[2rem]">{activity.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex-grow">

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <div className="h-28 bg-gray-200 rounded-md flex items-center justify-center mb-3 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
              <img 
                src={activity.imagePath} 
                alt={`${activity.title} preview`}
                className="w-full h-full object-cover"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] p-0 overflow-hidden flex flex-col">
            <div className="p-6 pb-0">
              <DialogTitle>{activity.title} Preview</DialogTitle>
              <DialogDescription>
                Preview of {activity.title}
              </DialogDescription>
            </div>
            <div className="flex-grow p-6 pt-4 overflow-auto flex items-center justify-center">
              <img 
                src={activity.imagePath} 
                alt={activity.title} 
                className="max-w-full max-h-[70vh] object-contain rounded-md shadow-lg"
              />
            </div>
            <div className="p-6 pt-0 flex justify-end gap-3">
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
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
          className={`w-full flex items-center justify-center gap-2 ${isViewed ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
          onClick={handleViewClick}
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
