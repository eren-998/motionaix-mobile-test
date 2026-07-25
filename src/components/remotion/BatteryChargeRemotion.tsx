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

  // Entrance spring animation
  const animStart = 0;
  const animEnd = Math.floor(durationInFrames * 0.22);

  const cardScale = interpolate(frame, [animStart, animEnd], [0.82, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const cardOpacity = interpolate(frame, [animStart, Math.floor(durationInFrames * 0.12)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Battery charge progress filling up (0% to targetPercentage)
  const chargeDuration = Math.floor(durationInFrames * 0.75);
  const currentPercentage = Math.round(
    interpolate(frame, [0, chargeDuration], [0, targetPercentage], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    })
  );

  // SVG Circle stroke dash calculations
  const radius = 104;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentPercentage / 100) * circumference;

  // Lightning bolt pulse animation
  const boltPulse = (frame / fps) % 1.2;
  const boltScale = interpolate(boltPulse, [0, 0.6, 1.2], [1, 1.16, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const boltGlow = interpolate(boltPulse, [0, 0.6, 1.2], [0.4, 0.95, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit animation
  const exitStart = Math.floor(durationInFrames * 0.9);
  const exitScale = interpolate(frame, [exitStart, durationInFrames], [1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.back(1.3)),
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
        backgroundColor: "#080B10",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        style={{
          position: "absolute",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.22) 0%, rgba(234,179,8,0.15) 45%, transparent 70%)",
          filter: "blur(65px)",
        }}
      />

      {/* Main Square Battery Widget Card */}
      <div
        style={{
          width: 460,
          height: 460,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
          backgroundColor: "#11151F",
          borderRadius: 48,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "36px",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 0 40px rgba(34, 197, 94, 0.15)",
          transform: `scale(${activeScale})`,
          opacity: activeOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          position: "relative",
          zIndex: 10,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Top Sheen Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
          }}
        />

        {/* Circular Progress Ring + Center Percentage */}
        <div
          style={{
            position: "relative",
            width: 255,
            height: 255,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* SVG Progress Circle */}
          <svg
            width="255"
            height="255"
            viewBox="0 0 240 240"
            style={{ transform: "rotate(-90deg)", overflow: "visible" }}
          >
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="rgba(34, 197, 94, 0.16)"
              strokeWidth="20"
              fill="transparent"
            />
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#22C55E"
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: "drop-shadow(0 0 14px rgba(34, 197, 94, 0.85))",
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
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="#EAB308"
              style={{
                transform: `scale(${boltScale})`,
                filter: `drop-shadow(0 0 12px rgba(234, 179, 8, ${boltGlow}))`,
              }}
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>

            <span
              style={{
                fontSize: 50,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {currentPercentage}%
            </span>
          </div>
        </div>

        {/* Bottom Label */}
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: "rgba(255, 255, 255, 0.65)",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
    </AbsoluteFill>
  );
};
