// Returns a short-lived signed URL for a downloadable book file,
// but only for members who have unlocked it (or admins).
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
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return json({ error: 'Not signed in' }, 401);

    let bookId: unknown;
    let mode: unknown;
    try {
      ({ bookId, mode } = await req.json());
    } catch {
      return json({ error: 'Invalid JSON body' }, 400);
    }
    if (typeof bookId !== 'string' || !/^[0-9a-f-]{36}$/i.test(bookId)) {
      return json({ error: 'A valid bookId is required' }, 400);
    }
    const inlineRead = mode === 'read';


    const url = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) return json({ error: 'Not signed in' }, 401);
    const userId = userData.user.id;

    const { data: book, error: bookErr } = await admin
      .from('books')
      .select('id, title, download_path')
      .eq('id', bookId)
      .maybeSingle();
    if (bookErr) throw bookErr;
    if (!book?.download_path) return json({ error: 'This item has no downloadable file' }, 404);

    const { data: isAdmin } = await admin.rpc('has_role', { _user_id: userId, _role: 'admin' });

    if (!isAdmin) {
      const { data: unlock } = await admin
        .from('unlocks')
        .select('id')
        .eq('user_id', userId)
        .eq('book_id', bookId)
        .maybeSingle();
      if (!unlock) return json({ error: 'Unlock this item with credits to download it' }, 403);
    }

    const filename = `${book.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '')}.pdf`;
    const { data: signed, error: signErr } = await admin.storage
      .from('book-pages')
      .createSignedUrl(book.download_path, 300, { download: filename });
    if (signErr || !signed?.signedUrl) throw signErr ?? new Error('Could not sign URL');

    return json({ url: signed.signedUrl });
  } catch (e) {
    console.error('get-download-url error', e);
    return json({ error: 'Could not prepare the download. Please try again.' }, 500);
  }
});
