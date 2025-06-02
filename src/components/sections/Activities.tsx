import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import LetterToMaggie from "@/components/activities/LetterToMaggie";
import { getActivities } from "@/data/activitiesData";
import { printImage } from "@/utils/printUtils";
import { Check, Maximize2, Printer } from "lucide-react";

const Activities = () => {
  const [viewedActivities, setViewedActivities] = useState<string[]>([]);
  // Assume getActivities returns a flat array of activities
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
                <div className="h-44 bg-gray-200 rounded-md flex items-center justify-center mb-4 overflow-hidden">
                  <img
                    src={activity.imagePath}
                    alt={`${activity.title} preview`}
                    className="w-full h-full object-cover"
                  />
                </div>
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