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
  accentColor = "#22C55E",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance spring animation (Apple iOS spring timing)
  const entranceSpring = spring({
    frame,
    fps,
    config: {
      mass: 0.75,
      damping: 12,
      stiffness: 90,
    },
  });

  const cardY = interpolate(entranceSpring, [0, 1], [-80, 0]);
  const cardScale = interpolate(entranceSpring, [0, 1], [0.84, 1]);
  const cardOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous subtle floating animation for liquid physics
  const floatY = Math.sin((frame / fps) * 2.5) * 3.5;

  // Pulse animation on green accept button
  const pulseCycle = (frame / fps) % 1.4;
  const pulseScale = interpolate(pulseCycle, [0, 0.7, 1.4], [1, 1.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringScale = interpolate(pulseCycle, [0, 1.4], [1, 1.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ringOpacity = interpolate(pulseCycle, [0, 0.7, 1.4], [0.75, 0.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Luminous rim beam position around card border
  const beamAngle = (frame * 2.5) % 360;

  // Audio wave bars oscillation for incoming call status
  const barHeights = [1, 2, 3, 4, 5].map((i) => {
    return 10 + Math.sin((frame / fps) * 8 + i * 1.2) * 8 + Math.cos((frame / fps) * 4 + i) * 4;
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
  const currentScale = frame >= exitStart ? cardScale * 0.9 : cardScale;

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
      {/* Dynamic Liquid Glass Background Glows */}
      <div
        style={{
          position: "absolute",
          width: 750,
          height: 750,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}25 0%, rgba(224, 86, 56, 0.18) 45%, transparent 70%)`,
          filter: "blur(75px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 65%)",
          filter: "blur(55px)",
          transform: `translateY(${floatY * -2}px)`,
        }}
      />

      {/* Background Cyber Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(to right, rgba(34, 197, 94, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(34, 197, 94, 0.15) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
          maskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Main Glassmorphic Call Card */}
      <div
        style={{
          width: "86%",
          maxWidth: 660,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 50%, rgba(34, 197, 94, 0.06) 100%)",
          backgroundColor: "rgba(15, 21, 32, 0.85)",
          borderRadius: 38,
          border: "1px solid rgba(255, 255, 255, 0.18)",
          padding: "36px 44px",
          boxShadow: `0 35px 85px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 0 50px ${accentColor}20`,
          transform: `translateY(${currentY}px) scale(${currentScale})`,
          opacity: currentOpacity,
          display: "flex",
          flexDirection: "column",
          gap: 32,
          position: "relative",
          zIndex: 10,
          backdropFilter: "blur(24px)",
          overflow: "hidden",
        }}
      >
        {/* Top Sheen Reflection Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "12%",
            right: "12%",
            height: 1.5,
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)",
          }}
        />

        {/* Dynamic Luminous Rim Glow Beam */}
        <div
          style={{
            position: "absolute",
            inset: -2,
            borderRadius: 40,
            background: `conic-gradient(from ${beamAngle}deg at 50% 50%, transparent 0deg, rgba(255, 255, 255, 0.25) 60deg, transparent 120deg)`,
            pointerEvents: "none",
            mixBlendMode: "overlay",
          }}
        />

        {/* Caller Info Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Avatar / Uploaded Logo Circle */}
          <div
            style={{
              width: 82,
              height: 82,
              borderRadius: "50%",
              backgroundColor: avatarUrl ? "transparent" : "#E05638",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 30px rgba(224, 86, 56, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
              border: "2px solid rgba(255, 255, 255, 0.25)",
              overflow: "hidden",
              position: "relative",
              flexShrink: 0,
            }}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                  fill="#FFFFFF"
                />
              </svg>
            )}
          </div>

          {/* Caller Details & Animated Soundwave */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: 34,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.025em",
                margin: 0,
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.6)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100%",
              }}
            >
              {callerName}
            </h3>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.65)",
                  letterSpacing: "0.01em",
                }}
              >
                {subtitle}
              </span>

              {/* Mini Audio Bars Visualizer */}
              <div style={{ display: "flex", alignItems: "center", gap: 3, height: 20 }}>
                {barHeights.map((h, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: 3.5,
                      height: `${h}px`,
                      backgroundColor: accentColor,
                      borderRadius: 2,
                      boxShadow: `0 0 6px ${accentColor}`,
                    }}
                  />
                ))}
              </div>
            </div>
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
                width: 74,
                height: 74,
                borderRadius: "50%",
                backgroundColor: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 12px 28px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                border: "1.5px solid rgba(255, 255, 255, 0.25)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" transform="rotate(135 12 12)" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255, 255, 255, 0.7)" }}>
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
                width: 74,
                height: 74,
                borderRadius: "50%",
                border: `2px solid ${accentColor}`,
                transform: `scale(${ringScale})`,
                opacity: ringOpacity,
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: "50%",
                backgroundColor: accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 12px 32px ${accentColor}65, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                border: "1.5px solid rgba(255, 255, 255, 0.25)",
                transform: `scale(${pulseScale})`,
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255, 255, 255, 0.7)" }}>
              Accept
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
