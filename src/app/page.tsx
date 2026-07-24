"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import EarthTravelDemo from "@/components/EarthTravelDemo";
import SubscribeDemo from "@/components/SubscribeDemo";
import IosNotificationDemo from "@/components/IosNotificationDemo";
import YoutubeOdometerDemo from "@/components/YoutubeOdometerDemo";
import InstagramOdometerDemo from "@/components/InstagramOdometerDemo";
import NewsArticleDemo from "@/components/NewsArticleDemo";
import ChartEngineDemo from "@/components/ChartEngineDemo";
import { 
  EarningsEssence, 
  FileDownloadEssence, 
  FireSliderEssence, 
  FollowerEssence, 
  GoalEssence, 
  RevealEssence 
} from "@/components/MotionEssenceCards";

/* ───────────────────────── Animated Background Waves ───────────────────────── */
const GlassWave = ({ delay, yOffset, opacity, duration }: { delay: number; yOffset: string; opacity: number; duration: number }) => (
  <div
    className="absolute left-0 right-0 h-[600px] pointer-events-none"
    style={{ 
      top: yOffset, 
      opacity: opacity * 1.5,
      animation: `glasswave-float ${duration}s ease-in-out ${delay}s infinite`,
      willChange: 'transform',
    }}
  >
    <div className="absolute inset-0 transform -skew-y-12" style={{ background: 'radial-gradient(ellipse at center, rgba(255, 215, 0, 0.18) 0%, transparent 70%)' }} />
    <div className="absolute inset-0 rounded-[100%]" style={{ background: 'radial-gradient(ellipse at center, rgba(255, 165, 0, 0.14) 0%, transparent 70%)' }} />
  </div>
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
   ═══════════════════════════════════════════════════════════════════════════════ */
const PromoTextWithLang = () => {
  const [lang, setLang] = useState("ENG");

  const CONTENT: Record<string, { title: React.ReactNode, text1: React.ReactNode, text2: React.ReactNode, text3: React.ReactNode, text4: React.ReactNode }> = {
    ENG: {
      title: <>Pro Motion Graphics, <br/><span className="text-primary-container">Zero After Effects.</span></>,
      text1: <>Get <span className="text-white font-semibold">copyright-free After Effects templates</span> directly in your browser. Extremely lightweight and fast rendering.</>,
      text2: <>Whether you're a <span className="text-primary-container font-medium">mobile editor</span>, laptop creator, or agency, save hundreds of hours. Access ready-made motion graphics, motion essence, mini assets, AI captions, and audio-to-waveform tools.</>,
      text3: <>No heavy software required. No motion graphics knowledge needed. No high costs. <span className="text-white font-semibold">Many assets are completely free.</span></>,
      text4: <>Just input your needs, customize with simple controls, and render directly to your device. Highly optimized to work perfectly even on mobile.</>
    },
    HGL: {
      title: <>Pro Motion Graphics, <br/><span className="text-primary-container">Zero After Effects.</span></>,
      text1: <>Seedhe apne browser mein <span className="text-white font-semibold">copyright-free After Effects templates</span> paayein. Bahut lightweight aur fast rendering.</>,
      text2: <>Chahe aap <span className="text-primary-container font-medium">mobile editor</span> ho, laptop creator, ya agency, apne saikdon ghante bachayein. Ready-made motion graphics, motion essence, mini assets, AI captions aur audio-to-waveform tools access karein.</>,
      text3: <>Na heavy software chahiye, na motion graphics ki knowledge, na zyada paise. <span className="text-white font-semibold">Bahut saare assets bilkul free hain.</span></>,
      text4: <>Bas apni zaroorat daalein, simple controls se customize karein, aur direct apne device par render karein. Mobile par bhi best chalne ke liye optimize kiya gaya hai.</>
    },
    HIN: {
      title: <>प्रो मोशन ग्राफिक्स, <br/><span className="text-primary-container">ज़ीरो आफ्टर इफेक्ट्स।</span></>,
      text1: <>सीधे अपने ब्राउज़र में <span className="text-white font-semibold">कॉपीराइट-फ्री आफ्टर इफेक्ट्स टेम्प्लेट</span> प्राप्त करें। बहुत हल्का और तेज़ रेंडरिंग।</>,
      text2: <>चाहे आप <span className="text-primary-container font-medium">मोबाइल एडिटर</span> हों, लैपटॉप क्रिएटर हों या एजेंसी, अपने सैकड़ों घंटे बचाएं। रेडीमेड मोशन ग्राफिक्स, मोशन एसेंस, मिनी एसेट्स, एआई कैप्शन और ऑडियो-टू-वेवफॉर्म टूल्स का उपयोग करें।</>,
      text3: <>कोई भारी सॉफ्टवेयर की आवश्यकता नहीं, कोई मोशन ग्राफिक्स का ज्ञान नहीं, कोई भारी खर्च नहीं। <span className="text-white font-semibold">बहुत सारे एसेट्स बिल्कुल मुफ्त हैं।</span></>,
      text4: <>बस अपनी जरूरतें दर्ज करें, सरल कंट्रोल्स के साथ कस्टमाइज़ करें, और सीधे अपने डिवाइस पर रेंडर करें। मोबाइल पर भी बेहतरीन काम करने के लिए ऑप्टिमाइज़ किया गया है।</>
    },
    ESP: {
      title: <>Pro Motion Graphics, <br/><span className="text-primary-container">Cero After Effects.</span></>,
      text1: <>Obtén <span className="text-white font-semibold">plantillas de After Effects sin derechos de autor</span> directamente en tu navegador. Extremadamente ligero y de renderizado rápido.</>,
      text2: <>Ya seas un <span className="text-primary-container font-medium">editor móvil</span>, creador de portátiles o agencia, ahorra cientos de horas. Accede a motion graphics, assets mínimos, subtítulos con IA y herramientas de audio a forma de onda.</>,
      text3: <>No se requiere software pesado. No se necesitan conocimientos de motion graphics. Sin altos costos. <span className="text-white font-semibold">Muchos assets son completamente gratis.</span></>,
      text4: <>Solo ingresa tus necesidades, personaliza con controles simples y renderiza directamente a tu dispositivo. Altamente optimizado para funcionar perfectamente en móviles.</>
    },
    FRA: {
      title: <>Pro Motion Graphics, <br/><span className="text-primary-container">Zéro After Effects.</span></>,
      text1: <>Obtenez des <span className="text-white font-semibold">modèles After Effects libres de droits</span> directement dans votre navigateur. Extrêmement léger et rendu rapide.</>,
      text2: <>Que vous soyez un <span className="text-primary-container font-medium">monteur mobile</span>, un créateur sur ordinateur ou une agence, gagnez des centaines d'heures. Accédez à des graphiques animés prêts à l'emploi et bien plus.</>,
      text3: <>Aucun logiciel lourd requis. Aucune connaissance en motion graphics nécessaire. Pas de coûts élevés. <span className="text-white font-semibold">De nombreux actifs sont entièrement gratuits.</span></>,
      text4: <>Il suffit d'entrer vos besoins, de personnaliser avec des commandes simples et de rendre directement sur votre appareil. Hautement optimisé pour fonctionner parfaitement sur mobile.</>
    }
  };

  const current = CONTENT[lang];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-display text-3xl font-bold tracking-tight text-on-background leading-tight">
          {current.title}
        </h3>
        {/* Language Switcher */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10 shrink-0">
          {["ENG", "HGL", "HIN", "ESP", "FRA"].map(l => (
            <button 
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-1 text-[10px] font-bold rounded transition-colors ${lang === l ? "bg-primary-container text-on-primary-container" : "text-white hover:bg-white/10"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      
      <div className="font-body text-base text-on-surface-variant leading-relaxed space-y-4">
        <p>{current.text1}</p>
        <p>{current.text2}</p>
        <p>{current.text3}</p>
        <p>{current.text4}</p>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center bg-background min-h-screen relative overflow-hidden">

      {/* ── Background Blobs + Waves ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-background">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] animate-[pulse_10s_infinite]" style={{ background: 'radial-gradient(circle, rgba(255,209,0,0.12) 0%, transparent 70%)' }} />
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] animate-[pulse_12s_infinite_1s]" style={{ background: 'radial-gradient(circle, rgba(255,209,0,0.08) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[10%] left-[20%] w-[45vw] h-[45vw] animate-[pulse_8s_infinite_2s]" style={{ background: 'radial-gradient(circle, rgba(255,209,0,0.10) 0%, transparent 70%)' }} />
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
        {/* Golden ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,209,0,0.08) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(108,78,49,0.10) 0%, transparent 70%)' }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-28">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.15] max-w-4xl mx-auto">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-[#ffe066] to-primary-container">Stop wasting hours on After Effects editing.</span><br />
            <span className="text-on-surface-variant/80 text-2xl md:text-3xl font-bold mt-3 block">Simply customize these templates with your content and export easily.</span>
          </h2>
        </motion.div>

        {/* 1 — Earth Travel Map Demo + Info (Side by Side) */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8 }} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
          
          {/* Left: Earth Travel Demo Card */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white/[0.02] border border-primary-container/30 p-5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,200,0,0.04)] h-full">
            <div className="flex items-center gap-2.5">
              <span className="font-label text-[9px] uppercase tracking-[0.2em] text-primary-container font-bold px-2 py-0.5 rounded-full border border-primary-container/20 bg-primary-container/5">Demo</span>
              <h3 className="font-display text-lg font-bold tracking-tight text-on-background">3D Flight Map</h3>
            </div>
            <div className="flex-1 flex flex-col">
              <EarthTravelDemo />
            </div>
          </div>

          {/* Right: Info Text */}
          <PromoTextWithLang />
        </motion.div>

        {/* 2+3 — Subscribe + iOS Notification (Side by Side) */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          
          {/* Subscribe Demo Card */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white/[0.02] border border-primary-container/30 p-5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,200,0,0.04)]">
            <div className="flex items-center gap-2.5">
              <span className="font-label text-[9px] uppercase tracking-[0.2em] text-primary-container font-bold px-2 py-0.5 rounded-full border border-primary-container/20 bg-primary-container/5">Demo</span>
              <h3 className="font-display text-lg font-bold tracking-tight text-on-background">YouTube Lower Thirds</h3>
            </div>
            <SubscribeDemo />
          </div>

          {/* iOS Notification Demo Card */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white/[0.02] border border-primary-container/30 p-5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,200,0,0.04)]">
            <div className="flex items-center gap-2.5">
              <span className="font-label text-[9px] uppercase tracking-[0.2em] text-primary-container font-bold px-2 py-0.5 rounded-full border border-primary-container/20 bg-primary-container/5">Demo</span>
              <h3 className="font-display text-lg font-bold tracking-tight text-on-background">iOS Notification</h3>
            </div>
            <IosNotificationDemo />
          </div>
        </motion.div>

        {/* 4+5 — YouTube Odometer + Instagram Odometer (Side by Side) */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          
          {/* YouTube Odometer Demo Card */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white/[0.02] border border-primary-container/30 p-5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,200,0,0.04)]">
            <div className="flex items-center gap-2.5">
              <span className="font-label text-[9px] uppercase tracking-[0.2em] text-primary-container font-bold px-2 py-0.5 rounded-full border border-primary-container/20 bg-primary-container/5">Demo</span>
              <h3 className="font-display text-lg font-bold tracking-tight text-on-background">YouTube Odometer Count</h3>
            </div>
            <YoutubeOdometerDemo />
          </div>

          {/* Instagram Odometer Demo Card */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white/[0.02] border border-primary-container/30 p-5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,200,0,0.04)]">
            <div className="flex items-center gap-2.5">
              <span className="font-label text-[9px] uppercase tracking-[0.2em] text-primary-container font-bold px-2 py-0.5 rounded-full border border-primary-container/20 bg-primary-container/5">Demo</span>
              <h3 className="font-display text-lg font-bold tracking-tight text-on-background">Instagram Follower Count</h3>
            </div>
            <InstagramOdometerDemo />
          </div>
        </motion.div>

        {/* Interstitial Typography Section */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="w-full flex justify-center mb-16 mt-8">
          <div className="relative inline-block px-12 py-6 rounded-full border border-primary-container/20 bg-white/[0.01] shadow-[inset_0_0_40px_rgba(255,215,0,0.03)] backdrop-blur-md">
            <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700] text-center" style={{ textShadow: '0 4px 20px rgba(255, 215, 0, 0.2)' }}>
              Made by video editors, <br className="md:hidden" /> made for video editors
            </h2>
            <div className="absolute -top-4 -left-4 text-primary-container/40">✦</div>
            <div className="absolute -bottom-4 -right-4 text-primary-container/40">✦</div>
          </div>
        </motion.div>

        {/* 3 — News Article Engine (Graphics Engine) */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.8 }} className="w-full mb-16">
          <div className="flex flex-col gap-3 rounded-2xl bg-white/[0.02] border border-primary-container/30 p-5 backdrop-blur-sm shadow-[0_0_20px_rgba(255,200,0,0.04)]">
            <div className="flex items-center gap-2.5">
              <span className="font-label text-[9px] uppercase tracking-[0.2em] text-primary-container font-bold px-2 py-0.5 rounded-full border border-primary-container/20 bg-primary-container/5">Demo</span>
              <h3 className="font-display text-lg font-bold tracking-tight text-on-background">News Article Highlight</h3>
            </div>
            <NewsArticleDemo />
          </div>
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
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.8, delay: 0.1 }} className="w-full mb-16">
          <div className="flex flex-col gap-4 rounded-3xl bg-white/[0.03] border border-white/[0.06] p-5 md:p-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-primary-container font-bold px-3 py-1 rounded-full border border-primary-container/20 bg-primary-container/5">Motion Essence</span>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-on-background">Chart Drop Animation</h3>
                </div>
                <p className="font-body text-sm text-on-surface-variant max-w-2xl">
                  Animated bar chart that builds itself up bar by bar. Feed it your numbers, customize the insights, and export a clean data visualization clip.
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <ChartEngineDemo />
            </div>
          </div>
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
          SECTION 3 — MOTION ESSENCE LIBRARY
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 w-full bg-surface-container-low/50 py-28 border-y border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 md:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6 text-on-background">Motion Essence Library</h2>
            <p className="font-body text-lg text-on-surface-variant max-w-2xl mx-auto">
              Small, lightweight motion animations with minimal customization. Perfect for quick visual elements like money counters, progress bars, and simple text reveals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <EarningsEssence delay={0.05} />
            <FileDownloadEssence delay={0.1} />
            <FireSliderEssence delay={0.15} />
            <FollowerEssence delay={0.2} />
            <GoalEssence delay={0.25} />
            <RevealEssence delay={0.3} />
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
