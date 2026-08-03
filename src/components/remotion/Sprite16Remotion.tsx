import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useEffect, useRef, useState } from "react";

export type Sprite16RemotionProps = {
  imageUrl?: string;
  pixelSize?: number;
  colorCount?: number;
  outline?: boolean;
  scanlines?: boolean;
  splitPos?: number;
  showSplit?: boolean;
  transparentBg?: boolean;
};

export const Sprite16Remotion: React.FC<Sprite16RemotionProps> = ({
  imageUrl = "/demo-artwork.jpg",
  pixelSize = 12,
  colorCount = 16,
  outline = true,
  scanlines = true,
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

    srcCtx.drawImage(img, renderX, renderY, renderW, renderH);
    const srcImgData = srcCtx.getImageData(0, 0, w, h);
    const data = srcImgData.data;

    ctx.clearRect(0, 0, w, h);

    const size = Math.max(4, pixelSize);
    const factor = 255 / Math.max(2, colorCount / 2);

    for (let y = 0; y < h; y += size) {
      for (let x = 0; x < w; x += size) {
        const idx = (y * w + x) * 4;
        const r = Math.floor(data[idx] / factor) * factor;
        const g = Math.floor(data[idx + 1] / factor) * factor;
        const b = Math.floor(data[idx + 2] / factor) * factor;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(x, y, size, size);

        if (outline && (x === 0 || y === 0 || (data[idx] < 60 && data[idx + 1] < 60))) {
          ctx.strokeStyle = "rgba(0,0,0,0.45)";
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, size, size);
        }
      }
    }

    if (scanlines) {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      for (let y = 0; y < h; y += 4) {
        ctx.fillRect(0, y, w, 2);
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
  }, [imageLoaded, frame, pixelSize, colorCount, outline, scanlines, showSplit, splitPos, transparentBg, compWidth, compHeight]);

  return (
    <AbsoluteFill style={{
      backgroundColor: transparentBg ? "transparent" : "#030712",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </AbsoluteFill>
  );
};
