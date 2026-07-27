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

export type FolderRemotionProps = {
  folderTitle?: string;
  filesCount?: string;
  lastUpdated?: string;
  card1Title?: string;
  card2Title?: string;
  card3Title?: string;
  accentColor?: string;
};

export const FolderRemotion: React.FC<FolderRemotionProps> = ({
  folderTitle = "Projects",
  filesCount = "318 Files",
  lastUpdated = "Last added time Oct 13, 2025",
  card1Title = "ui_mockup.png",
  card2Title = "hero_render.mp4",
  card3Title = "analytics.json",
  accentColor = "#8B5CF6",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrance spring animation for the whole folder container
  const folderSpring = spring({
    frame,
    fps,
    config: {
      mass: 0.8,
      damping: 14,
      stiffness: 90,
    },
  });

  const folderScale = interpolate(folderSpring, [0, 1], [0.8, 1]);
  const folderY = interpolate(folderSpring, [0, 1], [60, 0]);
  const folderOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Continuous subtle float for organic feel
  const floatY = Math.sin((frame / fps) * 2.2) * 4;

  // Emerging files springs (staggered timings)
  const file1Spring = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { mass: 0.7, damping: 12, stiffness: 85 },
  });

  const file2Spring = spring({
    frame: Math.max(0, frame - 18),
    fps,
    config: { mass: 0.7, damping: 11, stiffness: 95 },
  });

  const file3Spring = spring({
    frame: Math.max(0, frame - 24),
    fps,
    config: { mass: 0.7, damping: 12, stiffness: 85 },
  });

  // Trajectories for emerging cards: Left, Center/Top, Right
  // Card 1 (Left)
  const card1X = interpolate(file1Spring, [0, 1], [0, -170]);
  const card1Y = interpolate(file1Spring, [0, 1], [40, -145]);
  const card1Rot = interpolate(file1Spring, [0, 1], [0, -13]);
  const card1Scale = interpolate(file1Spring, [0, 1], [0.85, 0.94]);
  const card1Opacity = interpolate(file1Spring, [0, 0.3, 1], [0, 1, 1]);

  // Card 2 (Center / Top)
  const card2X = interpolate(file2Spring, [0, 1], [0, 0]);
  const card2Y = interpolate(file2Spring, [0, 1], [40, -205]);
  const card2Rot = interpolate(file2Spring, [0, 1], [0, 0]);
  const card2Scale = interpolate(file2Spring, [0, 1], [0.88, 1]);
  const card2Opacity = interpolate(file2Spring, [0, 0.3, 1], [0, 1, 1]);

  // Card 3 (Right)
  const card3X = interpolate(file3Spring, [0, 1], [0, 170]);
  const card3Y = interpolate(file3Spring, [0, 1], [40, -145]);
  const card3Rot = interpolate(file3Spring, [0, 1], [0, 13]);
  const card3Scale = interpolate(file3Spring, [0, 1], [0.85, 0.94]);
  const card3Opacity = interpolate(file3Spring, [0, 0.3, 1], [0, 1, 1]);

  // Exit animation (last 10% of duration)
  const exitStart = Math.floor(durationInFrames * 0.9);
  const exitScale = interpolate(frame, [exitStart, durationInFrames], [1, 0.82], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.back(1.3)),
  });
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const currentScale = frame >= exitStart ? exitScale : folderScale;
  const currentOpacity = frame >= exitStart ? exitOpacity : folderOpacity;
  const currentY = frame >= exitStart ? folderY : folderY + floatY;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07080D",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background Ambient Purple/Violet Liquid Glows */}
      <div
        style={{
          position: "absolute",
          width: 750,
          height: 750,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}35 0%, #6D28D920 45%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 65%)",
          filter: "blur(60px)",
          transform: `translateY(${floatY * -2}px)`,
        }}
      />

      {/* Background Mesh Grid Pattern */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(to right, rgba(168, 85, 247, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(168, 85, 247, 0.15) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
          maskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
          pointerEvents: "none",
          zIndex: 0,
        }} 
      />

      {/* Outer Wrapper with Scale & Translate */}
      <div
        style={{
          position: "relative",
          width: 580,
          height: 490,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${currentY}px) scale(${currentScale})`,
          opacity: currentOpacity,
        }}
      >
        {/* ── 1. FOLDER BACK PANEL ── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        >
          {/* Top Folder Tab */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 210,
              height: 75,
              borderTopLeftRadius: 36,
              borderTopRightRadius: 28,
              background: `linear-gradient(135deg, ${accentColor} 0%, #6D28D9 100%)`,
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            }}
          />
          {/* Folder Backing Body */}
          <div
            style={{
              position: "absolute",
              top: 45,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 36,
              borderTopLeftRadius: 0,
              background: `linear-gradient(145deg, ${accentColor} 0%, #6D28D9 50%, #4C1D95 100%)`,
              boxShadow: "0 30px 70px rgba(109, 40, 217, 0.45), inset 0 1.5px 0 rgba(255, 255, 255, 0.35)",
            }}
          />
        </div>

        {/* ── 2. THREE EMERGING FILE CARDS (POCKET LAYER) ── */}
        <div
          style={{
            position: "absolute",
            top: 50,
            width: "100%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          {/* CARD 1 (LEFT TRAJECTORY) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 60,
              width: 250,
              height: 180,
              marginLeft: -125,
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 235, 255, 0.92) 100%)",
              borderRadius: 22,
              padding: "18px 20px",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.45), 0 0 20px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
              border: "1.5px solid rgba(255, 255, 255, 0.8)",
              transform: `translate(${card1X}px, ${card1Y}px) rotate(${card1Rot}deg) scale(${card1Scale})`,
              opacity: card1Opacity,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: "rgba(139, 92, 246, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", backgroundColor: "rgba(124, 58, 237, 0.1)", padding: "3px 8px", borderRadius: 8 }}>
                PNG
              </span>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#1E1B4B", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {card1Title}
              </p>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>2.4 MB • Image</span>
            </div>
          </div>

          {/* CARD 2 (CENTER / TOP TRAJECTORY) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 60,
              width: 270,
              height: 190,
              marginLeft: -135,
              background: "linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(245, 243, 255, 0.95) 100%)",
              borderRadius: 24,
              padding: "20px 22px",
              boxShadow: "0 25px 55px rgba(0, 0, 0, 0.5), 0 0 30px rgba(168, 85, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 1)",
              border: "1.5px solid rgba(255, 255, 255, 0.9)",
              transform: `translate(${card2X}px, ${card2Y}px) rotate(${card2Rot}deg) scale(${card2Scale})`,
              opacity: card2Opacity,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  backgroundColor: "rgba(236, 72, 153, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DB2777" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#DB2777", backgroundColor: "rgba(219, 39, 119, 0.1)", padding: "4px 10px", borderRadius: 8 }}>
                VIDEO
              </span>
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {card2Title}
              </p>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>48.5 MB • 4K WebM</span>
            </div>
          </div>

          {/* CARD 3 (RIGHT TRAJECTORY) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 60,
              width: 250,
              height: 180,
              marginLeft: -125,
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 235, 255, 0.92) 100%)",
              borderRadius: 22,
              padding: "18px 20px",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.45), 0 0 20px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
              border: "1.5px solid rgba(255, 255, 255, 0.8)",
              transform: `translate(${card3X}px, ${card3Y}px) rotate(${card3Rot}deg) scale(${card3Scale})`,
              opacity: card3Opacity,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", backgroundColor: "rgba(37, 99, 235, 0.1)", padding: "3px 8px", borderRadius: 8 }}>
                JSON
              </span>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 800, color: "#1E1B4B", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {card3Title}
              </p>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>14 KB • Data</span>
            </div>
          </div>
        </div>

        {/* ── 3. FOLDER FRONT GLASS FLAP ── */}
        <div
          style={{
            position: "absolute",
            top: 135,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 3,
            borderRadius: 36,
            background: "linear-gradient(145deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.12) 40%, rgba(124, 58, 237, 0.45) 100%)",
            backgroundColor: "#5B21B6",
            border: "1.5px solid rgba(255, 255, 255, 0.4)",
            boxShadow: "0 25px 65px rgba(0, 0, 0, 0.6), inset 0 1.5px 0 rgba(255, 255, 255, 0.6), inset 0 -2px 25px rgba(109, 40, 217, 0.5)",
            padding: "36px 42px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          {/* Glossy Top Edge Reflection Line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "10%",
              right: "10%",
              height: 1.5,
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent)",
            }}
          />

          {/* Top Section of Front Flap */}
          <div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <h2
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: "#FFFFFF",
                  margin: 0,
                  letterSpacing: "-0.02em",
                  textShadow: "0 2px 14px rgba(0, 0, 0, 0.4)",
                  lineHeight: 1.1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 380,
                }}
              >
                {folderTitle}
              </h2>

              {/* Info Icon Button */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 14,
                  fontWeight: 700,
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                }}
              >
                i
              </div>
            </div>

            <p
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.8)",
                margin: "8px 0 0 0",
              }}
            >
              {filesCount}
            </p>
          </div>

          {/* Bottom Timestamp Detail */}
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "rgba(255, 255, 255, 0.7)",
              letterSpacing: "-0.01em",
            }}
          >
            {lastUpdated}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
