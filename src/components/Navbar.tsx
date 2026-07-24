"use client";

import Link from "next/link";
import NavDropdown from "./NavDropdown";

export default function Navbar() {
  return (
    <nav className="sticky top-0 w-full z-50 bg-surface/65 backdrop-blur-xl border-b border-surface-container-highest shadow-sm">
      <div className="flex justify-between items-center px-6 md:px-16 py-4 w-full max-w-screen-2xl mx-auto">
        <Link href="/" className="flex items-center gap-4">
          <span className="font-display text-2xl md:text-3xl font-extrabold text-on-background tracking-tight">MotionAIx</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {/* Templates Dropdown */}
          <NavDropdown
            trigger="Templates"
            items={[
              { label: "Travel Route on Map", desc: "Animated route line across a 3D map with landmarks", href: "/login" },
              { label: "News Headline Highlight", desc: "Headline reveal with magnifying-glass effect", href: "/login" },
              { label: "Product Demo Layout", desc: "Clean walkthrough layout for product showcasing", href: "/login" },
              { label: "Cinematic Tech Intro", desc: "Dark, high-contrast intro sequence", href: "/login" },
              { label: "Launch Video on X", desc: "Announcement-style template for launches", href: "/login" },
            ]}
            footerLabel="Checkout More"
            footerHref="/templates"
          />

          {/* Motion Essence Dropdown */}
          <NavDropdown
            trigger="Motion Essence"
            items={[
              { label: "Earnings Counter", desc: "Slide-in with number increment effect", href: "/login" },
              { label: "File Download", desc: "Progress bar filling animation", href: "/login" },
              { label: "Fire Slider", desc: "Smooth sliding motion with glow", href: "/login" },
              { label: "Follower Count", desc: "Rapid counter rolling animation", href: "/login" },
            ]}
            footerLabel="Browse All Essence"
            footerHref="/login"
          />

          {/* Tools Dropdown */}
          <NavDropdown
            trigger="Tools"
            items={[
              { label: "Caption Generator", desc: "Auto-generate styled captions for any video", href: "/captions" },
              { label: "Audio Waveform Tool", desc: "Turn voiceovers into synced waveform videos", href: "/waveform" },
              { label: "Text 2 Motion Graphic", desc: "Convert text prompts into motion graphics", href: "#", badge: "Coming Soon" },
            ]}
          />

          {/* Pricing — Direct Link */}
          <a href="/pricing" className="text-on-surface-variant hover:text-primary-container transition-colors duration-300 font-label uppercase tracking-widest text-xs md:text-sm">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-6">
          <div className="liquid-glass-wrapper hidden md:inline-block">
            <Link href="/login" className="liquid-glass-btn group" style={{ width: '160px', height: '48px', borderRadius: '24px' }}>
              <div className="glass-specular-shine"></div>
              <div className="glass-content">
                <span className="font-label uppercase tracking-widest text-[11px] font-bold text-on-surface group-hover:text-primary-container transition-colors">Get Started</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
