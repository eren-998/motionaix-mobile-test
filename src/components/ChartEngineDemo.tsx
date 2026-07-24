"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Plus, Trash2, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useInView } from 'motion/react';
import { usePlayWhenInView } from '@/hooks/usePlayWhenInView';

// Easing Functions
const Easing = {
  linear: (t: number) => t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
};

function interpolate(progress: number, inRange: [number, number], outRange: [number, number], easing: keyof typeof Easing = 'linear') {
  const [inStart, inEnd] = inRange;
  const [outStart, outEnd] = outRange;
  if (progress <= inStart) return outStart;
  if (progress >= inEnd) return outEnd;
  let p = (progress - inStart) / (inEnd - inStart);
  p = Easing[easing](p);
  return outStart + p * (outEnd - outStart);
}

const DEFAULTS = {
  title: 'REVENUE GROWTH',
  subtitle: 'Q1 - Q4 Fiscal Year 2026',
  insightTitle: 'Key Insight',
  insightText: 'With a peak value reaching 140 during the 2026 phase, the metric indicates sustained scaling capabilities.',
  data: [
    { id: 1, label: '2023', value: 45, desc: 'Initial Stage', color: '#E4E4E7' },
    { id: 2, label: '2024', value: 30, desc: 'Market Dip', color: '#E4E4E7' },
    { id: 3, label: '2025', value: 85, desc: 'Recovery', color: '#E4E4E7' },
    { id: 4, label: '2026', value: 140, desc: 'Massive Scale', color: '#3B82F6' },
  ]
};

export default function ChartEngineDemo() {
  // Content States
  const [title, setTitle] = useState(DEFAULTS.title);
  const [subtitle, setSubtitle] = useState(DEFAULTS.subtitle);
  const [dataPoints, setDataPoints] = useState(DEFAULTS.data);
  
  // Settings States
  const [totalDuration, setTotalDuration] = useState(6000); // ms
  const [yAxisGap, setYAxisGap] = useState(20);
  const [yAxisMinLines, setYAxisMinLines] = useState(5);
  
  const [showInsight, setShowInsight] = useState(true);
  const [insightAnim, setInsightAnim] = useState(true);
  const [insightPosition, setInsightPosition] = useState<'TR' | 'TL' | 'BR' | 'BL'>('TR');
  const [insightTitle, setInsightTitle] = useState(DEFAULTS.insightTitle);
  const [insightText, setInsightText] = useState(DEFAULTS.insightText);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const mainRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const isInView = useInView(mainRef);
  const shouldPlay = usePlayWhenInView(isPlaying, isInView);

  // CSS Styles for UI consistency
  const iCls = "bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none w-full";
  const lCls = "text-[9px] uppercase tracking-widest text-on-surface-variant font-bold";

  // Responsive Scaling for 1920x1080 Canvas
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      const newScale = Math.min(width / 1920, height / 1080);
      setScale(newScale);
    });
    // Find the center wrapper to measure
    const centerWrapper = document.getElementById('chart-center-wrapper');
    if (centerWrapper) observer.observe(centerWrapper);
    return () => observer.disconnect();
  }, []);

  // Animation Loop
  useEffect(() => {
    let raf: number;
    let lastTime = 0;
    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      
      setElapsedMs((prev) => {
        const next = prev + delta;
        if (next >= totalDuration + 1000) { // +1s buffer hold at the end
          setIsPlaying(false);
          setIsFinished(true);
          return totalDuration + 1000;
        }
        return next;
      });
      raf = requestAnimationFrame(animate);
    };
    if (shouldPlay) raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [shouldPlay, totalDuration]);

  const togglePlay = () => {
    if (isFinished) { setElapsedMs(0); setIsFinished(false); setIsPlaying(true); }
    else setIsPlaying(p => !p);
  };
  
  const handleReplay = () => {
    setElapsedMs(0); setIsFinished(false); setIsPlaying(true);
  };

  const progress = Math.min(1, elapsedMs / totalDuration);

  // --- SMART Y-AXIS MATH LOGIC ---
  const safeGap = Math.max(1, yAxisGap); 
  const safeMinLines = Math.max(1, yAxisMinLines);
  
  const userMaxY = safeGap * safeMinLines;
  const dataMaxY = Math.max(...dataPoints.map(p => Number(p.value) || 0), 0);
  const highestValue = Math.max(userMaxY, dataMaxY);
  
  const chartTopY = Math.ceil(highestValue / safeGap) * safeGap;
  const numLines = Math.floor(chartTopY / safeGap) + 1;
  const gridLevels = Array.from({ length: numLines }, (_, i) => 1 - (i / (numLines - 1))); 
  
  // Prevent crash if user types e.g gap 1 and value 10000
  const finalGridLevels = gridLevels.length > 50 ? [1, 0.75, 0.5, 0.25, 0] : gridLevels;
  const finalChartTopY = gridLevels.length > 50 ? highestValue : chartTopY;

  // Data Actions
  const addDataPoint = () => {
    if (dataPoints.length >= 15) return;
    const newId = dataPoints.length > 0 ? Math.max(...dataPoints.map(d => d.id)) + 1 : 1;
    setDataPoints([...dataPoints, { id: newId, label: 'New', value: 50, desc: 'Desc', color: '#E4E4E7' }]);
  };
  const removeDataPoint = (id: number) => {
    if (dataPoints.length <= 1) return;
    setDataPoints(dataPoints.filter(d => d.id !== id));
  };
  const updateDataPoint = (id: number, key: string, value: string | number) => {
    setDataPoints(dataPoints.map(d => d.id === id ? { ...d, [key]: value } : d));
  };

  // Dimensional Logic
  const chartHeightPx = 550;
  const maxAvailableWidth = 1400;
  const numPillars = dataPoints.length;
  const defaultTotalWidth = (numPillars * 180) + (Math.max(0, numPillars - 1) * 120);
  const pillarScale = Math.min(1, maxAvailableWidth / (defaultTotalWidth || 1));

  // Animations (0 to 1 progress)
  // Bouncy Curve for Title
  const titleOpacity = interpolate(progress, [0.05, 0.15], [0, 1], 'easeOutCubic');
  const titleY = interpolate(progress, [0.05, 0.20], [80, 0], 'easeOutBack'); 
  const subtitleOpacity = interpolate(progress, [0.10, 0.20], [0, 1], 'easeOutCubic');
  
  const gridLineScaleX = interpolate(progress, [0.10, 0.30], [0, 1], 'easeOutQuart');

  // Insight Box Position styling
  const insightStyles = {
    TR: { top: '120px', right: '150px', transformX: [40, 0] },
    TL: { top: '120px', left: '150px', transformX: [-40, 0] },
    BR: { bottom: '150px', right: '150px', transformX: [40, 0] },
    BL: { bottom: '150px', left: '150px', transformX: [-40, 0] },
  }[insightPosition];

  const insightOpacity = insightAnim ? interpolate(progress, [0.15, 0.30], [0, 1], 'easeOutCubic') : 1;
  const insightX = insightAnim ? interpolate(progress, [0.15, 0.30], insightStyles.transformX as [number, number], 'easeOutBack') : 0;

  return (
    <div className="flex flex-col gap-3 w-full" ref={mainRef}>
      
      {/* 3-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_260px] gap-3 items-stretch">
        
        {/* ── LEFT PANEL: Content (Pillars & Headings) ── */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md flex flex-col gap-3 order-2 lg:order-1 overflow-y-auto max-h-[600px] custom-scrollbar">
          <span className="text-[9px] uppercase tracking-widest text-primary-container font-bold">Content Settings</span>
          
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-black/20 border border-white/5">
            <div className="flex flex-col gap-1">
              <label className={lCls}>Main Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={iCls} />
            </div>
            <div className="flex flex-col gap-1">
              <label className={lCls}>Subtitle</label>
              <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={iCls} />
            </div>
          </div>

          <hr className="border-white/10" />

          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Pillars Data</span>
              <span className="text-[9px] font-bold text-white/50">{dataPoints.length}/15</span>
            </div>
            
            <div className="flex flex-col gap-2">
              {dataPoints.map((point, index) => (
                <div key={point.id} className="flex flex-col gap-1.5 bg-black/30 border border-white/10 rounded-lg p-2 relative group">
                  {dataPoints.length > 1 && (
                    <button onClick={() => removeDataPoint(point.id)} className="absolute -top-2 -right-2 bg-red-500/90 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 shadow-lg">
                      <Trash2 size={10} />
                    </button>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-primary-container shrink-0 w-4">{index + 1}.</span>
                    <input type="color" value={point.color} onChange={(e) => updateDataPoint(point.id, 'color', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0" />
                    <div className="flex flex-col flex-1 gap-0.5">
                      <label className="text-[8px] font-bold text-white/40 uppercase">Pillar Name (Year/Month)</label>
                      <input type="text" value={point.label} onChange={(e) => updateDataPoint(point.id, 'label', e.target.value)} className="w-full bg-transparent text-xs text-white outline-none border-b border-transparent focus:border-primary-container transition-colors" placeholder="e.g. 2026" />
                    </div>
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex flex-col flex-1 gap-0.5">
                      <label className="text-[8px] font-bold text-white/40 uppercase">Number/Value</label>
                      <input type="number" value={point.value} onChange={(e) => updateDataPoint(point.id, 'value', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs font-mono text-white outline-none focus:border-primary-container transition-colors" placeholder="Value" />
                    </div>
                    <div className="flex flex-col flex-[2] gap-0.5">
                      <label className="text-[8px] font-bold text-white/40 uppercase">Top Text (e.g. +14%)</label>
                      <input type="text" value={point.desc} onChange={(e) => updateDataPoint(point.id, 'desc', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white outline-none focus:border-primary-container transition-colors" placeholder="Description" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={addDataPoint} 
              disabled={dataPoints.length >= 15}
              className="mt-2 w-full py-2.5 border border-dashed border-white/20 hover:border-primary-container hover:bg-primary-container/10 text-white rounded-lg flex items-center justify-center gap-2 text-[10px] font-bold transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Plus size={12} /> ADD NEW PILLAR
            </button>
          </div>
        </div>

        {/* ── CENTER PANEL: Video Canvas ── */}
        <div id="chart-center-wrapper" className="flex flex-col gap-2 order-1 lg:order-2">
          <div className="w-full aspect-video bg-black rounded-2xl border border-white/20 shadow-2xl overflow-hidden relative flex-1 min-h-[350px] group cursor-pointer" onClick={togglePlay}>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="relative shrink-0 overflow-hidden bg-[#F8FAFC] rounded-lg shadow-2xl transition-all"
                style={{ 
                  width: '1920px', 
                  height: '1080px',
                  transform: `scale(${scale})`,
                  transformOrigin: 'center',
                }}
              >
                {/* Crunchy White Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8)_0%,transparent_70%)] pointer-events-none" />

                {/* Header Typography with Bouncy Curve */}
                <div 
                  className="absolute z-20" 
                  style={{ 
                    opacity: titleOpacity, 
                    transform: `translateY(${titleY}px)`,
                    // Safe zone logic: push down if Insight is TL and visible
                    top: (insightPosition === 'TL' && showInsight) ? '320px' : '120px',
                    left: '150px',
                    transition: 'top 0.6s cubic-bezier(0.2, 1, 0.3, 1)'
                  }}
                >
                  <h1 className="font-sans font-black text-[90px] leading-none text-neutral-900 tracking-tight" style={{ fontFamily: '"Inter", sans-serif' }}>
                     {title}
                  </h1>
                  <p className="font-sans font-medium text-[32px] text-neutral-500 mt-4 tracking-wide" style={{ opacity: subtitleOpacity, fontFamily: '"Inter", sans-serif' }}>
                    {subtitle}
                  </p>
                </div>

                {/* Key Insight Box */}
                {showInsight && (
                  <div 
                    className="absolute z-30 w-[380px] bg-white/70 backdrop-blur-2xl border border-white/80 rounded-2xl p-6 shadow-2xl transition-all duration-500"
                    style={{ 
                      top: insightStyles.top,
                      bottom: insightStyles.bottom,
                      left: insightStyles.left,
                      right: insightStyles.right,
                      opacity: insightOpacity,
                      transform: `translateX(${insightX}px)`
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm">
                        <div className="w-4 h-4 rounded-sm bg-blue-600" />
                      </div>
                      <h3 className="font-sans font-bold text-xl text-neutral-800 tracking-tight" style={{ fontFamily: '"Inter", sans-serif' }}>{insightTitle}</h3>
                    </div>
                    <p className="font-sans text-[15px] text-neutral-600 leading-relaxed font-medium" style={{ fontFamily: '"Inter", sans-serif' }}>
                      {insightText}
                    </p>
                  </div>
                )}

                {/* Chart Area */}
                <div className="absolute bottom-[150px] left-[150px] right-[150px] h-[550px] flex items-end justify-between z-10">
                  
                  {/* Y-Axis Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
                    {finalGridLevels.map((level, i) => {
                      const isZero = level === 0;
                      const lineProgress = interpolate(progress, [0.15 + i*0.02, 0.30 + i*0.02], [0, 1], 'easeOutCubic');
                      const displayNum = Math.round(finalChartTopY * level);
                      return (
                        <div key={i} className="w-full flex items-center relative h-0">
                          <div 
                             className={`absolute w-full origin-left ${isZero ? 'border-t-[4px] border-neutral-300' : 'border-t-[2px] border-dashed border-neutral-400/50'}`}
                             style={{ transform: `scaleX(${gridLineScaleX})` }}
                          />
                          <span 
                             className="absolute -left-20 font-mono text-[22px] text-neutral-500 font-extrabold"
                             style={{ opacity: lineProgress, fontFamily: '"JetBrains Mono", monospace' }}
                          >
                             {displayNum}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Pillars Container */}
                  <div className="w-full h-full flex items-end justify-center px-[50px] z-20 relative" style={{ gap: `${120 * pillarScale}px` }}>
                    {dataPoints.map((point, index) => {
                      // Distribute animation start times across the first 30% of progress
                      const staggerDelay = 0.20 + (index * 0.05);
                      const startP = Math.min(staggerDelay, 0.6); 
                      const endP = startP + 0.15; 
                      
                      const pProgress = interpolate(progress, [startP, endP], [0, 1], 'easeOutQuart');
                      
                      const targetHeightPx = (Number(point.value) / finalChartTopY) * chartHeightPx;
                      const compensatedHeightPx = targetHeightPx / pillarScale;
                      
                      const textOpacity = interpolate(progress, [endP - 0.05, endP + 0.05], [0, 1]);
                      const bottomLabelOpacity = interpolate(progress, [startP, startP + 0.05], [0, 1]);
                      const bottomLabelY = interpolate(progress, [startP, startP + 0.05], [20, 0], 'easeOutQuart');
                      const isHighlight = point.color !== '#E4E4E7' && point.color !== '#e4e4e7' && point.color.toLowerCase() !== '#ffffff';

                      return (
                        <div key={point.id} className="relative flex flex-col items-center group" style={{ width: `${180 * pillarScale}px` }}>
                          <div 
                            className="absolute bottom-0 flex flex-col items-center w-max"
                            style={{ 
                              transform: `translateY(-${(targetHeightPx * pProgress) + 30}px) scale(${pillarScale})`,
                              transformOrigin: 'bottom center',
                              opacity: textOpacity
                            }}
                          >
                            <div className="font-mono text-5xl font-black text-neutral-800 tracking-tighter drop-shadow-sm mb-1" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                              {Math.round(Number(point.value) * pProgress)}
                            </div>
                            <div className={`text-xl font-sans font-bold px-4 py-1.5 rounded-full shadow-sm border ${isHighlight ? 'bg-white text-blue-600 border-blue-100' : 'bg-white text-neutral-500 border-neutral-100'}`} style={{ fontFamily: '"Inter", sans-serif' }}>
                              {point.desc}
                            </div>
                          </div>
                          
                          {/* 3D Pillar */}
                          <div 
                            className="w-[140px] rounded-t-3xl border-x border-t border-white/50 relative overflow-hidden"
                            style={{
                              height: `${compensatedHeightPx}px`,
                              transform: `scale(${pillarScale}, ${pillarScale * pProgress})`,
                              transformOrigin: 'bottom center',
                              backgroundColor: point.color,
                              boxShadow: `
                                0 30px 60px -12px rgba(0,0,0,0.15),
                                inset 0 4px 10px rgba(255,255,255,0.8),
                                inset -5px 0 20px rgba(0,0,0,0.03),
                                inset 5px 0 20px rgba(255,255,255,0.5)
                              `,
                            }}
                          >
                            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-white/40 to-transparent pointer-events-none" />
                          </div>
                          
                          {/* Bottom Label */}
                          <div 
                            className="absolute -bottom-[70px] flex items-center justify-center w-full"
                            style={{ opacity: bottomLabelOpacity, transform: `translateY(${bottomLabelY}px) scale(${pillarScale})`, transformOrigin: 'top center' }}
                          >
                            <span className="font-sans font-bold text-3xl text-neutral-600 tracking-tight" style={{ fontFamily: '"Inter", sans-serif' }}>
                              {point.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Play/Pause Overlay inside canvas */}
            <div className={`absolute inset-0 flex items-center justify-center z-30 transition-opacity duration-200 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20 hover:bg-black/80 transition-colors">
                {isFinished ? <RotateCcw size={24} className="text-white" /> : isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-40">
              <div className="h-full bg-primary-container transition-none shadow-[0_0_8px_rgba(255,209,0,0.6)]" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>

          {/* Player controls toolbar below video */}
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 backdrop-blur-md">
            <button onClick={togglePlay} className="p-1.5 bg-primary-container/20 text-primary-container hover:bg-primary-container/30 rounded-lg transition-all active:scale-95">
              {isFinished ? <RotateCcw size={14} /> : isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </button>
            <button onClick={handleReplay} className="p-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-all active:scale-95">
              <RotateCcw size={14} />
            </button>
            <div className="h-4 w-px bg-white/10 mx-1" />
            <span className="text-[10px] text-on-surface-variant font-bold ml-1">DURATION</span>
            <input
              type="range" min={4000} max={12000} step={500}
              value={totalDuration}
              onChange={(e) => setTotalDuration(Number(e.target.value))}
              className="flex-1 min-w-[60px] h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary-container [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-container [&::-webkit-slider-thumb]:appearance-none"
            />
            <span className="text-[10px] text-primary-container font-bold shrink-0 w-8">{(totalDuration / 1000).toFixed(1)}s</span>
          </div>
        </div>

        {/* ── RIGHT PANEL: Styling & Logic ── */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-4 backdrop-blur-md order-3">
          <span className="text-[9px] uppercase tracking-widest text-primary-container font-bold">Chart Logic & Style</span>
          
          {/* Smart Y-Axis Settings */}
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-black/20 border border-primary-container/20 shadow-[inset_0_0_15px_rgba(255,209,0,0.05)]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <label className={lCls + " text-primary-container"}>Smart Y-Axis Engine</label>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-1">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-white/70">Numbers Gap</label>
                <input type="number" min="1" value={yAxisGap} onChange={(e) => setYAxisGap(Number(e.target.value))} className={iCls + " text-center"} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-white/70">Minimum Lines</label>
                <input type="number" min="2" value={yAxisMinLines} onChange={(e) => setYAxisMinLines(Number(e.target.value))} className={iCls + " text-center"} />
              </div>
            </div>
            <p className="text-[9px] text-white/50 leading-relaxed mt-1 italic">
              * Chart automatically grows above {yAxisGap * yAxisMinLines} if your pillar values exceed it, ensuring perfect scale always.
            </p>
          </div>

          <hr className="border-white/10 my-0.5" />

          {/* Key Insight Controls */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className={lCls}>Key Insight Box</label>
              <div className="flex items-center gap-1.5">
                <label className="text-[9px] font-bold text-white flex items-center gap-1 cursor-pointer bg-black/40 px-2 py-0.5 rounded border border-white/10 hover:bg-white/5">
                  <input type="checkbox" checked={insightAnim} onChange={(e) => setInsightAnim(e.target.checked)} className="accent-primary-container" /> Anim
                </label>
                <label className="text-[9px] font-bold text-white flex items-center gap-1 cursor-pointer bg-primary-container/20 px-2 py-0.5 rounded border border-primary-container/30">
                  <input type="checkbox" checked={showInsight} onChange={(e) => setShowInsight(e.target.checked)} className="accent-primary-container" /> Show
                </label>
              </div>
            </div>
            
            {showInsight && (
              <div className="flex flex-col gap-2 animate-[pop-in_0.3s_ease-out]">
                <div className="grid grid-cols-[1fr_120px] gap-2">
                  <input type="text" value={insightTitle} onChange={(e) => setInsightTitle(e.target.value)} className={iCls} placeholder="Box Title" />
                  <div className="flex border border-white/10 rounded-lg overflow-hidden bg-black/40 p-0.5 gap-0.5">
                    {(['TL', 'TR', 'BL', 'BR'] as const).map(pos => (
                      <button key={pos} onClick={() => setInsightPosition(pos)} className={`flex-1 text-[9px] font-bold rounded ${insightPosition === pos ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-white transition-colors'}`}>{pos}</button>
                    ))}
                  </div>
                </div>
                <textarea value={insightText} onChange={(e) => setInsightText(e.target.value)} className={iCls + " resize-none h-16 leading-relaxed custom-scrollbar"} placeholder="Insight details..." />
              </div>
            )}
          </div>

          <Link href="/login" className="w-full text-center py-2.5 rounded-lg font-label text-[10px] uppercase tracking-widest font-bold transition-colors bg-on-surface text-background hover:bg-primary-container hover:text-on-primary-container shadow-lg block mt-auto">
            Login to Export Video
          </Link>
        </div>

      </div>
    </div>
  );
}
