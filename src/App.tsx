
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SubscribersList from "./pages/SubscribersList";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import TermsOfService from "./pages/TermsOfService";
import Videos from "./pages/Videos";
import CreationBook from "./pages/books/CreationBook";
import NoahsArkBook from "./pages/books/NoahsArkBook";
import JonahBook from "./pages/books/JonahBook";
import GodsLoveBook from "./pages/books/GodsLoveBook";
import AIAdventuresBook from "./pages/books/AIAdventuresBook";
import ChapterZero from "./pages/ChapterZero";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="font-sans bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/books/creation" element={<CreationBook />} />
            <Route path="/books/noahs-ark" element={<NoahsArkBook />} />
            <Route path="/books/jonah" element={<JonahBook />} />
            <Route path="/books/gods-love" element={<GodsLoveBook />} />
            <Route path="/books/ai-adventures" element={<AIAdventuresBook />} />
            <Route path="/chapter-zero" element={<ChapterZero />} />
            <Route path="/subscribers" element={<SubscribersList />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
