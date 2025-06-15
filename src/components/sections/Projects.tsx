
import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Image } from "lucide-react";

const Projects = () => {
  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800 font-['Comic_Neue']">Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project 1 - AI Adventures with Maggie */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-blue-500 bg-opacity-10 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">1</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <Dialog>
                <DialogTrigger className="relative group">
                  <img 
                    src="/lovable-uploads/6b22c83b-1f49-4e75-8037-492e12cab7bf.png" 
                    alt="AI Adventures with Maggie book cover" 
                    className="w-full h-48 object-contain mb-4 cursor-pointer transition-all group-hover:opacity-90" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-40 p-2 rounded-full">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl p-2">
                  <DialogTitle>AI Adventures with Maggie</DialogTitle>
                  <img 
                    src="/lovable-uploads/6b22c83b-1f49-4e75-8037-492e12cab7bf.png" 
                    alt="AI Adventures with Maggie book cover" 
                    className="w-full object-contain max-h-[80vh]" 
                  />
                </DialogContent>
              </Dialog>
              <h3 className="text-xl font-bold text-gray-800 text-center">AI Adventures with Maggie</h3>
            </div>
            <p className="text-gray-600 mb-4">A fun, simple introduction to artificial intelligence for kids, explained by Maggie! Expected release: November 2025.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{width: "40%"}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">40% complete</p>
          </div>
          
          {/* Project 2 */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-emerald-500 bg-opacity-10 text-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">2</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <Dialog>
                <DialogTrigger className="relative group">
                  <img 
                    src="/lovable-uploads/62a614b9-872b-4627-aa30-98d723add3dc.png" 
                    alt="The Divine Protocol book cover" 
                    className="w-full h-48 object-contain mb-4 cursor-pointer transition-all group-hover:opacity-90" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-40 p-2 rounded-full">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl p-2">
                  <DialogTitle>The Divine Protocol</DialogTitle>
                  <img 
                    src="/lovable-uploads/62a614b9-872b-4627-aa30-98d723add3dc.png" 
                    alt="The Divine Protocol book cover" 
                    className="w-full object-contain max-h-[80vh]" 
                  />
                </DialogContent>
              </Dialog>
              <h3 className="text-xl font-bold mb-3 text-gray-800 text-center">The Divine Protocol</h3>
            </div>
            <p className="text-gray-600 mb-4">How God Used Doctors, Medicine, and My Own Body to Heal Me. Expected release: October 2025.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-emerald-500 h-2.5 rounded-full" style={{width: "15%"}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">15% complete</p>
          </div>

          {/* Project 3 - Bible Heroes */}
          <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300">
            <div className="bg-amber-500 bg-opacity-10 text-amber-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl">3</span>
            </div>
            <div className="flex flex-col items-center mb-4">
              <Dialog>
                <DialogTrigger className="relative group">
                  <img 
                    src="/lovable-uploads/a30b516d-17c3-44e1-bd65-120f84bc64a2.png" 
                    alt="Bible Heroes and Heroines book cover" 
                    className="w-full h-48 object-contain mb-4 cursor-pointer transition-all group-hover:opacity-90" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black bg-opacity-40 p-2 rounded-full">
                      <Image className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl p-2">
                  <DialogTitle>Bible Heroes and Heroines</DialogTitle>
                  <img 
                    src="/lovable-uploads/a30b516d-17c3-44e1-bd65-120f84bc64a2.png" 
                    alt="Bible Heroes and Heroines book cover" 
                    className="w-full object-contain max-h-[80vh]" 
                  />
                </DialogContent>
              </Dialog>
              <h3 className="text-xl font-bold text-gray-800 text-center">Bible Heroes and Heroines</h3>
            </div>
            <p className="text-gray-600 mb-4">Bible Heroes and Heroines as told by Maggie. Expected release: November 2025.</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-amber-500 h-2.5 rounded-full" style={{width: "10%"}}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">10% complete</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
