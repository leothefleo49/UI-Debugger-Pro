"""
Proxy server that injects UI Debugger into HTML responses.
Used for PHP, Ruby, and static HTML sites.
"""
import http.server
import socketserver
import urllib.request
import urllib.error
import re


class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    """HTTP proxy that injects the debugger script."""
    
    backend_port = 8000
    
    def do_GET(self):
        self._proxy_request('GET')
    
    def do_POST(self):
        self._proxy_request('POST')
    
    def _proxy_request(self, method):
        # Build the backend URL
        backend_url = f"http://localhost:{self.backend_port}{self.path}"
        
        try:
            # Forward the request to the backend
            if method == 'POST':
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length) if content_length > 0 else None
                req = urllib.request.Request(backend_url, data=post_data, method='POST')
            else:
                req = urllib.request.Request(backend_url, method='GET')
            
            # Copy headers
            for key, value in self.headers.items():
                if key.lower() not in ['host', 'connection']:
                    req.add_header(key, value)
            
            # Get response from backend
            with urllib.request.urlopen(req, timeout=30) as response:
                content = response.read()
                content_type = response.headers.get('Content-Type', '')
                
                # Inject debugger if HTML
                if 'text/html' in content_type:
                    try:
                        html = content.decode('utf-8')
                        # Inject our script
                        script_tag = '''
<script>
(function() {
    // Load UI Debugger from CDN or local
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/ui-debugger-pro@latest/dist/index.global.js';
    script.onload = function() {
        if (window.UIDebuggerPro && window.UIDebuggerPro.UIDebugger) {
            const container = document.createElement('div');
            container.id = '__ui_debugger_pro__';
            document.body.appendChild(container);
            
            // Initialize with React if available, otherwise use vanilla
            if (window.React && window.ReactDOM) {
                const root = ReactDOM.createRoot(container);
                root.render(React.createElement(window.UIDebuggerPro.UIDebugger));
            }
        }
    };
    document.head.appendChild(script);
})();
</script>
'''
                        if '</body>' in html:
                            html = html.replace('</body>', script_tag + '</body>')
                        elif '</html>' in html:
                            html = html.replace('</html>', script_tag + '</html>')
                        else:
                            html += script_tag
                        
                        content = html.encode('utf-8')
                    except:
                        pass  # If decoding fails, send original
                
                # Send response
                self.send_response(response.status)
                for key, value in response.headers.items():
                    if key.lower() not in ['content-length', 'transfer-encoding']:
                        self.send_header(key, value)
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                
        except urllib.error.URLError as e:
            self.send_error(502, f"Bad Gateway: {str(e)}")
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {str(e)}")


def start_proxy_server(backend_port=8000, proxy_port=8001):
    """Start the proxy server."""
    ProxyHandler.backend_port = backend_port
    
    with socketserver.TCPServer(("", proxy_port), ProxyHandler) as httpd:
        print(f"Proxy server running on port {proxy_port}, forwarding to {backend_port}")
        httpd.serve_forever()
