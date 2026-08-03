import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import React from "react";

const CustomEasing = {
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

function chartInterpolate(
  progress: number,
  inRange: [number, number],
  outRange: [number, number],
  easing: keyof typeof CustomEasing | "linear" = "linear"
) {
  const [inStart, inEnd] = inRange;
  const [outStart, outEnd] = outRange;
  if (progress <= inStart) return outStart;
  if (progress >= inEnd) return outEnd;
  let p = (progress - inStart) / (inEnd - inStart);
  if (easing !== "linear") p = CustomEasing[easing](p);
  return outStart + p * (outEnd - outStart);
}

export interface ChartDataPoint {
  id: number;
  label: string;
  value: number;
  desc: string;
  color: string;
}

export type ChartEngineRemotionProps = {
  title?: string;
  subtitle?: string;
  data?: ChartDataPoint[];
  yAxisGap?: number;
  yAxisMinLines?: number;
};

export const ChartEngineRemotion: React.FC<ChartEngineRemotionProps> = ({
  title = "REVENUE GROWTH",
  subtitle = "Q1 - Q4 Fiscal Year 2026",
  data = [
    { id: 1, label: "2023", value: 45, desc: "Initial Stage", color: "#E4E4E7" },
    { id: 2, label: "2024", value: 30, desc: "Market Dip", color: "#E4E4E7" },
    { id: 3, label: "2025", value: 85, desc: "Recovery", color: "#E4E4E7" },
    { id: 4, label: "2026", value: 140, desc: "Massive Scale", color: "#3B82F6" },
  ],
  yAxisGap = 20,
  yAxisMinLines = 5,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = Math.min(1, frame / durationInFrames);

  // Smart Y-Axis math
  const safeGap = Math.max(1, yAxisGap);
  const safeMinLines = Math.max(1, yAxisMinLines);
  const userMaxY = safeGap * safeMinLines;
  const dataMaxY = Math.max(...data.map((p) => Number(p.value) || 0), 0);
  const highestValue = Math.max(userMaxY, dataMaxY);
  const chartTopY = Math.ceil(highestValue / safeGap) * safeGap;
  const numLines = Math.floor(chartTopY / safeGap) + 1;
  const gridLevels = Array.from({ length: numLines }, (_, i) => 1 - i / (numLines - 1));
  const finalGridLevels = gridLevels.length > 50 ? [1, 0.75, 0.5, 0.25, 0] : gridLevels;
  const finalChartTopY = gridLevels.length > 50 ? highestValue : chartTopY;

  // Dimensional logic
  const chartHeightPx = 550;
  const maxAvailableWidth = 1400;
  const numPillars = data.length;
  const defaultTotalWidth = numPillars * 180 + Math.max(0, numPillars - 1) * 120;
  const pillarScale = Math.min(1, maxAvailableWidth / (defaultTotalWidth || 1));

  // Animations
  const titleOpacity = chartInterpolate(progress, [0.05, 0.15], [0, 1], "easeOutCubic");
  const titleY = chartInterpolate(progress, [0.05, 0.2], [80, 0], "easeOutBack");
  const subtitleOpacity = chartInterpolate(progress, [0.1, 0.2], [0, 1], "easeOutCubic");
  const gridLineScaleX = chartInterpolate(progress, [0.1, 0.3], [0, 1], "easeOutQuart");

  return (
    <AbsoluteFill style={{ backgroundColor: "#F8FAFC", overflow: "hidden" }}>
      {/* Standardized Crisp High-Contrast Grid Background */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1,
        backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
      }} />

      {/* Radial Glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 2,
        background: "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.12) 0%, transparent 70%)",
      }} />

      {/* Header Typography */}
      <div style={{
        position: "absolute", zIndex: 20,
        top: 120,
        left: 150,
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
      }}>
        <h1 style={{
          fontFamily: '"Inter", sans-serif', fontWeight: 900, fontSize: 90,
          lineHeight: 1, color: "#0f172a", letterSpacing: "-0.02em", margin: 0,
        }}>{title}</h1>
        <p style={{
          fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: 32,
          color: "#475569", letterSpacing: "0.02em", opacity: subtitleOpacity, margin: 0, marginTop: 16,
        }}>{subtitle}</p>
      </div>

      {/* Chart Area */}
      <div style={{
        position: "absolute", bottom: 150, left: 150, right: 150, height: 550,
        display: "flex", alignItems: "flex-end", justifyContent: "space-between", zIndex: 10,
      }}>
        {/* Y-Axis Grid Lines */}
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          justifyContent: "space-between", zIndex: 0, pointerEvents: "none",
        }}>
          {finalGridLevels.map((level, i) => {
            const isZero = level === 0;
            const lineProgress = chartInterpolate(progress, [0.15 + i * 0.02, 0.3 + i * 0.02], [0, 1], "easeOutCubic");
            const displayNum = Math.round(finalChartTopY * level);
            return (
              <div key={i} style={{ width: "100%", display: "flex", alignItems: "center", position: "relative", height: 0 }}>
                <div style={{
                  position: "absolute", width: "100%", transformOrigin: "left",
                  borderTop: isZero ? "4px solid #cbd5e1" : "2px dashed rgba(148,163,184,0.6)",
                  transform: `scaleX(${gridLineScaleX})`,
                }} />
                <span style={{
                  position: "absolute", left: -80, fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 22, color: "#64748b", fontWeight: 800, opacity: lineProgress,
                }}>{displayNum}</span>
              </div>
            );
          })}
        </div>

        {/* Pillars Container */}
        <div style={{
          width: "100%", height: "100%", display: "flex", alignItems: "flex-end",
          justifyContent: "center", padding: "0 50px", zIndex: 20, position: "relative",
          gap: `${120 * pillarScale}px`,
        }}>
          {data.map((point, index) => {
            const staggerDelay = 0.2 + index * 0.05;
            const startP = Math.min(staggerDelay, 0.6);
            const endP = startP + 0.15;
            const pProgress = chartInterpolate(progress, [startP, endP], [0, 1], "easeOutQuart");
            const targetHeightPx = (Number(point.value) / finalChartTopY) * chartHeightPx;
            const compensatedHeightPx = targetHeightPx / pillarScale;
            const textOpacity = chartInterpolate(progress, [endP - 0.05, endP + 0.05], [0, 1]);
            const bottomLabelOpacity = chartInterpolate(progress, [startP, startP + 0.05], [0, 1]);
            const bottomLabelY = chartInterpolate(progress, [startP, startP + 0.05], [20, 0], "easeOutQuart");
            const isHighlight = point.color !== "#E4E4E7" && point.color !== "#e4e4e7" && point.color.toLowerCase() !== "#ffffff";

            return (
              <div key={point.id} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: `${180 * pillarScale}px` }}>
                {/* Value label */}
                <div style={{
                  position: "absolute", bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", width: "max-content",
                  transform: `translateY(-${targetHeightPx * pProgress + 30}px) scale(${pillarScale})`,
                  transformOrigin: "bottom center", opacity: textOpacity,
                }}>
                  <div style={{
                    fontFamily: '"JetBrains Mono", monospace', fontSize: 48, fontWeight: 900,
                    color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 4,
                    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                  }}>
                    {Math.round(Number(point.value) * pProgress)}
                  </div>
                  <div style={{
                    fontSize: 20, fontFamily: '"Inter", sans-serif', fontWeight: 700,
                    padding: "6px 16px", borderRadius: 9999,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    background: "#ffffff",
                    color: isHighlight ? "#2563EB" : "#64748b",
                    border: isHighlight ? "1px solid #DBEAFE" : "1px solid #e2e8f0",
                  }}>
                    {point.desc}
                  </div>
                </div>

                {/* 3D Pillar */}
                <div style={{
                  width: 140, borderRadius: "24px 24px 0 0",
                  borderLeft: "1px solid rgba(255,255,255,0.6)",
                  borderRight: "1px solid rgba(255,255,255,0.6)",
                  borderTop: "1px solid rgba(255,255,255,0.6)",
                  height: `${compensatedHeightPx}px`,
                  transform: `scale(${pillarScale}, ${pillarScale * pProgress})`,
                  transformOrigin: "bottom center",
                  backgroundColor: point.color,
                  boxShadow: "0 30px 60px -12px rgba(0,0,0,0.15), inset 0 4px 10px rgba(255,255,255,0.8), inset -5px 0 20px rgba(0,0,0,0.03), inset 5px 0 20px rgba(255,255,255,0.5)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", inset: 0, width: "50%",
                    background: "linear-gradient(to right, rgba(255,255,255,0.45), transparent)",
                    pointerEvents: "none",
                  }} />
                </div>

                {/* Bottom Label */}
                <div style={{
                  position: "absolute", bottom: -70, display: "flex", alignItems: "center",
                  justifyContent: "center", width: "100%",
                  opacity: bottomLabelOpacity,
                  transform: `translateY(${bottomLabelY}px) scale(${pillarScale})`,
                  transformOrigin: "top center",
                }}>
                  <span style={{
                    fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: 30,
                    color: "#475569", letterSpacing: "-0.02em",
                  }}>{point.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
