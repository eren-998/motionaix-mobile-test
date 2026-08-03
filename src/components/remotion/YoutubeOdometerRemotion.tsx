import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import React from "react";
import { Bell, ChevronDown, User } from "lucide-react";

// Remotion-compatible odometer digit (hardware-accelerated, zero-jitter, continuous roll)
const OdometerDigitRemotion: React.FC<{ char: string; frame: number }> = ({ char, frame }) => {
  if (isNaN(Number(char)) || char === " ") {
    return <span style={{ display: "inline-block", transform: "translateY(0.05em)" }}>{char}</span>;
  }
  const num = parseInt(char, 10);
  const rollProgress = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.175, 0.885, 0.32, 1.1),
  });
  const yOffset = num * rollProgress;

  return (
    <span style={{
      display: "inline-flex", flexDirection: "column", height: "1em",
      overflow: "hidden", lineHeight: "1em", verticalAlign: "baseline",
    }}>
      <span style={{
        display: "flex", flexDirection: "column",
        transform: `translate3d(0, -${yOffset}em, 0)`,
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} style={{
            height: "1em", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
          }}>{n}</span>
        ))}
      </span>
    </span>
  );
};

const OdometerRemotion: React.FC<{ value: string | number; frame: number }> = ({ value, frame }) => {
  const chars = String(value).split("");
  return (
    <span style={{ display: "inline-flex", alignItems: "center", fontVariantNumeric: "tabular-nums" }}>
      {chars.map((char, index) => <OdometerDigitRemotion key={index} char={char} frame={frame} />)}
    </span>
  );
};

// Sparkles (deterministic particle burst)
const SparklesRemotion: React.FC<{ active: boolean; frame: number; startFrame: number }> = ({ active, frame, startFrame }) => {
  if (!active) return null;
  const sparkleFrame = Math.max(0, frame - startFrame);
  const colors = ["#FFFFFF", "#FFD100", "#E5E5E5", "#A3A3A3"];

  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)", zIndex: 30, pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", borderRadius: "50%",
        border: "2px solid rgba(255,255,255,0.6)", pointerEvents: "none",
        width: interpolate(sparkleFrame, [0, 15], [10, 110], { extrapolateRight: "clamp" }),
        height: interpolate(sparkleFrame, [0, 15], [10, 110], { extrapolateRight: "clamp" }),
        opacity: interpolate(sparkleFrame, [0, 15], [1, 0], { extrapolateRight: "clamp" }),
      }} />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * (360 / 16)) * (Math.PI / 180);
        const distance = 40 + random(`yt-sp-d-${i}`) * 35;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const color = colors[i % colors.length];
        const size = 3 + random(`yt-sp-s-${i}`) * 5;
        const pProgress = interpolate(sparkleFrame, [0, 21], [0, 1], {
          extrapolateRight: "clamp", easing: Easing.out(Easing.quad),
        });
        const px = tx * pProgress;
        const py = ty * pProgress;
        const pScale = interpolate(pProgress, [0, 0.4, 1], [0, 1.1, 0]);
        const pOpacity = interpolate(pProgress, [0, 0.4, 1], [1, 1, 0]);

        return (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            width: size, height: size, backgroundColor: color,
            transform: `translate3d(${px}px, ${py}px, 0) scale(${pScale})`,
            opacity: pOpacity,
            boxShadow: `0 0 6px ${color}`,
          }} />
        );
      })}
    </div>
  );
};

export type YoutubeOdometerRemotionProps = {
  channelName?: string;
  handle?: string;
  baseCount?: number;
  avatarUrl?: string;
};

export const YoutubeOdometerRemotion: React.FC<YoutubeOdometerRemotionProps> = ({
  channelName = "Motionaix",
  handle = "@motionaix",
  baseCount = 124000,
  avatarUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Frame timing
  const fIntroEnd = Math.round(0.6 * fps);
  const fMouseClick = Math.round(1.5 * fps);
  const fHoldEnd = Math.round(durationInFrames - 0.6 * fps);

  const isActionTriggered = frame >= fMouseClick;
  const showSparkles = frame >= fMouseClick && frame <= fMouseClick + 20;

  const displayCount = isActionTriggered
    ? (Number(baseCount) + 1).toLocaleString()
    : Number(baseCount).toLocaleString();

  // Card Intro & Outro Spring
  const introSpring = spring({
    frame,
    fps,
    config: { mass: 0.9, damping: 14, stiffness: 120 },
  });
  const introY = interpolate(introSpring, [0, 1], [80, 0]);
  const introScale = interpolate(introSpring, [0, 1], [0.88, 1]);
  const introOpacity = interpolate(introSpring, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });

  const outroFrame = Math.max(0, frame - fHoldEnd);
  const outroSpring = spring({
    frame: outroFrame,
    fps,
    config: { mass: 0.7, damping: 16, stiffness: 160 },
  });
  const outroY = interpolate(outroSpring, [0, 1], [0, -60]);
  const outroScale = interpolate(outroSpring, [0, 1], [1, 0.92]);
  const outroOpacity = interpolate(outroSpring, [0, 0.5], [1, 0], { extrapolateRight: "clamp" });

  const cardY = frame >= fHoldEnd ? outroY : introY;
  const cardScale = frame >= fHoldEnd ? outroScale : introScale;
  const cardOpacity = frame >= fHoldEnd ? outroOpacity : introOpacity;

  // Mouse cursor interpolation
  const btnX = 360, btnY = 0;
  const idleX = 450, idleY = 220;

  let mouseX = idleX, mouseY = idleY, mouseScale = 1, mouseOpacity = 0;
  const easeSmooth = Easing.bezier(0.25, 1, 0.35, 1);

  if (frame < Math.round(0.6 * fps)) {
    mouseOpacity = interpolate(frame, [Math.round(0.4 * fps), Math.round(0.6 * fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    mouseX = idleX; mouseY = idleY;
  } else if (frame < fMouseClick) {
    mouseOpacity = 1;
    mouseX = interpolate(frame, [Math.round(0.6 * fps), fMouseClick], [idleX, btnX], { easing: easeSmooth, extrapolateRight: "clamp" });
    mouseY = interpolate(frame, [Math.round(0.6 * fps), fMouseClick], [idleY, btnY], { easing: easeSmooth, extrapolateRight: "clamp" });
  } else if (frame < fMouseClick + 6) {
    mouseOpacity = 1; mouseX = btnX; mouseY = btnY;
    mouseScale = interpolate(frame, [fMouseClick, fMouseClick + 3, fMouseClick + 6], [1, 0.82, 1], { extrapolateRight: "clamp" });
  } else if (frame < fHoldEnd) {
    mouseOpacity = 1;
    mouseX = interpolate(frame, [fMouseClick + 6, fHoldEnd], [btnX, btnX + 15], { easing: easeSmooth, extrapolateRight: "clamp" });
    mouseY = interpolate(frame, [fMouseClick + 6, fHoldEnd], [btnY, btnY + 15], { easing: easeSmooth, extrapolateRight: "clamp" });
  } else {
    mouseX = idleX; mouseY = idleY;
    mouseOpacity = interpolate(frame, [fHoldEnd, durationInFrames], [1, 0], { extrapolateRight: "clamp" });
  }

  const odometerFrame = isActionTriggered ? frame - fMouseClick : 0;

  return (
    <AbsoluteFill style={{
      backgroundColor: "#0b132b", display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Standardized Crisp High-Contrast Background Grid */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1,
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.14) 1px, transparent 1px)`,
        backgroundSize: "36px 36px",
        maskImage: "radial-gradient(ellipse at center, black 60%, transparent 95%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 60%, transparent 95%)",
      }} />

      {/* Background Gradients */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.55, pointerEvents: "none", zIndex: 2 }}>
        <div style={{
          position: "absolute", top: "20%", right: "20%", width: 650, height: 650, borderRadius: "50%", opacity: 0.7,
          background: "radial-gradient(circle, rgba(225,29,72,0.55) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", left: "20%", width: 750, height: 750, borderRadius: "50%", opacity: 0.6,
          background: "radial-gradient(circle, rgba(79,70,229,0.55) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />
      </div>

      {/* Liquid Glass Subscribe Card */}
      <div style={{
        position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 48, padding: "32px 48px", borderRadius: 9999,
        background: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(28px) saturate(180%) brightness(1.15)",
        WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.15)",
        border: "1px solid rgba(255, 255, 255, 0.22)",
        boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.2), 0 20px 50px rgba(0,0,0,0.45)",
        width: "90%", maxWidth: 980, zIndex: 10,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
        overflow: "hidden",
      }}>
        {/* Top Sheen */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
          pointerEvents: "none", zIndex: 15,
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: 32, position: "relative", zIndex: 10 }}>
          {/* Avatar */}
          <div style={{
            width: 112, height: 112, borderRadius: "50%", background: "rgba(0,0,0,0.4)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.25)", overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <User size={48} color="rgba(255,255,255,0.6)" />
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <span style={{ color: "#ffffff", fontWeight: 800, fontSize: 34, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{channelName}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.7)", fontSize: 26, marginTop: 6, lineHeight: 1 }}>
              <span>{handle}</span>
              <span style={{ fontSize: 20 }}>•</span>
              <span style={{ fontWeight: 600, color: "#ffffff", display: "flex", alignItems: "center" }}>
                <OdometerRemotion value={displayCount} frame={Math.max(0, odometerFrame)} />
                <span style={{ marginLeft: 6 }}>subscribers</span>
              </span>
            </div>
          </div>
        </div>

        {/* Subscribe Button */}
        <div style={{
          position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, height: 80, width: 280, borderRadius: 9999, fontWeight: 700, fontSize: 28,
          zIndex: 10, overflow: "hidden", flexShrink: 0,
          boxShadow: isActionTriggered ? "inset 0 1px 1px rgba(255,255,255,0.2)" : "0 4px 20px rgba(255,255,255,0.4)",
          background: isActionTriggered ? "rgba(39,39,39,0.9)" : "#ffffff",
          color: isActionTriggered ? "#ffffff" : "#000000",
          border: isActionTriggered ? "1px solid rgba(255,255,255,0.15)" : "none",
          transform: frame >= fMouseClick && frame < fMouseClick + 6 ? "scale(0.92)" : "scale(1)",
          transition: "all 0.15s ease",
        }}>
          <SparklesRemotion active={showSparkles} frame={frame} startFrame={fMouseClick} />
          {isActionTriggered ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
              <Bell size={30} fill="currentColor" color="#fff" />
              <span style={{ whiteSpace: "nowrap" }}>Subscribed</span>
              <ChevronDown size={26} style={{ opacity: 0.7 }} />
            </div>
          ) : (
            <span style={{ whiteSpace: "nowrap" }}>Subscribe</span>
          )}
        </div>
      </div>

      {/* Mouse Cursor */}
      <div style={{
        position: "absolute", zIndex: 50, pointerEvents: "none", left: 0, top: 0,
        transform: `translate3d(${mouseX}px, ${mouseY}px, 0) scale(${mouseScale})`,
        opacity: mouseOpacity, transformOrigin: "top left",
        filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.6))",
      }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.5.79v22.42l6.56-6.57h9.29L4.5.79z" fill="black" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      </div>
    </AbsoluteFill>
  );
};
