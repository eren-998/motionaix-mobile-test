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
import { SubscribeRemotion } from "@/components/remotion/SubscribeRemotion";
import { IosNotificationRemotion } from "@/components/remotion/IosNotificationRemotion";
import { NewsArticleRemotion } from "@/components/remotion/NewsArticleRemotion";
import { ChartEngineRemotion, ChartDataPoint } from "@/components/remotion/ChartEngineRemotion";
import { YoutubeOdometerRemotion } from "@/components/remotion/YoutubeOdometerRemotion";
import { InstagramOdometerRemotion } from "@/components/remotion/InstagramOdometerRemotion";
import { HalftoneRemotion } from "@/components/remotion/HalftoneRemotion";
import { Sprite16Remotion } from "@/components/remotion/Sprite16Remotion";
import { PunkCollageRemotion } from "@/components/remotion/PunkCollageRemotion";
import { FatPixelRemotion } from "@/components/remotion/FatPixelRemotion";
import { BootlegRemotion } from "@/components/remotion/BootlegRemotion";
import { AsciiRemotion } from "@/components/remotion/AsciiRemotion";
import { CmykRemotion } from "@/components/remotion/CmykRemotion";
import { TeletextRemotion } from "@/components/remotion/TeletextRemotion";
import { DitherRemotion } from "@/components/remotion/DitherRemotion";
import * as htmlToImage from "html-to-image";
import { Muxer, ArrayBufferTarget } from "webm-muxer";
import { ExportModeContext } from "@/lib/export-context";

type ActiveTab = "fireslider" | "earnings" | "earth" | "download" | "follower" | "goal" | "reveal" | "incomingcall" | "batterycharge" | "folder" | "subscribe" | "iosnotification" | "newsarticle" | "chartengine" | "ytodometer" | "igodometer" | "halftone" | "sprite16" | "punk" | "fatpixel" | "bootleg" | "ascii" | "cmyk" | "teletext" | "dither";

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

  // ── Converted Component States ──
  const [subChannelName, setSubChannelName] = useState<string>("Motionaix");
  const [subHandle, setSubHandle] = useState<string>("@motionaix");
  const [subSubCount, setSubSubCount] = useState<string>("1.2M subscribers");
  const [subAvatarUrl, setSubAvatarUrl] = useState<string>("");

  const [iosAppName, setIosAppName] = useState<string>("Messages");
  const [iosNotiTitle, setIosNotiTitle] = useState<string>("Sarah Jenkins");
  const [iosNotiMessage, setIosNotiMessage] = useState<string>("Are we still meeting at Blue Bottle Coffee at 5? ☕");
  const [iosNotiTime, setIosNotiTime] = useState<string>("now");
  const [iosIconUrl, setIosIconUrl] = useState<string>("");

  const [newsChannel, setNewsChannel] = useState<string>("THE HINDU");
  const [newsHeadline, setNewsHeadline] = useState<string>("Trump signs order seeking to overhaul U.S. elections, including requiring {proof of citizenship}");
  const [newsDate, setNewsDate] = useState<string>("Published - March 26, 2026 07:38 am");
  const [newsBody, setNewsBody] = useState<string>("President Donald Trump signed a sweeping executive action to overhaul elections in the U.S. on Tuesday (March 25, 2026), including requiring {documentary proof} of citizenship to register to vote in federal elections.");
  const [newsHighlightColor, setNewsHighlightColor] = useState<string>("#FFF04D");
  const [newsTextColor, setNewsTextColor] = useState<string>("#000000");
  const [newsPaperStyle, setNewsPaperStyle] = useState<"vintage" | "newsprint" | "classic" | "transparent">("vintage");

  // ── Chart Engine States ──
  const [chartTitle, setChartTitle] = useState<string>("REVENUE GROWTH");
  const [chartSubtitle, setChartSubtitle] = useState<string>("Q1 - Q4 Fiscal Year 2026");
  const [chartYAxisGap, setChartYAxisGap] = useState<number>(20);
  const [chartYAxisMinLines, setChartYAxisMinLines] = useState<number>(5);
  const [chartDataPoints, setChartDataPoints] = useState<ChartDataPoint[]>([
    { id: 1, label: "2023", value: 45, desc: "Initial Stage", color: "#E4E4E7" },
    { id: 2, label: "2024", value: 30, desc: "Market Dip", color: "#E4E4E7" },
    { id: 3, label: "2025", value: 85, desc: "Recovery", color: "#E4E4E7" },
    { id: 4, label: "2026", value: 140, desc: "Massive Scale", color: "#3B82F6" },
  ]);

  const [ytChannelName, setYtChannelName] = useState<string>("Motionaix");
  const [ytHandle, setYtHandle] = useState<string>("@motionaix");
  const [ytBaseCount, setYtBaseCount] = useState<number>(124000);
  const [ytAvatarUrl, setYtAvatarUrl] = useState<string>("");

  const [igChannelName, setIgChannelName] = useState<string>("Aesthetic Vibes");
  const [igBaseCount, setIgBaseCount] = useState<number>(124000);
  const [igPosts, setIgPosts] = useState<string>("1,204");
  const [igFollowing, setIgFollowing] = useState<string>("42");
  const [igCategory, setIgCategory] = useState<string>("Digital Creator");
  const [igBio, setIgBio] = useState<string>("Creating visual experiences ✨\nCheck out the link below 👇");
  const [igLink, setIgLink] = useState<string>("linktr.ee/aestheticvibes");
  const [igAvatarUrl, setIgAvatarUrl] = useState<string>("");
  const [igAssetFit, setIgAssetFit] = useState<boolean>(false);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);

  // ── AE Aesthetic Studio States ──
  const [halftoneMode, setHalftoneMode] = useState<"image" | "imageToVideo" | "videoOverlay">("image");
  const [studioImageUrl, setStudioImageUrl] = useState<string>("/demo-artwork.jpg");
  const [studioVideoUrl, setStudioVideoUrl] = useState<string>("/EarningsRemotion.webm");
  const [studioShowSplit, setStudioShowSplit] = useState<boolean>(false);
  const [studioSplitPos, setStudioSplitPos] = useState<number>(0.5);

  // Halftone Specific
  const [halftoneDotSize, setHalftoneDotSize] = useState<number>(10);
  const [halftoneAngle, setHalftoneAngle] = useState<number>(45);
  const [halftoneContrast, setHalftoneContrast] = useState<number>(1.6);
  const [halftoneWhiteCutoff, setHalftoneWhiteCutoff] = useState<number>(0.85);
  const [halftoneBgTint, setHalftoneBgTint] = useState<string>("#1233e6");
  const [halftoneAnimateAngle, setHalftoneAnimateAngle] = useState<boolean>(true);

  // Sprite 16 Specific
  const [spritePixelSize, setSpritePixelSize] = useState<number>(12);
  const [spriteColorCount, setSpriteColorCount] = useState<number>(16);
  const [spriteOutline, setSpriteOutline] = useState<boolean>(true);
  const [spriteScanlines, setSpriteScanlines] = useState<boolean>(true);

  // Punk Collage Specific
  const [punkThreshold, setPunkThreshold] = useState<number>(120);
  const [punkPaperColor, setPunkPaperColor] = useState<string>("#ff0066");
  const [punkInkColor, setPunkInkColor] = useState<string>("#090d16");
  const [punkGrainStep, setPunkGrainStep] = useState<number>(4);
  const [punkTapeColor, setPunkTapeColor] = useState<string>("#ccff00");
  const [punkShowTape, setPunkShowTape] = useState<boolean>(false);
  const [punkTapePos, setPunkTapePos] = useState<"br" | "tr" | "bl" | "tl">("br");
  const [punkTapeAngle, setPunkTapeAngle] = useState<number>(-12);

  // Aspect Ratio & Auto Image Natural Ratio State
  const [aspectRatioMode, setAspectRatioMode] = useState<"auto" | "16:9" | "1:1" | "9:16">("auto");
  const [imageNaturalRatio, setImageNaturalRatio] = useState<{ w: number; h: number }>({ w: 1920, h: 1080 });

  // Fat Pixel Specific
  const [fatBlockSize, setFatBlockSize] = useState<number>(18);
  const [fatPosterize, setFatPosterize] = useState<number>(5);

  // Bootleg Pixel Specific
  const [bootlegPixelSize, setBootlegPixelSize] = useState<number>(12);
  const [bootlegColorShift, setBootlegColorShift] = useState<boolean>(true);
  const [bootlegEdgeOutline, setBootlegEdgeOutline] = useState<boolean>(true);

  // ASCII Art Specific
  const [asciiCharSize, setAsciiCharSize] = useState<number>(10);
  const [asciiColorMode, setAsciiColorMode] = useState<"green" | "amber" | "original" | "bw">("green");

  // CMYK Dots Specific
  const [cmykDotSize, setCmykDotSize] = useState<number>(8);
  const [cmykContrast, setCmykContrast] = useState<number>(1.3);

  // Teletext Specific
  const [teletextGridSize, setTeletextGridSize] = useState<number>(14);
  const [teletextScanlines, setTeletextScanlines] = useState<boolean>(true);

  // 1-Bit Dither Specific
  const [ditherScale, setDitherScale] = useState<number>(2);
  const [ditherFgColor, setDitherFgColor] = useState<string>("#000000");
  const [ditherBgColor, setDitherBgColor] = useState<string>("#ffffff");

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
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset download when changing export settings or tab
  React.useEffect(() => {
    setVideoUrl(null);
    setRenderTime(null);
  }, [activeTab, resolution, fps, durationSec]);

  React.useEffect(() => {
    if (studioImageUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (img.naturalWidth && img.naturalHeight) {
          setImageNaturalRatio({ w: img.naturalWidth, h: img.naturalHeight });
        }
      };
      img.src = studioImageUrl;
    }
  }, [studioImageUrl]);

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

  const isAestheticTab = ["halftone", "sprite16", "punk", "fatpixel", "bootleg", "ascii", "cmyk", "teletext", "dither"].includes(activeTab);

  const getDynamicCompDims = () => {
    if (isAestheticTab) {
      if (aspectRatioMode === "auto" && imageNaturalRatio.w && imageNaturalRatio.h) {
        return { w: imageNaturalRatio.w, h: imageNaturalRatio.h };
      }
      if (aspectRatioMode === "1:1") return { w: 1080, h: 1080 };
      if (aspectRatioMode === "9:16") return { w: 1080, h: 1920 };
    }
    return { w: COMP_WIDTH, h: COMP_HEIGHT };
  };

  const { w: activeCompW, h: activeCompH } = getDynamicCompDims();

  // Output video dimensions (for encoder only)
  const getOutputDims = (res: string) => {
    if (isAestheticTab && aspectRatioMode === "auto" && imageNaturalRatio.w && imageNaturalRatio.h) {
      return { w: imageNaturalRatio.w, h: imageNaturalRatio.h };
    }
    if (isAestheticTab && aspectRatioMode === "1:1") return { w: 1080, h: 1080 };
    if (isAestheticTab && aspectRatioMode === "9:16") return { w: 1080, h: 1920 };
    if (activeTab === "igodometer" && igAssetFit) {
      return { w: 700, h: 520 };
    }
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
      const ctx = outCanvas.getContext("2d", { alpha: transparentBg });
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
        skipFonts: true,
        cacheBust: false,
        skipAutoScale: true,
        includeQuerySelector: null,
        backgroundColor: transparentBg ? "transparent" : undefined,
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
        const childCanvas = captureNode?.querySelector("canvas");

        if (activeTab === "earth" || childCanvas) {
          srcCanvas = (childCanvas || document.querySelector("canvas")) as HTMLCanvasElement | null;
          if (!srcCanvas) throw new Error("Canvas element not found.");
        } else {
          if (!captureNode) throw new Error("Capture node not found.");

          srcCanvas = await htmlToImage.toCanvas(captureNode, htmlToImageConfig);

          if (!srcCanvas) throw new Error("html-to-image failed.");
        }

        if (ctx) {
          if (transparentBg) {
            ctx.clearRect(0, 0, outW, outH);
          }
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

  // ── High-Res PNG Image Export Action ──
  const exportHighResPNG = async () => {
    try {
      const captureNode = document.getElementById("csr-capture-node");
      const childCanvas = captureNode?.querySelector("canvas");
      let canvasToSave: HTMLCanvasElement | null = null;

      if (activeTab === "earth" || childCanvas) {
        canvasToSave = (childCanvas || document.querySelector("canvas")) as HTMLCanvasElement | null;
      } else if (captureNode) {
        canvasToSave = await htmlToImage.toCanvas(captureNode, {
          pixelRatio: 2,
          backgroundColor: transparentBg ? "transparent" : undefined,
        });
      }

      if (canvasToSave) {
        const dataUrl = canvasToSave.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `motionaix-${activeTab}-${Date.now()}.png`;
        a.click();
      } else {
        alert("Unable to capture image preview.");
      }
    } catch (e: any) {
      console.error("PNG export error:", e);
      alert("PNG Export Error: " + (e.message || String(e)));
    }
  };

  const handleSplitDrag = (clientX: number) => {
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    setStudioSplitPos(Math.round((x / rect.width) * 100) / 100);
  };

  const templateTabs: { id: ActiveTab; label: string }[] = [
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
    { id: "subscribe", label: "🔴 Subscribe Banner" },
    { id: "iosnotification", label: "💬 iOS Notification" },
    { id: "newsarticle", label: "📰 News Article" },
    { id: "chartengine", label: "📊 Chart Engine" },
    { id: "ytodometer", label: "▶️ YT Odometer" },
    { id: "igodometer", label: "📸 IG Odometer" },
  ];

  const studioTabs: { id: ActiveTab; label: string }[] = [
    { id: "halftone", label: "🔴 Halftone Print" },
    { id: "sprite16", label: "👾 16-Bit Sprite" },
    { id: "fatpixel", label: "📦 Fat Pixel" },
    { id: "bootleg", label: "🐛 Bootleg Pixel" },
    { id: "ascii", label: "💻 ASCII Art" },
    { id: "punk", label: "✂️ Punk Collage" },
    { id: "cmyk", label: "🎨 CMYK Dots" },
    { id: "teletext", label: "📺 Teletext" },
    { id: "dither", label: "🏁 1-Bit Dither" },
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
        {/* Tab Switcher - Motion Templates & AE Aesthetic Studio */}
        <div className="flex flex-col gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2 px-1">
              🎬 Motion Graphics Templates
            </span>
            <div className="flex flex-wrap gap-1.5">
              {templateTabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    activeTab === id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-850">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 block mb-2 px-1">
              🎨 AE Aesthetic Effects Studio (Separate Windows)
            </span>
            <div className="flex flex-wrap gap-2">
              {studioTabs.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all border ${
                    activeTab === id
                      ? id === "halftone"
                        ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30"
                        : id === "sprite16"
                        ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                        : "bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-600/30"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Player Viewport — ALWAYS 1920x1080 composition */}
        <div
          ref={viewportRef}
          className={`w-full aspect-video rounded-2xl overflow-hidden bg-black transition-all duration-300 relative select-none ${getThemeBorderClass(activeTab, sliderMode)}`}
          onMouseMove={(e) => { if (isDraggingSplit) handleSplitDrag(e.clientX); }}
          onMouseUp={() => setIsDraggingSplit(false)}
          onMouseLeave={() => setIsDraggingSplit(false)}
          onTouchMove={(e) => { if (isDraggingSplit) handleSplitDrag(e.touches[0].clientX); }}
          onTouchEnd={() => setIsDraggingSplit(false)}
        >
          {/* Interactive Before / After Split Slider Overlay */}
          {studioShowSplit && ["halftone", "sprite16", "punk"].includes(activeTab) && (
            <div
              className="absolute inset-0 z-20 cursor-ew-resize pointer-events-auto"
              onMouseDown={(e) => { setIsDraggingSplit(true); handleSplitDrag(e.clientX); }}
              onTouchStart={(e) => { setIsDraggingSplit(true); handleSplitDrag(e.touches[0].clientX); }}
            >
              {/* Vertical Split Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,1)] flex items-center justify-center -translate-x-1/2 pointer-events-none z-30"
                style={{ left: `${studioSplitPos * 100}%` }}
              >
                <div className="w-10 h-10 rounded-full bg-white text-slate-950 font-black text-xs flex items-center justify-center shadow-2xl border-2 border-slate-900 tracking-tighter">
                  ◀▶
                </div>
              </div>

              {/* Before / After Badges */}
              <div className="absolute top-4 left-4 pointer-events-none px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 font-bold text-[10px] uppercase text-slate-200 tracking-widest shadow-lg z-30">
                Original (Before)
              </div>
              <div className="absolute top-4 right-4 pointer-events-none px-3 py-1 rounded-full bg-blue-600/80 backdrop-blur-md border border-white/20 font-bold text-[10px] uppercase text-white tracking-widest shadow-lg z-30">
                AE Shader (After)
              </div>
            </div>
          )}

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
            {activeTab === "subscribe" && (
              <Player
                ref={playerRef}
                component={SubscribeRemotion}
                inputProps={{ channelName: subChannelName, handle: subHandle, subCount: subSubCount, avatarUrl: subAvatarUrl }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "iosnotification" && (
              <Player
                ref={playerRef}
                component={IosNotificationRemotion}
                inputProps={{ appName: iosAppName, notiTitle: iosNotiTitle, notiMessage: iosNotiMessage, notiTime: iosNotiTime, iconUrl: iosIconUrl }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "newsarticle" && (
              <Player
                ref={playerRef}
                component={NewsArticleRemotion}
                inputProps={{
                  channelName: newsChannel,
                  headline: newsHeadline,
                  date: newsDate,
                  body: newsBody,
                  highlightColor: newsHighlightColor,
                  textColor: newsTextColor,
                  paperStyle: newsPaperStyle,
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
            {activeTab === "chartengine" && (
              <Player
                ref={playerRef}
                component={ChartEngineRemotion}
                inputProps={{
                  title: chartTitle,
                  subtitle: chartSubtitle,
                  data: chartDataPoints,
                  yAxisGap: chartYAxisGap,
                  yAxisMinLines: chartYAxisMinLines,
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
            {activeTab === "ytodometer" && (
              <Player
                ref={playerRef}
                component={YoutubeOdometerRemotion}
                inputProps={{ channelName: ytChannelName, handle: ytHandle, baseCount: ytBaseCount, avatarUrl: ytAvatarUrl }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={COMP_WIDTH}
                compositionHeight={COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "igodometer" && (
              <Player
                ref={playerRef}
                component={InstagramOdometerRemotion}
                inputProps={{
                  channelName: igChannelName,
                  baseCount: igBaseCount,
                  igPosts,
                  igFollowing,
                  igCategory,
                  igBio,
                  igLink,
                  avatarUrl: igAvatarUrl,
                  fitAsset: igAssetFit,
                  transparentBg,
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={igAssetFit ? 700 : COMP_WIDTH}
                compositionHeight={igAssetFit ? 520 : COMP_HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                loop
              />
            )}
            {activeTab === "halftone" && (
              <Player
                ref={playerRef}
                component={HalftoneRemotion}
                inputProps={{
                  mode: halftoneMode,
                  imageUrl: studioImageUrl,
                  videoUrl: studioVideoUrl,
                  dotSize: halftoneDotSize,
                  angle: halftoneAngle,
                  contrast: halftoneContrast,
                  whiteCutoff: halftoneWhiteCutoff,
                  bgTint: halftoneBgTint,
                  splitPos: studioSplitPos,
                  showSplit: studioShowSplit,
                  animateAngle: halftoneAnimateAngle,
                  transparentBg,
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={activeCompW}
                compositionHeight={activeCompH}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                autoPlay={halftoneMode !== "image" || halftoneAnimateAngle}
                loop={halftoneMode !== "image" || halftoneAnimateAngle}
              />
            )}
            {activeTab === "sprite16" && (
              <Player
                ref={playerRef}
                component={Sprite16Remotion}
                inputProps={{
                  imageUrl: studioImageUrl,
                  pixelSize: spritePixelSize,
                  colorCount: spriteColorCount,
                  outline: spriteOutline,
                  scanlines: spriteScanlines,
                  splitPos: studioSplitPos,
                  showSplit: studioShowSplit,
                  transparentBg,
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={activeCompW}
                compositionHeight={activeCompH}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                autoPlay={false}
                loop={false}
              />
            )}
            {activeTab === "punk" && (
              <Player
                ref={playerRef}
                component={PunkCollageRemotion}
                inputProps={{
                  imageUrl: studioImageUrl,
                  threshold: punkThreshold,
                  paperColor: punkPaperColor,
                  inkColor: punkInkColor,
                  grainStep: punkGrainStep,
                  tapeColor: punkTapeColor,
                  showTape: punkShowTape,
                  tapePosition: punkTapePos,
                  tapeAngle: punkTapeAngle,
                  splitPos: studioSplitPos,
                  showSplit: studioShowSplit,
                  transparentBg,
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={activeCompW}
                compositionHeight={activeCompH}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                autoPlay={false}
                loop={false}
              />
            )}
            {activeTab === "fatpixel" && (
              <Player
                ref={playerRef}
                component={FatPixelRemotion}
                inputProps={{
                  imageUrl: studioImageUrl,
                  blockSize: fatBlockSize,
                  posterize: fatPosterize,
                  splitPos: studioSplitPos,
                  showSplit: studioShowSplit,
                  transparentBg,
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={activeCompW}
                compositionHeight={activeCompH}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                autoPlay={false}
                loop={false}
              />
            )}
            {activeTab === "bootleg" && (
              <Player
                ref={playerRef}
                component={BootlegRemotion}
                inputProps={{
                  imageUrl: studioImageUrl,
                  pixelSize: bootlegPixelSize,
                  colorShift: bootlegColorShift,
                  edgeOutline: bootlegEdgeOutline,
                  splitPos: studioSplitPos,
                  showSplit: studioShowSplit,
                  transparentBg,
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={activeCompW}
                compositionHeight={activeCompH}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                autoPlay={false}
                loop={false}
              />
            )}
            {activeTab === "ascii" && (
              <Player
                ref={playerRef}
                component={AsciiRemotion}
                inputProps={{
                  imageUrl: studioImageUrl,
                  charSize: asciiCharSize,
                  colorMode: asciiColorMode,
                  splitPos: studioSplitPos,
                  showSplit: studioShowSplit,
                  transparentBg,
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={activeCompW}
                compositionHeight={activeCompH}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                autoPlay={false}
                loop={false}
              />
            )}
            {activeTab === "cmyk" && (
              <Player
                ref={playerRef}
                component={CmykRemotion}
                inputProps={{
                  imageUrl: studioImageUrl,
                  dotSize: cmykDotSize,
                  contrast: cmykContrast,
                  splitPos: studioSplitPos,
                  showSplit: studioShowSplit,
                  transparentBg,
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={activeCompW}
                compositionHeight={activeCompH}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                autoPlay={false}
                loop={false}
              />
            )}
            {activeTab === "teletext" && (
              <Player
                ref={playerRef}
                component={TeletextRemotion}
                inputProps={{
                  imageUrl: studioImageUrl,
                  gridSize: teletextGridSize,
                  scanlines: teletextScanlines,
                  splitPos: studioSplitPos,
                  showSplit: studioShowSplit,
                  transparentBg,
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={activeCompW}
                compositionHeight={activeCompH}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                autoPlay={false}
                loop={false}
              />
            )}
            {activeTab === "dither" && (
              <Player
                ref={playerRef}
                component={DitherRemotion}
                inputProps={{
                  imageUrl: studioImageUrl,
                  scale: ditherScale,
                  fgColor: ditherFgColor,
                  bgColor: ditherBgColor,
                  splitPos: studioSplitPos,
                  showSplit: studioShowSplit,
                  transparentBg,
                }}
                durationInFrames={totalFrames}
                fps={fps}
                compositionWidth={activeCompW}
                compositionHeight={activeCompH}
                style={{ width: "100%", height: "100%" }}
                controls={!rendering}
                autoPlay={false}
                loop={false}
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
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Aspect Ratio / Size</span>
            <select
              value={aspectRatioMode}
              onChange={(e) => setAspectRatioMode(e.target.value as any)}
              disabled={rendering}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-bold cursor-pointer disabled:opacity-50"
            >
              <option value="auto">Auto (Original Image Ratio: {imageNaturalRatio.w}×{imageNaturalRatio.h})</option>
              <option value="16:9">16:9 Landscape (1920×1080)</option>
              <option value="1:1">1:1 Square (1080×1080)</option>
              <option value="9:16">9:16 Reel / Story (1080×1920)</option>
            </select>
          </div>
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
              <span>Border / Outline</span>
            </label>
          </div>
          <div className="flex flex-col gap-1.5 justify-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Background</span>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-slate-750 transition-all select-none">
              <input
                type="checkbox"
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
                disabled={rendering}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span>Ghost / Transparent (Alpha)</span>
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

        {/* ── Subscribe Controls Panel ── */}
        {activeTab === "subscribe" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Subscriber Banner Setup</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Channel Name</label>
                <input
                  type="text" value={subChannelName} onChange={(e) => setSubChannelName(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Handle</label>
                <input
                  type="text" value={subHandle} onChange={(e) => setSubHandle(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Subscribers</label>
                <input
                  type="text" value={subSubCount} onChange={(e) => setSubSubCount(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Custom Avatar:</span>
              <input
                type="file" accept="image/*" disabled={rendering}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { if (ev.target?.result) setSubAvatarUrl(ev.target.result as string); };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ── iOS Notification Controls Panel ── */}
        {activeTab === "iosnotification" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">iOS Notification Setup</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">App Name</label>
                <input
                  type="text" value={iosAppName} onChange={(e) => setIosAppName(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Title</label>
                <input
                  type="text" value={iosNotiTitle} onChange={(e) => setIosNotiTitle(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Timestamp</label>
                <input
                  type="text" value={iosNotiTime} onChange={(e) => setIosNotiTime(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400">Notification Message</label>
              <input
                type="text" value={iosNotiMessage} onChange={(e) => setIosNotiMessage(e.target.value)} disabled={rendering}
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Custom App Icon:</span>
              <input
                type="file" accept="image/*" disabled={rendering}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { if (ev.target?.result) setIosIconUrl(ev.target.result as string); };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-500/20 file:text-blue-400 hover:file:bg-blue-500/30 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ── News Article Controls Panel ── */}
        {activeTab === "newsarticle" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">News Article Setup</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Publisher</label>
                <input
                  type="text" value={newsChannel} onChange={(e) => setNewsChannel(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Date Line</label>
                <input
                  type="text" value={newsDate} onChange={(e) => setNewsDate(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400">Headline (Use &#123;highlight&#125; for wipe effect)</label>
              <textarea
                value={newsHeadline} onChange={(e) => setNewsHeadline(e.target.value)} disabled={rendering}
                rows={2} className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400">Body Text</label>
              <textarea
                value={newsBody} onChange={(e) => setNewsBody(e.target.value)} disabled={rendering}
                rows={3} className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-400 resize-none"
              />
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Paper Style:</span>
                <select
                  value={newsPaperStyle} onChange={(e) => setNewsPaperStyle(e.target.value as any)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-bold cursor-pointer"
                >
                  <option value="vintage">Vintage</option>
                  <option value="newsprint">Newsprint</option>
                  <option value="classic">Classic White</option>
                  <option value="transparent">Transparent Glass</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Highlight Color:</span>
                <input
                  type="color" value={newsHighlightColor} onChange={(e) => setNewsHighlightColor(e.target.value)} disabled={rendering}
                  className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer p-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Text Color:</span>
                <input
                  type="color" value={newsTextColor} onChange={(e) => setNewsTextColor(e.target.value)} disabled={rendering}
                  className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer p-0"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── YT Odometer Controls Panel ── */}
        {activeTab === "ytodometer" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">YouTube Odometer Setup</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Channel Name</label>
                <input
                  type="text" value={ytChannelName} onChange={(e) => setYtChannelName(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Handle</label>
                <input
                  type="text" value={ytHandle} onChange={(e) => setYtHandle(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Start Count</label>
                <input
                  type="number" value={ytBaseCount} onChange={(e) => setYtBaseCount(Number(e.target.value))} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Custom Avatar:</span>
              <input
                type="file" accept="image/*" disabled={rendering}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { if (ev.target?.result) setYtAvatarUrl(ev.target.result as string); };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-red-500/20 file:text-red-400 hover:file:bg-red-500/30 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ── Chart Engine Controls Panel ── */}
        {activeTab === "chartengine" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Chart Engine Setup</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Main Title</label>
                <input
                  type="text" value={chartTitle} onChange={(e) => setChartTitle(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Subtitle</label>
                <input
                  type="text" value={chartSubtitle} onChange={(e) => setChartSubtitle(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Smart Y-Axis Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-blue-500/20">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-blue-400">Smart Y-Axis Numbers Gap</label>
                <input
                  type="number" min="1" value={chartYAxisGap} onChange={(e) => setChartYAxisGap(Number(e.target.value))} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-blue-400">Minimum Grid Lines</label>
                <input
                  type="number" min="2" value={chartYAxisMinLines} onChange={(e) => setChartYAxisMinLines(Number(e.target.value))} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Pillars Data Editor */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pillars Data ({chartDataPoints.length}/15)</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {chartDataPoints.map((point, index) => (
                  <div key={point.id} className="flex flex-wrap items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl">
                    <span className="text-xs font-extrabold text-blue-400 w-5">{index + 1}.</span>
                    <input
                      type="color" value={point.color} disabled={rendering}
                      onChange={(e) => {
                        const newColor = e.target.value;
                        setChartDataPoints(chartDataPoints.map(p => p.id === point.id ? { ...p, color: newColor } : p));
                      }}
                      className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text" value={point.label} placeholder="Label (e.g. 2026)" disabled={rendering}
                      onChange={(e) => {
                        const newL = e.target.value;
                        setChartDataPoints(chartDataPoints.map(p => p.id === point.id ? { ...p, label: newL } : p));
                      }}
                      className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number" value={point.value} placeholder="Value" disabled={rendering}
                      onChange={(e) => {
                        const newV = Number(e.target.value);
                        setChartDataPoints(chartDataPoints.map(p => p.id === point.id ? { ...p, value: newV } : p));
                      }}
                      className="w-24 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text" value={point.desc} placeholder="Desc (e.g. +40%)" disabled={rendering}
                      onChange={(e) => {
                        const newD = e.target.value;
                        setChartDataPoints(chartDataPoints.map(p => p.id === point.id ? { ...p, desc: newD } : p));
                      }}
                      className="flex-1 min-w-[100px] bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-blue-500"
                    />
                    {chartDataPoints.length > 1 && (
                      <button
                        onClick={() => setChartDataPoints(chartDataPoints.filter(p => p.id !== point.id))}
                        disabled={rendering}
                        className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold text-xs rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (chartDataPoints.length >= 15) return;
                  const newId = chartDataPoints.length > 0 ? Math.max(...chartDataPoints.map(p => p.id)) + 1 : 1;
                  setChartDataPoints([...chartDataPoints, { id: newId, label: "New", value: 50, desc: "Stage", color: "#E4E4E7" }]);
                }}
                disabled={rendering || chartDataPoints.length >= 15}
                className="py-2.5 border border-dashed border-slate-700 hover:border-blue-500 hover:bg-blue-500/10 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-50"
              >
                + ADD NEW PILLAR
              </button>
            </div>
          </div>
        )}

        {/* ── Halftone Print Controls Panel ── */}
        {activeTab === "halftone" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Halftone Print Studio Setup</span>
            
            {/* Halftone Mode Selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-blue-500/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300">Mode:</span>
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                  <button
                    onClick={() => setHalftoneMode("image")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      halftoneMode === "image" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    📷 Static Image
                  </button>
                  <button
                    onClick={() => setHalftoneMode("imageToVideo")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      halftoneMode === "imageToVideo" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🎬 Image-to-Video Animation
                  </button>
                  <button
                    onClick={() => setHalftoneMode("videoOverlay")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      halftoneMode === "videoOverlay" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🎥 Video Overlay Shader
                  </button>
                </div>
              </div>

              {halftoneMode !== "videoOverlay" ? (
                <div className="flex items-center gap-3">
                  <input
                    type="file" accept="image/*" disabled={rendering}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => { if (ev.target?.result) setStudioImageUrl(ev.target.result as string); };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600/20 file:text-blue-400 cursor-pointer"
                  />
                  <button
                    onClick={() => setStudioImageUrl("/demo-artwork.jpg")}
                    disabled={rendering}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-colors border border-slate-700"
                  >
                    Reset Demo Artwork
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-300">Upload Video File:</span>
                  <input
                    type="file" accept="video/*" disabled={rendering}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setStudioVideoUrl(url);
                      }
                    }}
                    className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600/20 file:text-blue-400 cursor-pointer"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Dot Size ({halftoneDotSize}px)</label>
                <input type="range" min="4" max="24" value={halftoneDotSize} onChange={(e) => setHalftoneDotSize(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Grid Angle ({halftoneAngle}°)</label>
                <input type="range" min="0" max="90" value={halftoneAngle} onChange={(e) => setHalftoneAngle(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Contrast ({halftoneContrast})</label>
                <input type="range" min="0.5" max="2.8" step="0.1" value={halftoneContrast} onChange={(e) => setHalftoneContrast(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Background Tint Color</span>
                <input type="color" value={halftoneBgTint} onChange={(e) => setHalftoneBgTint(e.target.value)} disabled={rendering} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer p-0" />
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Animate Angle Sweep</span>
                <input type="checkbox" checked={halftoneAnimateAngle} onChange={(e) => setHalftoneAnimateAngle(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
            </div>

            {/* Split Screen Control */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400">Before / After Split Comparison</label>
                <input type="checkbox" checked={studioShowSplit} onChange={(e) => setStudioShowSplit(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
              {studioShowSplit && (
                <input type="range" min="0" max="1" step="0.01" value={studioSplitPos} onChange={(e) => setStudioSplitPos(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
              )}
            </div>
          </div>
        )}

        {/* ── 16-Bit Sprite Controls Panel ── */}
        {activeTab === "sprite16" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">16-Bit Arcade Sprite Setup (Image Effect)</span>
            
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-indigo-500/20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Artwork Source:</span>
                <input
                  type="file" accept="image/*" disabled={rendering}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setStudioImageUrl(ev.target.result as string); };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-indigo-600/20 file:text-indigo-400 cursor-pointer"
                />
              </div>
              <button
                onClick={() => setStudioImageUrl("/demo-artwork.jpg")}
                disabled={rendering}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                Reset Demo Artwork
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Pixel Size ({spritePixelSize}px)</label>
                <input type="range" min="4" max="28" value={spritePixelSize} onChange={(e) => setSpritePixelSize(Number(e.target.value))} disabled={rendering} className="accent-indigo-500 cursor-pointer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Color Quantization ({spriteColorCount} Colors)</label>
                <input type="range" min="4" max="32" step="4" value={spriteColorCount} onChange={(e) => setSpriteColorCount(Number(e.target.value))} disabled={rendering} className="accent-indigo-500 cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Sprite Edge Outlines</span>
                <input type="checkbox" checked={spriteOutline} onChange={(e) => setSpriteOutline(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-indigo-500 rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Retro CRT Scanlines</span>
                <input type="checkbox" checked={spriteScanlines} onChange={(e) => setSpriteScanlines(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-indigo-500 rounded cursor-pointer" />
              </div>
            </div>

            {/* Split Screen Control */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400">Before / After Split Comparison</label>
                <input type="checkbox" checked={studioShowSplit} onChange={(e) => setStudioShowSplit(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-indigo-500 rounded cursor-pointer" />
              </div>
              {studioShowSplit && (
                <input type="range" min="0" max="1" step="0.01" value={studioSplitPos} onChange={(e) => setStudioSplitPos(Number(e.target.value))} disabled={rendering} className="accent-indigo-500 cursor-pointer" />
              )}
            </div>
          </div>
        )}

        {/* ── Punk Collage Controls Panel ── */}
        {activeTab === "punk" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Punk Xerox Collage Setup (Image Effect)</span>
            
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-pink-500/20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Artwork Source:</span>
                <input
                  type="file" accept="image/*" disabled={rendering}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setStudioImageUrl(ev.target.result as string); };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-pink-600/20 file:text-pink-400 cursor-pointer"
                />
              </div>
              <button
                onClick={() => setStudioImageUrl("/demo-artwork.jpg")}
                disabled={rendering}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                Reset Demo Artwork
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Xerox Ink Threshold ({punkThreshold})</label>
                <input type="range" min="60" max="200" value={punkThreshold} onChange={(e) => setPunkThreshold(Number(e.target.value))} disabled={rendering} className="accent-pink-500 cursor-pointer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Grain / Noise Step ({punkGrainStep}px)</label>
                <input type="range" min="2" max="10" value={punkGrainStep} onChange={(e) => setPunkGrainStep(Number(e.target.value))} disabled={rendering} className="accent-pink-500 cursor-pointer" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Paper Color</span>
                <input type="color" value={punkPaperColor} onChange={(e) => setPunkPaperColor(e.target.value)} disabled={rendering} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer p-0" />
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Xerox Ink Color</span>
                <input type="color" value={punkInkColor} onChange={(e) => setPunkInkColor(e.target.value)} disabled={rendering} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer p-0" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Show Duct Tape</span>
                <input type="checkbox" checked={punkShowTape} onChange={(e) => setPunkShowTape(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-pink-500 rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Tape Color</span>
                <input type="color" value={punkTapeColor} onChange={(e) => setPunkTapeColor(e.target.value)} disabled={rendering || !punkShowTape} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer p-0 disabled:opacity-30" />
              </div>
              <div className="flex flex-col gap-1 bg-slate-900 p-2.5 rounded-xl border border-slate-800 justify-center">
                <label className="text-[10px] font-bold text-slate-400">Tape Position</label>
                <select
                  value={punkTapePos}
                  onChange={(e) => setPunkTapePos(e.target.value as any)}
                  disabled={rendering || !punkShowTape}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-bold disabled:opacity-30 cursor-pointer"
                >
                  <option value="br">Bottom-Right</option>
                  <option value="tr">Top-Right</option>
                  <option value="bl">Bottom-Left</option>
                  <option value="tl">Top-Left</option>
                </select>
              </div>
            </div>

            {/* Split Screen Control */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400">Before / After Split Comparison</label>
                <input type="checkbox" checked={studioShowSplit} onChange={(e) => setStudioShowSplit(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-pink-500 rounded cursor-pointer" />
              </div>
              {studioShowSplit && (
                <input type="range" min="0" max="1" step="0.01" value={studioSplitPos} onChange={(e) => setStudioSplitPos(Number(e.target.value))} disabled={rendering} className="accent-pink-500 cursor-pointer" />
              )}
            </div>
          </div>
        )}

        {/* ── Fat Pixel Controls Panel ── */}
        {activeTab === "fatpixel" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Fat Pixel Setup (Image Effect)</span>
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Artwork Source:</span>
                <input
                  type="file" accept="image/*" disabled={rendering}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setStudioImageUrl(ev.target.result as string); };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600/20 file:text-blue-400 cursor-pointer"
                />
              </div>
              <button
                onClick={() => setStudioImageUrl("/demo-artwork.jpg")}
                disabled={rendering}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                Reset Demo Artwork
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Fat Block Size ({fatBlockSize}px)</label>
                <input type="range" min="8" max="40" value={fatBlockSize} onChange={(e) => setFatBlockSize(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Posterize Steps ({fatPosterize})</label>
                <input type="range" min="3" max="12" value={fatPosterize} onChange={(e) => setFatPosterize(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400">Before / After Split Comparison</label>
                <input type="checkbox" checked={studioShowSplit} onChange={(e) => setStudioShowSplit(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {/* ── Bootleg Pixel Controls Panel ── */}
        {activeTab === "bootleg" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Bootleg Pixel Setup (Image Effect)</span>
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Artwork Source:</span>
                <input
                  type="file" accept="image/*" disabled={rendering}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setStudioImageUrl(ev.target.result as string); };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600/20 file:text-blue-400 cursor-pointer"
                />
              </div>
              <button
                onClick={() => setStudioImageUrl("/demo-artwork.jpg")}
                disabled={rendering}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                Reset Demo Artwork
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400">Pixel Resolution ({bootlegPixelSize}px)</label>
              <input type="range" min="6" max="28" value={bootlegPixelSize} onChange={(e) => setBootlegPixelSize(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Anti-Design Edge Outlines</span>
                <input type="checkbox" checked={bootlegEdgeOutline} onChange={(e) => setBootlegEdgeOutline(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Bootleg Color Shift</span>
                <input type="checkbox" checked={bootlegColorShift} onChange={(e) => setBootlegColorShift(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400">Before / After Split Comparison</label>
                <input type="checkbox" checked={studioShowSplit} onChange={(e) => setStudioShowSplit(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {/* ── ASCII Art Controls Panel ── */}
        {activeTab === "ascii" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">ASCII Art Terminal Setup (Image Effect)</span>
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Artwork Source:</span>
                <input
                  type="file" accept="image/*" disabled={rendering}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setStudioImageUrl(ev.target.result as string); };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600/20 file:text-blue-400 cursor-pointer"
                />
              </div>
              <button
                onClick={() => setStudioImageUrl("/demo-artwork.jpg")}
                disabled={rendering}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                Reset Demo Artwork
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Character Size ({asciiCharSize}px)</label>
                <input type="range" min="6" max="20" value={asciiCharSize} onChange={(e) => setAsciiCharSize(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Terminal Color Mode</label>
                <select value={asciiColorMode} onChange={(e) => setAsciiColorMode(e.target.value as any)} disabled={rendering} className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold cursor-pointer">
                  <option value="green">Matrix Terminal Green</option>
                  <option value="amber">1970s Amber CRT</option>
                  <option value="original">Source Full Color ASCII</option>
                  <option value="bw">Monochrome White</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400">Before / After Split Comparison</label>
                <input type="checkbox" checked={studioShowSplit} onChange={(e) => setStudioShowSplit(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {/* ── CMYK Dots Controls Panel ── */}
        {activeTab === "cmyk" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">CMYK Rosette Dots Setup (Image Effect)</span>
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Artwork Source:</span>
                <input
                  type="file" accept="image/*" disabled={rendering}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setStudioImageUrl(ev.target.result as string); };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600/20 file:text-blue-400 cursor-pointer"
                />
              </div>
              <button
                onClick={() => setStudioImageUrl("/demo-artwork.jpg")}
                disabled={rendering}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                Reset Demo Artwork
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Rosette Dot Size ({cmykDotSize}px)</label>
                <input type="range" min="4" max="20" value={cmykDotSize} onChange={(e) => setCmykDotSize(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Contrast ({cmykContrast})</label>
                <input type="range" min="0.8" max="2.2" step="0.1" value={cmykContrast} onChange={(e) => setCmykContrast(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400">Before / After Split Comparison</label>
                <input type="checkbox" checked={studioShowSplit} onChange={(e) => setStudioShowSplit(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {/* ── Teletext Controls Panel ── */}
        {activeTab === "teletext" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Teletext Retro Screen Setup (Image Effect)</span>
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Artwork Source:</span>
                <input
                  type="file" accept="image/*" disabled={rendering}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setStudioImageUrl(ev.target.result as string); };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600/20 file:text-blue-400 cursor-pointer"
                />
              </div>
              <button
                onClick={() => setStudioImageUrl("/demo-artwork.jpg")}
                disabled={rendering}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                Reset Demo Artwork
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Grid Block Size ({teletextGridSize}px)</label>
                <input type="range" min="8" max="24" value={teletextGridSize} onChange={(e) => setTeletextGridSize(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">CRT Scanlines</span>
                <input type="checkbox" checked={teletextScanlines} onChange={(e) => setTeletextScanlines(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400">Before / After Split Comparison</label>
                <input type="checkbox" checked={studioShowSplit} onChange={(e) => setStudioShowSplit(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        )}

        {/* ── 1-Bit Dither Controls Panel ── */}
        {activeTab === "dither" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">1-Bit Bayer Dither Setup (Image Effect)</span>
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Artwork Source:</span>
                <input
                  type="file" accept="image/*" disabled={rendering}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => { if (ev.target?.result) setStudioImageUrl(ev.target.result as string); };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-600/20 file:text-blue-400 cursor-pointer"
                />
              </div>
              <button
                onClick={() => setStudioImageUrl("/demo-artwork.jpg")}
                disabled={rendering}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                Reset Demo Artwork
              </button>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400">Pixel Scale ({ditherScale}px)</label>
              <input type="range" min="1" max="6" value={ditherScale} onChange={(e) => setDitherScale(Number(e.target.value))} disabled={rendering} className="accent-blue-500 cursor-pointer" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Foreground Ink</span>
                <input type="color" value={ditherFgColor} onChange={(e) => setDitherFgColor(e.target.value)} disabled={rendering} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer p-0" />
              </div>
              <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-300">Background Paper</span>
                <input type="color" value={ditherBgColor} onChange={(e) => setDitherBgColor(e.target.value)} disabled={rendering} className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer p-0" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400">Before / After Split Comparison</label>
                <input type="checkbox" checked={studioShowSplit} onChange={(e) => setStudioShowSplit(e.target.checked)} disabled={rendering} className="w-4 h-4 accent-blue-500 rounded cursor-pointer" />
              </div>
            </div>
          </div>
        )}
        {activeTab === "igodometer" && (
          <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/60 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Instagram Odometer Setup</span>
              {/* Asset Viewport Toggle Button */}
              <button
                onClick={() => setIgAssetFit(!igAssetFit)}
                disabled={rendering}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                  igAssetFit
                    ? "bg-pink-600 text-white border-pink-500 shadow-lg shadow-pink-600/30"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
                }`}
              >
                {igAssetFit ? "📐 Asset Viewport (700×520 Cropped)" : "📺 Fullscreen Viewport (1920×1080)"}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Profile Name</label>
                <input
                  type="text" value={igChannelName} onChange={(e) => setIgChannelName(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Category</label>
                <input
                  type="text" value={igCategory} onChange={(e) => setIgCategory(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Start Followers</label>
                <input
                  type="number" value={igBaseCount} onChange={(e) => setIgBaseCount(Number(e.target.value))} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Posts Count</label>
                <input
                  type="text" value={igPosts} onChange={(e) => setIgPosts(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Following Count</label>
                <input
                  type="text" value={igFollowing} onChange={(e) => setIgFollowing(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Bio Text</label>
                <input
                  type="text" value={igBio} onChange={(e) => setIgBio(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-pink-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-400">Bio Link</label>
                <input
                  type="text" value={igLink} onChange={(e) => setIgLink(e.target.value)} disabled={rendering}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400">Custom Avatar:</span>
              <input
                type="file" accept="image/*" disabled={rendering}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => { if (ev.target?.result) setIgAvatarUrl(ev.target.result as string); };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pink-500/20 file:text-pink-400 hover:file:bg-pink-500/30 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Primary Export Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={startCSRRender}
            disabled={rendering}
            className="w-full text-white font-black py-4 px-6 rounded-xl transition-all shadow-xl text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            style={{
              background: rendering ? "#1e293b" : "linear-gradient(90deg, #ea580c, #f59e0b)",
              boxShadow: rendering ? "none" : "0 10px 30px rgba(234,88,12,0.25)",
            }}
          >
            {rendering
              ? `Rendering Video... ${renderProgress}%`
              : `🎬 Export ${resolution} Video (${durationSec}s)`}
          </button>

          <button
            onClick={exportHighResPNG}
            disabled={rendering}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black py-4 px-6 rounded-xl transition-all shadow-xl text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer border border-slate-700 disabled:opacity-50"
          >
            📸 Download High-Res PNG Image
          </button>

          {videoUrl && (
            <a
              href={videoUrl}
              download={`${activeTab}_${resolution}_${fps}fps_${durationSec}s.webm`}
              className="sm:col-span-2 w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 px-6 rounded-xl text-center transition-all shadow-xl text-base flex items-center justify-center gap-2"
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
