# Installation Guide: Python (Flask, Django, FastAPI)

UI Debugger Pro provides a Python package that acts as middleware. It injects the debugger UI into your HTML templates automatically.

## 🐍 PIP Installation

```bash
pip install ui-debugger-pro
```

---

## 🌶️ Flask

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

## 🎸 Django

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

## ⚡ FastAPI / Starlette

FastAPI uses ASGI, but you can use `WSGIMiddleware` if you are mounting a WSGI app, or use the CDN method (recommended for pure ASGI apps).

For pure FastAPI, we recommend using the **CDN Method** in your base template, as Python middleware for HTML injection in ASGI is complex.

See [CDN Installation](./INSTALL_VANILLA.md).
