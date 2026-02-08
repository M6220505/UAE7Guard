#!/usr/bin/env python3
"""
Resize screenshots to Apple App Store requirements
- iPhone 6.7": 1290x2796
- iPhone 6.5": 1284x2778
"""

from PIL import Image
import os
import glob

# Source and destination directories
source_dir = "attached_assets"
dest_dir_67 = "app-store-screenshots/iphone-6.7"
dest_dir_65 = "app-store-screenshots/iphone-6.5"

# Create directories
os.makedirs(dest_dir_67, exist_ok=True)
os.makedirs(dest_dir_65, exist_ok=True)

# Target sizes
SIZE_67 = (1290, 2796)  # iPhone 6.7"
SIZE_65 = (1284, 2778)  # iPhone 6.5"

# Select best screenshots (based on file size - usually means more content)
screenshots = glob.glob(f"{source_dir}/IMG_*_1206x2622.png")
screenshots.sort(key=lambda x: os.path.getsize(x), reverse=True)

# Take top 10 screenshots
selected = screenshots[:10]

print(f"Found {len(screenshots)} screenshots")
print(f"Selected {len(selected)} best screenshots\n")

for i, screenshot in enumerate(selected, 1):
    try:
        # Open image
        img = Image.open(screenshot)
        
        # Resize for iPhone 6.7" (1290x2796)
        img_67 = img.resize(SIZE_67, Image.Resampling.LANCZOS)
        filename_67 = f"{dest_dir_67}/{i:02d}-screenshot.png"
        img_67.save(filename_67, "PNG", optimize=True)
        print(f"✅ {filename_67}")
        
        # Resize for iPhone 6.5" (1284x2778)
        img_65 = img.resize(SIZE_65, Image.Resampling.LANCZOS)
        filename_65 = f"{dest_dir_65}/{i:02d}-screenshot.png"
        img_65.save(filename_65, "PNG", optimize=True)
        print(f"✅ {filename_65}")
        
    except Exception as e:
        print(f"❌ Error processing {screenshot}: {e}")

print(f"\n🎉 Done! Created {len(selected)} screenshots for each size")
print(f"\niPhone 6.7\" screenshots: {dest_dir_67}/")
print(f"iPhone 6.5\" screenshots: {dest_dir_65}/")
