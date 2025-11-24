import click
import os
import shutil
import subprocess
import sys
import threading
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
def start(args):
    """Start your app with UI Debugger injected (Universal Zero Config).
    
    Works from ANY directory - automatically finds your project!
    
    Usage: 
        ui-debugger start                    # Run from anywhere in your project
        ui-debugger start -- <your-command>  # Explicit command (optional)
    
    Supports: Django, Flask, FastAPI, Next.js, React, Vue, PHP, Ruby, HTML, and more!
    """
    click.echo("🚀 UI Debugger Pro - Universal Zero-Config Mode")
    click.echo("🔎 Auto-detecting project type...")
    
    # 0. Find the actual project directory
    project_dirs = ['.', 'app', 'App', 'src', 'backend', 'server', 'client', 'frontend', 'web']
    project_root = None
    
    for dir_name in project_dirs:
        if not os.path.exists(dir_name):
            continue
            
        # Check for Node.js project
        pkg_json = os.path.join(dir_name, 'package.json')
        if os.path.exists(pkg_json):
            try:
                with open(pkg_json, 'r') as f:
                    pkg = __import__('json').load(f)
                    if 'scripts' in pkg and pkg['scripts']:
                        project_root = dir_name
                        break
            except:
                pass
        
        # Check for Python project markers
        for marker in ['manage.py', 'app.py', 'main.py', 'requirements.txt', 'pyproject.toml']:
            if os.path.exists(os.path.join(dir_name, marker)):
                project_root = dir_name
                break
        
        if project_root:
            break
    
    # Switch to project directory
    if project_root and project_root != '.':
        click.echo(f"📂 Detected project in subdirectory: {project_root}")
        click.echo("🔄 Switching to project directory...")
        os.chdir(project_root)
    
    injected_file = None
    original_content = None
    server_process = None
    proxy_thread = None
    
    # Check if this is a Node.js project
    if os.path.exists('package.json'):
        click.echo("📦 Detected Node.js project - delegating to JavaScript CLI")
        click.echo("💡 Use: npx ui-debugger-pro start")
        click.echo("")
        
        # Try to run the JS CLI automatically
        try:
            import subprocess
            result = subprocess.run(['npx', 'ui-debugger-pro', 'start'], check=False)
            return
        except Exception as e:
            click.echo(f"⚠️  Please install Node.js dependencies and run: npx ui-debugger-pro start")
            return
    
    # Django Detection
    if os.path.exists('manage.py'):
        click.echo("✅ Detected Django project")
        
        # Find settings.py
        settings_file = None
        for root, dirs, files in os.walk('.'):
            if 'node_modules' in root or '.git' in root or 'venv' in root:
                continue
            if 'settings.py' in files:
                settings_file = os.path.join(root, 'settings.py')
                break
        
        if settings_file:
            with open(settings_file, 'r') as f:
                content = f.read()
            
            if 'ui_debugger_pro' not in content:
                click.echo(f"💉 Injecting into {settings_file}...")
                injected_file = settings_file
                original_content = content
                
                with open(settings_file, 'a') as f:
                    f.write("\n# UI Debugger Pro - Auto-Injected (will be removed on exit)\n")
                    f.write("MIDDLEWARE += ['ui_debugger_pro.UIDebuggerMiddleware']\n")
            else:
                click.echo("✅ UI Debugger already configured")
        
        # Auto-detect command
        if not args:
            args = ('python', 'manage.py', 'runserver')
    
    # Flask Detection
    elif os.path.exists('app.py') or any(os.path.exists(f'src/{f}') for f in ['app.py', 'main.py']):
        app_path = 'app.py' if os.path.exists('app.py') else 'src/app.py' if os.path.exists('src/app.py') else 'src/main.py'
        
        if os.path.exists(app_path):
            with open(app_path, 'r') as f:
                content = f.read()
            
            if 'Flask' in content:
                click.echo(f"✅ Detected Flask project: {app_path}")
                
                if 'ui_debugger_pro' not in content:
                    click.echo(f"💉 Injecting into {app_path}...")
                    injected_file = app_path
                    original_content = content
                    
                    import re
                    match = re.search(r'(app\s*=\s*Flask\([^)]+\))', content)
                    if match:
                        injection = "\nfrom ui_debugger_pro import UIDebuggerMiddleware\napp.wsgi_app = UIDebuggerMiddleware(app.wsgi_app)\n"
                        content = content[:match.end()] + injection + content[match.end():]
                        with open(app_path, 'w') as f:
                            f.write(content)
                    else:
                        click.echo("⚠️  Could not auto-inject. Please add middleware manually.")
                        injected_file = None
                else:
                    click.echo("✅ UI Debugger already configured")
                
                # Auto-detect command
                if not args:
                    args = ('python', app_path)
    
    # FastAPI Detection
    elif os.path.exists('main.py') or os.path.exists('src/main.py'):
        main_path = 'main.py' if os.path.exists('main.py') else 'src/main.py'
        
        with open(main_path, 'r') as f:
            content = f.read()
        
        if 'FastAPI' in content:
            click.echo(f"✅ Detected FastAPI project: {main_path}")
            
            if 'ui_debugger_pro' not in content:
                click.echo(f"💉 Injecting into {main_path}...")
                injected_file = main_path
                original_content = content
                
                import re
                match = re.search(r'(app\s*=\s*FastAPI\([^)]*\))', content)
                if match:
                    injection = "\nfrom ui_debugger_pro import ASGIDebuggerMiddleware\napp.add_middleware(ASGIDebuggerMiddleware)\n"
                    content = content[:match.end()] + injection + content[match.end():]
                    with open(main_path, 'w') as f:
                        f.write(content)
                else:
                    click.echo("⚠️  Could not auto-inject. Please add middleware manually.")
                    injected_file = None
            else:
                click.echo("✅ UI Debugger already configured")
            
            # Auto-detect command
            if not args:
                # Extract app module name
                app_module = 'main:app'
                if 'src/' in main_path:
                    app_module = 'src.main:app'
                args = ('uvicorn', app_module, '--reload')
    
    # PHP/Ruby/HTML Detection
    elif any(os.path.exists(f) for f in ['index.php', 'index.html', 'index.htm', 'public/index.html', 'public/index.php']):
        static_files = [f for f in ['index.php', 'index.html', 'index.htm', 'public/index.html', 'public/index.php'] if os.path.exists(f)]
        detected_file = static_files[0] if static_files else None
        
        if detected_file:
            if '.php' in detected_file:
                click.echo(f"✅ Detected PHP project: {detected_file}")
                project_type = 'php'
            else:
                click.echo(f"✅ Detected static HTML project: {detected_file}")
                project_type = 'html'
            
            click.echo("🌐 Starting proxy server with UI Debugger injection...")
            
            import threading
            from .proxy_server import start_proxy_server
            
            # Determine backend command
            if not args:
                if project_type == 'php':
                    args = ('php', '-S', 'localhost:8000')
                else:
                    import sys
                    args = (sys.executable, '-m', 'http.server', '8000')
            
            click.echo(f"🚀 Starting backend: {' '.join(args)}")
            server_process = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            import time
            time.sleep(2)
            
            proxy_thread = threading.Thread(target=start_proxy_server, args=(8000, 8001), daemon=True)
            proxy_thread.start()
            
            click.echo("✅ Proxy server running on http://localhost:8001")
            click.echo("⚠️  Press Ctrl+C to stop")
            
            try:
                server_process.wait()
            except KeyboardInterrupt:
                pass
            finally:
                if server_process:
                    server_process.terminate()
                    server_process.wait()
                click.echo("🧹 Cleaned up successfully")
            return
    
    # No project detected
    else:
        click.echo("❌ Could not detect project type")
        click.echo("💡 Supported: Django, Flask, FastAPI, Next.js, React, Vue, PHP, Ruby, static HTML")
        click.echo("💡 Make sure you're in the project root directory")
        
        if args:
            click.echo(f"\n▶️  Running custom command: {' '.join(args)}")
        else:
            click.echo("\n💡 Usage: ui-debugger start -- <your-command>")
            return
    
    # Run the command
    if not args:
        click.echo("❌ Could not determine run command")
        return
    
    click.echo(f"\n🚀 Running: {' '.join(args)}")
    click.echo("⚠️  Press Ctrl+C to stop and auto-cleanup")
    
    try:
        subprocess.run(args, check=True)
    except KeyboardInterrupt:
        click.echo("\n🛑 Interrupted by user")
    except Exception as e:
        click.echo(f"❌ Error: {e}")
    finally:
        # Cleanup
        if injected_file and original_content is not None:
            click.echo(f"🧹 Cleaning up {injected_file}...")
            with open(injected_file, 'w') as f:
                f.write(original_content)
            click.echo("✅ Cleanup complete")


# Keep the old 'run' command as an alias for backwards compatibility
@main.command(context_settings=dict(
    ignore_unknown_options=True,
))
@click.argument('args', nargs=-1, type=click.UNPROCESSED)
def run(args):
    """Alias for 'start' command (deprecated - use 'start' instead)."""
    click.echo("⚠️  'run' command is deprecated. Use 'ui-debugger start' instead.")
    click.echo("")
    
    # Call start command
    import sys
    sys.argv = ['ui-debugger', 'start'] + list(args)
    start(args)

if __name__ == '__main__':
    main()

