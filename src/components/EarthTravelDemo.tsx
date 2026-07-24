"use client";

import React, { useState, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { EarthTravel, CITIES } from "@/components/remotion/EarthTravel";
import Link from "next/link";

export default function EarthTravelDemo() {
  const [origin, setOrigin] = useState("mumbai");
  const [destination, setDestination] = useState("tokyo");
  const [durationSecs, setDurationSecs] = useState(10);

  const playerRef = useRef<PlayerRef>(null);

  const fps = 30;
  const compWidth = 1280;
  const compHeight = 720;
  const durationInFrames = durationSecs * fps;

  return (
    <div className="flex flex-col gap-4 w-full earth-demo-container">
      {/* Player Container */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black shadow-2xl relative">
        <Player
          ref={playerRef}
          component={EarthTravel}
          inputProps={{ origin, destination }}
          durationInFrames={durationInFrames}
          fps={fps}
          compositionWidth={compWidth}
          compositionHeight={compHeight}
          style={{ width: "100%", height: "100%" }}
          controls
          loop
        />
      </div>

      {/* Controls Container */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2.5 backdrop-blur-md">
        
        {/* Route Selectors */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Origin</label>
            <select 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none"
            >
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">Destination</label>
            <select 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:border-primary-container outline-none"
            >
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Duration Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Sequence Duration</label>
            <span className="text-xs text-primary-container font-bold">{durationSecs.toFixed(1)}s</span>
          </div>
          <input
            type="range" min={2} max={20} step={0.5}
            value={durationSecs}
            onChange={(e) => setDurationSecs(Number(e.target.value))}
            className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary-container [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-container [&::-webkit-slider-thumb]:appearance-none"
          />
        </div>

        {/* Export Button -> Redirects to Login */}
        <Link
          href="/login"
          className="w-full text-center py-2.5 rounded-lg font-label text-[10px] uppercase tracking-widest font-bold transition-colors bg-on-surface text-background hover:bg-primary-container hover:text-on-primary-container shadow-lg block"
        >
          Login to Export Video
        </Link>
      </div>
    </div>
  );
}
