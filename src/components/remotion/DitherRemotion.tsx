import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useEffect, useRef, useState } from "react";

export type DitherRemotionProps = {
  imageUrl?: string;
  scale?: number;
  fgColor?: string;
  bgColor?: string;
  splitPos?: number;
  showSplit?: boolean;
  transparentBg?: boolean;
};

export const DitherRemotion: React.FC<DitherRemotionProps> = ({
  imageUrl = "/demo-artwork.jpg",
  scale = 2,
  fgColor = "#000000",
  bgColor = "#ffffff",
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

    ctx.clearRect(0, 0, w, h);
    if (!transparentBg) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = fgColor;

    const bayer4x4 = [
      [ 0,  8,  2, 10],
      [12,  4, 14,  6],
      [ 3, 11,  1,  9],
      [15,  7, 13,  5]
    ];

    const step = Math.max(1, scale);
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const idx = (y * w + x) * 4;
        const lum = (0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2]) / 255;
        const threshold = (bayer4x4[Math.floor(y / step) % 4][Math.floor(x / step) % 4] / 16);

        if (lum < threshold) {
          ctx.fillRect(x, y, step, step);
        }
      }
    }

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
  }, [imageLoaded, frame, scale, fgColor, bgColor, showSplit, splitPos, transparentBg, compWidth, compHeight]);

  return (
    <AbsoluteFill style={{
      backgroundColor: transparentBg ? "transparent" : "#030712",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </AbsoluteFill>
  );
};
