# App Store Screenshot Sizes - Quick Reference

## iPhone Sizes (Required)

| Device Size | Resolution (Portrait) | Resolution (Landscape) | Example Devices |
|------------|----------------------|------------------------|----------------|
| 6.9" | 1290×2796px | 2796×1290px | iPhone 16 Pro Max |
| 6.7" | 1290×2796px | 2796×1290px | iPhone 15 Plus, 14 Plus |
| 6.5" | 1242×2688px | 2688×1242px | iPhone XS Max, 11 Pro Max |
| 6.3" | 1290×2796px | 2796×1290px | iPhone 16 Pro, 15 Pro, 14 Pro |
| 6.1" | 1170×2532px | 2532×1170px | iPhone 14, 13, 12, 11, XR |
| 5.5" | 1242×2208px | 2208×1242px | iPhone 8 Plus, 7 Plus, 6s Plus |
| 5.8" | 1125×2436px | 2436×1125px | iPhone X, XS, 11 Pro |
| 4.7" | 750×1334px | 1334×750px | iPhone SE (2nd/3rd), 8, 7 |
| 4.0" | 640×1136px | 1136×640px | iPhone SE (1st gen), 5s |

## iPad Sizes (Optional)

| Device Size | Resolution (Portrait) | Resolution (Landscape) | Example Devices |
|------------|----------------------|------------------------|----------------|
| 12.9" Pro (3rd gen+) | 2048×2732px | 2732×2048px | iPad Pro 12.9" |
| 11" Pro | 1668×2388px | 2388×1668px | iPad Pro 11" |
| 10.5" Pro | 1668×2224px | 2224×1668px | iPad Pro 10.5", Air 3 |
| 9.7" | 1536×2048px | 2048×1536px | iPad 9.7", Air 2 |

## Important Notes

### Minimum Requirements
- **At least 3 screenshots** are required for iOS apps
- The **first 3 screenshots** will be shown on the App Store listing page
- You can upload **up to 10 screenshots** per device size
- Screenshots must be **JPG or PNG** format
- File size: **Maximum 500 MB** per screenshot

### Best Practices
1. **Upload the highest resolution first** - Apple scales down automatically
2. **Portrait orientation is preferred** - Most users browse App Store in portrait
3. **Show actual app content** - No fake UI or mockups
4. **No transparency** - Screenshots must have solid backgrounds
5. **Use localized screenshots** - Different screenshots for different languages

### Required Simulators for Xcode

To cover all major sizes, use these simulators:

```bash
# Primary (must have)
- iPhone 16 Pro Max (6.9")
- iPhone 15 Pro (6.3")
- iPhone 14 (6.1")

# Secondary (recommended)
- iPhone 8 Plus (5.5")
- iPhone SE (3rd generation) (4.7")

# iPad (if supporting iPad)
- iPad Pro 12.9" (12.9")
- iPad Pro 11" (11")
```

## Quick ImageMagick Resize Commands

If you have one high-resolution screenshot and need to resize:

```bash
# From iPhone 16 Pro Max to other sizes
convert screenshot.png -resize 1290x2796 iphone-6.9.png
convert screenshot.png -resize 1242x2688 iphone-6.5.png
convert screenshot.png -resize 1170x2532 iphone-6.1.png
convert screenshot.png -resize 1242x2208 iphone-5.5.png
convert screenshot.png -resize 750x1334 iphone-4.7.png
convert screenshot.png -resize 640x1136 iphone-4.0.png
```

## Online Tools for Resizing

- **App Screenshot** - https://www.appstorescreenshot.com/
- **Previewed** - https://previewed.app/
- **Screenshot Builder** - https://www.screenshotbuilder.com/
- **LaunchKit** - https://launchkit.io/ (deprecated but screenshots still work)

## For UAE7Guard Specifically

Based on the App Store Connect screenshots you shared, you need to upload for:

✅ **Required:**
1. iPhone 6.9" Display
2. iPhone 6.5" Display
3. iPhone 6.3" Display
4. iPhone 6.1" Display

⚠️ **Recommended:**
5. iPhone 5.5" Display
6. iPhone 4.7" Display

📱 **Optional (older devices):**
7. iPhone 4.0" Display
8. iPhone 3.5" Display

## Fastest Method

1. Build app in Xcode
2. Run on **iPhone 16 Pro Max simulator** (largest)
3. Take screenshots with `Cmd+S`
4. Upload to https://www.appstorescreenshot.com/
5. Download all sizes
6. Upload to App Store Connect

**Time estimate:** 30 minutes for 5 screenshots across all sizes

---

**Need help? See the full guide:** `docs/APP_STORE_SCREENSHOTS_GUIDE.md`
