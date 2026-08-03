import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useEffect, useRef, useState } from "react";

export type CmykRemotionProps = {
  imageUrl?: string;
  dotSize?: number;
  contrast?: number;
  splitPos?: number;
  showSplit?: boolean;
  transparentBg?: boolean;
};

export const CmykRemotion: React.FC<CmykRemotionProps> = ({
  imageUrl = "/demo-artwork.jpg",
  dotSize = 8,
  contrast = 1.3,
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
      ctx.fillStyle = "#f8f5eb";
      ctx.fillRect(0, 0, w, h);
    }

    ctx.globalCompositeOperation = "multiply";

    const dSize = Math.max(4, dotSize);
    const channels = [
      { color: "#00e5ff", angle: 0.26 },
      { color: "#ff0066", angle: 1.30 },
      { color: "#ffe600", angle: 0 },
      { color: "#111111", angle: 0.78 }
    ];

    const diag = Math.sqrt(w * w + h * h);

    channels.forEach(ch => {
      ctx.fillStyle = ch.color;
      const cos = Math.cos(ch.angle);
      const sin = Math.sin(ch.angle);

      for (let x = -diag; x < diag; x += dSize) {
        for (let y = -diag; y < diag; y += dSize) {
          const origX = Math.floor(x * cos - y * sin + w / 2);
          const origY = Math.floor(x * sin + y * cos + h / 2);

          if (origX >= 0 && origX < w && origY >= 0 && origY < h) {
            const idx = (origY * w + origX) * 4;
            let lum = (data[idx] + data[idx + 1] + data[idx + 2]) / 765;
            lum = Math.pow(lum, contrast);
            const radius = (1 - lum) * (dSize / 2);

            if (radius > 0.5) {
              ctx.beginPath();
              ctx.arc(origX, origY, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    });

    ctx.globalCompositeOperation = "source-over";

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
  }, [imageLoaded, frame, dotSize, contrast, showSplit, splitPos, transparentBg, compWidth, compHeight]);

  return (
    <AbsoluteFill style={{
      backgroundColor: transparentBg ? "transparent" : "#030712",
      display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
    }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
    </AbsoluteFill>
  );
};
