"use client";

import React, { useState, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { EarthTravel, CITIES } from "@/components/remotion/EarthTravel";

export default function EarthTravelDemo() {
  const [origin, setOrigin] = useState("mumbai");
  const [destination, setDestination] = useState("tokyo");
  const [durationSecs, setDurationSecs] = useState(10);
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const playerRef = useRef<PlayerRef>(null);

  const fps = 30;
  const compWidth = 1280;
  const compHeight = 720;
  const durationInFrames = durationSecs * fps;

  const startCSRRender = async () => {
    if (!playerRef.current) return;
    const player = playerRef.current;

    player.pause();
    player.seekTo(0);

    // Find the canvas inside this specific container
    const canvas = document.querySelector(".earth-demo-container canvas") as HTMLCanvasElement;
    if (!canvas) {
      alert("Error: WebGL Canvas not found. Make sure the animation is loaded.");
      return;
    }

    if (!window.VideoEncoder) {
      alert("Your browser does not support WebCodecs (VideoEncoder). Please use Chrome, Edge, or a modern Android browser.");
      return;
    }

    setRendering(true);
    setRenderProgress(0);
    setVideoUrl(null);

    try {
      const { Muxer, ArrayBufferTarget } = await import("webm-muxer");

      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: {
          codec: "V_VP9",
          width: compWidth,
          height: compHeight,
          frameRate: fps,
        },
      });

      const videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => console.error("VideoEncoder error:", e),
      });

      videoEncoder.configure({
        codec: "vp09.00.10.08",
        width: compWidth,
        height: compHeight,
        bitrate: 5_000_000,
      });

      await new Promise((r) => setTimeout(r, 500));

      for (let f = 0; f < durationInFrames; f++) {
        player.seekTo(f);
        await new Promise((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        });
        await new Promise((r) => setTimeout(r, 30));

        const timestamp = (f * 1000000) / fps;
        const videoFrame = new VideoFrame(canvas, { timestamp });

        videoEncoder.encode(videoFrame);
        videoFrame.close();

        setRenderProgress(Math.round((f / durationInFrames) * 100));
      }

      await videoEncoder.flush();
      muxer.finalize();

      const buffer = muxer.target.buffer;
      const blob = new Blob([buffer], { type: "video/webm" });
      const url = URL.createObjectURL(blob);

      setVideoUrl(url);
    } catch (err) {
      console.error("Rendering failed:", err);
      alert("An error occurred during rendering.");
    } finally {
      setRendering(false);
    }
  };

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
        {rendering && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-30">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-primary-container rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="font-bold text-white text-sm">Rendering Video in Browser...</p>
              <p className="text-primary-container font-bold text-xl mt-1">{renderProgress}%</p>
            </div>
          </div>
        )}
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
              disabled={rendering}
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
              disabled={rendering}
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
                disabled={rendering}
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

        {/* Export Button */}
        {videoUrl ? (
          <a
            href={videoUrl}
            download={`earth_travel_${origin}_to_${destination}.webm`}
            className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-4 rounded-xl text-center transition-all shadow-lg text-sm mt-2"
          >
            📥 Download Ready ({durationSecs}s)
          </a>
        ) : (
          <button
            onClick={startCSRRender}
            disabled={rendering}
            className="w-full bg-on-surface hover:bg-white text-background font-bold py-3 px-4 rounded-xl transition-all shadow-lg text-sm mt-2"
          >
            {rendering ? "Rendering..." : "⚡ Generate & Export Video"}
          </button>
        )}
      </div>
    </div>
  );
}
