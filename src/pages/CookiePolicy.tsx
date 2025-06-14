
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CookiePolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/22798029-d558-453e-8673-fa3d5ec62840.png" alt="Maggie the dog logo" className="h-12 w-12 rounded-full object-cover" />
            <span className="text-2xl font-bold text-indigo-600 font-comic">Books By Maggie</span>
          </div>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-comic">Cookie Policy</h1>
          <p className="text-gray-500 mb-6">Last updated: June 14, 2025</p>

          <p className="mb-4 text-gray-700">
            Welcome to Books By Maggie! This Cookie Policy explains how we use cookies and similar technologies on our website.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">What Are Cookies?</h2>
          <p className="mb-4 text-gray-700">
            Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">How We Use Cookies</h2>
          <p className="mb-4 text-gray-700">
            Our website, Books By Maggie, does not use cookies to collect personal information or for tracking purposes. We are committed to protecting your privacy, and our site is designed to be a simple, safe place for you to explore Maggie's adventures.
          </p>
          <p className="mb-4 text-gray-700">
            The only information we collect is your email address if you voluntarily subscribe to our newsletter. This process does not involve the use of cookies to store your personal data on your device.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">Third-Party Services</h2>
          <p className="mb-4 text-gray-700">
            We do not use any third-party services that place cookies on your device for advertising, analytics, or tracking. Links to external sites, like Amazon for purchasing books, are direct links and we do not use affiliate cookies to track your activity.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">Your Choices</h2>
          <p className="mb-4 text-gray-700">
            Since we do not use cookies, there are no settings for you to manage on our website. You can browse freely without concerns about cookie-based tracking.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about our Cookie Policy, please feel free to contact us through the contact form on our website.
          </p>
        </div>
      </main>
    </div>
  );
};

export default CookiePolicy;

