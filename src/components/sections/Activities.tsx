import React from "react";
import { getActivities } from "@/data/activitiesData.tsx";
import ActivityCard from "@/components/activities/ActivityCard";
import { toast } from "@/components/ui/use-toast";
import { printImage } from "@/utils/printUtils";
import { Palette } from "lucide-react";

const Activities = () => {
  const [viewedActivities, setViewedActivities] = React.useState<string[]>([]);

  const handleView = (activityId: string) => {
    if (!viewedActivities.includes(activityId)) {
      setViewedActivities((prev) => [...prev, activityId]);
      toast("Activity Viewed", {
        description: "Great job exploring this activity!",
      });
    }
  };

  const handlePrint = (imagePath: string) => {
    printImage(imagePath);
    toast("Printing...", {
      description: "Your activity page is preparing to print.",
    });
  };

  const categories = getActivities();

  return (
    <section id="activities" className="py-24 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full mb-4">
            <Palette className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-medium text-accent-foreground">Learning Resources</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Fun Activities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Engage in fun and educational activities that bring the Bible to life
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
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
