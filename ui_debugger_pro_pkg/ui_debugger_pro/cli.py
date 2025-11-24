import click
import os
import shutil
import subprocess
import sys
from .config import load_config, save_config, get_log_dir

@click.group()
def main():
    """UI Debugger Pro CLI"""
    pass

@main.command()
def enable():
    """Enable the UI Debugger in your application."""
    config = load_config()
    config['enabled'] = True
    save_config(config)
    click.echo("✅ UI Debugger Pro ENABLED")

@main.command()
def disable():
    """Disable the UI Debugger (it will not be injected)."""
    config = load_config()
    config['enabled'] = False
    save_config(config)
    click.echo("❌ UI Debugger Pro DISABLED")

@main.command()
@click.option('--dir', default=None, help='Directory to save logs')
@click.option('--max-logs', default=None, type=int, help='Max number of logs to keep')
def config(dir, max_logs):
    """Configure settings."""
    conf = load_config()
    if dir:
        conf['log_dir'] = dir
    if max_logs:
        conf['max_logs'] = max_logs
    save_config(conf)
    click.echo(f"⚙️ Configuration updated: {conf}")

@main.command()
def clean():
    """Clean up old logs."""
    log_dir = get_log_dir()
    if os.path.exists(log_dir):
        shutil.rmtree(log_dir)
        os.makedirs(log_dir)
        click.echo(f"🗑️ Cleared logs in {log_dir}")
    else:
        click.echo("No logs found.")

@main.command(context_settings=dict(
    ignore_unknown_options=True,
))
@click.argument('args', nargs=-1, type=click.UNPROCESSED)
def run(args):
    """Run your app with UI Debugger injected (Zero Config).
    
    Usage: ui-debugger run -- python manage.py runserver
           ui-debugger run -- php -S localhost:8000
           ui-debugger run -- ruby -run -e httpd . -p 8000
    """
    # 1. Attempt Injection
    injected_file = None
    original_content = None
    server_process = None
    
    # Django Detection
    if os.path.exists('manage.py'):
        # Find settings.py
        for root, dirs, files in os.walk('.'):
            if 'settings.py' in files:
                settings_path = os.path.join(root, 'settings.py')
                with open(settings_path, 'r') as f:
                    content = f.read()
                
                if 'ui_debugger_pro' not in content:
                    click.echo(f"💉 Injecting into {settings_path}...")
                    injected_file = settings_path
                    original_content = content
                    
                    # Append middleware
                    with open(settings_path, 'a') as f:
                        f.write("\n# UI Debugger Injection\n")
                        f.write("MIDDLEWARE += ['ui_debugger_pro.UIDebuggerMiddleware']\n")
                    break
    
    # Flask Detection
    elif os.path.exists('app.py'):
        app_path = 'app.py'
        with open(app_path, 'r') as f:
            content = f.read()
        
        if 'ui_debugger_pro' not in content and 'Flask' in content:
            click.echo(f"💉 Injecting into {app_path}...")
            injected_file = app_path
            original_content = content
            
            # Try to inject after Flask app creation
            import re
            # Look for app = Flask(__name__)
            match = re.search(r'(app\s*=\s*Flask\([^)]+\))', content)
            if match:
                injection = "\nfrom ui_debugger_pro import UIDebuggerMiddleware\napp.wsgi_app = UIDebuggerMiddleware(app.wsgi_app)\n"
                content = content[:match.end()] + injection + content[match.end():]
                with open(app_path, 'w') as f:
                    f.write(content)
            else:
                click.echo("⚠️  Could not find Flask app initialization. Please add middleware manually.")
                injected_file = None
    
    # FastAPI Detection
    elif os.path.exists('main.py'):
        main_path = 'main.py'
        with open(main_path, 'r') as f:
            content = f.read()
        
        if 'ui_debugger_pro' not in content and 'FastAPI' in content:
            click.echo(f"💉 Injecting into {main_path}...")
            injected_file = main_path
            original_content = content
            
            # Inject ASGI middleware
            import re
            match = re.search(r'(app\s*=\s*FastAPI\([^)]*\))', content)
            if match:
                injection = "\nfrom ui_debugger_pro import ASGIDebuggerMiddleware\napp.add_middleware(ASGIDebuggerMiddleware)\n"
                content = content[:match.end()] + injection + content[match.end():]
                with open(main_path, 'w') as f:
                    f.write(content)
            else:
                click.echo("⚠️  Could not find FastAPI app initialization. Please add middleware manually.")
                injected_file = None
    
    # PHP/Ruby/HTML Detection - Start proxy server
    elif any(os.path.exists(f) for f in ['index.php', 'index.html', 'index.htm']):
        click.echo("🌐 Detected static/PHP site. Starting proxy server with UI Debugger...")
        
        # Start the proxy server in the background
        import threading
        from .proxy_server import start_proxy_server
        
        # Determine the command
        if not args:
            if os.path.exists('index.php'):
                args = ('php', '-S', 'localhost:8000')
            else:
                # For static HTML, use Python's built-in server
                import sys
                args = (sys.executable, '-m', 'http.server', '8000')
        
        # Start backend server in background
        click.echo(f"🚀 Starting backend: {' '.join(args)}")
        server_process = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Give it a moment to start
        import time
        time.sleep(2)
        
        # Start proxy on port 8001
        proxy_thread = threading.Thread(target=start_proxy_server, args=(8000, 8001), daemon=True)
        proxy_thread.start()
        
        click.echo("✅ Proxy server running on http://localhost:8001 with UI Debugger injected!")
        click.echo("⚠️  Press Ctrl+C to stop")
        
        try:
            # Keep running until interrupted
            server_process.wait()
        except KeyboardInterrupt:
            pass
        finally:
            if server_process:
                server_process.terminate()
                server_process.wait()

    # 2. Run Command
    if not args:
        if os.path.exists('manage.py'):
            args = ('python', 'manage.py', 'runserver')
        elif os.path.exists('app.py'):
            args = ('python', 'app.py')
        elif os.path.exists('main.py'):
            args = ('uvicorn', 'main:app', '--reload')
        else:
            click.echo("❌ No command provided and could not detect app.")
            return

    click.echo(f"🚀 Running: {' '.join(args)}")
    try:
        subprocess.run(args, check=True)
    except KeyboardInterrupt:
        pass
    except Exception as e:
        click.echo(f"❌ Error: {e}")
    finally:
        # 3. Cleanup
        if injected_file and original_content is not None:
            click.echo(f"🧹 Cleaning up {injected_file}...")
            with open(injected_file, 'w') as f:
                f.write(original_content)

if __name__ == '__main__':
    main()

