"use client";

import { motion } from "motion/react";
import Link from "next/link";
import LiquidGlassCard from "@/components/LiquidGlassCard";

const PricingCard = ({
  planName, price, tagline, subTagline, features, isPopular, delay
}: {
  planName: string; price: string; tagline: string; subTagline: string;
  features: string[]; isPopular?: boolean; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
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
          <div className="font-display text-4xl font-extrabold text-on-surface tracking-tighter">
            {price}<span className="text-base font-normal text-on-surface-variant ml-1">/ Month</span>
          </div>
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

export default function Pricing() {
  return (
    <div className="flex-grow flex flex-col items-center pt-24 pb-32 px-6 md:px-16 max-w-[1400px] mx-auto w-full">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container rounded-full blur-[150px] opacity-[0.06]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-primary-container rounded-full blur-[120px] opacity-[0.04]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-20 max-w-3xl">
        <h1 className="font-display text-5xl md:text-7xl font-extrabold mb-6 tracking-tighter text-on-background">
          Simple Pricing for Creators
        </h1>
        <p className="font-body text-lg text-on-surface-variant leading-relaxed">
          Start for free or upgrade to premium tools to scale your content creation. No hidden charges.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-start">
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
    </div>
  );
}
