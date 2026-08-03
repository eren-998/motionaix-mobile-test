import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import React from "react";
import { ChevronDown, User, UserPlus } from "lucide-react";

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

// Sparkles (deterministic)
const SparklesRemotion: React.FC<{ active: boolean; frame: number; startFrame: number }> = ({ active, frame, startFrame }) => {
  if (!active) return null;
  const sparkleFrame = Math.max(0, frame - startFrame);
  const colors = ["#0095F6", "#47A5E9", "#0077C4", "#FFFFFF"];

  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)", zIndex: 30, pointerEvents: "none",
    }}>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", borderRadius: "50%",
        border: "2px solid rgba(0,149,246,0.6)", pointerEvents: "none",
        width: interpolate(sparkleFrame, [0, 15], [10, 110], { extrapolateRight: "clamp" }),
        height: interpolate(sparkleFrame, [0, 15], [10, 110], { extrapolateRight: "clamp" }),
        opacity: interpolate(sparkleFrame, [0, 15], [1, 0], { extrapolateRight: "clamp" }),
      }} />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * (360 / 16)) * (Math.PI / 180);
        const distance = 40 + random(`ig-sp-d-${i}`) * 35;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const color = colors[i % colors.length];
        const size = 3 + random(`ig-sp-s-${i}`) * 5;
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

export type InstagramOdometerRemotionProps = {
  channelName?: string;
  baseCount?: number;
  igPosts?: string;
  igFollowing?: string;
  igCategory?: string;
  igBio?: string;
  igLink?: string;
  avatarUrl?: string;
  fitAsset?: boolean;
  transparentBg?: boolean;
};

export const InstagramOdometerRemotion: React.FC<InstagramOdometerRemotionProps> = ({
  channelName = "Aesthetic Vibes",
  baseCount = 124000,
  igPosts = "1,204",
  igFollowing = "42",
  igCategory = "Digital Creator",
  igBio = "Creating visual experiences ✨\nCheck out the link below 👇",
  igLink = "linktr.ee/aestheticvibes",
  avatarUrl,
  fitAsset = false,
  transparentBg = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width: compWidth } = useVideoConfig();

  const isFitMode = fitAsset || compWidth <= 750;

  // Frame timing
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
  const cardScale = isFitMode ? 1 : (frame >= fHoldEnd ? outroScale : introScale);
  const cardOpacity = frame >= fHoldEnd ? outroOpacity : introOpacity;

  // ── Precision Cursor Calculations (Relative to Follow Button) ──
  // Follow button center inside its container: X = 135px, Y = 36px
  const targetX = 135 - 8;
  const targetY = 36 - 4;
  const idleX = 360;
  const idleY = 220;

  let mouseX = idleX, mouseY = idleY, mouseScale = 1, mouseOpacity = 0;
  const easeSmooth = Easing.bezier(0.25, 1, 0.35, 1);

  if (frame < Math.round(0.6 * fps)) {
    mouseOpacity = interpolate(frame, [Math.round(0.4 * fps), Math.round(0.6 * fps)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    mouseX = idleX; mouseY = idleY;
  } else if (frame < fMouseClick) {
    mouseOpacity = 1;
    mouseX = interpolate(frame, [Math.round(0.6 * fps), fMouseClick], [idleX, targetX], { easing: easeSmooth, extrapolateRight: "clamp" });
    mouseY = interpolate(frame, [Math.round(0.6 * fps), fMouseClick], [idleY, targetY], { easing: easeSmooth, extrapolateRight: "clamp" });
  } else if (frame < fMouseClick + 6) {
    mouseOpacity = 1; mouseX = targetX; mouseY = targetY;
    mouseScale = interpolate(frame, [fMouseClick, fMouseClick + 3, fMouseClick + 6], [1, 0.82, 1], { extrapolateRight: "clamp" });
  } else if (frame < fHoldEnd) {
    mouseOpacity = 1;
    mouseX = interpolate(frame, [fMouseClick + 6, fHoldEnd], [targetX, targetX + 15], { easing: easeSmooth, extrapolateRight: "clamp" });
    mouseY = interpolate(frame, [fMouseClick + 6, fHoldEnd], [targetY, targetY + 15], { easing: easeSmooth, extrapolateRight: "clamp" });
  } else {
    mouseX = idleX; mouseY = idleY;
    mouseOpacity = interpolate(frame, [fHoldEnd, durationInFrames], [1, 0], { extrapolateRight: "clamp" });
  }

  const odometerFrame = isActionTriggered ? frame - fMouseClick : 0;

  return (
    <AbsoluteFill style={{
      backgroundColor: transparentBg ? "transparent" : "#0b132b",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      padding: isFitMode ? 0 : 20,
    }}>
      {/* Standardized Background Grid */}
      {!isFitMode && !transparentBg && (
        <div style={{
          position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1,
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.14) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse at center, black 60%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 60%, transparent 95%)",
        }} />
      )}

      {/* Background Gradients */}
      {!transparentBg && (
        <div style={{ position: "absolute", inset: 0, opacity: 0.55, pointerEvents: "none", zIndex: 2 }}>
          <div style={{
            position: "absolute", top: "15%", left: "25%", width: 700, height: 700, borderRadius: "50%", opacity: 0.7,
            background: "radial-gradient(circle, rgba(225,48,108,0.45) 0%, transparent 70%)",
            filter: "blur(50px)",
          }} />
          <div style={{
            position: "absolute", bottom: "15%", right: "25%", width: 800, height: 600, borderRadius: "50%", opacity: 0.6,
            background: "radial-gradient(circle, rgba(131,58,180,0.45) 0%, transparent 70%)",
            filter: "blur(50px)",
          }} />
        </div>
      )}

      {/* Instagram Liquid Glass Profile Card */}
      <div style={{
        position: "relative", display: "flex", flexDirection: "column", gap: 32,
        padding: 44, borderRadius: isFitMode ? 0 : 36,
        background: transparentBg ? "rgba(30, 41, 59, 0.75)" : "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(28px) saturate(180%) brightness(1.15)",
        WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.15)",
        border: isFitMode ? "none" : "1px solid rgba(255, 255, 255, 0.22)",
        boxShadow: isFitMode ? "none" : "inset 0 1px 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.2), 0 24px 60px rgba(0,0,0,0.45)",
        width: isFitMode ? "100%" : 700,
        height: isFitMode ? "100%" : "auto",
        justifyContent: isFitMode ? "center" : "flex-start",
        zIndex: 10,
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
        overflow: "hidden",
      }}>
        {/* Specular Sheen Top Line */}
        {!isFitMode && (
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
            pointerEvents: "none", zIndex: 15,
          }} />
        )}

        {/* Profile Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 32, position: "relative", zIndex: 10, width: "100%" }}>
          {/* Avatar with IG Gradient Ring */}
          <div style={{
            position: "relative", width: 128, height: 128, borderRadius: "50%", padding: 3.5, flexShrink: 0,
            background: "linear-gradient(135deg, #FEDA75, #FA7E1E, #D62976, #962FBF)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
          }}>
            <div style={{
              width: "100%", height: "100%", borderRadius: "50%",
              border: "3px solid rgba(3,7,18,0.8)", overflow: "hidden",
              background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <User size={44} color="rgba(255,255,255,0.6)" />
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ flex: 1, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: "#ffffff", fontWeight: 800, fontSize: 28 }}>{igPosts}</span>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 22 }}>Posts</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: "#ffffff", fontWeight: 800, fontSize: 28 }}>
                <OdometerRemotion value={displayCount} frame={Math.max(0, odometerFrame)} />
              </span>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 22 }}>Followers</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ color: "#ffffff", fontWeight: 800, fontSize: 28 }}>{igFollowing}</span>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 22 }}>Following</span>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, position: "relative", zIndex: 10 }}>
          <span style={{ color: "#ffffff", fontWeight: 800, fontSize: 26 }}>{channelName}</span>
          {igCategory && <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 24 }}>{igCategory}</span>}
          <span style={{ color: "#ffffff", fontSize: 24, lineHeight: 1.4, marginTop: 6, whiteSpace: "pre-wrap" }}>{igBio}</span>
          {igLink && <span style={{ color: "#E0F1FF", fontSize: 24, fontWeight: 500, marginTop: 6 }}>{igLink}</span>}
        </div>

        {/* Action Buttons Row */}
        <div style={{ display: "flex", gap: 12, position: "relative", zIndex: 10, width: "100%" }}>
          {/* Follow Button Container (Precision Mouse Cursor Target) */}
          <div style={{
            position: "relative", flex: 1.5, display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, height: 72, borderRadius: 14, fontWeight: 700, fontSize: 26,
            overflow: "visible", boxShadow: isActionTriggered ? "inset 0 1px 1px rgba(255,255,255,0.2)" : "0 4px 20px rgba(0,149,246,0.5)",
            background: isActionTriggered ? "rgba(54,54,54,0.85)" : "#0095F6",
            color: "#ffffff",
            backdropFilter: isActionTriggered ? "blur(12px)" : "none",
            border: isActionTriggered ? "1px solid rgba(255,255,255,0.15)" : "none",
            transform: frame >= fMouseClick && frame < fMouseClick + 6 ? "scale(0.94)" : "scale(1)",
            transition: "all 0.15s ease",
          }}>
            <SparklesRemotion active={showSparkles} frame={frame} startFrame={fMouseClick} />
            {isActionTriggered ? (
              <span style={{ display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
                Following <ChevronDown size={28} style={{ opacity: 0.7, marginTop: 2 }} />
              </span>
            ) : (
              <span style={{ whiteSpace: "nowrap" }}>Follow</span>
            )}

            {/* Mouse Cursor Rendered Relative to Follow Button (100% Precise Target) */}
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
          </div>

          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
            height: 72, borderRadius: 14, fontWeight: 700, fontSize: 26,
            background: "rgba(54,54,54,0.85)", backdropFilter: "blur(12px)",
            color: "#ffffff", border: "1px solid rgba(255,255,255,0.15)", whiteSpace: "nowrap",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2)",
          }}>Message</div>

          <div style={{
            width: 72, height: 72, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: 14, background: "rgba(54,54,54,0.85)", backdropFilter: "blur(12px)",
            color: "#ffffff", border: "1px solid rgba(255,255,255,0.15)", flexShrink: 0,
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2)",
          }}>
            <UserPlus size={32} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
