import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// --- Mock auth + subscription hooks ------------------------------------------------
let mockIsActive = false;
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: { id: "test-user" }, loading: false, signOut: vi.fn() }),
}));
vi.mock("@/hooks/useSubscription", () => ({
  useSubscription: () => ({
    isActive: mockIsActive,
    subscription: null,
    loading: false,
    refetch: vi.fn(),
  }),
}));

// --- Mock persistent image cache (IndexedDB not available in jsdom) ----------------
vi.mock("@/lib/imageCache", () => ({
  getCachedImageUrl: async (u: string) => u,
  prefetchImages: () => {},
  hasCachedImage: async () => true,
  cacheAllImages: async () => {},
}));

// --- Mock Supabase client ----------------------------------------------------------
const TEST_BOOK = {
  id: "book-1",
  slug: "paid-book",
  title: "Paid Book",
  page_count: 10,
  is_free: false,
};
const TEST_PAGES = Array.from({ length: 10 }, (_, i) => ({
  id: `page-${i + 1}`,
  page_number: i + 1,
  image_url: `https://example.test/page-${i + 1}.jpg`,
  narration_text: null,
  updated_at: null,
}));

function makeBooksQuery() {
  const chain: any = {};
  chain.select = () => chain;
  chain.eq = () => chain;
  chain.maybeSingle = async () => ({ data: TEST_BOOK, error: null });
  return chain;
}
function makePagesQuery() {
  const chain: any = {};
  chain.select = () => chain;
  chain.eq = () => chain;
  chain.lte = () => chain;
  chain.order = async () => ({ data: TEST_PAGES, error: null });
  chain.upsert = () => ({ then: (cb: any) => cb({ error: null }) });
  return chain;
}

vi.mock("@/integrations/supabase/client", () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: (table: string) => {
      if (table === "books") return makeBooksQuery();
      if (table === "book_pages") return makePagesQuery();
      if (table === "reading_history") return makePagesQuery();
      return makePagesQuery();
    },
    storage: {
      from: () => ({
        createSignedUrl: async (path: string) => ({
          data: { signedUrl: `https://example.test/${path}` },
          error: null,
        }),
      }),
    },
    functions: { invoke: async () => ({ data: null, error: null }) },
  },
}));

vi.mock("@/lib/publicConfig", () => ({
  supabaseUrl: "https://example.test",
  supabaseAnonKey: "anon",
  stripeClientToken: "pk_test_x",
}));

import BookReader from "@/pages/BookReader";

function renderReader() {
  return render(
    <MemoryRouter initialEntries={["/read/paid-book"]}>
      <Routes>
        <Route path="/read/:slug" element={<BookReader />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("BookReader paywall gating", () => {
  beforeEach(() => { mockIsActive = false; });

  it("shows only the first 3 pages to an unsubscribed user", async () => {
    renderReader();

    // Page 1
    await waitFor(() =>
      expect(screen.getByText(/Page 1 of 10/i)).toBeInTheDocument(),
    );

    const nextBtn = screen.getByRole("button", { name: /Next/i });

    // Advance to page 2
    fireEvent.click(nextBtn);
    await waitFor(() =>
      expect(screen.getByText(/Page 2 of 10/i)).toBeInTheDocument(),
    );

    // Advance to page 3 (last preview page)
    fireEvent.click(nextBtn);
    await waitFor(() =>
      expect(screen.getByText(/Page 3 of 10/i)).toBeInTheDocument(),
    );

    // Paywall CTA appears at end of preview
    expect(
      screen.getByText(/Keep reading with Maggie's Reading Club/i),
    ).toBeInTheDocument();

    // Next button is disabled — cannot advance to page 4
    expect(nextBtn).toBeDisabled();
  });

  it("allows subscribed users to advance past page 3", async () => {
    mockIsActive = true;
    renderReader();

    await waitFor(() =>
      expect(screen.getByText(/Page 1 of 10/i)).toBeInTheDocument(),
    );

    const nextBtn = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);
    fireEvent.click(nextBtn);

    await waitFor(() =>
      expect(screen.getByText(/Page 4 of 10/i)).toBeInTheDocument(),
    );
    expect(
      screen.queryByText(/Keep reading with Maggie's Reading Club/i),
    ).not.toBeInTheDocument();
  });
});
