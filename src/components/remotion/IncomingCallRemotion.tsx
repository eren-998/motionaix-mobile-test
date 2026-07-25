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
  avatarUrl?: string;
  accentColor?: string;
};

export const IncomingCallRemotion: React.FC<IncomingCallRemotionProps> = ({
  callerName = "Claude Code",
  subtitle = "incoming call...",
  avatarUrl = "",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance spring animation (Apple iOS spring timing)
  const animStart = 0;
  const animEnd = Math.floor(durationInFrames * 0.22);
  
  const cardY = interpolate(frame, [animStart, animEnd], [-90, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.5)),
  });

  const cardScale = interpolate(frame, [animStart, animEnd], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  const cardOpacity = interpolate(frame, [animStart, Math.floor(durationInFrames * 0.12)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous subtle floating animation for liquid feel
  const floatY = Math.sin((frame / fps) * 2) * 3;

  // Pulse animation on green accept button
  const pulseCycle = (frame / fps) % 1.4;
  const pulseScale = interpolate(pulseCycle, [0, 0.7, 1.4], [1, 1.18, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringScale = interpolate(pulseCycle, [0, 1.4], [1, 1.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(pulseCycle, [0, 0.7, 1.4], [0.7, 0.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit slide up (last 10% of duration)
  const exitStart = Math.floor(durationInFrames * 0.9);
  const exitY = interpolate(frame, [exitStart, durationInFrames], [0, -110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.back(1.3)),
  });
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentY = frame >= exitStart ? exitY : cardY + floatY;
  const currentOpacity = frame >= exitStart ? exitOpacity : cardOpacity;

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
      {/* Dynamic Liquid Glass Background Glows */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,197,94,0.18) 0%, rgba(224,86,56,0.15) 45%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Main Glassmorphic Call Card */}
      <div
        style={{
          width: "84%",
          maxWidth: 650,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
          backgroundColor: "#11151F",
          borderRadius: 36,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          padding: "38px 44px",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 0 40px rgba(34, 197, 94, 0.15)",
          transform: `translateY(${currentY}px) scale(${cardScale})`,
          opacity: currentOpacity,
          display: "flex",
          flexDirection: "column",
          gap: 34,
          position: "relative",
          zIndex: 10,
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Top Sheen Highlight Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "15%",
            right: "15%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
          }}
        />

        {/* Caller Info Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* Avatar / Uploaded Logo Circle */}
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: "50%",
              backgroundColor: avatarUrl ? "transparent" : "#E05638",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 28px rgba(224, 86, 56, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                  fill="#FFFFFF"
                />
              </svg>
            )}
          </div>

          {/* Caller Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h3
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.025em",
                margin: 0,
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
              }}
            >
              {callerName}
            </h3>
            <span
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.55)",
                letterSpacing: "0.01em",
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
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 24px rgba(239, 68, 68, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" transform="rotate(135 12 12)" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255, 255, 255, 0.65)" }}>
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
            {/* Animated Pulse Wave Ring */}
            <div
              style={{
                position: "absolute",
                top: 0,
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: "2px solid #22C55E",
                transform: `scale(${ringScale})`,
                opacity: ringOpacity,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor: "#22C55E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 28px rgba(34, 197, 94, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                transform: `scale(${pulseScale})`,
              }}
            >
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255, 255, 255, 0.65)" }}>
              Accept
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
