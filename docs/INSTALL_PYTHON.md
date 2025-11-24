# Installation Guide: Python (Flask, Django, FastAPI)

UI Debugger Pro provides a Python package that acts as middleware. It injects the debugger UI into your HTML templates automatically.

## 🐍 PIP Installation

```bash
pip install ui-debugger-pro
```

---

## ⚡ Zero-Config Setup (Recommended)

The fastest way to run your Python app with the debugger:

```bash
# Install the package
pip install ui-debugger-pro

# Run your app with the debugger (auto-cleans up on exit)
ui-debugger run -- python manage.py runserver
# or for Flask:
ui-debugger run -- python app.py
```

This command will:
1. Temporarily inject the middleware into your Django settings or Flask app
2. Run your development server
3. Auto-remove the middleware code when you stop the server (Ctrl+C)

**No code changes needed!** Perfect for quick debugging sessions.

---

## 🌶️ Flask (Manual Setup)

In your main application file (e.g., `app.py`):

```python
from flask import Flask
from ui_debugger_pro import UIDebuggerMiddleware

app = Flask(__name__)

# Wrap the WSGI app
# This intercepts HTML responses and injects the debugger script
app.wsgi_app = UIDebuggerMiddleware(app.wsgi_app)

if __name__ == '__main__':
    app.run(debug=True)
```

## 🎸 Django (Manual Setup)

### Option 1: Middleware (Recommended)

In your `settings.py`:

```python
MIDDLEWARE = [
    # Your other middleware...
    'ui_debugger_pro.UIDebuggerMiddleware',
]
```

### Option 2: WSGI Wrapper

In your `project/wsgi.py` file:

```python
import os
from django.core.wsgi import get_wsgi_application
from ui_debugger_pro import UIDebuggerMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')

application = get_wsgi_application()

# Wrap the application
application = UIDebuggerMiddleware(application)
```

## ⚡ FastAPI / Starlette (ASGI)

### Zero-Config Method

```bash
ui-debugger run -- uvicorn main:app --reload
```

### Manual Setup

FastAPI uses ASGI, so we provide a specialized middleware:

```python
from fastapi import FastAPI
from ui_debugger_pro import ASGIDebuggerMiddleware

app = FastAPI()

# Add the ASGI middleware
app.add_middleware(ASGIDebuggerMiddleware)

@app.get("/")
async def root():
    return {"message": "Hello World"}
```

**Alternative:** For pure FastAPI without backend injection, you can use the **CDN Method** in your HTML templates.

See [CDN Installation](./INSTALL_VANILLA.md).

---

## 🗑️ Removing the Debugger

### If using `ui-debugger run`:
Just press **Ctrl+C** to stop the server - it auto-cleans up!

### If installed manually:
Simply remove the middleware import and configuration from your code.
