import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useEffect, useRef, useState } from "react";

export type PunkCollageRemotionProps = {
  imageUrl?: string;
  threshold?: number;
  paperColor?: string;
  inkColor?: string;
  grainStep?: number;
  tapeColor?: string;
  showTape?: boolean;
  tapePosition?: "br" | "tr" | "bl" | "tl";
  tapeAngle?: number;
  splitPos?: number;
  showSplit?: boolean;
  transparentBg?: boolean;
};

export const PunkCollageRemotion: React.FC<PunkCollageRemotionProps> = ({
  imageUrl = "/demo-artwork.jpg",
  threshold = 120,
  paperColor = "#ff0066",
  inkColor = "#090d16",
  grainStep = 4,
  tapeColor = "#ccff00",
  showTape = false,
  tapePosition = "br",
  tapeAngle = -12,
  splitPos = 0.5,
  showSplit = false,
  transparentBg = false,
}) => {
  const frame = useCurrentFrame();
  const { width: compWidth, height: compHeight } = useVideoConfig();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      loadedImgRef.current = img;
      setImageLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = loadedImgRef.current;
    if (!canvas || !img || !imageLoaded) return;

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

    const imgAspect = img.width / img.height;
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

    srcCtx.clearRect(0, 0, w, h);
    srcCtx.drawImage(img, renderX, renderY, renderW, renderH);
    const srcImgData = srcCtx.getImageData(0, 0, w, h);
    const data = srcImgData.data;

    // 1. Fill Paper Background Color
    ctx.clearRect(0, 0, w, h);
    if (!transparentBg) {
      ctx.fillStyle = paperColor;
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Xerox Ink Threshold Pass
    ctx.fillStyle = inkColor;
    const step = Math.max(2, Math.min(12, grainStep));

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * w + x) * 4;
        const lum = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

        if (lum < threshold) {
          ctx.fillRect(x, y, step, step);
        }
      }
    }

    // 3. Duct Tape Accent Overlay
    if (showTape && tapeColor && tapeColor !== "transparent") {
      ctx.save();
      ctx.fillStyle = tapeColor;
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 12;

      let posX = w * 0.72;
      let posY = h * 0.78;
      if (tapePosition === "tr") { posX = w * 0.72; posY = h * 0.22; }
      else if (tapePosition === "bl") { posX = w * 0.28; posY = h * 0.78; }
      else if (tapePosition === "tl") { posX = w * 0.28; posY = h * 0.22; }

      ctx.translate(posX, posY);
      ctx.rotate((tapeAngle * Math.PI) / 180);
      ctx.fillRect(-w * 0.18, -h * 0.025, w * 0.35, h * 0.05);
      ctx.restore();
    }

    // 4. Split View
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
  }, [imageLoaded, frame, threshold, paperColor, inkColor, grainStep, tapeColor, showTape, tapePosition, tapeAngle, showSplit, splitPos, transparentBg, compWidth, compHeight]);

  return (
    <AbsoluteFill style={{
      backgroundColor: transparentBg ? "transparent" : "#030712",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </AbsoluteFill>
  );
};
