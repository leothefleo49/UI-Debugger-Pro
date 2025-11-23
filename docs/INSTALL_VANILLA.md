# Installation Guide: Vanilla JS, HTML, PHP, Ruby, & Bookmarklet

UI Debugger Pro can be used on **any** website, even if you don't use React or Python.

---

## 🌐 CDN (Script Tag)

Simply add this code to the bottom of your `<body>` tag. It works in WordPress, PHP, Ruby on Rails, static HTML, etc.

```html
<!-- 1. Load React Dependencies (Required) -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- 2. Load UI Debugger Pro -->
<script src="https://unpkg.com/ui-debugger-pro/dist/index.global.js"></script>

<!-- 3. Initialize -->
<script>
  // Check if we are in a dev environment or if a specific flag is set
  if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
    window.mountUIDebugger();
  }
</script>
```

---

## 🔖 Bookmarklet (No Install Required!)

Want to debug a site without changing the code? Create a bookmark in your browser with the following URL (JavaScript code):

**Copy this code and paste it into a new Bookmark's URL field:**

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://unpkg.com/ui-debugger-pro/dist/index.global.js';s.onload=function(){var r=document.createElement('script');r.src='https://unpkg.com/react@18/umd/react.production.min.js';r.onload=function(){var d=document.createElement('script');d.src='https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';d.onload=function(){window.mountUIDebugger()};document.body.appendChild(d)};document.body.appendChild(r)};document.body.appendChild(s)})();
```

**How to use:**
1. Create a new bookmark named "Debug UI".
2. Paste the code above as the URL.
3. Go to ANY website.
4. Click the bookmark.
5. The Debugger will appear!
