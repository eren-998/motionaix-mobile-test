"use client";

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
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
  accentColor = "#22C55E",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance spring animation (Apple iOS spring physics)
  const entranceSpring = spring({
    frame,
    fps,
    config: {
      mass: 0.75,
      damping: 13,
      stiffness: 95,
    },
  });

  const cardScale = interpolate(entranceSpring, [0, 1], [0.82, 1]);
  const cardOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous floating for liquid glass feel
  const floatY = Math.sin((frame / fps) * 2.2) * 3.5;

  // Battery charge progress filling up (0% to targetPercentage) smoothly
  const chargeDuration = Math.floor(durationInFrames * 0.75);
  const progressRaw = interpolate(frame, [0, chargeDuration], [0, targetPercentage], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const currentPercentage = Math.round(progressRaw);

  // SVG Circle stroke dash calculations
  const radius = 108;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressRaw / 100) * circumference;

  // Gold lightning bolt pulse animation
  const boltPulse = (frame / fps) % 1.2;
  const boltScale = interpolate(boltPulse, [0, 0.6, 1.2], [1, 1.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const boltGlow = interpolate(boltPulse, [0, 0.6, 1.2], [0.45, 0.95, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Liquid energy wave particles inside progress ring
  const waveOffset = (frame * 4) % 360;

  // Exit animation (last 10% of duration)
  const exitStart = Math.floor(durationInFrames * 0.9);
  const exitScale = interpolate(frame, [exitStart, durationInFrames], [1, 0.84], {
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
  const activeY = frame >= exitStart ? 0 : floatY;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07090E",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Dynamic Ambient Background Glows */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}28 0%, rgba(234, 179, 8, 0.18) 45%, transparent 70%)`,
          filter: "blur(70px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 65%)",
          filter: "blur(50px)",
          transform: `translateY(${floatY * -2}px)`,
        }}
      />

      {/* Background Energy Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(to right, rgba(234, 179, 8, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(234, 179, 8, 0.15) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
          maskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main Square Battery Widget Card */}
      <div
        style={{
          width: 470,
          height: 470,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(34, 197, 94, 0.06) 100%)",
          backgroundColor: "rgba(15, 21, 32, 0.85)",
          borderRadius: 52,
          border: "1px solid rgba(255, 255, 255, 0.18)",
          padding: "38px",
          boxShadow: `0 35px 85px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 0 50px ${accentColor}20`,
          transform: `translateY(${activeY}px) scale(${activeScale})`,
          opacity: activeOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          position: "relative",
          zIndex: 10,
          backdropFilter: "blur(24px)",
          overflow: "hidden",
        }}
      >
        {/* Top Sheen Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "18%",
            right: "18%",
            height: 1.5,
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
          }}
        />

        {/* Circular Progress Ring + Center Percentage */}
        <div
          style={{
            position: "relative",
            width: 265,
            height: 265,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* SVG Progress Circle */}
          <svg
            width="265"
            height="265"
            viewBox="0 0 260 260"
            style={{ transform: "rotate(-90deg)", overflow: "visible" }}
          >
            {/* Background Track */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              stroke="rgba(34, 197, 94, 0.14)"
              strokeWidth="22"
              fill="transparent"
            />
            {/* Glowing Active Progress Track */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              stroke={accentColor}
              strokeWidth="22"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: `drop-shadow(0 0 16px ${accentColor}AA)`,
              }}
            />
          </svg>

          {/* Liquid Glass Inner Disc */}
          <div
            style={{
              position: "absolute",
              width: 185,
              height: 185,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(0, 0, 0, 0.4) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "inset 0 2px 10px rgba(255, 255, 255, 0.15), inset 0 -4px 15px rgba(0, 0, 0, 0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {/* Gold Lightning Bolt Icon */}
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="#EAB308"
              style={{
                transform: `scale(${boltScale})`,
                filter: `drop-shadow(0 0 14px rgba(234, 179, 8, ${boltGlow}))`,
              }}
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>

            {/* Percentage Readout */}
            <span
              style={{
                fontSize: 52,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1,
                textShadow: "0 2px 14px rgba(0, 0, 0, 0.6)",
              }}
            >
              {currentPercentage}%
            </span>
          </div>
        </div>

        {/* Bottom Label */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: accentColor,
              boxShadow: `0 0 10px ${accentColor}`,
            }}
          />
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "rgba(255, 255, 255, 0.75)",
              letterSpacing: "0.36em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
