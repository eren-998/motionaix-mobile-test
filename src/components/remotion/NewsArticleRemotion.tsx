import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import React from "react";

export type NewsArticleRemotionProps = {
  channelName?: string;
  headline?: string;
  date?: string;
  body?: string;
  highlightColor?: string;
  textColor?: string;
  glowIntensity?: number;
  paperStyle?: "vintage" | "newsprint" | "classic" | "transparent";
};

export const NewsArticleRemotion: React.FC<NewsArticleRemotionProps> = ({
  channelName = "THE HINDU",
  headline = "Trump signs order seeking to overhaul U.S. elections, including requiring {proof of citizenship}",
  date = "Published - March 26, 2026 07:38 am",
  body = "President Donald Trump signed a sweeping executive action to overhaul elections in the U.S. on Tuesday (March 25, 2026), including requiring {documentary proof} of citizenship to register to vote in federal elections and demanding that all ballots be received by Election Day.",
  highlightColor = "#FFF04D",
  textColor = "#000000",
  glowIntensity = 0,
  paperStyle = "vintage",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const elapsedMs = (frame / fps) * 1000;

  // Spring physics for smooth AE 3D Card Reveal
  const revealProgress = spring({
    frame,
    fps,
    config: { mass: 1, damping: 18, stiffness: 100 },
  });

  const revealOpacity = interpolate(revealProgress, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });
  const revealZ = interpolate(revealProgress, [0, 1], [350, 0]);
  const revealY = interpolate(revealProgress, [0, 1], [120, 0]);
  const revealRotX = interpolate(revealProgress, [0, 1], [35, 0]);
  const revealRotY = interpolate(revealProgress, [0, 1], [-12, 0]);
  const revealRotZ = interpolate(revealProgress, [0, 1], [4, 0]);
  const revealBlur = interpolate(revealProgress, [0, 1], [15, 0]);

  // Highlight wipe transition
  const isHL = elapsedMs > 1500;
  const hlProgress = interpolate(frame, [Math.round(1.5 * fps), Math.round(2.7 * fps)], [100, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.25, 1, 0.5, 1),
  });

  // Background zoom (subtle Ken Burns effect)
  const bgScale = interpolate(frame, [0, durationInFrames], [1.05, 0.88], {
    extrapolateRight: "clamp", easing: Easing.bezier(0.25, 1, 0.5, 1),
  });
  const bgBrightness = interpolate(frame, [0, durationInFrames], [0.5, 0.3]);

  const renderText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\{.*?\})/g);
    return parts.map((part, i) => {
      if (part.startsWith("{") && part.endsWith("}")) {
        const innerText = part.slice(1, -1);
        return (
          <span key={i} style={{
            display: "inline",
            backgroundImage: `linear-gradient(to right, ${highlightColor} 50%, transparent 50%)`,
            backgroundSize: "200% 100%",
            backgroundPosition: `${hlProgress}% 0`,
            padding: "0.05em 0.15em",
            borderRadius: "3px",
            color: isHL ? (paperStyle === "transparent" ? "#000000" : "#000000") : "inherit",
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone" as any,
          }}>{innerText}</span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const paperBg = paperStyle === "transparent"
    ? "rgba(15, 23, 42, 0.75)"
    : paperStyle === "classic"
    ? "#fdfcfb"
    : paperStyle === "newsprint"
    ? "#EBECE7"
    : "#F3EFE6";

  const paperBorder = paperStyle === "transparent"
    ? "1px solid rgba(255,255,255,0.25)"
    : paperStyle === "newsprint"
    ? "1px solid #ccc"
    : paperStyle === "vintage"
    ? "1px solid #d4cdbd"
    : "1px solid rgba(0,0,0,0.1)";

  const paperColor = paperStyle === "transparent" ? "#FFFFFF" : textColor;

  // Auto font scaling logic based on headline length to prevent overflow
  const headlineLen = (headline || "").length;
  const headlineFontSize = headlineLen > 120 ? 38 : headlineLen > 80 ? 44 : 50;

  const bodyLen = (body || "").length;
  const bodyFontSize = bodyLen > 300 ? 20 : bodyLen > 180 ? 23 : 26;

  return (
    <AbsoluteFill style={{ backgroundColor: "#030712", overflow: "hidden" }}>
      {/* Standardized Background Grid */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1,
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
      }} />

      {/* Cinematic Dark Background Layer */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        transform: `scale(${bgScale})`,
        filter: `brightness(${bgBrightness})`,
        background: "radial-gradient(ellipse at 50% 40%, #1e1b4b 0%, #0f172a 60%, #020617 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        background: "radial-gradient(circle at center, transparent 0%, rgba(2,6,23,0.92) 100%)",
      }} />

      {/* Centered Dynamic Paper / Glass Card */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "center",
        perspective: 2000, pointerEvents: "none", padding: "40px",
      }}>
        <div style={{
          width: "90%", maxWidth: 1450, maxHeight: 920, overflow: "hidden", borderRadius: 16,
          background: paperBg, border: paperBorder, color: paperColor,
          backdropFilter: paperStyle === "transparent" ? "blur(32px) saturate(180%)" : "none",
          WebkitBackdropFilter: paperStyle === "transparent" ? "blur(32px) saturate(180%)" : "none",
          textShadow: glowIntensity > 0 ? `0 0 ${glowIntensity}px rgba(255,255,255,.8), 0 0 ${glowIntensity * 2}px ${textColor}60` : "none",
          boxShadow: paperStyle === "transparent"
            ? "inset 0 1px 1px 0 rgba(255,255,255,0.3), inset 0 0 40px rgba(0,0,0,0.5), 0 30px 80px rgba(0,0,0,0.85)"
            : "0 30px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.6)",
          opacity: revealOpacity,
          transform: `translateZ(${revealZ}px) translateY(${revealY}px) rotateX(${revealRotX}deg) rotateY(${revealRotY}deg) rotateZ(${revealRotZ}deg)`,
          filter: `blur(${revealBlur}px)`,
          backfaceVisibility: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          {/* Subtle Paper Texture */}
          {paperStyle !== "transparent" && paperStyle !== "classic" && (
            <div style={{
              position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", opacity: 0.35,
              mixBlendMode: "multiply",
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/dust.png")',
            }} />
          )}

          <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Header Banner */}
            <div style={{
              padding: "26px 40px", display: "flex", alignItems: "center", justifyContent: "center",
              borderBottom: paperStyle === "transparent" ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(0,0,0,0.12)",
              background: paperStyle === "transparent" ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.04)",
              flexShrink: 0,
            }}>
              <h2 style={{
                fontSize: 36, fontFamily: "Georgia, serif", fontWeight: 900,
                letterSpacing: "0.12em", textTransform: "uppercase",
                padding: "8px 32px", borderRadius: 6,
                background: "linear-gradient(135deg, #1e3a8a, #2b4c6e)", color: "#ffffff",
                boxShadow: "0 4px 14px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3)",
                margin: 0,
              }}>{channelName}</h2>
            </div>

            {/* Dynamic Scaled Body Content */}
            <div style={{
              padding: "36px 52px", display: "flex", flexDirection: "column", gap: 20, textAlign: "left",
              overflow: "hidden", flex: 1, justifyContent: "center",
            }}>
              <h1 style={{
                fontSize: headlineFontSize, fontFamily: "Georgia, serif", fontWeight: 700,
                lineHeight: 1.25, letterSpacing: "-0.02em", margin: 0,
              }}>{renderText(headline)}</h1>

              <div style={{
                width: "100%", paddingBottom: 12, margin: 0,
                borderBottom: paperStyle === "transparent" ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(0,0,0,0.15)",
                opacity: 0.85,
              }}>
                {date && <span style={{
                  fontSize: 20, fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
                  letterSpacing: "0.06em", fontWeight: 600, textTransform: "uppercase",
                  color: paperStyle === "transparent" ? "rgba(255,255,255,0.75)" : "#525252",
                }}>{date}</span>}
              </div>

              {body && (
                <p style={{
                  fontSize: bodyFontSize, lineHeight: 1.65, fontFamily: "Georgia, serif", textAlign: "justify",
                  textIndent: "1.5em", margin: 0,
                  opacity: paperStyle === "transparent" ? 0.95 : 0.9,
                  color: paperStyle === "transparent" ? "rgba(255,255,255,0.92)" : paperColor,
                }}>{renderText(body)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
