"use client";

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import React from "react";

export type BatteryChargeRemotionProps = {
  targetPercentage?: number;
  label?: string;
  accentColor?: string;
};

export const BatteryChargeRemotion: React.FC<BatteryChargeRemotionProps> = ({
  targetPercentage = 78,
  label = "CHARGING",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance slide + scale (0 to 25% of duration)
  const animStart = 0;
  const animEnd = Math.floor(durationInFrames * 0.25);

  const cardScale = interpolate(frame, [animStart, animEnd], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const cardOpacity = interpolate(frame, [animStart, Math.floor(durationInFrames * 0.15)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Battery charge progress dynamically filling up (0% to targetPercentage)
  const chargeDuration = Math.floor(durationInFrames * 0.75);
  const currentPercentage = Math.round(
    interpolate(frame, [0, chargeDuration], [0, targetPercentage], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    })
  );

  // SVG Circle stroke dash calculations
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentPercentage / 100) * circumference;

  // Lightning bolt pulse effect
  const boltPulse = (frame / fps) % 1;
  const boltScale = interpolate(boltPulse, [0, 0.5, 1], [1, 1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const boltGlow = interpolate(boltPulse, [0, 0.5, 1], [0.4, 0.9, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit scale out (last 10% of duration)
  const exitStart = Math.floor(durationInFrames * 0.9);
  const exitScale = interpolate(frame, [exitStart, durationInFrames], [1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.back(1.2)),
  });
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const activeScale = frame >= exitStart ? exitScale : cardScale;
  const activeOpacity = frame >= exitStart ? exitOpacity : cardOpacity;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0E14",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.2) 0%, rgba(234,179,8,0.12) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Main Square Battery Widget Card */}
      <div
        style={{
          width: 480,
          height: 480,
          backgroundColor: "#121620",
          borderRadius: 48,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          padding: "36px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
          transform: `scale(${activeScale})`,
          opacity: activeOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Circular Progress Ring + Center Percentage */}
        <div
          style={{
            position: "relative",
            width: 250,
            height: 250,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* SVG Progress Circle */}
          <svg
            width="250"
            height="250"
            viewBox="0 0 240 240"
            style={{ transform: "rotate(-90deg)", overflow: "visible" }}
          >
            {/* Track Circle (dark green opacity) */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="rgba(34, 197, 94, 0.18)"
              strokeWidth="22"
              fill="transparent"
            />
            {/* Active Progress Circle */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#22C55E"
              strokeWidth="22"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: "drop-shadow(0 0 12px rgba(34, 197, 94, 0.8))",
                transition: "stroke-dashoffset 0.05s linear",
              }}
            />
          </svg>

          {/* Center Content: Lightning Bolt + Percentage */}
          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {/* Lightning Bolt Icon */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="#EAB308"
              style={{
                transform: `scale(${boltScale})`,
                filter: `drop-shadow(0 0 10px rgba(234, 179, 8, ${boltGlow}))`,
              }}
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>

            {/* Percentage Text */}
            <span
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {currentPercentage}%
            </span>
          </div>
        </div>

        {/* Bottom Label */}
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: "rgba(255, 255, 255, 0.6)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
    </AbsoluteFill>
  );
};
