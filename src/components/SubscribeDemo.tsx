"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Bell, BellRing, ChevronDown, User, Upload, X, ThumbsUp } from "lucide-react";
import Link from "next/link";

export default function SubscribeDemo() {
  const [channelName, setChannelName] = useState("Motionaix");
  const [handle, setHandle] = useState("@motionaix");
  const [subCount, setSubCount] = useState("1.2M subscribers");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [totalDuration, setTotalDuration] = useState(5);

  const [animStage, setAnimStage] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const timelineRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimeline = () => {
    timelineRef.current.forEach(clearTimeout);
    timelineRef.current = [];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoImage(url);
    }
  };

  const playAnimation = () => {
    clearTimeline();
    setAnimStage(0);
    setShowSparkles(false);

    const totalMs = totalDuration * 1000;
    const tIntro = 0;
    const tMoveToLike = totalMs * 0.10;
    const tClickLike = totalMs * 0.22;
    const tMoveToSub = totalMs * 0.35;
    const tClickSub = totalMs * 0.48;
    const tMoveToBell = totalMs * 0.60;
    const tClickBell = totalMs * 0.72;
    const tExitMouse = totalMs * 0.85;
    const tCardOutro = totalMs * 0.95;

    setAnimStage(1);

    timelineRef.current.push(setTimeout(() => setAnimStage(2), tMoveToLike));
    timelineRef.current.push(setTimeout(() => setAnimStage(3), tClickLike));
    
    timelineRef.current.push(setTimeout(() => setAnimStage(4), tMoveToSub));
    timelineRef.current.push(setTimeout(() => {
      setAnimStage(5);
      setShowSparkles(true);
    }, tClickSub));
    timelineRef.current.push(setTimeout(() => setShowSparkles(false), tClickSub + 600));

    timelineRef.current.push(setTimeout(() => setAnimStage(6), tMoveToBell));
    timelineRef.current.push(setTimeout(() => setAnimStage(7), tClickBell));

    timelineRef.current.push(setTimeout(() => setAnimStage(8), tExitMouse));
    timelineRef.current.push(setTimeout(() => setAnimStage(9), tCardOutro));
    timelineRef.current.push(setTimeout(() => setAnimStage(0), totalMs));
  };

  const resetAnimation = () => {
    clearTimeline();
    setAnimStage(0);
    setShowSparkles(false);
  };

  useEffect(() => {
    return () => clearTimeline();
  }, []);

  const getMouseTransitionDuration = () => {
    if ([3, 5, 7].includes(animStage)) return "0.08s";
    const proportionalSpeed = (totalDuration * 1000) * 0.12;
    const travelSpeedSeconds = Math.min(600, proportionalSpeed) / 1000;
    return `${travelSpeedSeconds}s`;
  };

  const getMousePosition = () => {
    // We calibrate coordinates relative to the banner center
    switch (animStage) {
      case 0: return { x: 200, y: 150, opacity: 0, scale: 1 };
      case 1: return { x: 200, y: 150, opacity: 0, scale: 1 };
      case 2: return { x: -45, y: 18, opacity: 1, scale: 1 };     // Like Button
      case 3: return { x: -45, y: 18, opacity: 1, scale: 0.8 };   // Like Click
      case 4: return { x: 45, y: 18, opacity: 1, scale: 1 };      // Sub Button
      case 5: return { x: 45, y: 18, opacity: 1, scale: 0.8 };    // Sub Click
      case 6: return { x: 130, y: 18, opacity: 1, scale: 1 };     // Bell
      case 7: return { x: 130, y: 18, opacity: 1, scale: 0.8 };   // Bell Click
      case 8: return { x: 200, y: 150, opacity: 0, scale: 1 };    // Exit
      case 9: return { x: 200, y: 150, opacity: 0, scale: 1 };
      default: return { x: 200, y: 150, opacity: 0, scale: 1 };
    }
  };

  const mousePos = getMousePosition();
  const isCardVisible = animStage >= 1 && animStage <= 8;
  const isLiked = animStage >= 3;
  const isSubscribed = animStage >= 5;
  const isBellRinging = animStage >= 7;

  return (
    <div className="flex flex-col gap-4 w-full">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounce-in {
          0% { transform: translateY(80px) scale(0.9); opacity: 0; }
          60% { transform: translateY(-5px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes slide-out {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(60px) scale(0.95); opacity: 0; }
        }
        @keyframes bell-shake {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-20deg); }
          40% { transform: rotate(20deg); }
          60% { transform: rotate(-10deg); }
          80% { transform: rotate(10deg); }
        }
        .anim-in { animation: bounce-in 0.6s cubic-bezier(0.34, 1.3, 0.64, 1) forwards; }
        .anim-out { animation: slide-out 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
        .anim-bell { animation: bell-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards; }
      `}} />

      {/* Preview Canvas */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl relative flex items-center justify-center">
        {/* Background Gradients */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-primary-container rounded-full mix-blend-screen filter blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-[20%] right-[20%] w-64 h-64 bg-[#6c4e31] rounded-full mix-blend-screen filter blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse]" />
        </div>

        {/* Lower Third Banner */}
        <div 
          className={`relative flex items-center gap-4 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 opacity-0
            ${isCardVisible ? 'anim-in' : ''}
            ${animStage === 9 ? 'anim-out' : ''}
          `}
          style={{ transition: 'opacity 0.2s ease-in-out', transform: 'scale(1.2)' }}
        >
          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-white/20 overflow-hidden flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
            {logoImage ? (
              <img src={logoImage} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={22} className="text-white/70" />
            )}
          </div>

          {/* Text */}
          <div className="flex flex-col pr-2">
            <span className="text-white font-bold text-[15px] leading-tight tracking-tight">{channelName}</span>
            <span className="text-white/60 text-[11px] font-medium tracking-tight mt-0.5">{handle} • {subCount}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center relative h-9">
            
            {/* Like Button */}
            <button 
              className={`flex items-center justify-center w-9 h-9 rounded-full mr-2 z-10 transition-colors duration-300
                ${isLiked ? 'bg-primary-container text-on-primary-container' : 'bg-white/10 text-white'}
                ${animStage === 3 ? 'scale-90' : 'scale-100'}
              `}
              style={{ transition: 'all 0.2s ease' }}
            >
              <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
            </button>

            {/* Subscribe Button */}
            <button 
              className={`relative overflow-hidden flex items-center justify-center h-9 rounded-full font-bold text-[13px] z-10 transition-all duration-300
                ${isSubscribed ? 'bg-white/10 text-white/80 w-[115px]' : 'bg-white text-black w-[94px] hover:bg-neutral-200'}
                ${animStage === 5 ? 'scale-95 bg-neutral-300 text-black' : 'scale-100'}
              `}
            >
              {isSubscribed ? (
                <span className="flex items-center justify-center gap-1 w-full animate-in fade-in duration-300">
                  <Bell size={14} className="mb-[1px]" />
                  Subscribed
                  <ChevronDown size={13} className="opacity-70 ml-0.5" />
                </span>
              ) : (
                <span>Subscribe</span>
              )}
            </button>

            {/* Bell Button */}
            <div 
              className={`absolute left-[142px] flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white z-0 transition-all duration-400 origin-left
                ${isSubscribed ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 -translate-x-8 pointer-events-none'}
                ${animStage === 7 ? 'scale-90 bg-white/20' : ''}
              `}
            >
              {isBellRinging ? (
                <BellRing size={16} className="anim-bell" fill="currentColor" />
              ) : (
                <Bell size={16} />
              )}
            </div>

            {/* Smooth Mouse Cursor */}
            <div 
              className="absolute z-50 pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
              style={{
                transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(${mousePos.scale})`,
                opacity: mousePos.opacity,
                transition: `transform ${getMouseTransitionDuration()} cubic-bezier(0.25, 1, 0.2, 1), opacity 0.3s ease-in-out`
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5.79v22.42l6.56-6.57h9.29L4.5.79z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Container */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-md">
        
        {/* Upload Logo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Channel Logo</label>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black/40 overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
              {logoImage ? (
                <img src={logoImage} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-white/50" />
              )}
            </div>
            <label className="cursor-pointer flex items-center justify-center gap-2 py-2 px-4 bg-black/40 hover:bg-white/10 text-white rounded-lg transition-colors text-xs font-bold border border-white/10">
              <Upload size={14} /> Upload Image
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {logoImage && (
              <button onClick={() => setLogoImage(null)} className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Channel Name</label>
            <input 
              type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-container outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Handle</label>
            <input 
              type="text" value={handle} onChange={(e) => setHandle(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-container outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Subscribers</label>
            <input 
              type="text" value={subCount} onChange={(e) => setSubCount(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-container outline-none"
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex gap-2 mt-2">
          <button 
            onClick={playAnimation}
            className="flex-1 flex items-center justify-center gap-2 bg-on-surface text-background py-3 rounded-xl font-bold text-sm hover:bg-primary-container hover:text-on-primary-container transition-all shadow-lg active:scale-95"
          >
            <Play size={16} fill="currentColor" /> Preview Animation
          </button>
          <button 
            onClick={resetAnimation}
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
