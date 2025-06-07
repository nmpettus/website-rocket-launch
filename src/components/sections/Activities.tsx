
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import LetterToMaggie from "@/components/activities/LetterToMaggie";
import { getActivities } from "@/data/activitiesData";
import { printImage } from "@/utils/printUtils";
import { Check, Maximize2, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Activities = () => {
  const [viewedActivities, setViewedActivities] = useState<string[]>([]);
  const activities = getActivities() || [];

  const handleViewActivity = (activityId: string) => {
    if (!viewedActivities.includes(activityId)) {
      setViewedActivities(prev => [...prev, activityId]);
    }
  };

  if (!Array.isArray(activities) || activities.length === 0) {
    return (
      <section id="activities" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-800 font-['Comic_Neue']">Activities for All</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            No activities available at the moment. Please check back later!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="activities" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-800 font-['Comic_Neue']">Activities for All</h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          Explore our collection of fun printable activities designed to make learning about Bible stories interactive for everyone.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {activities.map(activity => (
            <div key={activity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">{activity.title}</h3>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="h-44 bg-gray-200 rounded-md flex items-center justify-center mb-4 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
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
                        onClick={() => printImage(activity.imagePath)}
                      >
                        <Printer size={16} />
                        Print Page
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex flex-col gap-3">
                  <Button
                    className={`w-full flex items-center justify-center gap-2 ${viewedActivities.includes(activity.id) ? 'bg-green-600 hover:bg-green-700' : ''}`}
                    onClick={() => handleViewActivity(activity.id)}
                  >
                    {viewedActivities.includes(activity.id) ? (
                      <>
                        <Check size={16} />
                        Viewed
                      </>
                    ) : (
                      <>
                        <Maximize2 size={16} />
                        {activity.viewText}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={() => printImage(activity.imagePath)}
                  >
                    <Printer size={16} />
                    Print Activity
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <div className="max-w-md mx-auto">
            <LetterToMaggie />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Activities;
