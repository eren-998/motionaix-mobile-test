"use client";

import React, { useState, useEffect, useCallback } from 'react';
import {
  Play, RotateCcw, Pause, Clock,
  Upload, XCircle
} from 'lucide-react';
import { useInView } from 'motion/react';
import { usePlayWhenInView } from '@/hooks/usePlayWhenInView';
import Link from 'next/link';

const DEFAULTS = {
  bgImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop',
  logo: '',
  channelName: 'THE HINDU',
  headline: 'Trump signs order seeking to overhaul U.S. elections, including requiring {proof of citizenship}',
  date: 'Published - March 26, 2026 07:38 am',
  body: 'President Donald Trump signed a sweeping executive action to overhaul elections in the U.S. on Tuesday (March 25, 2026), including requiring {documentary proof} of citizenship to register to vote in federal elections and demanding that all ballots be received by Election Day.',
  highlightColor: '#FFF04D',
  textColor: '#000000',
  glowIntensity: 0,
  paperStyle: 'vintage',
  aspectRatio: '16:9',
};

const RATIOS: Record<string, number> = {
  'auto': 16 / 9,
  '1:1': 1,
  '9:16': 9 / 16,
  '16:9': 16 / 9,
};

export default function NewsArticleDemo() {
  const [bgImage, setBgImage] = useState(DEFAULTS.bgImage);
  const [logo, setLogo] = useState(DEFAULTS.logo);
  const [channelName, setChannelName] = useState(DEFAULTS.channelName);
  const [headline, setHeadline] = useState(DEFAULTS.headline);
  const [date, setDate] = useState(DEFAULTS.date);
  const [body, setBody] = useState(DEFAULTS.body);
  const [highlightColor, setHighlightColor] = useState(DEFAULTS.highlightColor);
  const [textColor, setTextColor] = useState(DEFAULTS.textColor);
  const [glowIntensity, setGlowIntensity] = useState(DEFAULTS.glowIntensity);
  const [paperStyle, setPaperStyle] = useState(DEFAULTS.paperStyle);
  const [aspectRatio, setAspectRatio] = useState(DEFAULTS.aspectRatio);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [totalDuration, setTotalDuration] = useState(8);
  const [elapsedMs, setElapsedMs] = useState(0);

  const mainRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(mainRef);
  const shouldPlay = usePlayWhenInView(isPlaying, isInView);

  const hasAutoPlayed = React.useRef(false);
  useEffect(() => {
    if (isInView && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      setIsPlaying(true);
    }
  }, [isInView]);

  useEffect(() => {
    let raf: number;
    let last = 0;
    const tick = (ts: number) => {
      if (!last) last = ts;
      const dt = ts - last;
      last = ts;
      setElapsedMs((p) => {
        const n = p + dt;
        if (n >= totalDuration * 1000) {
          setIsPlaying(false);
          setIsFinished(true);
          return totalDuration * 1000;
        }
        return n;
      });
      raf = requestAnimationFrame(tick);
    };
    if (shouldPlay) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldPlay, totalDuration]);

  const togglePlay = useCallback(() => {
    if (isFinished) { setElapsedMs(0); setIsFinished(false); setIsPlaying(true); }
    else setIsPlaying(p => !p);
  }, [isFinished]);

  const handleReplay = useCallback(() => {
    setElapsedMs(0); setIsFinished(false); setIsPlaying(true);
  }, []);

  const handleImg = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setter(URL.createObjectURL(f));
  };

  const progress = elapsedMs / (totalDuration * 1000);
  const animActive = isPlaying || (elapsedMs > 0 && elapsedMs < totalDuration * 1000);
  const isHL = elapsedMs > 1500;

  const renderText = (text: string) => {
    if (!text) return null;
    // Split by {words} keeping the matched string
    const parts = text.split(/(\{.*?\})/g);
    
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        const innerText = part.slice(1, -1);
        return (
          <span key={i} className="inline relative" style={{
            backgroundImage: `linear-gradient(to right, ${highlightColor} 50%, transparent 50%)`,
            backgroundSize: '200% 100%',
            backgroundPosition: isHL ? '0 0' : '100% 0',
            transition: 'background-position 1.2s cubic-bezier(0.25,1,0.5,1), color 0.5s ease',
            padding: '0.05em 0', color: isHL ? '#FFF' : 'inherit',
            boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'
          }}>{innerText}</span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const iCls = "bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none w-full";
  const lCls = "text-[9px] uppercase tracking-widest text-on-surface-variant font-bold";
  const ratio = RATIOS[aspectRatio] || RATIOS['16:9'];

  return (
    <div className="flex flex-col gap-3 w-full" ref={mainRef}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes ae-3d-reveal {
          0%{opacity:0;transform:perspective(2000px) translateZ(400px) translateY(150px) rotateX(45deg) rotateY(-15deg) rotateZ(5deg);filter:blur(20px)}
          100%{opacity:1;transform:perspective(2000px) translateZ(0) translateY(0) rotateX(0) rotateY(0) rotateZ(0);filter:blur(0);box-shadow:0 40px 80px -20px rgba(0,0,0,.8)}
        }
        .anim-ae-reveal{animation:ae-3d-reveal 1.6s cubic-bezier(.16,1,.3,1) forwards;will-change:transform,opacity,filter;backface-visibility:hidden}
      `}} />

      {/* ═══ 3 COLUMN: [left params] [video] [right params] — all stretch to same height ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-3 items-stretch">

        {/* ── LEFT PANEL: Content fields ── */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md flex flex-col gap-2 order-2 lg:order-1 overflow-y-auto max-h-[600px] lg:max-h-none">
          <span className="text-[9px] uppercase tracking-widest text-primary-container font-bold">Content</span>

          <div className="flex flex-col gap-0.5">
            <label className={lCls}>Channel</label>
            <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} className={iCls} />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className={lCls}>Date</label>
            <input type="text" value={date} onChange={(e) => setDate(e.target.value)} className={iCls} />
          </div>
          <div className="flex flex-col gap-0.5 flex-1">
            <label className={lCls}>Headline</label>
            <textarea value={headline} onChange={(e) => setHeadline(e.target.value)} className={iCls + " resize-none font-serif leading-snug flex-1 min-h-[60px]"} />
          </div>
          <div className="flex flex-col gap-0.5 flex-[2]">
            <label className={lCls}>Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} className={iCls + " resize-none flex-1 min-h-[80px]"} />
          </div>
          {/* uploads */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <div className="relative h-8 bg-black/40 border border-white/10 border-dashed rounded-lg flex items-center justify-center hover:border-white/30 cursor-pointer overflow-hidden">
              <input type="file" accept="image/*" onChange={handleImg(setBgImage)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <span className="flex items-center gap-1 text-on-surface-variant text-[9px] font-semibold"><Upload size={10} /> BG Image</span>
            </div>
            <div className="relative h-8 bg-black/40 border border-white/10 border-dashed rounded-lg flex items-center justify-center hover:border-white/30 cursor-pointer overflow-hidden">
              {logo && <button onClick={(e) => { e.preventDefault(); setLogo(''); }} className="absolute right-0.5 top-0.5 z-20 text-red-400 bg-black/50 rounded-full p-0.5"><XCircle size={12} /></button>}
              <input type="file" accept="image/*" onChange={handleImg(setLogo)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <span className="flex items-center gap-1 text-on-surface-variant text-[9px] font-semibold"><Upload size={10} /> Logo</span>
            </div>
          </div>
        </div>

        {/* ── CENTER: Video Player (fixed stage, video resizes inside) ── */}
        <div className="flex flex-col gap-2 order-1 lg:order-2">
          {/* Black stage */}
          <div className="w-full bg-black rounded-2xl border border-white/20 shadow-2xl overflow-hidden relative flex-1 min-h-[350px]" style={{ minHeight: '420px' }}>
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div
                className="relative bg-black rounded-xl overflow-hidden transition-all duration-500 ease-out shadow-2xl cursor-pointer group"
                onClick={togglePlay}
                style={{
                  aspectRatio: ratio,
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: ratio >= 1 ? '100%' : 'auto',
                  height: ratio < 1 ? '100%' : 'auto',
                }}
              >
                {/* Background */}
                {bgImage && (<>
                  <div className="absolute inset-0 z-0 scale-105" style={{
                    backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: animActive ? 'blur(5px) brightness(0.35)' : 'blur(0px) brightness(0.6)',
                    transition: `filter ${totalDuration}s ease-out`
                  }} />
                  <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.95) 100%)' }} />
                </>)}

                {/* Zoom wrapper */}
                <div className="absolute inset-0 z-10 flex items-center justify-center transform-gpu pointer-events-none" style={{
                  transform: animActive ? 'scale(0.85)' : 'scale(1)',
                  transition: animActive ? `transform ${totalDuration}s cubic-bezier(0.25,1,0.5,1)` : 'transform 0.5s ease',
                }}>
                  <div className={`w-[92%] max-w-[850px] mx-auto overflow-hidden rounded-sm relative
                    ${animActive ? 'anim-ae-reveal' : 'opacity-100 drop-shadow-2xl'}
                    ${paperStyle === 'transparent' ? 'bg-black/40 backdrop-blur-md border border-white/20' : ''}
                    ${paperStyle === 'classic' ? 'bg-[#fdfcfb]' : ''}
                    ${paperStyle === 'vintage' ? 'bg-[#F3EFE6] border border-[#d4cdbd]' : ''}
                    ${paperStyle === 'newsprint' ? 'bg-[#EBECE7] border border-[#ccc]' : ''}
                  `} style={{
                    color: paperStyle === 'transparent' ? '#FFF' : textColor,
                    textShadow: glowIntensity > 0 ? `0 0 ${glowIntensity}px rgba(255,255,255,.8), 0 0 ${glowIntensity * 2}px ${textColor}60` : 'none',
                    boxShadow: paperStyle === 'transparent' ? 'inset 0 0 100px rgba(0,0,0,.5), 0 40px 80px rgba(0,0,0,.8)' : '0 40px 80px rgba(0,0,0,.7)'
                  }}>
                    {paperStyle !== 'transparent' && paperStyle !== 'classic' && (
                      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")' }} />
                    )}
                    <div className="relative z-10">
                      <div className={`px-4 py-3 flex items-center justify-center border-b ${paperStyle === 'transparent' ? 'border-white/20 bg-black/30' : 'border-neutral-300 bg-black/5'}`}>
                        {logo && <img src={logo} alt="Logo" className="h-6 w-auto mr-3 object-contain" />}
                        <h2 className="text-sm sm:text-xl font-serif font-black tracking-wider uppercase px-3 py-0.5 rounded shadow-lg bg-[#2b4c6e] text-white" style={{ fontFamily: 'Georgia, serif' }}>{channelName}</h2>
                      </div>
                      <div className="p-3 sm:p-6 flex flex-col items-start gap-2 text-left">
                        <h1 className="text-sm sm:text-2xl font-serif font-bold leading-[1.2] tracking-tight">{renderText(headline)}</h1>
                        <div className={`w-full border-b pb-1.5 mb-1 ${paperStyle === 'transparent' ? 'border-white/20 text-gray-300' : 'border-neutral-300/60 opacity-80'}`}>
                          {date && <span className="text-[8px] sm:text-xs font-sans tracking-wide font-medium uppercase">{date}</span>}
                        </div>
                        {body && <p className={`text-[9px] sm:text-sm leading-relaxed font-serif text-justify ${paperStyle === 'transparent' ? 'text-gray-100' : 'opacity-90'}`} style={{ textIndent: '1.5em' }}>{renderText(body)}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Play/Pause overlay */}
                <div className={`absolute inset-0 flex items-center justify-center z-30 transition-opacity duration-200 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100 bg-black/30'}`}>
                  <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-black/80 transition-colors">
                    {isFinished ? <RotateCcw size={24} className="text-white" /> : isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-40">
                  <div className="h-full bg-primary-container" style={{ width: `${progress * 100}%`, transition: isPlaying ? 'width 100ms linear' : 'none', boxShadow: '0 0 8px rgba(255,209,0,.6)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Controls bar */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-md flex-wrap">
            <button onClick={togglePlay} className="p-1.5 bg-primary-container/20 text-primary-container hover:bg-primary-container/30 rounded-lg transition-all active:scale-95">
              {isPlaying ? <Pause size={14} fill="currentColor" /> : isFinished ? <RotateCcw size={14} /> : <Play size={14} fill="currentColor" />}
            </button>
            <button onClick={handleReplay} className="p-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-all active:scale-95"><RotateCcw size={14} /></button>
            <Clock size={11} className="text-on-surface-variant shrink-0 ml-1" />
            <input type="range" min="3" max="15" step="0.5" value={totalDuration} onChange={(e) => setTotalDuration(Number(e.target.value))} className="flex-1 min-w-[60px] h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary-container [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-container [&::-webkit-slider-thumb]:appearance-none" />
            <span className="text-[10px] text-primary-container font-bold shrink-0">{totalDuration}s</span>
            <div className="h-4 w-px bg-white/10 mx-0.5" />
            {Object.entries(RATIOS).map(([k]) => (
              <button key={k} onClick={() => setAspectRatio(k)} className={`px-2 py-0.5 text-[9px] font-bold rounded-md border transition-all ${aspectRatio === k ? 'bg-primary-container text-on-primary-container border-primary-container' : 'bg-black/30 border-white/10 text-on-surface-variant'}`}>{k === 'auto' ? 'Auto' : k}</button>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL: Styling — stretches to match ── */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md flex flex-col gap-2.5 order-3">
          <span className="text-[9px] uppercase tracking-widest text-primary-container font-bold">Styling</span>

          <div className="flex flex-col gap-1">
            <label className={lCls}>Paper Style</label>
            <div className="grid grid-cols-2 gap-1">
              {(['vintage', 'newsprint', 'classic', 'transparent'] as const).map(s => (
                <button key={s} onClick={() => setPaperStyle(s)} className={`py-1.5 text-[9px] font-bold rounded-md border transition-all ${paperStyle === s
                  ? (s === 'vintage' ? 'bg-[#F3EFE6] text-[#4a4036] border-[#d4cdbd]'
                    : s === 'newsprint' ? 'bg-[#EBECE7] text-[#333] border-[#ccc]'
                    : s === 'classic' ? 'bg-white text-black border-white'
                    : 'bg-black/60 text-white border-white/20')
                  : 'bg-black/30 border-white/10 text-on-surface-variant'
                }`}>{s === 'transparent' ? 'Clear' : s === 'newsprint' ? 'News' : s.charAt(0).toUpperCase() + s.slice(1)}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 p-2 rounded-lg bg-black/20 border border-primary-container/10">
            <label className={lCls}>How to Highlight</label>
            <p className="text-[10px] text-on-surface-variant/80 leading-relaxed font-medium">
              Use curly brackets <span className="text-white bg-white/10 px-1 rounded mx-0.5">{`{}`}</span> around words in the content fields to highlight them. 
              <br/><br/>
              Example: <span className="text-white bg-white/10 px-1 rounded">The {`{American government}`} refused...</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <input type="color" value={highlightColor} onChange={(e) => setHighlightColor(e.target.value)} className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer p-0" />
              <span className="text-[9px] text-on-surface-variant">Highlight</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer p-0" />
              <span className="text-[9px] text-on-surface-variant">Text</span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <label className={lCls}>Text Glow: {glowIntensity}</label>
            <input type="range" min="0" max="20" step="1" value={glowIntensity} onChange={(e) => setGlowIntensity(Number(e.target.value))} className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary-container" />
          </div>

          <Link href="/login" className="w-full text-center py-2.5 rounded-lg font-label text-[10px] uppercase tracking-widest font-bold transition-colors bg-on-surface text-background hover:bg-primary-container hover:text-on-primary-container shadow-lg block mt-auto">
            Login to Export Video
          </Link>
        </div>
      </div>
    </div>
  );
}
