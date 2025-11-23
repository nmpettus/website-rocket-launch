import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Videos from "./pages/Videos";
import ChapterZero from "./pages/ChapterZero";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import SubscribersList from "./pages/SubscribersList";
import AIAdventuresBook from "./pages/books/AIAdventuresBook";
import CreationBook from "./pages/books/CreationBook";
import GodsLoveBook from "./pages/books/GodsLoveBook";
import JonahBook from "./pages/books/JonahBook";
import NoahsArkBook from "./pages/books/NoahsArkBook";
import ChristmasBook from "./pages/books/ChristmasBook";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/chapter-zero" element={<ChapterZero />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/secret" element={<SubscribersList />} />
        <Route path="/books/ai-adventures" element={<AIAdventuresBook />} />
        <Route path="/books/creation" element={<CreationBook />} />
        <Route path="/books/gods-love" element={<GodsLoveBook />} />
        <Route path="/books/jonah" element={<JonahBook />} />
        <Route path="/books/noahs-ark" element={<NoahsArkBook />} />
        <Route path="/books/christmas" element={<ChristmasBook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
