
import React from "react";
import { getActivities } from "@/data/activitiesData";
import ActivityCard from "@/components/activities/ActivityCard";
import { toast } from "@/components/ui/use-toast";
import { printImage } from "@/utils/printUtils";

const Activities = () => {
  const [viewedActivities, setViewedActivities] = React.useState<string[]>([]);

  const handleView = (activityId: string) => {
    if (!viewedActivities.includes(activityId)) {
      setViewedActivities((prev) => [...prev, activityId]);
      toast({
        title: "Activity Viewed",
        description: "Great job exploring this activity!",
      });
    }
  };

  const handlePrint = (imagePath: string) => {
    printImage(imagePath);
    toast({
      title: "Printing...",
      description: "Your activity page is preparing to print.",
    });
  };

  const activities = getActivities();

  return (
    <section id="activities" className="py-8 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-2 text-gray-800 font-['Comic_Neue']">
          Fun Activities
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6">
          Engage in fun and educational activities that bring the Bible to life!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((category) => (
            <ActivityCard
              key={category.id}
              category={category}
              viewedActivities={viewedActivities}
              onView={handleView}
              onPrint={handlePrint}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
