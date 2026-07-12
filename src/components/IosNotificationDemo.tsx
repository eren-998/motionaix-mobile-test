"use client";

import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Pause, User, Upload, X, Clock, Settings, Bell } from "lucide-react";
import Link from "next/link";

interface Preset {
  name: string;
  title: string;
  message: string;
  bg: string;
  icon: React.ReactNode;
}

const PRESETS: Record<string, Preset> = {
  messages: {
    name: "Messages",
    title: "Sarah Jenkins",
    message: "Are we still meeting at Blue Bottle Coffee at 5? ☕",
    bg: "bg-[#34C759]",
    icon: <path d="M12 2C6.477 2 2 6.14 2 11.25c0 2.87 1.487 5.43 3.824 7.128a10.22 10.22 0 01-2.613 3.125c-.287.214-.075.666.27.607 3.09-.526 5.37-2.074 6.784-3.327C10.835 18.91 11.411 18.95 12 18.95c5.523 0 10-4.14 10-9.25C22 6.14 17.523 2 12 2z" />
  },
  whatsapp: {
    name: "WhatsApp",
    title: "Bro (Group) 🔥",
    message: "Check out this new motion graphic render!",
    bg: "bg-[#25D366]",
    icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
  },
  instagram: {
    name: "Instagram",
    title: "alex_design",
    message: "Liked your story.",
    bg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>
  },
  gmail: {
    name: "Gmail",
    title: "Google Workspace",
    message: "Your meeting starts in 10 minutes.",
    bg: "bg-white",
    icon: <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" fill="#EA4335" />
  }
};

export default function IosNotificationDemo() {
  const [appName, setAppName] = useState(PRESETS.messages.name);
  const [notiTitle, setNotiTitle] = useState(PRESETS.messages.title);
  const [notiMessage, setNotiMessage] = useState(PRESETS.messages.message);
  const [notiTime, setNotiTime] = useState("now");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState("messages");
  
  const [totalDuration, setTotalDuration] = useState(5); 
  const [animState, setAnimState] = useState("idle");
  const [elapsedMs, setElapsedMs] = useState(0);

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
    let intervalId: NodeJS.Timeout;
    if (animState === "playing") {
      intervalId = setInterval(() => {
        setElapsedMs((prev) => {
          const next = prev + 10;
          if (next >= totalDuration * 1000) {
            setAnimState("idle");
            return 0;
          }
          return next;
        });
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [animState, totalDuration]);

  const handlePlay = () => {
    if (animState === "idle") setElapsedMs(0);
    setAnimState("playing");
  };

  const handleReset = () => {
    setAnimState("idle");
    setElapsedMs(0);
  };

  let currentStage = "hidden";
  if (elapsedMs > 0 && elapsedMs < 700) {
    currentStage = "intro";
  } else if (elapsedMs >= 700 && elapsedMs < (totalDuration * 1000 - 600)) {
    currentStage = "resting";
  } else if (elapsedMs >= (totalDuration * 1000 - 600) && elapsedMs < (totalDuration * 1000)) {
    currentStage = "outro";
  }

  const getAppIcon = () => {
    if (logoImage) {
      return <img src={logoImage} alt="Icon" className="w-full h-full object-cover" />;
    }
    const preset = PRESETS[selectedPreset];
    if (preset) {
      return (
        <div className={`w-full h-full ${preset.bg} flex items-center justify-center`}>
          <svg viewBox="0 0 24 24" className="w-[12px] h-[12px]" fill={preset.name === 'Instagram' ? 'none' : 'white'} stroke={preset.name === 'Instagram' ? 'white' : 'none'} xmlns="http://www.w3.org/2000/svg">
            {preset.icon}
          </svg>
        </div>
      );
    }
    return <Bell size={12} className="text-white" />;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      
      {/* Hidden Liquid Glass SVG Filter */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="apple-liquid-glass" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage x="0" y="0" width="400" height="120" href="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22120%22%20viewBox%3D%220%200%20400%20120%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22Y%22%20x1%3D%220%22%20x2%3D%220%22%20y1%3D%225%25%22%20y2%3D%2295%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%230F0%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23000%22%2F%3E%3C%2FlinearGradient%3E%3ClinearGradient%20id%3D%22X%22%20x1%3D%224%25%22%20x2%3D%2296%25%22%20y1%3D%220%22%20y2%3D%220%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23F00%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23000%22%2F%3E%3C%2FlinearGradient%3E%3C/defs%3E%3Crect%20width%3D%22400%22%20height%3D%22120%22%20fill%3D%22%23808080%22%2F%3E%3Cg%20filter%3D%22blur(1px)%22%3E%3Crect%20width%3D%22400%22%20height%3D%22120%22%20fill%3D%22%23000080%22%2F%3E%3Crect%20width%3D%22400%22%20height%3D%22120%22%20fill%3D%22url(%23Y)%22%20style%3D%22mix-blend-mode%3Ascreen%22%2F%3E%3Crect%20width%3D%22400%22%20height%3D%22120%22%20fill%3D%22url(%23X)%22%20style%3D%22mix-blend-mode%3Ascreen%22%2F%3E%3Crect%20x%3D%2216%22%20y%3D%2216%22%20width%3D%22368%22%20height%3D%2288%22%20rx%3D%2224%22%20ry%3D%2224%22%20fill%3D%22%23808080%22%20filter%3D%22blur(12px)%22%2F%3E%3C/g%3E%3C/svg%3E" result="displacementMap" />
          <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="22" xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix type="matrix" result="displacedR" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="20" xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix type="matrix" result="displacedG" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          <feDisplacementMap in="SourceGraphic" in2="displacementMap" scale="18" xChannelSelector="R" yChannelSelector="G" />
          <feColorMatrix type="matrix" result="displacedB" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          <feBlend in="displacedR" in2="displacedG" mode="screen" result="rg" />
          <feBlend in="rg" in2="displacedB" mode="screen" />
        </filter>
      </svg>

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
        .noti-anim-in { animation: iOS-spring-in 0.7s cubic-bezier(0.25, 1.25, 0.5, 1) forwards; }
        .noti-anim-out { animation: iOS-spring-out 0.55s cubic-bezier(0.3, 0.1, 0.3, 1) forwards; }
      `}} />

      {/* Preview Canvas */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl relative flex flex-col items-center justify-start pt-12">
        {/* Ambient Glows */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-[10%] left-[25%] w-[30%] h-[30%] bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-[20%] right-[15%] w-[40%] h-[40%] bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        </div>

        {/* The Notification Card */}
        <div 
          className={`relative w-[340px] rounded-[24px] shadow-[0_16px_40px_rgba(0,0,0,0.4)] select-none border border-white/10 opacity-0 z-10 
            ${currentStage === "intro" ? "noti-anim-in" : ""}
            ${currentStage === "resting" ? "opacity-100" : ""}
            ${currentStage === "outro" ? "noti-anim-out" : ""}
          `}
          style={{
            animationPlayState: animState === "paused" ? "paused" : "running",
            background: "rgba(255, 255, 255, 0)",
            backdropFilter: "blur(1px) url(#apple-liquid-glass) blur(3px) saturate(1.6) brightness(1.15)",
            WebkitBackdropFilter: "blur(8px) saturate(1.8) brightness(1.2) contrast(1.05)",
            boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.18), inset 1.5px 1.5px 0 rgba(255, 255, 255, 0.4), inset 0 0 14px rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0, 0, 0, 0.3)"
          }}
        >
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/12 to-transparent pointer-events-none z-10" />
          <div className="px-4 py-3.5 flex flex-col gap-1.5 relative z-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-[20px] h-[20px] rounded-[5px] overflow-hidden flex items-center justify-center shadow-inner">
                  {getAppIcon()}
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
      </div>

      {/* Controls Container */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-md">
        
        {/* Presets */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">App Presets</label>
          <div className="flex flex-wrap gap-2">
            {Object.keys(PRESETS).map((p) => (
              <button 
                key={p} onClick={() => selectPresetApp(p)}
                className={`py-1.5 px-3 text-xs font-bold rounded-lg border transition-all ${
                  selectedPreset === p 
                    ? "bg-primary-container text-on-primary-container border-primary-container" 
                    : "bg-black/40 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {PRESETS[p].name}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">App Icon (Upload)</label>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-md bg-black/40 overflow-hidden flex items-center justify-center border border-white/10">
                {getAppIcon()}
              </div>
              <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-2 px-2 bg-black/40 hover:bg-white/10 text-white rounded-lg transition-colors text-xs font-bold border border-white/10">
                <Upload size={14} /> Upload Icon
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Time Text</label>
            <input 
              type="text" value={notiTime} onChange={(e) => setNotiTime(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-container outline-none h-[36px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Notification Title</label>
            <input 
              type="text" value={notiTitle} onChange={(e) => setNotiTitle(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-container outline-none h-[36px]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Message</label>
            <input 
              type="text" value={notiMessage} onChange={(e) => setNotiMessage(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-container outline-none h-[36px]"
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex gap-2 mt-2">
          <button 
            onClick={handlePlay}
            className="flex-1 flex items-center justify-center gap-2 bg-on-surface text-background py-3 rounded-xl font-bold text-sm hover:bg-primary-container hover:text-on-primary-container transition-all shadow-lg active:scale-95"
          >
            <Play size={16} fill="currentColor" /> Preview Animation
          </button>
          <button 
            onClick={handleReset}
            className="p-3 bg-black/40 text-white rounded-xl hover:bg-white/10 transition-colors border border-white/10 active:scale-95"
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <Link
          href="/login"
          className="w-full text-center py-3.5 rounded-xl font-label text-xs uppercase tracking-widest font-bold transition-colors bg-white/5 border border-white/10 text-white hover:bg-white/10 shadow-lg block mt-2"
        >
          Login to Export Video
        </Link>
      </div>
    </div>
  );
}
