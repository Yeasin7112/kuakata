# Professional Hosting & Domain Setup Guide

Follow these steps to host **OurKuakata Pro** on your own domain using cPanel.

## 1. Domain & Hosting Requirements
- **Hosting**: Any standard cPanel hosting (Shared or VPS).
- **PHP Version**: 7.4, 8.0, 8.1, or 8.2.
- **Extensions**: Ensure `pdo_sqlite` is enabled in your PHP Selector (usually enabled by default).

## 2. Prepare the Files (Local)
1. Open your project terminal and run:
   ```bash
   npm run build
   ```
2. A folder named `dist` will be created in your root directory.
3. Locate the `api.php` file in your root folder.
4. Copy `api.php` into the `dist` folder so it sits alongside `index.html`.

## 3. Uploading to cPanel
1. Login to your **cPanel**.
2. Open **File Manager** and go to `public_html` (or your sub-domain folder).
3. **Upload** all contents of the local `dist` folder.
4. Your `public_html` directory should look like this:
   - `assets/` (folder)
   - `index.html`
   - `api.php`
   - `index.tsx` (optional if bundled)
   - `metadata.json`

## 4. Permission Settings
1. In cPanel File Manager, ensure the `public_html` folder permissions are `755`.
2. When you visit your domain for the first time, `api.php` will automatically create `database.sqlite`. 
3. Ensure the `public_html` directory is writable so the database file can be created.

## 5. Security Checklist
1. Create a `.htaccess` file in `public_html` (if not exists).
2. Add the following to prevent people from downloading your database file:
   ```apache
   <Files "database.sqlite">
     Order allow,deny
     Deny from all
   </Files>
   ```

## 6. Accessing Admin
1. Open your domain (e.g., `www.yourkuakata.com`).
2. Go to the **Profile** tab.
3. Click **Quick Admin Login**.
4. You will now see the **Admin Dashboard**.
5. Any change you make here is saved directly to your server's SQLite database.

## 7. Troubleshooting "Fallback Data"
- If you see "Using fallback data" while on your domain, it means the app can't reach `api.php`. 
- Check if your PHP version is active.
- Ensure the URL in `App.tsx` fetch call matches your file structure. Default is `api.php` (relative).
