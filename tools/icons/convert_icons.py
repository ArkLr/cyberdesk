"""Turn the Windows .ico files in src/assets/Icons into the 128 px PNGs the computer uses.

    python3 tools/icons/convert_icons.py

Needs Pillow (pip install pillow). Each .ico holds several sizes; the largest is used.
"""
from pathlib import Path
from PIL import Image

SRC = Path("src/assets/Icons")
OUT = Path("src/assets/os-icons")
SIZE = 128

# output name -> source .ico
ICONS = {
    "mail": "Mail",
    "browser": "Web",
    "explorer": "File Explorer 2",
    "bin-empty": "imageres_55",
    "bin-full": "imageres_54",
    "settings": "Settings",
    "photos": "imageres_122",
    "weather": "MSN Weather",
    "clock": "Alarms & Clock 2",
    "security": "ICON1028_1",
    "folder": "Windows Explorer",
    "folder-documents": "08",
    "folder-downloads": "10",
    "folder-music": "27",
    "folder-pictures": "31",
    "folder-videos": "26",
    "folder-zip": "04",
}

OUT.mkdir(parents=True, exist_ok=True)
for name, src in ICONS.items():
    im = Image.open(SRC / f"{src}.ico")
    im.size = max(im.info.get("sizes", [im.size]))  # pick the largest frame
    im.load()
    im.convert("RGBA").resize((SIZE, SIZE), Image.LANCZOS).save(OUT / f"{name}.png", optimize=True)
    print(f"{src}.ico -> {name}.png")
