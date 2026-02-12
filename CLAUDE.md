# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YF Studio company website - a static GitHub Pages site deployed to `yfstudio.co.uk`. Portfolio for an AI/Computer Vision/Embedded Systems consultancy based in York, UK.

## Development Commands

**No build tools** - Pure static site with no npm, package.json, or build scripts.

- Edit HTML/CSS/JS files directly
- Push to `main` branch for automatic GitHub Pages deployment
- Test locally by opening `index.html` in a browser

Python SVG utilities (output to `.txt` files — manually paste SVG into HTML):
```bash
python utils/generate_svg.py      # → utils/new_svg.txt
python utils/generate_cnn_svg.py  # → utils/cnn_svg.txt
```

## Technical Domain Context

This is a professional AI/Embedded systems studio site. Technical accuracy is critical for credibility.

**Service domains** (maintain consistent terminology):
- Neural Network Optimization - model quantization, pruning, INT8/FP16 precision
- Computer Vision - object detection (YOLO), facial recognition (FaceNet), tracking (DeepSORT)
- Edge AI Deployment - Jetson, Raspberry Pi, ARM SoC, TensorFlow Lite, OpenVINO, ONNX
- Sensor Fusion - LiDAR, camera, IMU integration
- AMR Navigation - SLAM, path planning, obstacle avoidance
- Multi-Robot Systems - fleet coordination, task allocation

**Hardware platforms mentioned**: NVIDIA Jetson Nano/Xavier, Raspberry Pi 4, custom ARM SoC, ROS/ROS2

**AI frameworks**: TensorFlow Lite, OpenVINO, ONNX Runtime, TensorRT, PyTorch

## Case Study Structure

All case studies in `case-studies/` follow this format:

1. **Hero** - Title, one-line description, key metrics (accuracy %, latency ms)
2. **Project Overview** - Brief description + Tech Stack grid (Hardware, AI Framework, Computer Vision, Deployment)
3. **The Challenge** - Client problem + bullet list of requirements
4. **Our Solution** - Numbered subsections (Custom Model, Pipeline, Optimization, etc.)
5. **Technical Implementation** - Architecture details, model optimization techniques
6. **Results & Impact** - Quantified outcomes

When adding case studies, maintain SEO meta tags (Open Graph, Twitter cards, canonical URL, robots).

**Case study pages differ from index.html**:
- Use inline `<style>` blocks in `<head>` (not shared CSS beyond `styles.css`)
- Do NOT load Three.js or `js/script.js` — only `js/analytics.js`
- Use relative paths: `../css/styles.css`, `../js/analytics.js`

## Visual Identity

**Color meanings**:
- Magenta (`#ff00ff`) - Primary accent, AI/neural network theme
- Cyan (`#00ffff`) - Secondary accent, data/technology theme
- Gradient (magenta→cyan) - Used for headings, CTAs, hover states

**Visual motifs**:
- Neural network particle animation (Three.js background) - represents AI connectivity
- SVG diagrams with pulsing nodes and flowing connections
- Glass-morphism cards with backdrop blur

New visuals should reinforce the AI/tech aesthetic with these colors and animation styles.

## Content Synchronization

These details appear in multiple files and must stay synchronized:

| Content | Locations |
|---------|-----------|
| Company name "YF Studio" | index.html (nav, footer), case-studies/*.html, README.md |
| Email: yfstudio.uk@gmail.com | index.html (contact section), README.md |
| Location: York, UK | index.html (contact), README.md |
| Domain: yfstudio.co.uk | CNAME, index.html meta tags |
| Domain: yfstudiouk.github.io | sitemap.xml, robots.txt, case-studies meta tags (legacy URLs - not yet migrated to yfstudio.co.uk) |
| GA ID: G-QXTGE73PYY | js/analytics.js |

## Architecture

### Technology Stack
- **HTML5/CSS3/Vanilla JS** - No frameworks
- **Three.js r128** (CDN) - 3D particle background
- **Font Awesome 6.4.0** (CDN) - Icons
- **Google Fonts** (Inter) - Typography
- **Formspree** - Contact form backend

### File Structure
```
index.html              # Main single-page site
css/styles.css          # Styling and 20+ CSS animations
js/script.js            # Interactivity, form handling
js/background-3d.js     # Three.js particle network
js/analytics.js         # Google Analytics
case-studies/*.html     # 6 portfolio case studies
utils/*.py              # SVG generation utilities
```

### Key Patterns
- Intersection Observer for scroll-triggered animations
- Debounced scroll handlers
- Form validation regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Toast notifications with auto-dismiss

### Responsive Breakpoints
- 768px (tablet)
- 480px (mobile)
- Mobile hamburger menu toggle

## Performance Notes

- Three.js runs 300 particles with O(N²) distance checking - test on lower-end devices
- All CSS animations use `transform` and `opacity` for GPU acceleration
