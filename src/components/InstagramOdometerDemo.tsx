"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, Bell, ChevronDown, Upload, X, UserPlus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'motion/react';
import { usePlayWhenInView } from '@/hooks/usePlayWhenInView';

// Odometer Components
const OdometerDigit = ({ char }: { char: string }) => {
  if (isNaN(Number(char)) || char === ' ') {
    return <span className="inline-block translate-y-[0.05em]">{char}</span>;
  }
  const num = parseInt(char, 10);
  return (
    <span className="inline-flex flex-col h-[1em] overflow-hidden leading-[1em] align-baseline align-text-bottom">
      <span className="flex flex-col transition-transform duration-[900ms] ease-[cubic-bezier(0.175,0.885,0.32,1.1)]" style={{ transform: `translateY(-${num}em)` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="h-[1em] flex items-center justify-center font-bold">{n}</span>
        ))}
      </span>
    </span>
  );
};

const Odometer = ({ value }: { value: string | number }) => {
  const chars = String(value).split('');
  return (
    <span className="inline-flex items-center" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {chars.map((char, index) => <OdometerDigit key={index} char={char} />)}
    </span>
  );
};

const ActionSparkles = ({ active }: { active: boolean }) => {
  if (!active) return null;
  const colors = ['#0095F6', '#47A5E9', '#0077C4', '#FFFFFF'];
  const particles = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i * (360 / 16)) * (Math.PI / 180);
    const distance = 40 + Math.random() * 30;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    const color = colors[i % colors.length];
    const size = 3 + Math.random() * 5;
    const delay = Math.random() * 0.05;
    return (
      <div key={i} className="absolute rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: `${size}px`, height: `${size}px`, backgroundColor: color, '--tx': `${tx}px`, '--ty': `${ty}px`, animation: `sparkle-pop 0.7s cubic-bezier(0.15, 0.85, 0.35, 1) ${delay}s forwards` } as React.CSSProperties}
      />
    );
  });
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-[#0095F6]/50 animate-ripple-ring pointer-events-none" />
      {particles}
    </div>
  );
};

export default function InstagramOdometerDemo() {
  const [channelName, setChannelName] = useState('Aesthetic Vibes');
  const [baseCount, setBaseCount] = useState(124000);
  const [igPosts, setIgPosts] = useState('1,204');
  const [igFollowing, setIgFollowing] = useState('42');
  const [igCategory, setIgCategory] = useState('Digital Creator');
  const [igBio, setIgBio] = useState('Creating visual experiences ✨\nCheck out the link below 👇');
  const [igLink, setIgLink] = useState('linktr.ee/aestheticvibes');
  
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [totalDuration, setTotalDuration] = useState(5000);
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedMs, setElapsedMs] = useState(0);

  const mainRef = useRef<HTMLDivElement>(null);
  const actionBtnRef = useRef<HTMLButtonElement>(null);
  const [targetCoords, setTargetCoords] = useState({ x: 0, y: 0 });

  const calculateTarget = useCallback(() => {
    const main = mainRef.current?.getBoundingClientRect();
    const btn = actionBtnRef.current?.getBoundingClientRect();
    if (main && btn) {
      setTargetCoords({
        x: (btn.left - main.left) + (btn.width / 2) - 4,
        y: (btn.top - main.top) + (btn.height / 2)
      });
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(calculateTarget, 100);
    window.addEventListener('resize', calculateTarget);
    return () => { clearTimeout(timeoutId); window.removeEventListener('resize', calculateTarget); };
  }, [calculateTarget]);

  const isInView = useInView(mainRef);
  const shouldPlay = usePlayWhenInView(isPlaying, isInView);

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
        if (next >= totalDuration) return 0;
        return next;
      });
      requestRef = requestAnimationFrame(animate);
    };
    requestRef = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef);
  }, [shouldPlay, totalDuration]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setLogoImage(URL.createObjectURL(file));
  };

  let currentStage = 0; 
  if (elapsedMs > 0 && elapsedMs <= 600) currentStage = 1; // Intro
  else if (elapsedMs > 600 && elapsedMs <= 1500) currentStage = 2; // Mouse moves
  else if (elapsedMs > 1500 && elapsedMs <= 1700) currentStage = 3; // Mouse clicks
  else if (elapsedMs > 1700 && elapsedMs <= (totalDuration - 800)) currentStage = 4; // Hold frame
  else if (elapsedMs > (totalDuration - 800)) currentStage = 5; // Outro

  const isActionTriggered = currentStage >= 3;
  const showSparkles = elapsedMs > 1500 && elapsedMs <= 2200;
  
  const displayCount = isActionTriggered ? (Number(baseCount) + 1).toLocaleString() : Number(baseCount).toLocaleString();

  const getMouseStyle = () => {
    const idleX = 800; const idleY = 800;
    let posX = idleX, posY = idleY, scale = 1, opacity = 0;
    switch (currentStage) {
      case 0: case 1: posX = idleX; posY = idleY; scale = 1; opacity = 0; break;
      case 2: posX = targetCoords.x; posY = targetCoords.y; scale = 1; opacity = 1; break;
      case 3: posX = targetCoords.x; posY = targetCoords.y; scale = 0.85; opacity = 1; break;
      case 4: posX = targetCoords.x + 20; posY = targetCoords.y + 20; scale = 1; opacity = 1; break;
      case 5: posX = idleX; posY = idleY; scale = 1; opacity = 0; break;
      default: break;
    }
    return {
      transform: `translate(${posX}px, ${posY}px) scale(${scale})`,
      opacity: opacity,
      transition: currentStage === 3 ? 'transform 0.1s ease-out' : currentStage === 4 ? 'transform 2s ease-out' : 'transform 0.8s cubic-bezier(0.25, 1.2, 0.3, 1), opacity 0.3s ease-in-out'
    };
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sparkle-pop { 0% { transform: translate(0, 0) scale(0); opacity: 1; } 40% { opacity: 1; transform: translate(calc(var(--tx) * 0.8), calc(var(--ty) * 0.8)) scale(1.1); } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; } }
        @keyframes ripple-pop { 0% { width: 10px; height: 10px; opacity: 1; } 100% { width: 100px; height: 100px; opacity: 0; } }
        .animate-ripple-ring { animation: ripple-pop 0.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards; }
        @keyframes pop-in { 0% { transform: scale(0.9) translateY(30px); opacity: 0; filter: blur(10px); } 100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0px); } }
        .anim-intro { animation: pop-in 0.7s cubic-bezier(0.2, 1.1, 0.3, 1) forwards; }
        @keyframes slide-out { 0% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0px); } 100% { transform: scale(0.9) translateY(-30px); opacity: 0; filter: blur(10px); } }
        .anim-outro { animation: slide-out 0.5s ease-in forwards; }
      `}} />

      {/* Video Canvas */}
      <div 
        ref={mainRef}
        className="w-full aspect-[2/1] rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl relative flex items-center justify-center cursor-pointer group"
        onClick={togglePlay}
      >
        {/* Background Gradients */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-[15%] left-[25%] w-[45vw] h-[45vw] rounded-full opacity-70 animate-[pulse_8s_ease-in-out_infinite]" style={{ background: 'radial-gradient(circle, rgba(225,48,108,0.35) 0%, transparent 70%)' }} />
          <div className="absolute bottom-[15%] right-[25%] w-[55vw] h-[35vw] rounded-full opacity-60 animate-[pulse_10s_ease-in-out_infinite_reverse]" style={{ background: 'radial-gradient(circle, rgba(131,58,180,0.35) 0%, transparent 70%)' }} />
        </div>

        {/* Instagram Profile Card */}
        <div 
          className={`relative flex flex-col gap-4 p-5 rounded-[28px] bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)] opacity-0 z-10 w-[90%] max-w-[340px] scale-[0.85] sm:scale-95 origin-center
            ${currentStage >= 1 && currentStage <= 4 ? 'anim-intro' : ''}
            ${currentStage === 5 ? 'anim-outro' : ''}
          `}
        >
          {/* Profile Header */}
          <div className="flex items-center gap-4 relative z-10 w-full">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[3px] bg-gradient-to-tr from-[#FEDA75] via-[#FA7E1E] to-[#D62976] shrink-0 shadow-lg">
              <div className="w-full h-full rounded-full border-[3px] border-black/40 overflow-hidden bg-black flex items-center justify-center">
                {logoImage ? <Image src={logoImage} alt="Logo" width={76} height={76} className="w-full h-full object-cover" unoptimized /> : <Upload size={20} className="text-white/50" />}
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="flex-1 flex justify-around items-center">
               <div className="flex flex-col items-center">
                 <span className="text-white font-bold text-[14px] sm:text-[16px]">{igPosts}</span>
                 <span className="text-neutral-400 text-[10px] sm:text-[12px]">Posts</span>
               </div>
               <div className="flex flex-col items-center">
                 <span className="text-white font-bold text-[14px] sm:text-[16px] drop-shadow-md">
                   <Odometer value={displayCount} />
                 </span>
                 <span className="text-neutral-400 text-[10px] sm:text-[12px]">Followers</span>
               </div>
               <div className="flex flex-col items-center">
                 <span className="text-white font-bold text-[14px] sm:text-[16px]">{igFollowing}</span>
                 <span className="text-neutral-400 text-[10px] sm:text-[12px]">Following</span>
               </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="flex flex-col gap-0.5 relative z-10">
            <span className="text-white font-bold text-[13px] sm:text-[14px]">{channelName}</span>
            {igCategory && <span className="text-neutral-400 text-[12px] sm:text-[14px]">{igCategory}</span>}
            <span className="text-white text-[12px] sm:text-[13px] leading-snug mt-1 whitespace-pre-wrap">{igBio}</span>
            {igLink && <span className="text-[#E0F1FF] text-[12px] sm:text-[13px] font-medium mt-1">{igLink}</span>}
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-2 relative z-10 w-full">
            <button 
              ref={actionBtnRef} 
              className={`relative flex-[1.5] flex items-center justify-center gap-1.5 h-9 rounded-lg font-bold text-[12px] sm:text-[13px] transition-all duration-300 overflow-hidden shadow-lg
                ${isActionTriggered ? 'bg-[#363636]/80 text-white border border-white/10 backdrop-blur-md' : 'bg-[#0095F6] text-white hover:bg-[#1877F2]'}`}
            >
              <ActionSparkles active={showSparkles} />
              {isActionTriggered ? (
                <span className="flex items-center gap-1 animate-[pop-in_0.3s_ease-out_forwards] whitespace-nowrap">
                  Following <ChevronDown size={14} className="opacity-70 mt-0.5 shrink-0" />
                </span>
              ) : <span className="whitespace-nowrap">Follow</span>}
            </button>
            
            <button className="flex-1 bg-[#363636]/80 backdrop-blur-md text-white border border-white/10 rounded-lg h-9 font-bold text-[12px] sm:text-[13px] hover:bg-[#4a4a4a] transition-colors whitespace-nowrap">
              Message
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-[#363636]/80 backdrop-blur-md text-white border border-white/10 rounded-lg hover:bg-[#4a4a4a] transition-colors shrink-0">
              <UserPlus size={16} />
            </button>
          </div>
        </div>

        {/* Cursor */}
        <div className="absolute z-50 pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] origin-top-left left-0 top-0" style={getMouseStyle()}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5.79v22.42l6.56-6.57h9.29L4.5.79z" fill="black" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          {currentStage === 3 && <div className="absolute top-0 left-0 w-8 h-8 -translate-x-3 -translate-y-3 rounded-full border-2 border-white/50 animate-ripple-ring" />}
        </div>
        
        {/* Pause/Play Overlay */}
        <div className={`absolute inset-0 flex items-center justify-center z-20 transition-opacity duration-200 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20">
            {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30">
          <div className="h-full bg-primary-container transition-none" style={{ width: `${(elapsedMs / totalDuration) * 100}%` }} />
        </div>
      </div>

      {/* Controls Container */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2.5 backdrop-blur-md flex-1">
        
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sequence Duration</label>
            <span className="text-xs text-primary-container font-bold">{(totalDuration / 1000).toFixed(1)}s</span>
          </div>
          <input
            type="range" min={3000} max={10000} step={100}
            value={totalDuration}
            onChange={(e) => setTotalDuration(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary-container [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-container [&::-webkit-slider-thumb]:appearance-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Name</label>
            <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Category</label>
            <input type="text" value={igCategory} onChange={(e) => setIgCategory(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Start Count</label>
            <input type="number" value={baseCount} onChange={(e) => setBaseCount(Number(e.target.value))} className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Posts</label>
            <input type="text" value={igPosts} onChange={(e) => setIgPosts(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none" />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Following</label>
            <input type="text" value={igFollowing} onChange={(e) => setIgFollowing(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
           <div className="flex flex-col gap-0.5">
             <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Bio Text</label>
             <input type="text" value={igBio} onChange={(e) => setIgBio(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none" />
           </div>
           <div className="flex flex-col gap-0.5">
             <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Bio Link</label>
             <input type="text" value={igLink} onChange={(e) => setIgLink(e.target.value)} className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none" />
           </div>
        </div>

        <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Logo</label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex-1 flex items-center justify-center py-1.5 bg-black/40 hover:bg-white/10 text-white rounded-lg transition-colors text-[10px] font-bold border border-white/10 h-7">
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {logoImage && (
                <button onClick={() => setLogoImage(null)} className="h-7 w-7 flex items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-colors">
                  <X size={12} />
                </button>
              )}
            </div>
        </div>

        <Link href="/login" className="w-full text-center py-2.5 rounded-lg font-label text-[10px] uppercase tracking-widest font-bold transition-colors bg-on-surface text-background hover:bg-primary-container hover:text-on-primary-container shadow-lg block mt-auto">
          Login to Export Video
        </Link>
      </div>
    </div>
  );
}
