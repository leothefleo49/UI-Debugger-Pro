import os
import json
import time
from werkzeug.wrappers import Request, Response
from .config import is_enabled, get_log_dir, load_config

class UIDebuggerMiddleware:
    def __init__(self, app):
        self.app = app
        self.static_dir = os.path.join(os.path.dirname(__file__), 'static')

    def __call__(self, environ, start_response):
        request = Request(environ)

        if request.path == '/ui-debugger-pro/loader.js':
            return self.serve_file('loader.js', 'application/javascript', start_response)
        
        if request.path == '/ui-debugger-pro/debugger.tsx':
            return self.serve_file('debugger.tsx', 'text/plain', start_response)

        if request.path == '/ui-debugger-pro/logs' and request.method == 'POST':
            return self.handle_logs(request, start_response)

        if not is_enabled() or request.args.get('ui_debugger_ignore') == 'true':
            return self.app(environ, start_response)

        # Buffer for interception
        response_info = {'status': None, 'headers': None, 'exc_info': None}
        
        def save_response_info(status, headers, exc_info=None):
            response_info['status'] = status
            response_info['headers'] = headers
            response_info['exc_info'] = exc_info
            # Don't call start_response yet

        app_iter = self.app(environ, save_response_info)
        
        content = b''
        # Iterate to get content (this triggers the app to run and call save_response_info)
        try:
            content = b''.join(app_iter)
        except Exception:
            # If app fails, we might need to handle it, but usually we just let it bubble
            pass

        # Now we have headers and content
        if response_info['status'] is None:
             # App didn't call start_response?
             return [content]

        is_html = False
        headers = response_info['headers']
        if headers:
            for name, value in headers:
                if name.lower() == 'content-type' and 'text/html' in value.lower():
                    is_html = True
                    break
        
        if is_html:
            try:
                html = content.decode('utf-8')
                injected_html = inject_debugger(html)
                content = injected_html.encode('utf-8')
                
                # Update Content-Length
                headers = [(k, v) for k, v in headers if k.lower() != 'content-length']
                headers.append(('Content-Length', str(len(content))))
            except:
                pass # Decode failed, send original

        start_response(response_info['status'], headers, response_info['exc_info'])
        return [content]

    def serve_file(self, filename, content_type, start_response):
        path = os.path.join(self.static_dir, filename)
        if os.path.exists(path):
            with open(path, 'rb') as f:
                data = f.read()
            start_response('200 OK', [('Content-Type', content_type), ('Content-Length', str(len(data)))])
            return [data]
        
        start_response('404 Not Found', [])
        return [b'']

    def handle_logs(self, request, start_response):
        try:
            data = json.loads(request.data)
            log_dir = get_log_dir()
            if not os.path.exists(log_dir):
                os.makedirs(log_dir)
            
            filename = f"ui-debug-log-{int(time.time())}.json"
            filepath = os.path.join(log_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
            
            # Cleanup old logs
            config = load_config()
            max_logs = config.get('max_logs', 50)
            files = sorted([os.path.join(log_dir, f) for f in os.listdir(log_dir) if f.endswith('.json')])
            while len(files) > max_logs:
                os.remove(files.pop(0))

            start_response('200 OK', [('Content-Type', 'application/json')])
            return [b'{"status": "saved"}']
        except Exception as e:
            start_response('500 Internal Server Error', [])
            return [str(e).encode()]

def inject_debugger(html_content):
    """Helper to inject the script tag into HTML string."""
    script = '<script src="/ui-debugger-pro/loader.js"></script>'
    if '</body>' in html_content:
        return html_content.replace('</body>', f'{script}</body>')
    return html_content + script
