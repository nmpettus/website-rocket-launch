
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-comic">Privacy Policy</h1>
          <p className="text-gray-500 mb-6">Last updated: June 14, 2025</p>

          <p className="mb-4 text-gray-700">
            Welcome to Books By Maggie! We are committed to protecting your privacy. This Privacy Policy explains what information we collect and why.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">Information We Collect</h2>
          <p className="mb-4 text-gray-700">
            The only personal information we collect is your email address, and only when you voluntarily provide it by subscribing to our newsletter.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">How We Use Your Information</h2>
          <p className="mb-4 text-gray-700">
            Your email address is used exclusively for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
            <li>To send you our newsletter with updates on new book releases.</li>
            <li>To inform you about special giveaways and promotions.</li>
            <li>To share Maggie's latest adventures and other fun content.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">Information We Do Not Collect</h2>
          <p className="mb-4 text-gray-700">
            We do not collect any other personal information. This includes, but is not limited to, your name, address, phone number, or payment details. We do not use cookies for tracking or collecting personal data.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">Data Security</h2>
          <p className="mb-4 text-gray-700">
            We take reasonable measures to protect the email addresses we collect. Your email address will not be sold, traded, or shared with any third parties.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">Unsubscribing</h2>
          <p className="mb-4 text-gray-700">
            You may unsubscribe from our newsletter at any time by clicking the "unsubscribe" link provided in every email.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please feel free to contact us through the contact form on our website.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
