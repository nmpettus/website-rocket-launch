# Hostinger Upload Checklist

Use this every time so the site does not turn into a blank white page.

1. Run:
   ```bash
   npm run build
   ```

2. Open the `dist` folder.

3. Upload the **contents inside `dist`** to Hostinger `public_html`:
   - `index.html`
   - `.htaccess`
   - `assets/`
   - `lovable-uploads/`
   - any other folders/files in `dist`

4. Do **not** upload only `index.html`.

5. If Hostinger already has an old `assets` folder, delete it first or replace it completely.

6. After upload, hard-refresh the website:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

If `index.html` is uploaded without its matching `assets/index-*.js` file, the browser shows a blank white page.