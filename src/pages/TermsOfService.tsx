
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-comic">Terms of Service</h1>
          <p className="text-gray-500 mb-6">Last updated: June 14, 2025</p>

          <p className="mb-4 text-gray-700">
            Welcome to Books By Maggie. By accessing our website, you agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">1. Intellectual Property</h2>
          <p className="mb-4 text-gray-700">
            All content on this website, including but not limited to text, graphics, logos, images, book excerpts, and the character "Maggie," is the property of the author/owner and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without express written permission.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">2. Use of Website</h2>
          <p className="mb-4 text-gray-700">
            This website is provided for your personal and non-commercial use. The content is for informational purposes about our books and related activities.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">3. Newsletter Subscription</h2>
          <p className="mb-4 text-gray-700">
            If you subscribe to our newsletter, you agree to receive periodic emails from us. We will protect your email address as described in our Privacy Policy. You can unsubscribe at any time using the link provided in each email.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">4. Links to Third-Party Sites</h2>
          <p className="mb-4 text-gray-700">
            Our website contains links to third-party websites, such as Amazon for book purchases. We are not responsible for the content, privacy policies, or practices of any third-party sites.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">5. Disclaimer</h2>
          <p className="mb-4 text-gray-700">
            The information and materials on this website are provided "as is" without any warranties. We do not warrant that the website will be available, uninterrupted, or error-free.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">6. Limitation of Liability</h2>
          <p className="mb-4 text-gray-700">
            In no event shall Books By Maggie or its owner be liable for any damages arising out of the use or inability to use the materials on this website.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">7. Changes to These Terms</h2>
          <p className="mb-4 text-gray-700">
            We reserve the right to modify these Terms of Service at any time. We will notify users of any changes by posting the new Terms of Service on this page.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-3 font-comic">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about these Terms, please contact us through the contact form on our website.
          </p>
        </div>
      </main>
    </div>
  );
};

export default TermsOfService;
