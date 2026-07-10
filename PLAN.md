# MotionAIx Landing Page Implementation Plan

## Project Context
- **Tech Stack**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS v4
- **Design**: "Liquid Glass" aesthetic with dark mode (primary) — deep charcoal/brown (#171309) with Gold/Yellow (#FFD100) accents
- **Typography**: 'Sora' (Headings), 'Hanken Grotesk' (Body), 'JetBrains Mono' (Labels)
- **Existing files**: `src/app/layout.tsx`, `src/app/globals.css`, `src/components/LiquidGlassCard.tsx`
- **Working directory**: `C:/Users/kaif/motionaix`
- **Build command**: `npm run build` (uses --webpack flag)
- **Test command**: `npm test`

## Task 1: Update Layout (Navbar + Footer)
**File**: `src/app/layout.tsx`

Update the navbar links to exactly match:
- `Templates` → `/templates`
- `Captions` → `/captions` (NEW — this page doesn't exist yet, just add the link)
- `Waveform Tool` → `/waveform`
- `Pricing` → `/pricing`

Keep the existing "Get Started" liquid glass button linking to `/login`.

Remove the unused `ThemeToggle` import (line 4). The `html` tag already has `className="dark"`.

Update footer to show:
- `MotionAIx` brand name
- Links: `Templates` · `License` · `API Docs` · `Privacy`
- Copyright: `© 2026 MotionAIx.` (no tagline after it)

**Acceptance Criteria**:
- Navbar has exactly 4 links: Templates, Captions, Waveform Tool, Pricing
- "Get Started" button links to /login
- Footer shows MotionAIx brand, 4 links, and copyright text
- No ThemeToggle import or usage
- html tag has className="dark"

---

## Task 2: Hero Section + "Three Tools" Section
**File**: `src/app/page.tsx` (rewrite from scratch)

This is a `"use client"` component.

### Hero Section:
- Eyebrow badge: "Ready-Made Motion Graphics & Customizations"
- H1: "Kill After Effects." (line 1) + "Animate in the Browser." (line 2)
- Subtitle: "Edit ready-made motion graphics templates, auto-generate styled captions, and turn any voiceover into a synced waveform video — all inside your browser, no software to install."
- CTA button: "Get Started Free" → links to `/login`
- Background: Dark theme with animated gold glass blobs and multi-layered white SVG glass waves

### "Everything you need, in three tools." Section:
Three feature blocks, each with left text + right video placeholder box:

**1. Motion Graphics Templates**
- Description: "Browse ready-made templates and edit them with your own content. Swap in your text, images, and data, then adjust color, size, and animation speed. One click renders and exports your final video."
- Sub-note: "Includes templates for subscriber counters, explainer visuals, product demos, and more — built to be customized, not started from scratch."
- Right side: Empty video placeholder box labeled "Template preview video goes here"

**2. Caption Generator**
- Description: "Upload any video and generate captions automatically. Choose from a library of bold caption styles — Nutella, New York Times Prism, Glass Morrison, Decorate Glass, and more — then customize fonts, colors, and animation to match your brand."
- Right side: Empty video placeholder box labeled "Caption style preview video goes here"

**3. Waveform Export**
- Description: "Upload a voiceover or any audio file and export it as an animated waveform video. See exactly how your audio moves — every beat, pause, and peak — as a visual you can drop straight into your edit."
- Right side: Empty video placeholder box labeled "Waveform preview video goes here"

**Acceptance Criteria**:
- Hero headline is exactly "Kill After Effects." + "Animate in the Browser."
- Hero subtitle matches exactly
- "Get Started Free" CTA links to /login
- Section title "Everything you need, in three tools." is present
- All 3 tool blocks have correct titles, descriptions, and video placeholder boxes
- Each video placeholder has a visible container with descriptive label text
- All text content matches the spec word-for-word

---

## Task 3: Template Library Section
**File**: `src/app/page.tsx` (append after the three tools section)

### Section Title: "Template Library"
### Subtitle: "A growing set of ready-to-edit templates, including:"

### 8 Template Cards in a grid (2x4 or responsive):
Each card has: template name (bold), description, and a video preview placeholder box.

1. **Travel Route on Map with 3D Landmarks** — "animated route line across a 3D map"
2. **News Article Headline Highlight** — "headline reveal with a magnifying-glass overview effect on key sentences"
3. **Product Demo Layout** — "clean walkthrough layout for showcasing a product"
4. **Launch Video on X** — "announcement-style template for product/feature launches"
5. **Cinematic Tech Intro** — "dark, high-contrast intro sequence"
6. **Transparent Call-To-Action Overlay** — "CTA overlay for layering on existing footage"
7. **Shape to Words Transformation** — "shapes morphing into typography"
8. **Audio Spectrum Visualizer** — "reactive waveform/spectrum animation"

Each card should have a visible video preview container (aspect-ratio 16:9) with text "(each card shows a live preview video of that template)" as a placeholder label.

**Acceptance Criteria**:
- Section title "Template Library" is present
- Subtitle text is present
- All 8 template cards are rendered with exact names and descriptions
- Each card has a video preview placeholder container
- Grid layout is responsive

---

## Task 4: Pricing Section
**File**: `src/app/page.tsx` (append after template library section)

### Section Title: "Simple Pricing for Creators"
### Subtitle: "Start for free or upgrade to premium tools to scale your content creation. No hidden charges."

### 3 Pricing Tiers in a responsive grid:

**Free Plan** (₹0 / Month):
- Tagline: "Perfect for casual editors, beginners, and testing the platform."
- Sub-tagline: "Create great visuals for your social media without paying anything."
- Features:
  - 10 Video Exports / Day
  - 10 Audio Waveforms / Day
  - 1 AI Caption / Day
  - Basic Motion Templates
  - 720p HD Quality (30 FPS)
  - Includes Watermark

**Pro Plan** (₹149 / Month) — MOST POPULAR badge:
- Tagline: "The best choice for regular YouTube, Instagram & Video editors."
- Sub-tagline: "Remove all limits and get professional, clean videos for less than the cost of a cup of coffee."
- Features:
  - NO WATERMARK
  - UNLIMITED Video Exports
  - 100 Audio Waveforms / Day
  - 20 AI Captions / Day
  - Premium Caption Styles (Nutella, NYT Prism, Glass Morrison, etc.)
  - All Premium Templates
  - 1080p Full HD Quality (30 FPS)

**Creator Plan** (₹299 / Month):
- Tagline: "Built for professional editors, agencies, and high performance."
- Sub-tagline: "For power users who need maximum quality, faster frame rates, and full control."
- Features:
  - Everything in Pro Included
  - UNLIMITED Video Exports
  - UNLIMITED Audio Waveforms
  - UNLIMITED AI Captions
  - 4K Ultra HD & 60 FPS
  - Advanced Customization
  - Early Access Layouts

**Acceptance Criteria**:
- Section title and subtitle present
- All 3 pricing tiers rendered with exact plan names, prices, taglines
- Pro plan has "MOST POPULAR" badge/indicator
- All features listed for each plan match exactly
- Responsive grid layout (1 column mobile, 3 columns desktop)

---

## Task 5: Final Build Validation & Polish
- Run `npm run build` and verify 0 errors
- Verify all pages compile: /, /login, /templates, /pricing, /waveform
- Check that `src/app/page.tsx` contains ALL sections in order: Hero → Three Tools → Template Library → Pricing
- Ensure no unused imports, no TypeScript errors
- Ensure dark theme is properly applied (html className="dark")

**Acceptance Criteria**:
- `npm run build` passes with 0 errors
- All routes compile successfully
- Page structure follows the exact section order
