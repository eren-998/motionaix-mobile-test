"use client";

import React, { useState, useRef, useMemo } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { EarthTravel, CITIES } from "@/components/remotion/EarthTravel";
import { EarningsRemotion } from "@/components/remotion/EarningsRemotion";
import { FireSliderRemotion } from "@/components/remotion/FireSliderRemotion";
import { FileDownloadRemotion } from "@/components/remotion/FileDownloadRemotion";
import { FollowerRemotion } from "@/components/remotion/FollowerRemotion";
import { GoalRemotion } from "@/components/remotion/GoalRemotion";
import { RevealRemotion } from "@/components/remotion/RevealRemotion";
import { IncomingCallRemotion } from "@/components/remotion/IncomingCallRemotion";
import { BatteryChargeRemotion } from "@/components/remotion/BatteryChargeRemotion";
import { FolderRemotion } from "@/components/remotion/FolderRemotion";
import * as htmlToImage from "html-to-image";
import { Muxer, ArrayBufferTarget } from "webm-muxer";
import { ExportModeContext } from "@/lib/export-context";

type ActiveTab = "fireslider" | "earnings" | "earth" | "download" | "follower" | "goal" | "reveal" | "incomingcall" | "batterycharge" | "folder";

/* ── ALWAYS render compositions at 1920x1080 internally.
      Resolution selector only controls the OUTPUT video encoder size.
      This prevents the black-screen / left-corner bug. ── */
const COMP_WIDTH = 1920;
const COMP_HEIGHT = 1080;

export default function TestPlayerPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("fireslider");

  // ── Earth Travel State ──
  const [origin, setOrigin] = useState("mumbai");
  const [destination, setDestination] = useState("tokyo");

  // ── Earnings State ──
  const [earningsVal, setEarningsVal] = useState("45800");

  // ── Fire Slider State ──
  const [sliderVal, setSliderVal] = useState<number>(85);
  const [sliderMode, setSliderMode] = useState<"fire" | "cold">("fire");

  // ── File Download State ──
  const [downloadProg, setDownloadProg] = useState<number>(85);
  const [downloadFileName, setDownloadFileName] = useState<string>("Update.zip");

  // ── Follower State ──
  const [followerCount, setFollowerCount] = useState<number>(299500);

  // ── Goal State ──
  const [goalVal, setGoalVal] = useState<number>(82);

  // ── Reveal State ──
  const [revealText, setRevealText] = useState<string>("MotionAIx");

  // ── New Motion Essence States ──
  const [callerName, setCallerName] = useState<string>("Claude Code");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [batteryTarget, setBatteryTarget] = useState<number>(78);
  const [folderTitle, setFolderTitle] = useState<string>("Projects");
  const [filesCount, setFilesCount] = useState<string>("318 Files");

  // ── Export Settings ──
  const [durationSec, setDurationSec] = useState<number>(4);
  const [fps, setFps] = useState<number>(30);
  const [resolution, setResolution] = useState<string>("1080p");
  const [showBorder, setShowBorder] = useState<boolean>(false);

  // Dynamic theme-matching border outline class for UI (After Effects Volumetric Layered Outlines)
  const getThemeBorderClass = (tab: ActiveTab, mode: "fire" | "cold") => {
    if (!showBorder) return "border border-slate-700 shadow-2xl";
    switch (tab) {
      case "fireslider":
        return mode === "fire"
          ? "border-2 border-orange-400 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(249,115,22,0.9),0_0_60px_rgba(249,115,22,0.4),0_0_100px_rgba(249,115,22,0.2)]"
          : "border-2 border-cyan-300 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(34,211,238,0.9),0_0_60px_rgba(34,211,238,0.4),0_0_100px_rgba(34,211,238,0.2)]";
      case "earnings":
        return "border-2 border-emerald-400 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(74,222,128,0.9),0_0_60px_rgba(74,222,128,0.4),0_0_100px_rgba(74,222,128,0.2)]";
      case "earth":
        return "border-2 border-blue-400 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(59,130,246,0.9),0_0_60px_rgba(59,130,246,0.4),0_0_100px_rgba(59,130,246,0.2)]";
      case "download":
        return "border-2 border-sky-300 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(56,189,248,0.9),0_0_60px_rgba(56,189,248,0.4),0_0_100px_rgba(56,189,248,0.2)]";
      case "follower":
        return "border-2 border-pink-400 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(236,72,153,0.9),0_0_60px_rgba(236,72,153,0.4),0_0_100px_rgba(236,72,153,0.2)]";
      case "goal":
        return "border-2 border-amber-300 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(245,158,11,0.9),0_0_60px_rgba(245,158,11,0.4),0_0_100px_rgba(245,158,11,0.2)]";
      case "reveal":
        return "border-2 border-purple-400 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(168,85,247,0.9),0_0_60px_rgba(168,85,247,0.4),0_0_100px_rgba(168,85,247,0.2)]";
      case "incomingcall":
        return "border-2 border-emerald-400 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(34,197,94,0.9),0_0_60px_rgba(34,197,94,0.4),0_0_100px_rgba(34,197,94,0.2)]";
      case "batterycharge":
        return "border-2 border-amber-300 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(245,158,11,0.9),0_0_60px_rgba(245,158,11,0.4),0_0_100px_rgba(245,158,11,0.2)]";
      case "folder":
        return "border-2 border-violet-400 ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(139,92,246,0.9),0_0_60px_rgba(139,92,246,0.4),0_0_100px_rgba(139,92,246,0.2)]";
      default:
        return "border-2 border-white ring-2 ring-white/60 shadow-[0_0_0_1.5px_rgba(255,255,255,0.7)_inset,0_0_30px_rgba(255,255,255,0.8)]";
    }
  };

  // Burn After Effects Volumetric Layered Outlines directly onto video export canvas frames
  const drawBorderOnCanvas = (
    c: CanvasRenderingContext2D,
    w: number,
    h: number,
    tab: ActiveTab,
    mode: "fire" | "cold"
  ) => {
    if (!showBorder) return;

    let borderColor = "#ffffff";
    let glowColor = "rgba(255, 255, 255, 0.8)";

    switch (tab) {
      case "fireslider":
        if (mode === "fire") {
          borderColor = "#f97316";
          glowColor = "rgba(249, 115, 22, 0.85)";
        } else {
          borderColor = "#22d3ee";
          glowColor = "rgba(34, 211, 238, 0.85)";
        }
        break;
      case "earnings":
        borderColor = "#4ade80";
        glowColor = "rgba(74, 222, 128, 0.85)";
        break;
      case "earth":
        borderColor = "#3b82f6";
        glowColor = "rgba(59, 130, 246, 0.85)";
        break;
      case "download":
        borderColor = "#38bdf8";
        glowColor = "rgba(56, 189, 248, 0.85)";
        break;
      case "follower":
        borderColor = "#ec4899";
        glowColor = "rgba(236, 72, 153, 0.85)";
        break;
      case "goal":
        borderColor = "#eab308";
        glowColor = "rgba(234, 179, 8, 0.85)";
        break;
      case "reveal":
        borderColor = "#a855f7";
        glowColor = "rgba(168, 85, 247, 0.85)";
        break;
      case "incomingcall":
        borderColor = "#22c55e";
        glowColor = "rgba(34, 197, 94, 0.85)";
        break;
      case "batterycharge":
        borderColor = "#eab308";
        glowColor = "rgba(234, 179, 8, 0.85)";
        break;
      case "folder":
        borderColor = "#8b5cf6";
        glowColor = "rgba(139, 92, 246, 0.85)";
        break;
    }

    const strokeWidth = Math.max(6, Math.round((w / 1920) * 18));
    const halfStroke = strokeWidth / 2;

    c.save();

    // ── Layer 1: Outer Soft Neon Volumetric Aura ──
    c.shadowColor = glowColor;
    c.shadowBlur = strokeWidth * 4;
    c.strokeStyle = borderColor;
    c.globalAlpha = 0.45;
    c.lineWidth = strokeWidth * 1.6;
    c.strokeRect(halfStroke, halfStroke, w - strokeWidth, h - strokeWidth);

    // ── Layer 2: Core Volumetric 3D Stroke ──
    c.globalAlpha = 0.95;
    c.shadowBlur = strokeWidth * 1.8;
    c.lineWidth = strokeWidth;
    c.strokeRect(halfStroke, halfStroke, w - strokeWidth, h - strokeWidth);

    // ── Layer 3: Inner Sharp Specular Core Highlight Line ──
    c.globalAlpha = 0.85;
    c.shadowBlur = 0;
    c.strokeStyle = "#FFFFFF";
    c.lineWidth = Math.max(2.5, Math.round(strokeWidth * 0.22));
    const inset = strokeWidth * 0.4;
    c.strokeRect(inset, inset, w - inset * 2, h - inset * 2);

    // ── Layer 4: Top Specular Corner Light Sheen Beam ──
    const grad = c.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.15)");
    grad.addColorStop(0.3, "rgba(255, 255, 255, 0.95)");
    grad.addColorStop(0.7, "rgba(255, 255, 255, 0.95)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0.15)");
    c.strokeStyle = grad;
    c.lineWidth = Math.max(3, Math.round(strokeWidth * 0.3));
    c.beginPath();
    c.moveTo(0, inset);
    c.lineTo(w, inset);
    c.stroke();

    c.restore();
  };

  // ── Render State ──
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderTime, setRenderTime] = useState<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const playerRef = useRef<PlayerRef>(null);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset download when changing export settings or tab
  React.useEffect(() => {
    setVideoUrl(null);
    setRenderTime(null);
  }, [activeTab, resolution, fps, durationSec]);

  // Memoize total frames to avoid recalc on every render
  const totalFrames = useMemo(() => Math.max(1, Math.round(durationSec * fps)), [durationSec, fps]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="font-bold text-slate-400">Initializing Render Engine...</p>
        </div>
      </div>
    );
  }

  // Output video dimensions (for encoder only)
  const getOutputDims = (res: string) => {
    switch (res) {
      case "4K": return { w: 3840, h: 2160 };
      case "1440p": return { w: 2560, h: 1440 };
      case "1080p": return { w: 1920, h: 1080 };
      case "720p": default: return { w: 1280, h: 720 };
    }
  };

  const getBitrate = (res: string) => {
    switch (res) {
      case "4K": return 50_000_000;
      case "1440p": return 30_000_000;
      case "1080p": return 18_000_000;
      case "720p": default: return 8_000_000;
    }
  };

  const { w: outW, h: outH } = getOutputDims(resolution);

  // ── Client-Side WebM Video Export with Optimized Pipeline ──
  const startCSRRender = async () => {
    if (!playerRef.current) return;
    const player = playerRef.current;

    player.pause();
    player.seekTo(0);

    if (!window.VideoEncoder) {
      alert("Your browser does not support WebCodecs (VideoEncoder). Please use Chrome or Edge.");
      return;
    }

    setRendering(true);
    setRenderProgress(0);
    setVideoUrl(null);
    const t0 = performance.now();

    let videoEncoder: VideoEncoder | null = null;
    let encoderError: Error | null = null;

    try {
      const muxer = new Muxer({
        target: new ArrayBufferTarget(),
        video: { codec: "V_VP9", width: outW, height: outH, frameRate: fps },
      });

      videoEncoder = new VideoEncoder({
        output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
        error: (e) => {
          console.error("VideoEncoder error handler triggered:", e);
          encoderError = e instanceof Error ? e : new Error(String(e));
        },
      });

      /* ── PERF FIX #1: Use "realtime" latency mode for ~3-5× faster VP9 encoding.
             "quality" forces the encoder to do multi-pass analysis per frame.
             "realtime" uses single-pass with rate control — still excellent quality
             at our bitrates (8-50Mbps) but dramatically faster. ── */
      videoEncoder.configure({
        codec: "vp09.00.10.08",
        width: outW,
        height: outH,
        bitrate: getBitrate(resolution),
        latencyMode: "realtime",
      });

      // Let browser settle + pre-warm encoder
      await new Promise((r) => setTimeout(r, 100));

      // Reuse output canvas outside loop (avoids GC pressure)
      const outCanvas = document.createElement("canvas");
      outCanvas.width = outW;
      outCanvas.height = outH;
      const ctx = outCanvas.getContext("2d", { alpha: false });
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      /* ── PERF FIX #2: Pre-compute html-to-image config once (avoid re-alloc per frame) ── */
      const captureNode = activeTab !== "earth" ? document.getElementById("csr-capture-node") : null;
      const nodeWidth = captureNode?.clientWidth || 800;
      const exactPixelRatio = outW / nodeWidth;
      const htmlToImageConfig = {
        pixelRatio: exactPixelRatio,
        /* ── PERF FIX #3: skipFonts=true — fonts are already loaded in the page.
               html-to-image re-fetches and inlines ALL @font-face declarations
               for each capture when this is false. This alone saves ~100-200ms/frame. ── */
        skipFonts: true,
        cacheBust: false,
        /* ── PERF FIX #4: Skip auto-embed of images — our compositions use
               pure CSS gradients and inline SVGs, no external <img> sources. ── */
        skipAutoScale: true,
        includeQuerySelector: null,
      };

      /* ── PERF FIX #5: Batch progress updates — calling setRenderProgress on
             EVERY frame triggers a full React re-render (reconciliation + DOM diff)
             60+ times during export. We batch to update every 5 frames. ── */
      const PROGRESS_BATCH = Math.max(1, Math.ceil(totalFrames / 20)); // ~20 updates total

      for (let f = 0; f < totalFrames; f++) {
        if (encoderError) {
          throw encoderError;
        }

        if (!videoEncoder || videoEncoder.state !== "configured") {
          throw new Error(`VideoEncoder is closed or not configured (state: ${videoEncoder?.state})`);
        }

        player.seekTo(f);

        /* ── PERF FIX #6: Double-RAF settling — a single requestAnimationFrame
               only schedules work for the NEXT frame, but Remotion's interpolation
               + React state propagation may not have fully painted yet.
               Double-RAF guarantees the browser has composited the new frame. ── */
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
          });
        });

        let srcCanvas: HTMLCanvasElement | null = null;

        if (activeTab === "earth") {
          srcCanvas = document.querySelector("canvas");
          if (!srcCanvas) throw new Error("WebGL canvas not found.");
        } else {
          if (!captureNode) throw new Error("Capture node not found.");

          srcCanvas = await htmlToImage.toCanvas(captureNode, htmlToImageConfig);

          if (!srcCanvas) throw new Error("html-to-image failed.");
        }

        if (ctx) {
          ctx.drawImage(srcCanvas, 0, 0, outW, outH);
          if (showBorder) {
            drawBorderOnCanvas(ctx, outW, outH, activeTab, sliderMode);
          }
        }

        const timestamp = (f * 1_000_000) / fps;
        const vf = new VideoFrame(outCanvas, { timestamp });

        if (videoEncoder.state === "configured") {
          videoEncoder.encode(vf, { keyFrame: f % (fps * 2) === 0 }); // Keyframe every 2s
        }
        vf.close();

        // Batched progress update (PERF FIX #5)
        if (f % PROGRESS_BATCH === 0 || f === totalFrames - 1) {
          setRenderProgress(Math.round(((f + 1) / totalFrames) * 100));
        }
      }

      if (videoEncoder.state === "configured") {
        await videoEncoder.flush();
      }
      muxer.finalize();

      const blob = new Blob([muxer.target.buffer], { type: "video/webm" });
      setVideoUrl(URL.createObjectURL(blob));
      setRenderTime(Math.round((performance.now() - t0) / 1000));
    } catch (err: any) {
      console.error("Rendering failed:", err);
      alert("Export Error: " + (err.message || String(err)));
    } finally {
      if (videoEncoder && videoEncoder.state !== "closed") {
        try {
          videoEncoder.close();
        } catch (e) {
          // Safe disposal
        }
      }
      setRendering(false);
    }
  };

  const tabs: { id: ActiveTab; label: string }[] = [
    { id: "fireslider", label: "🔥 Fire Slider" },
    { id: "earnings", label: "💰 Earnings" },
    { id: "earth", label: "🌍 Flight Map" },
    { id: "download", label: "📁 File Download" },
    { id: "follower", label: "👥 Social Growth" },
    { id: "goal", label: "🎯 Target Tracker" },
    { id: "reveal", label: "✨ Reveal" },
    { id: "incomingcall", label: "📞 Incoming Call" },
    { id: "batterycharge", label: "⚡ Battery Charge" },
    { id: "folder", label: "📁 3D Folder" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 p-8 flex flex-col gap-6 shadow-2xl">

        {/* Header */}
        <div className="text-center">
          <span className="bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs uppercase px-4 py-1.5 rounded-full tracking-widest">
            Studio Quality Video Exporter
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white mt-4">
            Remotion CSR Compiler
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
            Render motion graphics with custom visual background themes. Choose resolution, frame rate, and duration — then export.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              style={activeTab === id ? {
                backgroundColor: id === "fireslider" ? "#ea580c" : id === "incomingcall" ? "#16a34a" : id === "batterycharge" ? "#d97706" : id === "folder" ? "#8b5cf6" : id === "follower" ? "#ec4899" : id === "goal" ? "#eab308" : "#2563eb",
                boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
              } : undefined}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Player Viewport — ALWAYS 1920x1080 composition */}
        <div className={`w-full aspect-video rounded-2xl overflow-hidden bg-black transition-all duration-300 relative ${getThemeBorderClass(activeTab, sliderMode)}`}>
          <ExportModeContext.Provider value={rendering}>
          <div id="csr-capture-node" className="w-full h-full">
            {activeTab === "fireslider" && (
              <Player
                ref={playerRef}
                component={FireSliderRemotion}
                inputProps={{ val: sliderVal, mode: sliderMode }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "earnings" && (
              <Player
                ref={playerRef}
                component={EarningsRemotion}
                inputProps={{ val: earningsVal }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "earth" && (
              <Player
                ref={playerRef}
                component={EarthTravel}
                inputProps={{ origin, destination }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "download" && (
              <Player
                ref={playerRef}
                component={FileDownloadRemotion}
                inputProps={{ prog: downloadProg, fileName: downloadFileName }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "follower" && (
              <Player
                ref={playerRef}
                component={FollowerRemotion}
                inputProps={{ count: followerCount }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "goal" && (
              <Player
                ref={playerRef}
                component={GoalRemotion}
                inputProps={{ val: goalVal }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "reveal" && (
              <Player
                ref={playerRef}
                component={RevealRemotion}
                inputProps={{ text: revealText }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "incomingcall" && (
              <Player
                ref={playerRef}
                component={IncomingCallRemotion}
                inputProps={{ callerName, subtitle: "incoming call...", avatarUrl }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "batterycharge" && (
              <Player
                ref={playerRef}
                component={BatteryChargeRemotion}
                inputProps={{ targetPercentage: batteryTarget, label: "CHARGING" }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "folder" && (
              <Player
                ref={playerRef}
                component={FolderRemotion}
                inputProps={{
                  folderTitle,
                  filesCount,
                  lastUpdated: "Last added time Oct 13, 2025",
                  card1Title: "ui_mockup.png",
                  card2Title: "hero_render.mp4",
                  card3Title: "analytics.json",
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
          </div>
          </ExportModeContext.Provider>

          {/* Rendering Overlay */}
          {rendering && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-30 pointer-events-none">
              <div className="w-16 h-16 border-4 border-slate-700 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="font-extrabold text-xl text-white">Rendering {resolution} Video...</p>
                <p className="text-slate-400 text-sm mt-1">{outW}×{outH} | {fps} FPS | {durationSec}s ({totalFrames} frames)</p>
                <p className="text-orange-400 font-black text-3xl mt-2">{renderProgress}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Export Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Output Resolution</span>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              disabled={rendering}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold cursor-pointer disabled:opacity-50"
            >
              <option value="4K">4K (3840×2160)</option>
              <option value="1440p">1440p (2560×1440)</option>
              <option value="1080p">1080p (1920×1080) — Recommended</option>
              <option value="720p">720p (1280×720) — Fast</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Frame Rate</span>
            <select
              value={fps}
              onChange={(e) => setFps(Number(e.target.value))}
              disabled={rendering}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold cursor-pointer disabled:opacity-50"
            >
              <option value={60}>60 FPS (Smooth)</option>
              <option value={30}>30 FPS (Standard)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Duration</span>
            <select
              value={durationSec}
              onChange={(e) => setDurationSec(Number(e.target.value))}
              disabled={rendering}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold cursor-pointer disabled:opacity-50"
            >
              <option value={2}>2 seconds</option>
              <option value={4}>4 seconds</option>
              <option value={6}>6 seconds</option>
              <option value={8}>8 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={15}>15 seconds</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 justify-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Visual Outline</span>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white hover:bg-slate-750 transition-all select-none">
              <input
                type="checkbox"
                checked={showBorder}
                onChange={(e) => setShowBorder(e.target.checked)}
                disabled={rendering}
                className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
              />
              <span>Add Border / Outline</span>
            </label>
          </div>
        </div>

        {/* Template-Specific Controls */}
        {activeTab === "fireslider" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fire/Cold Slider Setup</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-300 whitespace-nowrap">Value (%):</span>
                <input
                  type="number" min="0" max="100"
                  value={sliderVal}
                  onChange={(e) => setSliderVal(Math.min(100, Math.max(0, Number(e.target.value))))}
                  disabled={rendering}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-orange-500 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-300 whitespace-nowrap">Theme:</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSliderMode("fire")} disabled={rendering}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={sliderMode === "fire" ? { backgroundColor: "#ea580c", color: "#fff" } : { backgroundColor: "#1e293b", color: "#94a3b8" }}
                  >
                    🔥 Volcanic Fire
                  </button>
                  <button
                    onClick={() => setSliderMode("cold")} disabled={rendering}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                    style={sliderMode === "cold" ? { backgroundColor: "#0891b2", color: "#fff" } : { backgroundColor: "#1e293b", color: "#94a3b8" }}
                  >
                    ❄️ Arctic Frost
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "earnings" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Earnings Setup</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-300">Amount ($):</span>
              <input
                type="number" value={earningsVal}
                onChange={(e) => setEarningsVal(e.target.value)}
                disabled={rendering}
                className="w-full max-w-[200px] bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-blue-500 disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {activeTab === "earth" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Select Route</span>
            <div className="flex items-center gap-3">
              <select value={origin} onChange={(e) => setOrigin(e.target.value)} disabled={rendering}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold cursor-pointer disabled:opacity-50">
                {CITIES.map((c) => (<option key={c.id} value={c.id}>From: {c.name}</option>))}
              </select>
              <span className="text-slate-500">➔</span>
              <select value={destination} onChange={(e) => setDestination(e.target.value)} disabled={rendering}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold cursor-pointer disabled:opacity-50">
                {CITIES.map((c) => (<option key={c.id} value={c.id}>To: {c.name}</option>))}
              </select>
            </div>
          </div>
        )}

        {activeTab === "download" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">File Download Setup</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-300 whitespace-nowrap">File Name:</span>
                <input
                  type="text" value={downloadFileName}
                  onChange={(e) => setDownloadFileName(e.target.value)}
                  disabled={rendering}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-300 whitespace-nowrap">Progress (%):</span>
                <input
                  type="number" min="0" max="100" value={downloadProg}
                  onChange={(e) => setDownloadProg(Math.min(100, Math.max(0, Number(e.target.value))))}
                  disabled={rendering}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500 disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "follower" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Social Growth Setup</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-300">Follower Count:</span>
              <input
                type="number" value={followerCount}
                onChange={(e) => setFollowerCount(Number(e.target.value))}
                disabled={rendering}
                className="w-full max-w-[220px] bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-pink-500 disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {activeTab === "goal" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Target Tracker Setup</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-300">Goal Percentage (%):</span>
              <input
                type="number" min="0" max="100" value={goalVal}
                onChange={(e) => setGoalVal(Math.min(100, Math.max(0, Number(e.target.value))))}
                disabled={rendering}
                className="w-full max-w-[200px] bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-amber-500 disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {activeTab === "reveal" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Cinematic Reveal Setup</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-300">Text:</span>
              <input
                type="text" value={revealText}
                onChange={(e) => setRevealText(e.target.value)}
                disabled={rendering}
                maxLength={20}
                className="w-full max-w-[260px] bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-sky-500 disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {activeTab === "incomingcall" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Incoming Phone Call Setup</span>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-300">Caller Name:</span>
                <input
                  type="text" value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  disabled={rendering}
                  maxLength={20}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-emerald-400 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-300">Custom Logo/Avatar:</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) setAvatarUrl(ev.target.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  disabled={rendering}
                  className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "batterycharge" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Battery Charge Setup</span>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-300">Target Percentage:</span>
              <input
                type="range" min="0" max="100" value={batteryTarget}
                onChange={(e) => setBatteryTarget(Number(e.target.value))}
                disabled={rendering}
                className="w-48 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <span className="text-sm font-extrabold text-amber-400">{batteryTarget}%</span>
            </div>
          </div>
        )}

        {activeTab === "folder" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">3D Folder Setup</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-300">Folder Title:</span>
                <input
                  type="text" value={folderTitle}
                  onChange={(e) => setFolderTitle(e.target.value)}
                  disabled={rendering}
                  maxLength={20}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-violet-400 disabled:opacity-50"
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-300">Files Count:</span>
                <input
                  type="text" value={filesCount}
                  onChange={(e) => setFilesCount(e.target.value)}
                  disabled={rendering}
                  maxLength={15}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-violet-400 disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Primary Export Action */}
        <div className="flex flex-col gap-3">
          <button
            onClick={startCSRRender}
            disabled={rendering}
            className="w-full text-white font-black py-4 px-6 rounded-xl transition-all shadow-xl text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            style={{
              background: rendering ? "#1e293b" : "linear-gradient(90deg, #ea580c, #f59e0b)",
              boxShadow: rendering ? "none" : "0 10px 30px rgba(234,88,12,0.25)",
            }}
          >
            {rendering
              ? `Rendering Video... ${renderProgress}%`
              : `⚡ Export ${resolution} ${fps}FPS (${durationSec}s)`}
          </button>

          {videoUrl && (
            <a
              href={videoUrl}
              download={`${activeTab}_${resolution}_${fps}fps_${durationSec}s.webm`}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 px-6 rounded-xl text-center transition-all shadow-xl text-base flex items-center justify-center gap-2"
            >
              📥 Download {resolution} WebM Video
            </a>
          )}
        </div>

        {renderTime !== null && (
          <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl text-center text-sm font-medium">
            ✅ <span className="font-bold text-emerald-400">{resolution} {fps}FPS ({durationSec}s WebM)</span> rendered in <span className="font-bold text-white">{renderTime}s</span> on this device
          </div>
        )}
      </div>
    </div>
  );
}
