# Which Installation Method Should I Choose?

If you are unsure which version of UI Debugger Pro to use, follow this simple flow.

## 1. Are you a Developer?

### "No, I just want to test a website."
- Use the Bookmarklet.  
- Why? It requires no installation — drag the installer button to your browser bar and click it on any website.  
- Go to: [Bookmarklet Installer](./bookmarklet_install.html)

### "Yes, I am building a web application."
- Go to Step 2.

---

## 2. How is your project built?

### "I use `npm start`, `npm run dev`, or `yarn dev`."
- Likely: React, Next.js, Vue, Svelte, or Vite.  
- Recommended: CLI / NPM  
- Command: `npx ui-debugger-pro init`  
- Why? Integrates with your dev server and hot-reloading.

### "I use Python (Flask, Django, FastAPI)."
- Likely uses Jinja2 or Django templates.  
- Recommended: Python package  
- Command: `pip install ui-debugger-pro`  
- Why? Injects the debugger via backend templates.

### "I just write `.html` files or use PHP/Ruby."
- Vanilla HTML or SSR.  
- Recommended: Script tag (CDN)  
- Action: Add the CDN `<script>` in your `<head>`  
- Read: [Vanilla / CDN Guide](./INSTALL_VANILLA.md)

### "I want to debug production sites or other people's sites."
- Recommended: Browser Extension  
- Why? Works on any URL (no code access needed).  
- Read: [Extension Guide](./INSTALL_EXTENSION.md)

---

## 3. "I don't code myself, it's for a non-web application from someone else or an AI coding agent."

If you need to send context to someone (a dev or support), you can include the README with one click:

### Download the README for sharing
- Quick download page (recommended): open this link in your browser to force-download the project README:
  - `/docs/download_readme.html` (if present in the repo / served via GitHub Pages)
  - Example raw URL (opens in browser; right-click → Save as to download):
    `https://raw.githubusercontent.com/leothefleo49/ui-debugger-pro/main/README.md`

- If the repo includes `docs/download_readme.html`, clicking that page will fetch the README and trigger an automatic download named `UI-Debugger-Pro-README.md`. This works across modern browsers.

- If the download page isn't available, use the raw URL above or ask the developer to attach README.md to an email or release asset.

---

## 4. Still Confused?

If none of this makes sense, use the Browser Extension. It is the most universal method and works everywhere.

---

## Quick tips for maintainers (add the one-click download page)
1. Add the provided `docs/download_readme.html` file to your repo (it fetches the raw README and forces a download).
2. Commit & push.
3. (Optional) Enable GitHub Pages for the repo (Settings → Pages → source = main / docs) so the download page is directly reachable at `https://<your-user>.github.io/<repo>/download_readme.html`.

This makes it trivial for non-developers to obtain a copy of your README without navigating browser bookmark managers or exporting bookmarks.

---
