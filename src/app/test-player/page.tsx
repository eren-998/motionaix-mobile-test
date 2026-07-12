"use client";

import React, { useState, useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { EarthTravel, CITIES } from "@/components/remotion/EarthTravel";

export default function TestPlayerPage() {
  const [origin, setOrigin] = useState("mumbai");
  const [destination, setDestination] = useState("tokyo");
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
  // Custom Render Settings
  const [fps, setFps] = useState<number>(30);
  const [resolution, setResolution] = useState<string>("720p"); // "720p" | "1080p" | "1440p"

  const playerRef = useRef<PlayerRef>(null);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="font-bold text-slate-400">Initializing CSR Render Engine...</p>
        </div>
      </div>
    );
  }

  // Get dimensions dynamically based on selected quality
  const getResolutionDims = (res: string) => {
    switch (res) {
      case "1080p":
        return { width: 1920, height: 1080 };
      case "1440p":
        return { width: 2560, height: 1440 };
      case "720p":
      default:
        return { width: 1280, height: 720 };
    }
  };

  const { width: compWidth, height: compHeight } = getResolutionDims(resolution);
  const durationInFrames = 10 * fps; // 10 second animation

  // Client-Side Video Export using WebCodecs & webm-muxer
  const startCSRRender = async () => {
    if (!playerRef.current) return;
    const player = playerRef.current;

    // Pause player & reset to start
    player.pause();
    player.seekTo(0);

    // Find the WebGL Canvas rendered by Remotion/Three.js
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      alert("Error: WebGL Canvas not found. Make sure the animation is loaded.");
      return;
    }

    // Verify WebCodecs support
    if (!window.VideoEncoder) {
      alert("Your browser does not support WebCodecs (VideoEncoder). Please use Chrome, Edge, or a modern Android browser.");
      return;
    }

    setRendering(true);
    setRenderProgress(0);
    setVideoUrl(null);
    const startTime = performance.now();

    try {
      // Dynamically import webm-muxer so it only loads on client
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

      // We use VP9 for WebM
      videoEncoder.configure({
        codec: "vp09.00.10.08",
        width: compWidth,
        height: compHeight,
        bitrate: 5_000_000, // 5 Mbps
      });

      // Let the browser settle initially
      await new Promise((r) => setTimeout(r, 500));

      for (let f = 0; f < durationInFrames; f++) {
        // Seek to the exact frame
        player.seekTo(f);
        
        // Wait for Remotion/ThreeJS to finish rendering this frame.
        // We provide &quot;templates&quot; that represent the UI, and you construct the final clip. That&apos;s it.
        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });
        
        // On mobile, if we still have blank frames, add a tiny explicit delay
        await new Promise((r) => setTimeout(r, 30));

        // Capture frame with absolute timestamp in microseconds
        const timestamp = (f * 1000000) / fps;
        const videoFrame = new VideoFrame(canvas, { timestamp });

        // Encode and flush frame immediately to keep memory usage low
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
      setRenderTime(Math.round((performance.now() - startTime) / 1000));
    } catch (err) {
      console.error("Rendering failed:", err);
      alert("An error occurred during rendering.");
    } finally {
      setRendering(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 p-8 flex flex-col gap-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center">
          <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase px-3 py-1.5 rounded-full tracking-widest">
            Mobile Client-Side Render Test
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white mt-4">
            CSR Performance &amp; Exporter
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Test how fast your mobile device renders and compiles 3D maps entirely in the browser.
          </p>
        </div>

        {/* Remotion Player */}
        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-black shadow-lg relative">
          <Player
            ref={playerRef}
            component={EarthTravel}
            inputProps={{
              origin: origin,
              destination: destination,
            }}
            durationInFrames={durationInFrames}
            fps={fps}
            compositionWidth={compWidth}
            compositionHeight={compHeight}
            style={{
              width: "100%",
              height: "100%",
            }}
            controls
            loop
          />

          {rendering && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-30">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="font-bold text-lg">Compiling Video on Mobile Device...</p>
                <p className="text-slate-400 text-sm mt-1">Resolution: {resolution} | FPS: {fps}</p>
                <p className="text-blue-400 font-bold text-xl mt-1">{renderProgress}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Custom Export Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/30 p-4 rounded-xl border border-slate-800/40 text-sm">
          {/* Resolution Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Video Quality (Resolution):</span>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              disabled={rendering}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold cursor-pointer disabled:opacity-50"
            >
              <option value="720p">720p (Fast)</option>
              <option value="1080p">1080p (Full HD - Recommended)</option>
              <option value="1440p">1440p (2K - High Quality)</option>
            </select>
          </div>

          {/* FPS Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Frame Rate (FPS):</span>
            <select
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              disabled={rendering}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold cursor-pointer disabled:opacity-50"
            >
              <option value={30}>30 FPS (Standard)</option>
              <option value={60}>60 FPS (Super Smooth)</option>
            </select>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
          
          {/* Location Selectors */}
          <div className="flex flex-col gap-3 justify-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Route</span>
            <div className="flex items-center gap-3">
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                disabled={rendering}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    From: {c.name}
                  </option>
                ))}
              </select>
              <span className="text-slate-500">➔</span>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={rendering}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    To: {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Render and Export Actions */}
          <div className="flex flex-col justify-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Compile Video</span>
            <div className="flex flex-col gap-3">
              <button
                onClick={startCSRRender}
                disabled={rendering}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm"
              >
                {rendering ? "Rendering Client-Side..." : "⚡ Render in Browser (Client-Side)"}
              </button>
              
              {videoUrl && (
                <a
                  href={videoUrl}
                  download={`flight_${origin}_to_${destination}_${resolution}_${fps}fps.mp4`}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 px-6 rounded-xl text-center transition-all shadow-lg shadow-green-600/20 text-sm flex items-center justify-center"
                >
                  📥 Download Video
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Results / Diagnostics */}
        {renderTime !== null && (
          <div className="bg-blue-950/20 border border-blue-900/30 p-4 rounded-xl text-center text-sm">
            🎉 Client-Side Video rendered in <span className="font-bold text-blue-400">{renderTime} seconds</span> directly on this device!
          </div>
        )}
        
        <div className="bg-slate-900/50 border border-red-900/30 p-4 rounded-xl text-xs text-slate-400 text-left space-y-2 mt-4">
          <p className="font-bold text-slate-300">⚠️ Limitations on Mobile & Vercel:</p>
          <p><strong>Browser Render:</strong> Mobile browsers often discard WebGL buffers or lack full WebCodecs support, resulting in 23KB black videos. This is a hardware/browser limit.</p>
          <p><strong>True Remotion Render:</strong> This runs exactly like the Remotion Studio Dashboard using Headless Chrome. <strong>However, it will FAIL on Vercel</strong> because standard Vercel serverless functions have a 50MB size limit (Chromium is 150MB+) and time out after 10s.</p>
          <p><strong>Solution:</strong> To test &quot;True Remotion&quot; smoothly, run `npm run dev` on your PC, then open your PC&apos;s local IP (e.g., `http://192.168.1.5:3000`) on your mobile browser and click the Purple button!</p>
        </div>

      </div>
    </div>
  );
}
