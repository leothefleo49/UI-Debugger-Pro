"""
ASGI Middleware for FastAPI and other ASGI apps.
"""
import json
import os
from .config import is_enabled


class ASGIDebuggerMiddleware:
    """ASGI middleware that injects the UI Debugger into HTML responses."""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http' or not is_enabled():
            await self.app(scope, receive, send)
            return
        
        # Buffer the response
        response_started = False
        status_code = None
        headers = []
        body_parts = []
        
        async def wrapped_send(message):
            nonlocal response_started, status_code, headers, body_parts
            
            if message['type'] == 'http.response.start':
                response_started = True
                status_code = message['status']
                headers = list(message.get('headers', []))
            
            elif message['type'] == 'http.response.body':
                body_parts.append(message.get('body', b''))
                
                # If this is the last chunk, process and inject
                if not message.get('more_body', False):
                    # Check if HTML
                    is_html = False
                    for name, value in headers:
                        if name.lower() == b'content-type' and b'text/html' in value.lower():
                            is_html = True
                            break
                    
                    if is_html:
                        # Combine body parts
                        body = b''.join(body_parts)
                        try:
                            html = body.decode('utf-8')
                            injected = inject_debugger_html(html)
                            body = injected.encode('utf-8')
                            
                            # Update content-length
                            headers = [(k, v) for k, v in headers if k.lower() != b'content-length']
                            headers.append((b'content-length', str(len(body)).encode()))
                        except:
                            pass  # Decoding failed, send original
                        
                        # Send the modified response
                        await send({
                            'type': 'http.response.start',
                            'status': status_code,
                            'headers': headers,
                        })
                        await send({
                            'type': 'http.response.body',
                            'body': body,
                        })
                    else:
                        # Not HTML, send as-is
                        await send({
                            'type': 'http.response.start',
                            'status': status_code,
                            'headers': headers,
                        })
                        await send({
                            'type': 'http.response.body',
                            'body': b''.join(body_parts),
                        })
                else:
                    # More body coming, keep buffering
                    pass
            else:
                await send(message)
        
        await self.app(scope, receive, wrapped_send)


def inject_debugger_html(html_content):
    """Inject the debugger script into HTML."""
    script = '''
<script>
(function() {
    // Load UI Debugger from CDN
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/ui-debugger-pro@latest/dist/index.global.js';
    script.onload = function() {
        if (window.UIDebuggerPro && window.UIDebuggerPro.UIDebugger) {
            const container = document.createElement('div');
            container.id = '__ui_debugger_pro__';
            document.body.appendChild(container);
            
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
    if '</body>' in html_content:
        return html_content.replace('</body>', script + '</body>')
    elif '</html>' in html_content:
        return html_content.replace('</html>', script + '</html>')
    return html_content + script
