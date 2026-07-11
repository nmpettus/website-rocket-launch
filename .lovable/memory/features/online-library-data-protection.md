---
name: Online Library Data Protection
description: Books, book_pages, and book-pages storage objects are permanent user content. Never delete without explicit user permission AND password confirmation.
type: constraint
---

# Online Library Data Protection

Uploaded books are irreplaceable user content. The following are **forbidden** unless the user explicitly requests deletion in the current message AND provides a password/confirmation phrase:

- Do NOT add a DELETE policy to `public.books` or `public.book_pages`.
- Do NOT add a DELETE policy to the `book-pages` storage bucket.
- Do NOT add a delete button, delete handler, or any client-side `.delete()` / `.remove()` call targeting books, book_pages, or the `book-pages` bucket.
- Do NOT silently overwrite an existing book by reusing its slug — slug collisions must be blocked before save (already enforced by `ensureSlugCanBeSaved`).
- Do NOT delete-then-reinsert page rows during a republish — use upsert on `(book_id, page_number)` only.

**Why:** A prior version had a hard-delete button and slug-based overwrites, which caused "The Little Lunch" book to be lost with no recovery path. The user was upset and required guarantees this can never happen again.

**How to apply:** If the user ever asks to delete a book, require them to (1) name the book, (2) confirm in writing they want it permanently deleted, and (3) provide a password/confirmation phrase in the same message. Only then may a one-off migration or manual SQL delete be run — never re-enable delete UI or delete policies.
