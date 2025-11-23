# Which Installation Method Should I Choose?

If you are unsure which version of UI Debugger Pro to use, follow this simple flowchart.

## 1. Are you a Developer?

### "No, I just want to test a website."
*   **Use the Bookmarklet**.
*   **Why?** It requires no installation. You just drag a button to your browser bar and click it on any website.
*   [**Go to Bookmarklet Installer**](./bookmarklet_install.html)

### "Yes, I am building a web application."
*   **Go to Step 2.**

---

## 2. How is your project built?

### "I use `npm start`, `npm run dev`, or `yarn dev`."
*   You are likely using **React, Next.js, Vue, Svelte, or Vite**.
*   **Recommended Method**: **CLI / NPM**
*   **Command**: `npx ui-debugger-pro init`
*   **Why?** It integrates deeply with your development server and hot-reloading.

### "I use Python (Flask, Django, FastAPI)."
*   You are likely using **Jinja2 or Django Templates**.
*   **Recommended Method**: **Python Package**
*   **Command**: `pip install ui-debugger-pro`
*   **Why?** It allows you to inject the debugger via your backend templates.

### "I just write `.html` files or use PHP/Ruby."
*   You are using **Vanilla HTML or Server-Side Rendering**.
*   **Recommended Method**: **Script Tag**
*   **Action**: Add the CDN link to your `<head>` tag.
*   [**Read Guide**](./INSTALL_VANILLA.md)

### "I want to debug *production* sites or other people's sites."
*   **Recommended Method**: **Browser Extension**
*   **Why?** It works on *any* URL (Google, Facebook, your localhost, etc.) without needing access to the code.
*   [**Read Guide**](./INSTALL_EXTENSION.md)

---

## 3. Still Confused?

If none of this makes sense, **use the Browser Extension**. It is the most universal method and works everywhere.
