"use client";

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import React from "react";

export type VoiceMemoRemotionProps = {
  title?: string;
  subtitle?: string;
  accentColor?: string;
};

// Fixed spectrum heights to look like realistic Voice Memo audio
const WAVE_BARS = [
  12, 16, 14, 20, 28, 35, 22, 18, 30, 42, 55, 68, 45, 30, 50, 65, 80, 58, 40,
  60, 75, 90, 70, 48, 62, 85, 95, 60, 45, 70, 50, 35, 48, 65, 52, 38, 25, 30,
  45, 60, 40, 28, 35, 20, 15, 25, 30, 22, 18, 14
];

export const VoiceMemoRemotion: React.FC<VoiceMemoRemotionProps> = ({
  title = "New Recording 12",
  subtitle = "Voice Memos",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance slide + scale (0 to 25% of duration)
  const animStart = 0;
  const animEnd = Math.floor(durationInFrames * 0.25);

  const cardY = interpolate(frame, [animStart, animEnd], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  const cardScale = interpolate(frame, [animStart, animEnd], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const cardOpacity = interpolate(frame, [animStart, Math.floor(durationInFrames * 0.15)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Playhead progress from 0% to 100% across the full video duration
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculated elapsed time timestamp string (e.g. 00:12.84)
  const elapsedSec = (frame / fps) + 8.2; // Offset to start at realistic 8s
  const mins = Math.floor(elapsedSec / 60).toString().padStart(2, "0");
  const secs = Math.floor(elapsedSec % 60).toString().padStart(2, "0");
  const millis = Math.floor((elapsedSec % 1) * 100).toString().padStart(2, "0");
  const timeString = `${mins}:${secs}.${millis}`;

  // Red recording dot pulsing
  const dotPulse = (frame / fps) % 1;
  const dotOpacity = interpolate(dotPulse, [0, 0.5, 1], [1, 0.3, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit slide down (last 10% of duration)
  const exitStart = Math.floor(durationInFrames * 0.9);
  const exitY = interpolate(frame, [exitStart, durationInFrames], [0, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.back(1.2)),
  });
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentY = frame >= exitStart ? exitY : cardY;
  const currentOpacity = frame >= exitStart ? exitOpacity : cardOpacity;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0E14",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace",
        overflow: "hidden",
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(59,130,246,0.12) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Main Voice Memo Widget Card */}
      <div
        style={{
          width: "82%",
          maxWidth: 640,
          backgroundColor: "#121620",
          borderRadius: 32,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          padding: "36px 40px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          transform: `translateY(${currentY}px) scale(${cardScale})`,
          opacity: currentOpacity,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Header Title + Subtitle + Recording Indicator */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h3
              style={{
                fontSize: 30,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {title}
            </h3>
            <span
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.45)",
                letterSpacing: "0.02em",
              }}
            >
              {subtitle}
            </span>
          </div>

          {/* Red Recording Dot */}
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#EF4444",
              boxShadow: "0 0 12px #EF4444",
              opacity: dotOpacity,
              marginTop: 6,
            }}
          />
        </div>

        {/* Center Audio Waveform Container with Playhead */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 10px",
          }}
        >
          {WAVE_BARS.map((height, i) => {
            const barRatio = i / (WAVE_BARS.length - 1);
            const isPlayed = barRatio <= progress;
            return (
              <div
                key={i}
                style={{
                  width: 4,
                  height: `${height}%`,
                  borderRadius: 3,
                  backgroundColor: isPlayed ? "#EF4444" : "rgba(255, 255, 255, 0.2)",
                  boxShadow: isPlayed ? "0 0 10px rgba(239, 68, 68, 0.4)" : "none",
                  transition: "background-color 0.1s ease",
                }}
              />
            );
          })}

          {/* Vertical Playhead Scrub Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${progress * 96 + 2}%`,
              width: 4,
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              boxShadow: "0 0 16px rgba(255, 255, 255, 0.9), 0 0 4px #FFFFFF",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Footer: Timer & Done Action Button */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 4 }}>
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "monospace",
              color: "#FFFFFF",
              letterSpacing: "0.05em",
            }}
          >
            {timeString}
          </span>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#3B82F6",
              fontSize: 22,
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: "-0.01em",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </AbsoluteFill>
  );
};
