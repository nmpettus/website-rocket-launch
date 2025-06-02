
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const BlogPreview = () => {
  return (
    <section id="blog" className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800 font-['Comic_Neue']">From Our Blog</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Post 1 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <img src="https://picsum.photos/600/400?random=110" alt="Blog post image" className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>June 15, 2023</span>
                <span className="mx-2">•</span>
                <span>5 min read</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">The Inspiration Behind Our First Book</h3>
              <p className="text-gray-600 mb-4">Discover how Maggie's playful antics inspired our debut children's book and started this wonderful journey.</p>
              <Link to="#" className="text-indigo-600 font-medium hover:underline">Read More →</Link>
            </div>
          </div>
          
          {/* Blog Post 2 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <img src="https://picsum.photos/600/400?random=111" alt="Blog post image" className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>May 28, 2023</span>
                <span className="mx-2">•</span>
                <span>4 min read</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Translating Children's Books: Challenges & Rewards</h3>
              <p className="text-gray-600 mb-4">Learn about our experience translating the first book into Spanish and Italian while preserving the magic.</p>
              <Link to="#" className="text-indigo-600 font-medium hover:underline">Read More →</Link>
            </div>
          </div>
          
          {/* Blog Post 3 */}
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <img src="https://picsum.photos/600/400?random=112" alt="Blog post image" className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span>May 10, 2023</span>
                <span className="mx-2">•</span>
                <span>7 min read</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">How We're Giving Back Through Books</h3>
              <p className="text-gray-600 mb-4">The story behind our GiveSendGo campaign and how we're getting books to children who need them most.</p>
              <Link to="#" className="text-indigo-600 font-medium hover:underline">Read More →</Link>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full">View All Blog Posts</Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
