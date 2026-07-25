"use client";

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";
import React from "react";

export type IncomingCallRemotionProps = {
  callerName?: string;
  subtitle?: string;
  accentColor?: string;
};

export const IncomingCallRemotion: React.FC<IncomingCallRemotionProps> = ({
  callerName = "Claude Code",
  subtitle = "incoming call...",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance slide + scale (0 to 25% of duration)
  const animStart = 0;
  const animEnd = Math.floor(durationInFrames * 0.25);
  
  const cardY = interpolate(frame, [animStart, animEnd], [-80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.4)),
  });

  const cardScale = interpolate(frame, [animStart, animEnd], [0.88, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const cardOpacity = interpolate(frame, [animStart, Math.floor(durationInFrames * 0.15)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse animation on green accept button
  const pulseCycle = (frame / fps) % 1.5;
  const pulseScale = interpolate(pulseCycle, [0, 0.75, 1.5], [1, 1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(pulseCycle, [0, 0.75, 1.5], [0.6, 0, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit slide up (last 10% of duration)
  const exitStart = Math.floor(durationInFrames * 0.9);
  const exitY = interpolate(frame, [exitStart, durationInFrames], [0, -100], {
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
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
          background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(249,115,22,0.12) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Main Call Card */}
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
          gap: 32,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Caller Info Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Avatar Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              backgroundColor: "#E05638",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(224, 86, 56, 0.4)",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {/* Multi-pointed Star Icon */}
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                fill="#FFFFFF"
              />
            </svg>
          </div>

          {/* Caller Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h3
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              {callerName}
            </h3>
            <span
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.5)",
                letterSpacing: "0.02em",
              }}
            >
              {subtitle}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            paddingTop: 8,
          }}
        >
          {/* Decline Button */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                backgroundColor: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px rgba(239, 68, 68, 0.4)",
                cursor: "pointer",
              }}
            >
              {/* Phone End Icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" transform="rotate(135 12 12)" />
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255, 255, 255, 0.6)" }}>
              Decline
            </span>
          </div>

          {/* Accept Button */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              position: "relative",
            }}
          >
            {/* Pulse Ring */}
            <div
              style={{
                position: "absolute",
                top: 0,
                width: 68,
                height: 68,
                borderRadius: "50%",
                border: "2px solid #22C55E",
                transform: `scale(${pulseScale * 1.2})`,
                opacity: ringOpacity,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                backgroundColor: "#22C55E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(34, 197, 94, 0.5)",
                transform: `scale(${pulseScale})`,
                cursor: "pointer",
              }}
            >
              {/* Phone Call Icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255, 255, 255, 0.6)" }}>
              Accept
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
