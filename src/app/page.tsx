"use client";

import { motion } from "motion/react";
import Link from "next/link";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import EarthTravelDemo from "@/components/EarthTravelDemo";
import SubscribeDemo from "@/components/SubscribeDemo";
import IosNotificationDemo from "@/components/IosNotificationDemo";

/* ───────────────────────── Animated Background Waves ───────────────────────── */
const GlassWave = ({ delay, yOffset, opacity, duration }: { delay: number; yOffset: string; opacity: number; duration: number }) => (
  <motion.div
    animate={{ y: [0, 20, -20, 0], skewY: [0, 1, -1, 0] }}
    transition={{ repeat: Infinity, duration, delay, ease: "easeInOut" }}
    className="absolute left-0 w-full h-[400px] pointer-events-none"
    style={{ top: yOffset, opacity }}
  >
    <svg className="w-full h-full" viewBox="0 0 1440 400" fill="none" preserveAspectRatio="none">
      <path d="M0,180 C240,280 480,100 720,200 C960,300 1200,140 1440,180 L1440,400 L0,400 Z" fill="rgba(255, 255, 255, 0.12)" />
    </svg>
  </motion.div>
);

/* ───────────────────────── Video Placeholder Box ───────────────────────── */
const VideoPlaceholder = ({ label }: { label: string }) => (
  <div className="w-full aspect-video rounded-3xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-sm flex items-center justify-center p-6">
    <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant/60 text-center">{label}</p>
  </div>
);

/* ───────────────────────── Template Card ───────────────────────── */
const TemplateCard = ({ name, desc, delay }: { name: string; desc: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className="group"
  >
    <LiquidGlassCard className="!w-full !h-full">
      <div className="flex flex-col gap-4 p-6 w-full relative z-10">
        <div className="w-full aspect-video rounded-2xl border border-dashed border-white/15 bg-white/5 flex items-center justify-center">
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/50 text-center px-2">Live preview video</span>
        </div>
        <h4 className="font-display text-base font-bold text-on-surface tracking-tight">{name}</h4>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">{desc}</p>
      </div>
    </LiquidGlassCard>
  </motion.div>
);

/* ───────────────────────── Pricing Card ───────────────────────── */
const PricingCard = ({
  planName, price, tagline, subTagline, features, isPopular, delay
}: {
  planName: string; price: string; tagline: string; subTagline: string;
  features: string[]; isPopular?: boolean; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={`relative ${isPopular ? "md:-mt-4 md:mb-4" : ""}`}
  >
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-5 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label text-xs uppercase tracking-widest font-bold shadow-lg">
        Most Popular
      </div>
    )}
    <LiquidGlassCard className={`!w-full !h-full ${isPopular ? "ring-2 ring-primary-container/60" : ""}`}>
      <div className="flex flex-col p-8 w-full relative z-10 gap-6">
        <div>
          <h3 className="font-display text-2xl font-bold text-on-surface tracking-tight mb-1">{planName}</h3>
          <div className="font-display text-4xl font-extrabold text-on-surface tracking-tighter">{price}<span className="text-base font-normal text-on-surface-variant ml-1">/ Month</span></div>
        </div>
        <p className="font-body text-sm text-primary-container font-semibold italic">&ldquo;{tagline}&rdquo;</p>
        <p className="font-body text-sm text-on-surface-variant leading-relaxed">{subTagline}</p>
        <ul className="flex flex-col gap-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 font-body text-sm text-on-surface">
              <span className="text-primary-container mt-0.5 shrink-0">✦</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Link href="/login" className="mt-auto block w-full text-center py-3.5 rounded-full font-label text-xs uppercase tracking-widest font-bold transition-colors bg-on-surface text-background hover:bg-primary-container hover:text-on-primary-container">
          Get Started
        </Link>
      </div>
    </LiquidGlassCard>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="w-full flex flex-col items-center bg-background min-h-screen relative overflow-hidden">

      {/* ── Background Blobs + Waves ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-background">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,_rgba(255,209,0,0.12)_0%,_rgba(255,255,255,0)_70%)] blur-[120px] animate-[pulse_10s_infinite]" />
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,_rgba(255,209,0,0.08)_0%,_rgba(255,255,255,0)_70%)] blur-[140px] animate-[pulse_12s_infinite_1s]" />
        <div className="absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] bg-[radial-gradient(circle,_rgba(255,209,0,0.1)_0%,_rgba(255,255,255,0)_70%)] blur-[100px] animate-[pulse_8s_infinite_2s]" />
        <GlassWave yOffset="5%" opacity={0.5} duration={12} delay={0} />
        <GlassWave yOffset="25%" opacity={0.3} duration={16} delay={2} />
        <GlassWave yOffset="50%" opacity={0.4} duration={14} delay={4} />
        <GlassWave yOffset="75%" opacity={0.3} duration={18} delay={1} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 pt-36 pb-20 md:pb-28 flex flex-col items-center text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-center w-full">
          <div className="font-label text-xs uppercase tracking-[0.25em] text-primary-container mb-6 px-4 py-1.5 rounded-full border border-primary-container/20 bg-primary-container/5 backdrop-blur-md">
            Ready-Made Motion Graphics &amp; Customizations
          </div>

          <h1 className="font-display text-5xl md:text-8xl font-extrabold mb-8 tracking-tighter leading-[1.05] text-on-background max-w-5xl">
            Kill After Effects.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-on-background to-on-surface-variant">Animate in the Browser.</span>
          </h1>

          <p className="font-body text-lg md:text-2xl text-on-surface-variant mb-12 max-w-[70ch] leading-relaxed">
            Edit ready-made motion graphics templates, auto-generate styled captions, and turn any voiceover into a synced waveform video — all inside your browser, no software to install.
          </p>

          <Link href="/login" className="w-[300px] h-[88px]">
            <LiquidGlassCard className="!w-full !h-full !rounded-[44px]" title="Get Started Free" subtitle="No Software Needed" isButton />
          </Link>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — MOTION GRAPHICS SHOWCASE
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-28">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mx-auto">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-[#ffe066] to-primary-container">Stop wasting hours on After Effects editing.</span><br />
            <span className="text-on-surface-variant/80 text-2xl md:text-3xl font-bold mt-3 block">Simply customize these templates with your content and export easily.</span>
          </h2>
        </motion.div>

        {/* 1 — Earth Travel Map Demo */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8 }} className="flex flex-col md:flex-row gap-12 md:gap-16 items-start mb-28">
          <div className="flex flex-col gap-5 rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm w-full md:w-1/2">
            <span className="self-start font-label text-[10px] uppercase tracking-[0.2em] text-primary-container font-bold px-3 py-1 rounded-full border border-primary-container/20 bg-primary-container/5">Interactive Demo</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-on-background">3D Flight Map Generator</h3>
            <p className="font-body text-base text-on-surface-variant leading-relaxed border-l-2 border-primary-container/30 pl-4">
              Create an animated 3D flight path between two cities. Select your origin and destination below, choose the duration, and preview your video instantly.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <EarthTravelDemo />
          </div>
        </motion.div>

        {/* 2 — Subscribe & Like Animation Demo */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8 }} className="flex flex-col md:flex-row gap-12 md:gap-16 items-start mb-28">
          <div className="flex flex-col gap-5 md:order-2 rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm w-full md:w-1/2">
            <span className="self-start font-label text-[10px] uppercase tracking-[0.2em] text-primary-container font-bold px-3 py-1 rounded-full border border-primary-container/20 bg-primary-container/5">Interactive Demo</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-on-background">YouTube Lower Thirds</h3>
            <p className="font-body text-base text-on-surface-variant leading-relaxed border-l-2 border-primary-container/30 pl-4">
              A premium, perfectly timed "Like, Subscribe & Bell" animation for your videos. Upload your channel logo, enter your handle, and generate an alpha-transparent WebM to drop right into Premiere or CapCut.
            </p>
          </div>
          <div className="w-full md:w-1/2 md:order-1">
            <SubscribeDemo />
          </div>
        </motion.div>

        {/* 3 — iOS Notification Graphic Demo */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8 }} className="flex flex-col md:flex-row gap-12 md:gap-16 items-start mb-28">
          <div className="flex flex-col gap-5 rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm w-full md:w-1/2">
            <span className="self-start font-label text-[10px] uppercase tracking-[0.2em] text-primary-container font-bold px-3 py-1 rounded-full border border-primary-container/20 bg-primary-container/5">Interactive Demo</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-on-background">Apple iOS Notification</h3>
            <p className="font-body text-base text-on-surface-variant leading-relaxed border-l-2 border-primary-container/30 pl-4">
              Recreate the exact look, feel, and physics of a real iPhone notification sliding down from the top of the screen. Features authentic liquid glass backdrop filtering. Just edit the text, pick the app icon, and export.
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <IosNotificationDemo />
          </div>
        </motion.div>

        {/* 2 — Subscriber Count Animation */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-28">
          <div className="flex flex-col gap-5 md:order-2 rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm">
            <span className="self-start font-label text-[10px] uppercase tracking-[0.2em] text-primary-container font-bold px-3 py-1 rounded-full border border-primary-container/20 bg-primary-container/5">Mini Asset</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-on-background">Subscriber Count Animation</h3>
            <p className="font-body text-base text-on-surface-variant leading-relaxed border-l-2 border-primary-container/30 pl-4">
              Shows a number counting up from zero to your subscriber or follower count. Clean background, big bold number, smooth easing. Type in any number and it animates to that.
            </p>
          </div>
          <div className="md:order-1">
            <VideoPlaceholder label="Subscriber Count preview" />
          </div>
        </motion.div>

        {/* 3 — News Headline Highlight */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-28">
          <div className="flex flex-col gap-5 rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm">
            <span className="self-start font-label text-[10px] uppercase tracking-[0.2em] text-primary-container font-bold px-3 py-1 rounded-full border border-primary-container/20 bg-primary-container/5">Template</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-on-background">News Headline Highlight</h3>
            <p className="font-body text-base text-on-surface-variant leading-relaxed border-l-2 border-primary-container/30 pl-4">
              An article screenshot slides in, then a magnifying glass scans across key sentences and highlights them. Paste your headline, adjust the highlight color, done.
            </p>
          </div>
          <VideoPlaceholder label="News Headline Highlight preview" />
        </motion.div>

        {/* 4 — Product Demo Layout */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-28">
          <div className="flex flex-col gap-5 md:order-2 rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm">
            <span className="self-start font-label text-[10px] uppercase tracking-[0.2em] text-primary-container font-bold px-3 py-1 rounded-full border border-primary-container/20 bg-primary-container/5">Template</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-on-background">Product Demo Layout</h3>
            <p className="font-body text-base text-on-surface-variant leading-relaxed border-l-2 border-primary-container/30 pl-4">
              A clean split-screen layout where your product image sits on one side and feature text animates in on the other. Drop in your screenshot, write 3-4 bullet points, and export a walkthrough clip.
            </p>
          </div>
          <div className="md:order-1">
            <VideoPlaceholder label="Product Demo Layout preview" />
          </div>
        </motion.div>

        {/* 5 — Chart Drop Animation */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="flex flex-col gap-5 rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8 backdrop-blur-sm">
            <span className="self-start font-label text-[10px] uppercase tracking-[0.2em] text-primary-container font-bold px-3 py-1 rounded-full border border-primary-container/20 bg-primary-container/5">Mini Asset</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-on-background">Chart Drop Animation</h3>
            <p className="font-body text-base text-on-surface-variant leading-relaxed border-l-2 border-primary-container/30 pl-4">
              Animated bar chart or line graph that builds itself up bar by bar. Feed it your numbers and labels, pick a style, and it renders a clean data visualization clip you can use in any video.
            </p>
          </div>
          <VideoPlaceholder label="Chart Drop Animation preview" />
        </motion.div>

        {/* Closing Callout */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="text-center mt-28">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-on-background">
            Stop begging for templates in comments.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container to-on-surface-variant">Just come out here.</span>
          </h2>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — TEMPLATE LIBRARY
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 w-full bg-surface-container-low/50 py-28 border-y border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 text-on-background">Template Library</h2>
            <p className="font-body text-xl text-on-surface-variant max-w-2xl mx-auto">A growing set of ready-to-edit templates, including:</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TemplateCard name="Travel Route on Map with 3D Landmarks" desc="Animated route line across a 3D map" delay={0.05} />
            <TemplateCard name="News Article Headline Highlight" desc="Headline reveal with a magnifying-glass overview effect on key sentences" delay={0.1} />
            <TemplateCard name="Product Demo Layout" desc="Clean walkthrough layout for showcasing a product" delay={0.15} />
            <TemplateCard name="Launch Video on X" desc="Announcement-style template for product/feature launches" delay={0.2} />
            <TemplateCard name="Cinematic Tech Intro" desc="Dark, high-contrast intro sequence" delay={0.25} />
            <TemplateCard name="Transparent Call-To-Action Overlay" desc="CTA overlay for layering on existing footage" delay={0.3} />
            <TemplateCard name="Shape to Words Transformation" desc="Shapes morphing into typography" delay={0.35} />
            <TemplateCard name="Audio Spectrum Visualizer" desc="Reactive waveform/spectrum animation" delay={0.4} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — PRICING
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-16 py-28">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 text-on-background">Simple Pricing for Creators</h2>
          <p className="font-body text-xl text-on-surface-variant max-w-3xl mx-auto">Start for free or upgrade to premium tools to scale your content creation. No hidden charges.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Free Plan */}
          <PricingCard
            planName="Free Plan"
            price="₹0"
            tagline="Perfect for casual editors, beginners, and testing the platform."
            subTagline="Create great visuals for your social media without paying anything."
            features={[
              "10 Video Exports / Day",
              "10 Audio Waveforms / Day",
              "1 AI Caption / Day",
              "Basic Motion Templates",
              "720p HD Quality — 30 FPS",
              "Includes Watermark",
            ]}
            delay={0.1}
          />

          {/* Pro Plan */}
          <PricingCard
            planName="Pro Plan"
            price="₹149"
            tagline="The best choice for regular YouTube, Instagram & Video editors."
            subTagline="Remove all limits and get professional, clean videos for less than the cost of a cup of coffee."
            features={[
              "NO WATERMARK",
              "UNLIMITED Video Exports",
              "100 Audio Waveforms / Day",
              "20 AI Captions / Day",
              "Premium Caption Styles — Nutella, NYT Prism, Glass Morrison, etc.",
              "All Premium Templates",
              "1080p Full HD Quality — 30 FPS",
            ]}
            isPopular
            delay={0.2}
          />

          {/* Creator Plan */}
          <PricingCard
            planName="Creator Plan"
            price="₹299"
            tagline="Built for professional editors, agencies, and high performance."
            subTagline="For power users who need maximum quality, faster frame rates, and full control."
            features={[
              "Everything in Pro Included",
              "UNLIMITED Video Exports",
              "UNLIMITED Audio Waveforms",
              "UNLIMITED AI Captions",
              "4K Ultra HD & 60 FPS",
              "Advanced Customization",
              "Early Access Layouts",
            ]}
            delay={0.3}
          />
        </div>
      </section>

    </div>
  );
}
