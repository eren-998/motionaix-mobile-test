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
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-md">
        
        {/* Route Selectors */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Origin</label>
            <select 
              value={origin} 
              onChange={(e) => setOrigin(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-container outline-none"
            >
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Destination</label>
            <select 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-primary-container outline-none"
            >
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Duration Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Video Duration (Seconds)</label>
          <div className="flex gap-2">
            {[5, 10, 15, 20].map((sec) => (
              <button
                key={sec}
                onClick={() => setDurationSecs(sec)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  durationSecs === sec 
                    ? "bg-primary-container text-on-primary-container border-primary-container" 
                    : "bg-black/40 border-white/10 text-white hover:bg-white/10"
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Export Button -> Redirects to Login */}
        <Link
          href="/login"
          className="w-full text-center py-3.5 rounded-xl font-label text-xs uppercase tracking-widest font-bold transition-colors bg-on-surface text-background hover:bg-primary-container hover:text-on-primary-container shadow-lg mt-2 block"
        >
          Login to Export Video
        </Link>
      </div>
    </div>
  );
}
