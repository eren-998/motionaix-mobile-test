"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, Upload, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "motion/react";
import { usePlayWhenInView } from "@/hooks/usePlayWhenInView";

interface PresetApp {
  name: string;
  title: string;
  message: string;
  icon: string; // path to SVG in /public/icons/
}

const PRESETS: Record<string, PresetApp> = {
  messages: {
    name: "Messages",
    title: "Sarah Jenkins",
    message: "Are we still meeting at Blue Bottle Coffee at 5? ☕",
    icon: "/icons/messages.svg",
  },
  whatsapp: {
    name: "WhatsApp",
    title: "Bro (Group) 🔥",
    message: "Check out this new motion graphic render!",
    icon: "/icons/whatsapp.svg",
  },
  instagram: {
    name: "Instagram",
    title: "alex_design",
    message: "Liked your story.",
    icon: "/icons/instagram.svg",
  },
  gmail: {
    name: "Gmail",
    title: "Google Workspace",
    message: "Your meeting starts in 10 minutes.",
    icon: "/icons/gmail.svg",
  },
  stripe: {
    name: "Stripe",
    title: "Payment Received",
    message: "You received $500.00 from John Doe.",
    icon: "/icons/stripe.svg",
  },
  paypal: {
    name: "PayPal",
    title: "Money Received",
    message: "Alex sent you $50.00 USD.",
    icon: "/icons/paypal.svg",
  },
};

export default function IosNotificationDemo() {
  const [totalDuration, setTotalDuration] = useState(5000);
  const [appName, setAppName] = useState(PRESETS.messages.name);
  const [notiTitle, setNotiTitle] = useState(PRESETS.messages.title);
  const [notiMessage, setNotiMessage] = useState(PRESETS.messages.message);
  const [notiTime] = useState("now");
  const [selectedPreset, setSelectedPreset] = useState("messages");
  const [logoImage, setLogoImage] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  const mainRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(mainRef);
  const shouldPlay = usePlayWhenInView(isPlaying, isInView);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoImage(URL.createObjectURL(file));
      setSelectedPreset("custom");
    }
  };

  const selectPresetApp = (presetKey: string) => {
    setSelectedPreset(presetKey);
    setLogoImage(null);
    if (PRESETS[presetKey]) {
      setAppName(PRESETS[presetKey].name);
      setNotiTitle(PRESETS[presetKey].title);
      setNotiMessage(PRESETS[presetKey].message);
    }
  };

  useEffect(() => {
    if (!shouldPlay) return;

    let requestRef: number;
    let lastTime = 0;

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;

      setElapsedMs((prev) => {
        const next = prev + delta;
        if (next >= totalDuration) {
          setProgress(0);
          return 0; // loop
        }
        setProgress(next / totalDuration);
        return next;
      });

      requestRef = requestAnimationFrame(animate);
    };

    requestRef = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef);
  }, [shouldPlay, totalDuration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Determine animation stage from elapsed time
  let currentStage = "hidden";
  if (elapsedMs > 0 && elapsedMs < 700) {
    currentStage = "intro";
  } else if (elapsedMs >= 700 && elapsedMs < (totalDuration - 600)) {
    currentStage = "resting";
  } else if (elapsedMs >= (totalDuration - 600) && elapsedMs < totalDuration) {
    currentStage = "outro";
  }

  const iconSrc = logoImage || PRESETS[selectedPreset]?.icon || "/icons/messages.svg";

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes iOS-spring-in {
          0% { transform: translateY(-100px) scale(0.92); opacity: 0; }
          65% { transform: translateY(6px) scale(1.01); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes iOS-spring-out {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-120px) scale(0.9); opacity: 0; }
        }
        .noti-in { animation: iOS-spring-in 0.7s cubic-bezier(0.25, 1.25, 0.5, 1) forwards; }
        .noti-out { animation: iOS-spring-out 0.55s cubic-bezier(0.3, 0.1, 0.3, 1) forwards; }
      `}} />

      {/* Video Player Canvas */}
      <div
        ref={mainRef}
        className="w-full aspect-[2/1] rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl relative flex flex-col items-center justify-start pt-8 cursor-pointer group"
        onClick={togglePlay}
      >
        {/* Ambient Glows */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-[10%] left-[25%] w-[30%] h-[30%] rounded-full animate-[pulse_8s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] rounded-full animate-[pulse_10s_ease-in-out_infinite_reverse]" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)' }} />
        </div>

        {/* Notification Card */}
        <div
          className={`relative w-[320px] md:w-[360px] rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.4)] select-none border border-white/10 opacity-0 z-10
            ${currentStage === "intro" ? "noti-in" : ""}
            ${currentStage === "resting" ? "opacity-100" : ""}
            ${currentStage === "outro" ? "noti-out" : ""}
          `}
          style={{
            animationPlayState: isPlaying ? "running" : "paused",
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(24px) saturate(1.8) brightness(1.1)",
            WebkitBackdropFilter: "blur(24px) saturate(1.8) brightness(1.1)",
            boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.18), inset 1.5px 1.5px 0 rgba(255, 255, 255, 0.3), 0 20px 40px rgba(0, 0, 0, 0.3)"
          }}
        >
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10" />
          <div className="px-4 py-3.5 flex flex-col gap-1.5 relative z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-[20px] h-[20px] rounded-[5px] overflow-hidden flex items-center justify-center shadow-inner bg-white/10">
                  <Image src={iconSrc} alt="App" width={20} height={20} className="w-full h-full object-cover" unoptimized />
                </div>
                <span className="text-white/80 text-[11px] font-bold tracking-wide uppercase mt-[1px]">{appName}</span>
              </div>
              <span className="text-white/50 text-[11px] font-medium mt-[1px]">{notiTime}</span>
            </div>
            <div className="flex flex-col pr-1 mt-0.5">
              <h4 className="text-white font-semibold text-[14px] tracking-tight leading-tight">{notiTitle}</h4>
              <p className="text-white/90 text-[13px] font-medium leading-snug tracking-tight mt-[3px]">{notiMessage}</p>
            </div>
          </div>
        </div>

        {/* Pause/Play Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-200 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20">
            {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
          <div className="h-full bg-primary-container transition-none" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      {/* Controls Container */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2.5 backdrop-blur-md flex-1">
        
        {/* Duration Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sequence Duration</label>
            <span className="text-xs text-primary-container font-bold">{(totalDuration / 1000).toFixed(1)}s</span>
          </div>
          <input
            type="range" min={2000} max={10000} step={100}
            value={totalDuration}
            onChange={(e) => setTotalDuration(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary-container [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-container [&::-webkit-slider-thumb]:appearance-none"
          />
        </div>

        {/* App Presets with Real Icons */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">App Presets</label>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(PRESETS).map((p) => (
              <button
                key={p}
                onClick={() => selectPresetApp(p)}
                className={`flex items-center gap-1 py-1 px-2 text-[11px] font-bold rounded-md border transition-all ${
                  selectedPreset === p
                    ? "bg-primary-container text-on-primary-container border-primary-container"
                    : "bg-black/40 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                <Image src={PRESETS[p].icon} alt={PRESETS[p].name} width={14} height={14} className="w-3.5 h-3.5" unoptimized />
                {PRESETS[p].name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Icon Upload */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-black/40 overflow-hidden flex items-center justify-center border border-white/10">
            <Image src={iconSrc} alt="Icon" width={20} height={20} className="w-5 h-5 object-cover" unoptimized />
          </div>
          <label className="cursor-pointer flex items-center justify-center gap-1.5 py-1.5 px-3 bg-black/40 hover:bg-white/10 text-white rounded-lg transition-colors text-[11px] font-bold border border-white/10">
            <Upload size={12} /> Upload Icon
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {logoImage && (
            <button onClick={() => { setLogoImage(null); setSelectedPreset("messages"); }} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Text Inputs */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Title</label>
            <input
              type="text" value={notiTitle} onChange={(e) => setNotiTitle(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Message</label>
            <input
              type="text" value={notiMessage} onChange={(e) => setNotiMessage(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none"
            />
          </div>
        </div>

        <Link
          href="/login"
          className="w-full text-center py-2.5 rounded-lg font-label text-[10px] uppercase tracking-widest font-bold transition-colors bg-on-surface text-background hover:bg-primary-container hover:text-on-primary-container shadow-lg block mt-auto"
        >
          Login to Export Video
        </Link>
      </div>
    </div>
  );
}
