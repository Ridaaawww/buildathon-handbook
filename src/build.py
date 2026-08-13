#!/usr/bin/env python3
"""Inline ideas.json into template.html and write index.html at the repo root.

Usage:  python3 src/build.py
"""

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "src" / "template.html"
DATA = ROOT / "src" / "ideas.json"
OUTPUT = ROOT / "index.html"

PLACEHOLDER = "/*__IDEAS_JSON__*/"


def main() -> int:
    template = TEMPLATE.read_text(encoding="utf-8")
    if PLACEHOLDER not in template:
        print(f"error: {PLACEHOLDER} not found in {TEMPLATE}", file=sys.stderr)
        return 1

    raw = DATA.read_text(encoding="utf-8")
    ideas = json.loads(raw)  # parse to fail loudly on malformed data

    OUTPUT.write_text(template.replace(PLACEHOLDER, raw), encoding="utf-8")
    print(f"wrote {OUTPUT.relative_to(ROOT)} — {len(ideas)} ideas, {OUTPUT.stat().st_size:,} bytes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
