import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Image } from "lucide-react";

const FutureProjects = () => {
  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800 font-['Comic_Neue']">Coming Soon</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project 1 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-indigo-600 bg-opacity-10 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">1</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <Dialog>
                <DialogTrigger className="relative group">
                  <img 
                    src="/lovable-uploads/18ecb8c6-00a6-471e-8f35-ffbb961b8f6c.png" 
                    alt="God's Love as told by Maggie book cover" 
                    className="w-full h-48 object-contain mb-4 cursor-pointer transition-all group-hover:opacity-90" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-40 p-2 rounded-full">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl p-2">
                  <DialogTitle>God's Love as told by Maggie</DialogTitle>
                  <img 
                    src="/lovable-uploads/18ecb8c6-00a6-471e-8f35-ffbb961b8f6c.png" 
                    alt="God's Love as told by Maggie book cover" 
                    className="w-full object-contain max-h-[80vh]" 
                  />
                </DialogContent>
              </Dialog>
              <h3 className="text-xl font-bold text-gray-800 text-center">God's Love as told by Maggie</h3>
            </div>
            <p className="text-gray-600 mb-4">A heartwarming tale about God's love for everyone, told through the eyes of Maggie. Expected release: June 2025.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{width: "65%"}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">65% complete</p>
          </div>
          
          {/* Project 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-amber-500 bg-opacity-10 text-amber-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">2</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <Dialog>
                <DialogTrigger className="relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" 
                    alt="Maggie Explains AI book cover placeholder" 
                    className="w-full h-48 object-cover mb-4 cursor-pointer transition-all group-hover:opacity-90" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-40 p-2 rounded-full">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl p-2">
                  <DialogTitle>Maggie Explains AI</DialogTitle>
                  <img 
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80" 
                    alt="Maggie Explains AI book cover placeholder" 
                    className="w-full object-contain max-h-[80vh]" 
                  />
                </DialogContent>
              </Dialog>
              <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">Maggie Explains AI</h3>
            </div>
            <p className="text-gray-600 mb-4">A fun, interactive book where Maggie helps children understand artificial intelligence in simple terms. Expected release: Sept 2025.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-amber-500 h-2.5 rounded-full" style={{width: "30%"}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">30% complete</p>
          </div>
          
          {/* Project 3 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-emerald-500 bg-opacity-10 text-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">3</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <Dialog>
                <DialogTrigger className="relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" 
                    alt="God's Miracle Cure for Cancer book cover placeholder" 
                    className="w-full h-48 object-cover mb-4 cursor-pointer transition-all group-hover:opacity-90" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-40 p-2 rounded-full">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl p-2">
                  <DialogTitle>God's Miracle Cure for Cancer</DialogTitle>
                  <img 
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" 
                    alt="God's Miracle Cure for Cancer book cover placeholder" 
                    className="w-full object-contain max-h-[80vh]" 
                  />
                </DialogContent>
              </Dialog>
              <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">God's Miracle Cure for Cancer</h3>
            </div>
            <p className="text-gray-600 mb-4">Maggie shares insights on God's healing power in this inspiring book. Expected release: Spring 2024.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{width: "15%"}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">15% complete</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureProjects;