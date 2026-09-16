#!/usr/bin/env python3
"""Orbita managed-endpoint collector.

Run this only on laptops your company owns and has permission to inventory.
It reports installed AI apps, browser extension names, MCP configs, and
local Ollama models to your Orbita API. It does not open a remote shell.

  set ORBITA_URL=http://localhost:8000
  set ORBITA_TOKEN=your-access-jwt
  python orbita_collect.py
"""
from __future__ import annotations

import json
import os
import platform
import socket
import urllib.error
import urllib.request
from pathlib import Path

HOME = Path.home()
KNOWN_APPS = {
    "Cursor": ["Cursor", "cursor"],
    "ChatGPT": ["ChatGPT", "chatgpt"],
    "Claude": ["Claude", "claude"],
    "Ollama": ["Ollama", "ollama"],
    "LM Studio": ["LM Studio", "lm studio"],
    "GitHub Copilot": ["GitHub Copilot", "copilot"],
    "Perplexity": ["Perplexity"],
    "Grammarly": ["Grammarly"],
}


def _exists(path: Path) -> bool:
    try:
        return path.exists()
    except OSError:
        return False


def find_apps() -> list[str]:
    found = []
    system = platform.system()
    for name, needles in KNOWN_APPS.items():
        hit = False
        for needle in needles:
            if system == "Windows":
                candidates = [
                    Path(os.environ.get("LOCALAPPDATA", "")) / needle,
                    Path(os.environ.get("LOCALAPPDATA", "")) / "Programs" / needle,
                    Path(os.environ.get("PROGRAMFILES", r"C:\Program Files")) / needle,
                ]
            elif system == "Darwin":
                candidates = [Path("/Applications") / f"{needle}.app"]
            else:
                candidates = [Path("/usr/bin") / needle.lower(), HOME / ".local/bin" / needle.lower()]
            if any(_exists(c) for c in candidates):
                hit = True
                break
        if hit:
            found.append(name)
    return found


def find_extensions() -> list[str]:
    names = []
    chrome_dirs = [
        HOME / "AppData/Local/Google/Chrome/User Data/Default/Extensions",
        HOME / "AppData/Local/Microsoft/Edge/User Data/Default/Extensions",
        HOME / "Library/Application Support/Google/Chrome/Default/Extensions",
        HOME / ".config/google-chrome/Default/Extensions",
    ]
    known_ids = {
        "jgjaeacdkonaoafenlfkkkmbaopkbilf": "ChatGPT for Google",
        "fcoeoabgfenejglbffodgkkbkcdhcgfn": "Claude",
        "kbfnbcaeplbcioakkpcpgfkobkghlhen": "Grammarly",
    }
    for folder in chrome_dirs:
        if not _exists(folder):
            continue
        for child in folder.iterdir():
            if child.name in known_ids:
                names.append(known_ids[child.name])
    return names


def find_mcp() -> list[dict]:
    files = [
        HOME / ".cursor" / "mcp.json",
        HOME / "AppData/Roaming/Cursor/User/globalStorage/mcp.json",
        HOME / ".claude.json",
        HOME / "Library/Application Support/Claude/claude_desktop_config.json",
        HOME / "AppData/Roaming/Claude/claude_desktop_config.json",
    ]
    servers = []
    for path in files:
        if not _exists(path):
            continue
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            continue
        mcp = data.get("mcpServers") or data.get("servers") or {}
        if isinstance(mcp, dict):
            for name, cfg in mcp.items():
                entry = {"name": name}
                if isinstance(cfg, dict):
                    entry["command"] = cfg.get("command") or ""
                    entry["url"] = cfg.get("url") or ""
                servers.append(entry)
    return servers


def find_ollama() -> list[str]:
    try:
        req = urllib.request.Request("http://127.0.0.1:11434/api/tags", method="GET")
        with urllib.request.urlopen(req, timeout=1.5) as res:
            payload = json.loads(res.read().decode("utf-8"))
        return [m.get("name") for m in payload.get("models") or [] if m.get("name")]
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError):
        return []


def main() -> None:
    url = os.environ.get("ORBITA_URL", "http://localhost:8000").rstrip("/")
    token = os.environ.get("ORBITA_TOKEN", "")
    body = {
        "hostname": socket.gethostname(),
        "user": os.environ.get("USERNAME") or os.environ.get("USER") or "",
        "apps": find_apps(),
        "extensions": find_extensions(),
        "mcp": find_mcp(),
        "ollama": find_ollama(),
    }
    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        f"{url}/api/discovery/collector",
        data=data,
        method="POST",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=15) as res:
            print(res.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        print(exc.read().decode("utf-8", errors="replace"))
        raise SystemExit(1) from exc


if __name__ == "__main__":
    main()
