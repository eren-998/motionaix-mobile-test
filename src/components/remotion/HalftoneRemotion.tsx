import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useEffect, useRef, useState } from "react";

export type HalftoneRemotionProps = {
  mode?: "image" | "imageToVideo" | "videoOverlay";
  imageUrl?: string;
  videoUrl?: string;
  dotSize?: number;
  angle?: number;
  contrast?: number;
  whiteCutoff?: number;
  bgTint?: string;
  animateAngle?: boolean;
  splitPos?: number;
  showSplit?: boolean;
  transparentBg?: boolean;
};

export const HalftoneRemotion: React.FC<HalftoneRemotionProps> = ({
  mode = "image",
  imageUrl = "/demo-artwork.jpg",
  videoUrl = "/EarningsRemotion.webm",
  dotSize = 10,
  angle = 45,
  contrast = 1.6,
  whiteCutoff = 0.85,
  bgTint = "#1233e6",
  animateAngle = true,
  splitPos = 0.5,
  showSplit = false,
  transparentBg = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width: compWidth, height: compHeight } = useVideoConfig();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Load Image when in Image or Image-to-Video mode
  useEffect(() => {
    if (mode === "image" || mode === "imageToVideo") {
      setImageLoaded(false);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        loadedImgRef.current = img;
        setImageLoaded(true);
      };
      img.src = imageUrl;
    }
  }, [mode, imageUrl]);

  // Handle Video Frame Seeking strictly when in videoOverlay mode
  useEffect(() => {
    if (mode === "videoOverlay" && videoRef.current) {
      const vid = videoRef.current;
      if (vid.readyState >= 2 && vid.duration) {
        const targetTime = (frame / fps) % vid.duration;
        vid.currentTime = targetTime;
        setVideoLoaded(true);
      }
    }
  }, [frame, fps, mode]);

  // Dynamic calculations for Image-to-Video Animation Mode
  let effectiveAngle = angle;
  let effectiveDotSize = dotSize;
  let effectiveContrast = contrast;

  if (mode === "imageToVideo") {
    // Smooth 360-degree angle sweep + pulse effect over time
    const angleProgress = interpolate(frame, [0, durationInFrames], [0, 360]);
    effectiveAngle = (angle + angleProgress) % 360;

    // Subtle pulsing wave for dot size and contrast
    const wave = Math.sin((frame / fps) * Math.PI * 2);
    effectiveDotSize = Math.max(4, dotSize + wave * 2);
    effectiveContrast = Math.max(0.5, contrast + wave * 0.2);
  } else if (animateAngle) {
    effectiveAngle = (angle + frame * 0.4) % 360;
  }

  // Frame Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let sourceElement: HTMLImageElement | HTMLVideoElement | null = null;
    if (mode === "image" || mode === "imageToVideo") {
      if (!imageLoaded || !loadedImgRef.current) return;
      sourceElement = loadedImgRef.current;
    } else if (mode === "videoOverlay") {
      if (!videoRef.current) return;
      sourceElement = videoRef.current;
    }

    if (!sourceElement) return;

    const srcW = (mode === "videoOverlay")
      ? (sourceElement as HTMLVideoElement).videoWidth
      : (sourceElement as HTMLImageElement).width;

    const srcH = (mode === "videoOverlay")
      ? (sourceElement as HTMLVideoElement).videoHeight
      : (sourceElement as HTMLImageElement).height;

    if (!srcW || !srcH) return;

    const w = compWidth;
    const h = compHeight;
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const srcCanvas = document.createElement("canvas");
    srcCanvas.width = w;
    srcCanvas.height = h;
    const srcCtx = srcCanvas.getContext("2d", { willReadFrequently: true });
    if (!srcCtx) return;

    // Aspect ratio positioning
    const imgAspect = srcW / srcH;
    const canvasAspect = w / h;
    let renderW = w, renderH = h, renderX = 0, renderY = 0;

    if (imgAspect > canvasAspect) {
      renderH = h;
      renderW = h * imgAspect;
      renderX = (w - renderW) / 2;
    } else {
      renderW = w;
      renderH = w / imgAspect;
      renderY = (h - renderH) / 2;
    }

    srcCtx.drawImage(sourceElement, renderX, renderY, renderW, renderH);
    const srcImgData = srcCtx.getImageData(0, 0, w, h);
    const data = srcImgData.data;

    // 1. Background Fill
    ctx.clearRect(0, 0, w, h);
    if (!transparentBg) {
      ctx.fillStyle = bgTint;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Halftone Shader Loop
    const angleRad = (effectiveAngle * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    const diag = Math.sqrt(w * w + h * h);
    const dSize = Math.max(4, effectiveDotSize);

    for (let x = -diag; x < diag; x += dSize) {
      for (let y = -diag; y < diag; y += dSize) {
        const origX = Math.floor(x * cos - y * sin + w / 2);
        const origY = Math.floor(x * sin + y * cos + h / 2);

        if (origX >= 0 && origX < w && origY >= 0 && origY < h) {
          const idx = (origY * w + origX) * 4;
          let lum = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
          lum = Math.pow(lum, effectiveContrast);

          if (lum > whiteCutoff) {
            ctx.fillStyle = "#f5f2e6";
            ctx.beginPath();
            ctx.arc(origX, origY, (dSize / 2) * 0.9, 0, Math.PI * 2);
            ctx.fill();
          } else {
            const radius = (1 - lum) * (dSize / 2) * 1.1;
            if (radius > 0.4) {
              ctx.fillStyle = "#0a0a0c";
              ctx.beginPath();
              ctx.arc(origX, origY, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    }

    // 3. Split View Comparison
    if (showSplit) {
      const splitX = Math.floor(w * splitPos);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, h);
      ctx.clip();
      ctx.drawImage(srcCanvas, 0, 0, w, h);
      ctx.restore();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.shadowColor = "rgba(0,0,0,0.6)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, h);
      ctx.stroke();
    }
  }, [imageLoaded, videoLoaded, mode, frame, effectiveAngle, effectiveDotSize, effectiveContrast, whiteCutoff, bgTint, showSplit, splitPos, transparentBg, compWidth, compHeight]);

  return (
    <AbsoluteFill style={{
      backgroundColor: transparentBg ? "transparent" : "#030712",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      {/* ONLY render video element when mode is videoOverlay */}
      {mode === "videoOverlay" && (
        <video
          ref={videoRef}
          src={videoUrl}
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          style={{ display: "none" }}
        />
      )}

      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </AbsoluteFill>
  );
};
