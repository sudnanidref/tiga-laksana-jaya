#!/usr/bin/env python3
"""Build responsive WebP thumbnails for project-card images."""
from pathlib import Path
import json
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/projects-2026"
OUTPUT = SOURCE / "cards"
MANIFEST = ROOT / "src/data/project-images.json"
WIDTHS = (480, 960)
QUALITY = {480: 72, 960: 76}

OUTPUT.mkdir(parents=True, exist_ok=True)
manifest = {}
for source in sorted(SOURCE.glob("*.webp")):
    with Image.open(source) as raw:
        image = ImageOps.exif_transpose(raw).convert("RGB")
        original_width, original_height = image.size
        variants = {}
        for requested_width in WIDTHS:
            width = min(requested_width, original_width)
            height = round(original_height * width / original_width)
            target = OUTPUT / f"{source.stem}-{requested_width}.webp"
            resized = image if width == original_width else image.resize((width, height), Image.Resampling.LANCZOS)
            resized.save(target, "WEBP", quality=QUALITY[requested_width], method=6)
            variants[str(requested_width)] = {
                "src": f"/assets/projects-2026/cards/{target.name}",
                "width": width,
                "height": height,
                "bytes": target.stat().st_size,
            }
        manifest[source.name] = {
            "original": {"width": original_width, "height": original_height, "bytes": source.stat().st_size},
            "variants": variants,
        }
MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(f"Built {len(manifest) * len(WIDTHS)} responsive project thumbnails for {len(manifest)} images.")
