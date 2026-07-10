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

  // Client-Side Video Export using Canvas Stream & MediaRecorder
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

    setRendering(true);
    setRenderProgress(0);
    setVideoUrl(null);
    const startTime = performance.now();

    // Capture canvas stream (independent of display refresh rate)
    const stream = canvas.captureStream(fps);
    
    // Choose WebM video format (supported on Chrome/Firefox/Android, fallback for iOS)
    let options = { mimeType: "video/webm;codecs=vp9" };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "video/webm;codecs=vp8" };
    }
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "video/webm" };
    }
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      options = { mimeType: "" }; // Fallback to default
    }

    const recordedChunks: BlobPart[] = [];
    const mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setRendering(false);
      setRenderTime(Math.round((performance.now() - startTime) / 1000));
    };

    // Start recording
    mediaRecorder.start();

    // Adjust render delay based on quality to ensure mobile GPU completely draws each frame
    let frameDelay = 80; // default for 720p
    if (resolution === "1080p") frameDelay = 160;
    if (resolution === "1440p") frameDelay = 320;

    // Step through each frame sequentially to record perfect frames
    for (let frame = 0; frame < durationInFrames; frame++) {
      player.seekTo(frame);
      setRenderProgress(Math.round((frame / durationInFrames) * 100));
      // Give the browser GPU time to completely finish rendering the 3D scene
      await new Promise((resolve) => setTimeout(resolve, frameDelay));
    }

    // Finish recording
    mediaRecorder.stop();
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
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={startCSRRender}
                disabled={rendering}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm animate-pulse"
              >
                {rendering ? "Rendering..." : "⚡ Render WebM on Mobile"}
              </button>
              
              {videoUrl && (
                <a
                  href={videoUrl}
                  download={`flight_${origin}_to_${destination}_${resolution}_${fps}fps.webm`}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3.5 px-6 rounded-xl text-center transition-all shadow-lg shadow-green-600/20 text-sm flex items-center justify-center"
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
            🎉 Video rendered in <span className="font-bold text-blue-400">{renderTime} seconds</span> directly on this device!
          </div>
        )}

      </div>
    </div>
  );
}
