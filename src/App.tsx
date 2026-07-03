import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Videos from "./pages/Videos";
import ChapterZero from "./pages/ChapterZero";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import SubscribersList from "./pages/SubscribersList";
import AskMaggie from "./pages/AskMaggie";
import MaggiesAIAdventures from "./pages/MaggiesAIAdventures";
import AIAdventuresBook from "./pages/books/AIAdventuresBook";
import CreationBook from "./pages/books/CreationBook";
import GodsLoveBook from "./pages/books/GodsLoveBook";
import JonahBook from "./pages/books/JonahBook";
import NoahsArkBook from "./pages/books/NoahsArkBook";
import ChristmasBook from "./pages/books/ChristmasBook";
import ThanksgivingBook from "./pages/books/ThanksgivingBook";
import EasterBook from "./pages/books/EasterBook";
import IndependenceDayBook from "./pages/books/IndependenceDayBook";
import About from "./pages/About";
import OnlineLibrary from "./pages/OnlineLibrary";
import BibleVersesGodsLove from "./pages/BibleVersesGodsLove";
import Matteo from "./pages/Matteo";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Join from "./pages/Join";
import Members from "./pages/Members";
import BookReader from "./pages/BookReader";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();
const AdminBooks = lazy(() => import("./pages/AdminBooks"));

const isPasswordResetLink = () => {
  if (typeof window === "undefined") return false;
  const search = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  return (
    search.get("reset-password") === "1" ||
    hash.includes("type=recovery") ||
    hash.includes("access_token=")
  );
};

const HomeOrResetPassword = () => (isPasswordResetLink() ? <ResetPassword /> : <Index />);
const NotFoundOrResetPassword = () => (isPasswordResetLink() ? <ResetPassword /> : <NotFound />);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
    <Toaster />
    <HashRouter>
      <Routes>

        <Route path="/" element={<HomeOrResetPassword />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/chapter-zero" element={<ChapterZero />} />
        <Route path="/ask-maggie" element={<AskMaggie />} />
        <Route path="/maggies-ai-adventures" element={<MaggiesAIAdventures />} />
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
        <Route path="/books/thanksgiving" element={<ThanksgivingBook />} />
        <Route path="/books/easter" element={<EasterBook />} />
        <Route path="/books/independence-day" element={<IndependenceDayBook />} />
        <Route path="/about" element={<About />} />
        <Route path="/online-library" element={<OnlineLibrary />} />
        <Route path="/resources/bible-verses-gods-love" element={<BibleVersesGodsLove />} />
        <Route path="/matteo" element={<Matteo />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/join" element={<Join />} />
        <Route path="/members" element={<Members />} />
        <Route path="/read/:slug" element={<BookReader />} />
        <Route
          path="/admin/books"
          element={
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading admin…</div>}>
              <AdminBooks />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundOrResetPassword />} />
      </Routes>
    </HashRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

