"""Canonical AI Asset types. Every later connector writes this shape onto Agent."""

ASSET_TYPES = (
    "AI_APP",
    "AI_AGENT",
    "MCP_SERVER",
    "LOCAL_MODEL",
    "BROWSER_EXTENSION",
    "IDE_EXTENSION",
    "AI_API",
    "OAUTH_APP",
)

_VENDORS = {
    "chatgpt": "OpenAI",
    "custom gpt": "OpenAI",
    "claude": "Anthropic",
    "gemini": "Google",
    "perplexity": "Perplexity",
    "grok": "xAI",
    "cursor": "Anysphere",
    "lovable": "Lovable",
    "replit": "Replit",
    "v0": "Vercel",
    "copilot": "GitHub",
    "cline": "Cline",
    "continue": "Continue",
    "grammarly": "Grammarly",
    "mcp": "MCP",
}

_APPS = {
    "chatgpt",
    "claude",
    "gemini",
    "perplexity",
    "cursor",
    "lovable",
    "replit",
    "v0",
    "grok",
    "custom gpt",
}


def infer_asset_type(platform: str) -> str:
    p = (platform or "").lower()
    if "mcp" in p:
        return "MCP_SERVER"
    if "ollama" in p or "lm studio" in p or p.endswith(" local"):
        return "LOCAL_MODEL"
    if "copilot" in p or p in {"cline", "continue"} or "ide" in p:
        return "IDE_EXTENSION"
    if "extension" in p or p == "grammarly":
        return "BROWSER_EXTENSION"
    if "oauth" in p:
        return "OAUTH_APP"
    if p in _APPS:
        return "AI_APP"
    if p.endswith(" api") or p.endswith("_api"):
        return "AI_API"
    return "AI_AGENT"


def infer_vendor(platform: str) -> str:
    return _VENDORS.get((platform or "").lower(), platform or "Unknown")


if __name__ == "__main__":
    assert infer_asset_type("ChatGPT") == "AI_APP"
    assert infer_asset_type("Postgres MCP") == "MCP_SERVER"
    assert infer_asset_type("Zapier") == "AI_AGENT"
    assert infer_asset_type("Copilot") == "IDE_EXTENSION"
    assert len(ASSET_TYPES) == 8
    print("asset types ok")
