"""Risk scoring: data sensitivity x permission breadth x ownership status.

Mirrors the concept doc's formula. Used when an agent is registered without
an explicit score, and re-run when scopes or ownership change.
"""
from typing import List

# Scopes that reach sensitive data classes
SENSITIVE_SCOPES = {
    "gmail": 18,
    "sheets": 12,
    "google sheets": 12,
    "drive": 12,
    "crm": 18,
    "hubspot": 15,
    "postgres": 20,
    "zoho payroll": 25,
    "payroll": 25,
    "tally": 18,
    "zendesk": 12,
    "clearbit": 10,
    "slack": 8,
    "notion": 8,
    "github": 10,
}

PLATFORM_BASE = {
    "zapier": 20,
    "make": 20,
    "n8n": 18,
    "custom gpt": 22,
    "claude": 15,
    "mcp": 25,
    "github app": 12,
    "other": 18,
}


def score_agent(platform: str, scopes: List[str], owner_name: str, status: str) -> int:
    score = PLATFORM_BASE.get(platform.lower(), PLATFORM_BASE["other"])

    # Data sensitivity + permission breadth
    for scope in scopes:
        score += SENSITIVE_SCOPES.get(scope.lower(), 6)

    # Ownership status is the biggest single factor
    orphaned = owner_name.strip().lower() in ("", "unassigned") or status == "orphaned"
    if orphaned:
        score += 30

    return max(0, min(100, score))
