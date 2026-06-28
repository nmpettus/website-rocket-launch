# Hostinger Upload Checklist

Use this every time so the site does not turn into a blank white page.

1. Run:
   ```bash
   npm run build
   ```

2. The build now creates `hostinger-upload.zip` automatically.

3. In Hostinger File Manager, open `public_html`, upload `hostinger-upload.zip`, and extract it there.

4. The zip contains the **contents inside `dist`**:
   - `index.html`
   - `.htaccess`
   - `assets/`
   - `lovable-uploads/`
   - any other folders/files in `dist`

5. Do **not** upload only `index.html`.

6. If Hostinger already has an old `assets` folder, delete it first or replace it completely.

7. After upload, hard-refresh the website:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

If `index.html` is uploaded without its matching JavaScript file in `assets/`, the browser shows a blank white page.