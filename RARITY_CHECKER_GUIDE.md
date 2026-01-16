# Rarity Checker Setup Guide

## Overview
The Rarity Checker has been successfully integrated into your PHANTOMS website. It allows users to enter an NFT ID and view:
- Rarity score (calculated from trait frequencies)
- Rarity rank (Legendary, Epic, Rare, Uncommon, Common)
- Collection rank (position by rarity)
- Percentile score
- All traits/attributes
- NFT image preview

## Files Added/Modified

### New Files:
1. **`rarity_checker.html`** - Main rarity checker page with UI and logic
2. **`test_rarity.html`** - Test page to verify metadata loading

### Modified Files:
1. **`index.html`** - Updated "Check Rarity" button to link to rarity_checker.html

### Data Files (Already in place):
- **`ptms metadata/1` through `ptms metadata/2229`** - NFT metadata files
  - Each contains: name, description, image URL, attributes
  - Attributes include: Background, Cloak, Skin, Eyes, Head, etc.

## How It Works

### Rarity Scoring Algorithm:
1. **Trait Frequency**: Count how many NFTs have each trait
2. **Trait Rarity Value**: `(Total NFTs / Trait Frequency) × 100`
3. **NFT Rarity Score**: Sum of all trait rarity values
4. **Ranking**: Sort all NFTs by score, assign rank #1 to highest

### Example:
- If "Phantom Prime" skin appears in 100 out of 2229 NFTs:
  - Rarity value = (2229 / 100) × 100 = 2,229 points

## Deployment Instructions

### Local Testing:
```bash
cd d:\phant0ms
python -m http.server 8000
# Then visit: http://localhost:8000/rarity_checker.html
```

### Testing Checklist:
- [ ] Server starts without errors
- [ ] Main page loads with buttons
- [ ] "Check Rarity" button redirects to rarity_checker.html
- [ ] Metadata loads (check browser console)
- [ ] Search for NFT #1 returns results
- [ ] Traits display correctly
- [ ] Rarity score calculation works
- [ ] Back button returns to main page

### Performance Notes:
- First load: ~3-5 seconds (loading 2229 NFT metadata files)
- Subsequent searches: ~1 second (data cached in memory)
- All processing happens client-side (no backend needed)

## GitHub/Vercel Deployment

### Before Pushing:
1. ✅ Test locally at http://localhost:8000/rarity_checker.html
2. Verify all 2229 metadata files are in `ptms metadata/` folder
3. Test metadata loading in browser DevTools Console
4. Check that images load correctly

### Push to GitHub:
```bash
cd d:\phant0ms
git add -A
git commit -m "Add rarity checker functionality"
git push origin main
```

### Deploy to Vercel:
1. Connect your GitHub repo to Vercel
2. Vercel automatically detects static files
3. Build setting: Static site (no build command needed)
4. Deploy!

## Features

### User Interface:
- **Responsive Design**: Works on mobile, tablet, desktop
- **Glassmorphism Effect**: Modern frosted glass UI
- **Gradient Animations**: Neon cyan-to-pink gradients
- **Loading States**: Spinner while data loads
- **Error Handling**: Clear messages if NFT not found

### Rarity Display:
- **5-Tier Ranking System**:
  - 🟡 **Legendary** (8000+): Ultra rare
  - 🟣 **Epic** (6000-7999): Very rare
  - 🟢 **Rare** (4000-5999): Fairly common
  - 🔵 **Uncommon** (2000-3999): Common
  - ⚪ **Common** (<2000): Very common

### Traits Display:
- Each trait shows type and value
- Hover effects on trait items
- Scrollable traits list (if many attributes)

## Customization

### Change Rarity Thresholds:
Edit in `rarity_checker.html`, function `getRarityRank()`:
```javascript
function getRarityRank(score) {
  if (score >= 8000) return "Legendary";    // Adjust these numbers
  if (score >= 6000) return "Epic";
  if (score >= 4000) return "Rare";
  if (score >= 2000) return "Uncommon";
  return "Common";
}
```

### Change Colors:
Edit Tailwind config in `rarity_checker.html`:
```javascript
colors: {
  neonCyan: "#7afcff",      // Adjust colors
  neonPink: "#ff7adf",
  neonGreen: "#3CFF8F",
  // ... etc
}
```

### Adjust Max NFT ID:
In the input field:
```html
<input id="nftInput" type="number" max="2229" />  <!-- Change this number -->
```

## Troubleshooting

### Metadata Not Loading:
1. Check browser Console (F12 → Console tab)
2. Verify `ptms metadata/` folder exists with numbered files
3. Ensure no file encoding issues (UTF-8)
4. Check Network tab to see fetch requests

### Images Not Showing:
1. Check that image URLs are correct in metadata
2. Verify images are accessible from browser
3. Check CORS headers if on different domain

### Slow Performance:
1. This is normal on first load (2229 files to process)
2. Subsequent searches will be instant (cached)
3. On production, consider pre-bundling metadata as JSON

## Next Steps

1. **Test the current implementation** at http://localhost:8000/rarity_checker.html
2. **Verify all metadata** is loading correctly
3. **Push to GitHub** once confirmed working
4. **Deploy to Vercel** for live version
5. **Share the link** with your community

---

**Status**: ✅ Ready for local testing  
**Test Page**: http://localhost:8000/test_rarity.html  
**Main Page**: http://localhost:8000/  
**Rarity Checker**: http://localhost:8000/rarity_checker.html

