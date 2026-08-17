// Admin-only, confirmation-gated deletion of a library book.
// Requires: caller is an admin AND sends the book's exact title as confirmation.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  try {
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '').trim();
    if (!token) return json({ error: 'Not signed in' }, 401);

    let bookId: unknown, confirmTitle: unknown;
    try {
      ({ bookId, confirmTitle } = await req.json());
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }
    if (typeof bookId !== 'string' || !/^[0-9a-f-]{36}$/i.test(bookId)) {
      return json({ error: 'A valid bookId is required' }, 400);
    }
    if (typeof confirmTitle !== 'string' || !confirmTitle.trim()) {
      return json({ error: 'Confirmation title is required' }, 400);
    }

    const url = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) return json({ error: 'Not signed in' }, 401);

    const { data: isAdmin } = await admin.rpc('has_role', {
      _user_id: userData.user.id,
      _role: 'admin',
    });
    if (!isAdmin) return json({ error: 'Admins only' }, 403);

    const { data: book, error: bookErr } = await admin
      .from('books')
      .select('id, title, slug, cover_image_url, download_path')
      .eq('id', bookId)
      .maybeSingle();
    if (bookErr) throw bookErr;
    if (!book) return json({ error: 'Book not found' }, 404);

    if (confirmTitle.trim().toLowerCase() !== book.title.trim().toLowerCase()) {
      return json({ error: 'Confirmation text does not match the book title' }, 400);
    }

    // Collect storage objects belonging to this book.
    const { data: pages } = await admin
      .from('book_pages')
      .select('image_url')
      .eq('book_id', bookId);

    const paths = new Set<string>();
    const addPath = (p?: string | null) => {
      if (p && !p.startsWith('http') && !p.startsWith('/')) paths.add(p);
    };
    pages?.forEach((p) => addPath(p.image_url));
    addPath(book.cover_image_url);
    addPath(book.download_path);

    // Remove dependent rows first (FKs have no cascade).
    await admin.from('book_pages').delete().eq('book_id', bookId);
    await admin.from('unlocks').delete().eq('book_id', bookId);
    await admin.from('reading_history').delete().eq('book_id', bookId);

    const { error: delErr } = await admin.from('books').delete().eq('id', bookId);
    if (delErr) throw delErr;

    if (paths.size) {
      const list = [...paths];
      for (let i = 0; i < list.length; i += 100) {
        await admin.storage.from('book-pages').remove(list.slice(i, i + 100));
      }
    }

    console.log(`admin ${userData.user.id} deleted book ${book.slug} (${paths.size} files)`);
    return json({ success: true, title: book.title, filesRemoved: paths.size });
  } catch (e) {
    console.error('admin-delete-book error', e);
    return json({ error: 'Could not delete this book. Please try again.' }, 500);
  }
});
