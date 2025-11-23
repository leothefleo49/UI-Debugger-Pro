import os
import json
import sys

CONFIG_FILE = ".ui-debugger.json"

DEFAULT_CONFIG = {
    "enabled": True,
    "log_dir": "ui_debug_logs",
    "max_logs": 50,
    "auto_delete_days": 7,
    "theme": "dark",
    "terminal_mode": False
}

def load_config():
    if os.path.exists(CONFIG_FILE):
        try:
            with open(CONFIG_FILE, 'r') as f:
                return {**DEFAULT_CONFIG, **json.load(f)}
        except:
            pass
    return DEFAULT_CONFIG

def save_config(config):
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)

def is_enabled():
    return load_config().get("enabled", True)

def get_log_dir():
    return load_config().get("log_dir", "ui_debug_logs")
