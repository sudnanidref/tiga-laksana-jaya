#!/usr/bin/env python3
"""Migrate only routes declared in sitemap.xml into Astro page data."""
from __future__ import annotations

import html
import json
import re
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
OUT = ROOT / "src/data/routes.json"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
ASTRO_NATIVE_ROUTES = {"/our-clients/"}


def attr(source: str, pattern: str, default: str = "") -> str:
    match = re.search(pattern, source, re.I | re.S)
    return html.unescape(match.group(1).strip()) if match else default


def source_for(route: str) -> Path:
    return ROOT / ("index.html" if route == "/" else f"{route.strip('/')}/index.html")


def extract(route: str) -> dict:
    file = source_for(route)
    source = file.read_text(encoding="utf-8")
    main_match = re.search(r"<main[^>]*>(.*?)</main>", source, re.I | re.S)
    if not main_match:
        raise RuntimeError(f"Missing <main> in {file}")
    schemas = []
    for payload in re.findall(r'<script\s+type="application/ld\+json">(.*?)</script>', source, re.I | re.S):
        schemas.append(json.loads(payload))
    title = attr(source, r"<title>(.*?)</title>")
    description = attr(source, r'<meta\s+name="description"\s+content="([^"]*)"')
    canonical = attr(source, r'<link\s+rel="canonical"\s+href="([^"]*)"')
    og_title = attr(source, r'<meta\s+property="og:title"\s+content="([^"]*)"', title)
    og_description = attr(source, r'<meta\s+property="og:description"\s+content="([^"]*)"', description)
    og_image = attr(source, r'<meta\s+property="og:image"\s+content="([^"]*)"', "https://tigalaksanajaya.com/assets/company-cover-e7e7380822.webp")
    return {
        "path": route,
        "title": title,
        "description": description,
        "canonical": canonical,
        "ogTitle": og_title,
        "ogDescription": og_description,
        "ogImage": og_image,
        "active": "home" if route == "/" else route.strip("/").split("/")[0],
        "mainHtml": main_match.group(1).strip(),
        "schemas": schemas,
    }


def main() -> None:
    tree = ET.parse(SITEMAP)
    routes = []
    for loc in tree.findall("sm:url/sm:loc", NS):
        route = urlparse(loc.text or "").path or "/"
        if not route.endswith("/"):
            route += "/"
        if route in ASTRO_NATIVE_ROUTES:
            continue
        routes.append(route)
    if len(routes) != len(set(routes)):
        raise RuntimeError("Duplicate routes in sitemap.xml")
    pages = [extract(route) for route in routes]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Migrated {len(pages)} sitemap routes to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
