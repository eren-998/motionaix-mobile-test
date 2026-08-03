import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import React from "react";

export type IosNotificationRemotionProps = {
  appName?: string;
  notiTitle?: string;
  notiMessage?: string;
  notiTime?: string;
  iconUrl?: string;
};

export const IosNotificationRemotion: React.FC<IosNotificationRemotionProps> = ({
  appName = "Messages",
  notiTitle = "Sarah Jenkins",
  notiMessage = "Are we still meeting at Blue Bottle Coffee at 5? ☕",
  notiTime = "now",
  iconUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Tune Remotion spring physics for authentic iOS notification bounce
  const introProgress = spring({
    frame,
    fps,
    config: { mass: 0.8, damping: 14, stiffness: 140 },
  });

  const introY = interpolate(introProgress, [0, 1], [-140, 0]);
  const introScale = interpolate(introProgress, [0, 1], [0.88, 1]);
  const introOpacity = interpolate(introProgress, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });

  // Outro spring: starts 18 frames before end
  const outroStartFrame = Math.max(0, durationInFrames - Math.round(0.6 * fps));
  const outroFrame = Math.max(0, frame - outroStartFrame);
  const outroProgress = spring({
    frame: outroFrame,
    fps,
    config: { mass: 0.6, damping: 16, stiffness: 180 },
  });

  const outroY = interpolate(outroProgress, [0, 1], [0, -140]);
  const outroScale = interpolate(outroProgress, [0, 1], [1, 0.9]);
  const outroOpacity = interpolate(outroProgress, [0, 0.6], [1, 0], { extrapolateRight: "clamp" });

  const cardY = frame >= outroStartFrame ? outroY : introY;
  const cardScale = frame >= outroStartFrame ? outroScale : introScale;
  const cardOpacity = frame >= outroStartFrame ? outroOpacity : introOpacity;

  return (
    <AbsoluteFill style={{
      backgroundColor: "#030712",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
      paddingTop: 160, overflow: "hidden",
    }}>
      {/* Standardized Background Grid */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1,
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
      }} />

      {/* Ambient Glows */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.45, pointerEvents: "none", zIndex: 2 }}>
        <div style={{
          position: "absolute", top: "10%", left: "25%", width: "35%", height: "35%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.45) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "15%", width: "45%", height: "45%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />
      </div>

      {/* iOS Liquid Glass Notification Card */}
      <div style={{
        position: "relative", width: 740, borderRadius: 40, zIndex: 10,
        background: "rgba(255, 255, 255, 0.09)",
        backdropFilter: "blur(28px) saturate(180%) brightness(1.15)",
        WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.15)",
        boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.2), inset 0 0 20px 0 rgba(255, 255, 255, 0.05), 0 24px 60px rgba(0, 0, 0, 0.45)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
        overflow: "hidden",
      }}>
        {/* Specular Light Refraction Top Sheen */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0.6) 70%, transparent 100%)",
          pointerEvents: "none", zIndex: 15,
        }} />
        <div style={{
          position: "absolute", inset: 0, borderRadius: 40, pointerEvents: "none", zIndex: 10,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 60%, transparent 100%)",
        }} />

        <div style={{ padding: "30px 38px", display: "flex", flexDirection: "column", gap: 14, position: "relative", zIndex: 20 }}>
          {/* Header Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              {/* App Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "rgba(255,255,255,0.15)", boxShadow: "inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
                {iconUrl ? (
                  <img src={iconUrl} alt={appName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #3b82f6, #6366f1)" }} />
                )}
              </div>
              <span style={{
                color: "rgba(255, 255, 255, 0.85)", fontSize: 22, fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
              }}>{appName}</span>
            </div>
            <span style={{
              color: "rgba(255, 255, 255, 0.5)", fontSize: 22, fontWeight: 500,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            }}>{notiTime}</span>
          </div>

          {/* Content Body */}
          <div style={{ display: "flex", flexDirection: "column", paddingRight: 10, marginTop: 2 }}>
            <h4 style={{
              color: "#ffffff", fontWeight: 600, fontSize: 28, letterSpacing: "-0.02em", lineHeight: 1.2, margin: 0,
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif",
            }}>{notiTitle}</h4>
            <p style={{
              color: "rgba(255, 255, 255, 0.92)", fontSize: 26, fontWeight: 400, lineHeight: 1.4, margin: 0, marginTop: 6, letterSpacing: "-0.01em",
              fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            }}>{notiMessage}</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
