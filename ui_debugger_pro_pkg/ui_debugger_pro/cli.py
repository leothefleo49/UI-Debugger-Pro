import click
import os
import shutil
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

if __name__ == '__main__':
    main()
