"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw } from "lucide-react";
import LiquidGlassCard from "@/components/LiquidGlassCard";
import { Player } from "@remotion/player";

import { EarningsRemotion } from "./remotion/EarningsRemotion";
import { FireSliderRemotion } from "./remotion/FireSliderRemotion";
import { FileDownloadRemotion } from "./remotion/FileDownloadRemotion";
import { FollowerRemotion } from "./remotion/FollowerRemotion";
import { GoalRemotion } from "./remotion/GoalRemotion";
import { RevealRemotion } from "./remotion/RevealRemotion";

/* ────────────────────────────────────────────────────────
   Shared Card Wrapper & Tools
   ──────────────────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────
   Shared Card Wrapper & Tools
   ──────────────────────────────────────────────────────── */
const EssenceWrapper = ({ title, desc, children, delay, showBorder, borderClass }: { title: string, desc: string, children: React.ReactNode, delay: number, showBorder?: boolean, borderClass?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className="group h-full flex"
  >
    <LiquidGlassCard className="!w-full !h-full flex flex-col border border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex flex-col flex-1 p-4 sm:p-5 w-full relative z-10">
        {/* Top Video/Display Box */}
        <div className={`w-full aspect-video rounded-2xl bg-black/50 overflow-hidden relative flex items-center justify-center mb-5 transition-all duration-300 ${
          showBorder && borderClass ? borderClass : "border border-white/10 shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)]"
        }`}>
          <div className="absolute inset-0 pointer-events-none z-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")', opacity: 0.2, mixBlendMode: "screen" }} />
          {children}
        </div>
        {/* Text */}
        <div className="mt-auto">
          <h4 className="font-display text-lg font-bold text-on-surface tracking-tight mb-1">{title}</h4>
          <p className="font-body text-[13px] text-on-surface-variant leading-relaxed">{desc}</p>
        </div>
      </div>
    </LiquidGlassCard>
  </motion.div>
);

const CenterReplayBtn = ({ isFinished, onReplay }: { isFinished: boolean, onReplay: () => void }) => (
  <AnimatePresence>
    {isFinished && (
      <motion.button 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={onReplay}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer group/btn"
        title="Replay Animation"
      >
        <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 shadow-2xl flex items-center justify-center group-hover/btn:scale-110 transition-transform duration-300">
          <RotateCcw size={24} className="text-white group-hover/btn:-rotate-180 transition-transform duration-500" />
        </div>
      </motion.button>
    )}
  </AnimatePresence>
);

const InputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute bottom-2 left-2 right-2 z-40 bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-2 flex items-center justify-between gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
    {children}
  </div>
);

/* ────────────────────────────────────────────────────────
   1. Earnings Counter Remotion Player
   ──────────────────────────────────────────────────────── */
export const EarningsEssence = ({ delay }: { delay: number }) => {
  const [val, setVal] = useState("45800");
  const [showBorder, setShowBorder] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [isFin, setIsFin] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setIsFin(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
    }
    const t = setTimeout(() => setIsFin(true), 4000);
    return () => clearTimeout(t);
  }, [playKey, val]);

  return (
    <EssenceWrapper
      title="Earnings Display"
      desc="Liquid glass monetization tracker with falling cash"
      delay={delay}
      showBorder={showBorder}
      borderClass="border-4 border-emerald-400 shadow-[0_0_30px_rgba(74,222,128,0.75),inset_0_0_15px_rgba(74,222,128,0.3)]"
    >
      <CenterReplayBtn isFinished={isFin} onReplay={() => setPlayKey(p => p + 1)} />

      <div className="absolute inset-0 w-full h-full bg-black/40">
        <Player
          ref={playerRef}
          component={EarningsRemotion}
          inputProps={{ val }}
          durationInFrames={120}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          autoPlay
          loop={false}
        />
      </div>
      
      <InputWrapper>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#4ade80] font-bold">Amount ($)</span>
          <input type="number" value={val} onChange={(e) => setVal(e.target.value)}
            className="bg-black/50 border border-white/20 rounded-md px-2 py-1 text-xs text-white w-20 outline-none focus:border-[#4ade80] focus:ring-1 focus:ring-[#4ade80] transition-all font-bold" />
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/80 hover:text-white select-none">
          <input type="checkbox" checked={showBorder} onChange={(e) => setShowBorder(e.target.checked)} className="w-3 h-3 accent-emerald-400 rounded cursor-pointer" />
          <span>Border</span>
        </label>
      </InputWrapper>
    </EssenceWrapper>
  );
};

/* ────────────────────────────────────────────────────────
   2. File Download Remotion Player
   ──────────────────────────────────────────────────────── */
export const FileDownloadEssence = ({ delay }: { delay: number }) => {
  const [prog, setProg] = useState(85);
  const [showBorder, setShowBorder] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [isFin, setIsFin] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setIsFin(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
    }
    const t = setTimeout(() => setIsFin(true), 4000);
    return () => clearTimeout(t);
  }, [playKey, prog]);

  return (
    <EssenceWrapper
      title="File Download"
      desc="Apple liquid glass folder with neon trails"
      delay={delay}
      showBorder={showBorder}
      borderClass="border-4 border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.75),inset_0_0_15px_rgba(56,189,248,0.3)]"
    >
      <CenterReplayBtn isFinished={isFin} onReplay={() => setPlayKey(p => p + 1)} />

      <div className="absolute inset-0 w-full h-full bg-black/40">
        <Player
          ref={playerRef}
          component={FileDownloadRemotion}
          inputProps={{ prog, fileName: "Update.zip" }}
          durationInFrames={120}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          autoPlay
          loop={false}
        />
      </div>

      <InputWrapper>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Progress (%)</span>
          <input type="range" min="0" max="100" value={prog} onChange={(e) => setProg(Number(e.target.value))} className="w-14 sm:w-16 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-blue-400" />
          <input type="number" min="0" max="100" value={prog} onChange={(e) => setProg(Number(e.target.value))} className="w-10 bg-black/50 border border-white/20 rounded px-1 py-0.5 text-xs text-white text-center" />
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/80 hover:text-white select-none">
          <input type="checkbox" checked={showBorder} onChange={(e) => setShowBorder(e.target.checked)} className="w-3 h-3 accent-sky-400 rounded cursor-pointer" />
          <span>Border</span>
        </label>
      </InputWrapper>
    </EssenceWrapper>
  );
};

/* ────────────────────────────────────────────────────────
   3. Fire/Cold Slider Remotion Player
   ──────────────────────────────────────────────────────── */
export const FireSliderEssence = ({ delay }: { delay: number }) => {
  const [val, setVal] = useState(85);
  const [mode, setMode] = useState<"fire" | "cold">("fire");
  const [showBorder, setShowBorder] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [isFin, setIsFin] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setIsFin(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
    }
    const t = setTimeout(() => setIsFin(true), 4000);
    return () => clearTimeout(t);
  }, [playKey, val, mode]);

  const isFire = mode === "fire";

  return (
    <EssenceWrapper
      title="Element Slider"
      desc="Heat/Cold tracker with physics-based particles"
      delay={delay}
      showBorder={showBorder}
      borderClass={isFire ? "border-4 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.75),inset_0_0_15px_rgba(249,115,22,0.3)]" : "border-4 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.75),inset_0_0_15px_rgba(34,211,238,0.3)]"}
    >
      <CenterReplayBtn isFinished={isFin} onReplay={() => setPlayKey(p => p + 1)} />

      <div className="absolute inset-0 w-full h-full bg-black/40">
        <Player
          ref={playerRef}
          component={FireSliderRemotion}
          inputProps={{ val, mode }}
          durationInFrames={120}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          autoPlay
          loop={false}
        />
      </div>

      <InputWrapper>
        <div className="flex gap-2 items-center">
          <button onClick={() => setMode(mode === "fire" ? "cold" : "fire")} className={`px-2 py-1 rounded text-[9px] uppercase font-bold transition-colors ${isFire ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}>
            Mode: {mode}
          </button>
          <input type="number" min="0" max="100" value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-10 bg-black/50 border border-white/20 rounded px-1 py-0.5 text-xs text-white text-center" />
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/80 hover:text-white select-none">
          <input type="checkbox" checked={showBorder} onChange={(e) => setShowBorder(e.target.checked)} className="w-3 h-3 accent-orange-500 rounded cursor-pointer" />
          <span>Border</span>
        </label>
      </InputWrapper>
    </EssenceWrapper>
  );
};

/* ────────────────────────────────────────────────────────
   4. Follower Count Remotion Player
   ──────────────────────────────────────────────────────── */
export const FollowerEssence = ({ delay }: { delay: number }) => {
  const [count, setCount] = useState(299500);
  const [showBorder, setShowBorder] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [isFin, setIsFin] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setIsFin(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
    }
    const t = setTimeout(() => setIsFin(true), 4000);
    return () => clearTimeout(t);
  }, [playKey, count]);

  return (
    <EssenceWrapper
      title="Social Growth"
      desc="Real rolling odometer with liquid glass card"
      delay={delay}
      showBorder={showBorder}
      borderClass="border-4 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.75),inset_0_0_15px_rgba(236,72,153,0.3)]"
    >
      <CenterReplayBtn isFinished={isFin} onReplay={() => setPlayKey(p => p + 1)} />

      <div className="absolute inset-0 w-full h-full bg-black/40">
        <Player
          ref={playerRef}
          component={FollowerRemotion}
          inputProps={{ count, label: "Followers" }}
          durationInFrames={120}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          autoPlay
          loop={false}
        />
      </div>

      <InputWrapper>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold">Followers</span>
          <input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))}
            className="bg-black/50 border border-white/20 rounded-md px-2 py-1 text-xs text-center text-white w-24 outline-none focus:border-pink-500 transition-all font-bold" />
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/80 hover:text-white select-none">
          <input type="checkbox" checked={showBorder} onChange={(e) => setShowBorder(e.target.checked)} className="w-3 h-3 accent-pink-500 rounded cursor-pointer" />
          <span>Border</span>
        </label>
      </InputWrapper>
    </EssenceWrapper>
  );
};

/* ────────────────────────────────────────────────────────
   5. Goal Remotion Player
   ──────────────────────────────────────────────────────── */
export const GoalEssence = ({ delay }: { delay: number }) => {
  const [val, setVal] = useState(82);
  const [showBorder, setShowBorder] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [isFin, setIsFin] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setIsFin(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
    }
    const t = setTimeout(() => setIsFin(true), 4000);
    return () => clearTimeout(t);
  }, [playKey, val]);

  return (
    <EssenceWrapper
      title="Target Tracker"
      desc="Premium glowing goal marker and dynamic track"
      delay={delay}
      showBorder={showBorder}
      borderClass="border-4 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.75),inset_0_0_15px_rgba(245,158,11,0.3)]"
    >
      <CenterReplayBtn isFinished={isFin} onReplay={() => setPlayKey(p => p + 1)} />

      <div className="absolute inset-0 w-full h-full bg-black/40">
        <Player
          ref={playerRef}
          component={GoalRemotion}
          inputProps={{ val, title: "Target Tracker" }}
          durationInFrames={120}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          autoPlay
          loop={false}
        />
      </div>

      <InputWrapper>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] uppercase tracking-widest text-[#ffd700] font-bold">Goal (%)</span>
          <input type="range" min="0" max="100" value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-14 sm:w-16 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-[#ffd700]" />
          <input type="number" min="0" max="100" value={val} onChange={(e) => setVal(Number(e.target.value))} className="w-10 bg-black/50 border border-white/20 rounded px-1 py-0.5 text-xs text-white text-center" />
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/80 hover:text-white select-none">
          <input type="checkbox" checked={showBorder} onChange={(e) => setShowBorder(e.target.checked)} className="w-3 h-3 accent-amber-400 rounded cursor-pointer" />
          <span>Border</span>
        </label>
      </InputWrapper>
    </EssenceWrapper>
  );
};

/* ────────────────────────────────────────────────────────
   6. Cinematic Reveal Remotion Player
   ──────────────────────────────────────────────────────── */
export const RevealEssence = ({ delay }: { delay: number }) => {
  const [text, setText] = useState("MotionAIx");
  const [showBorder, setShowBorder] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [isFin, setIsFin] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    setIsFin(false);
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.play();
    }
    const t = setTimeout(() => setIsFin(true), 4000);
    return () => clearTimeout(t);
  }, [playKey, text]);

  return (
    <EssenceWrapper
      title="Cinematic Reveal"
      desc="Buttery smooth blur mask with light sweep"
      delay={delay}
      showBorder={showBorder}
      borderClass="border-4 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.75),inset_0_0_15px_rgba(168,85,247,0.3)]"
    >
      <CenterReplayBtn isFinished={isFin} onReplay={() => setPlayKey(p => p + 1)} />

      <div className="absolute inset-0 w-full h-full bg-black/40">
        <Player
          ref={playerRef}
          component={RevealRemotion}
          inputProps={{ text }}
          durationInFrames={120}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={30}
          style={{ width: "100%", height: "100%" }}
          controls={false}
          autoPlay
          loop={false}
        />
      </div>

      <InputWrapper>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold">Text</span>
          <input type="text" value={text} onChange={(e) => setText(e.target.value)}
            className="bg-black/50 border border-white/20 rounded-md px-2 py-1 text-xs text-center text-white w-24 outline-none focus:border-white transition-all font-bold" 
            maxLength={15} />
        </div>
        <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/80 hover:text-white select-none">
          <input type="checkbox" checked={showBorder} onChange={(e) => setShowBorder(e.target.checked)} className="w-3 h-3 accent-purple-400 rounded cursor-pointer" />
          <span>Border</span>
        </label>
      </InputWrapper>
    </EssenceWrapper>
  );
};
