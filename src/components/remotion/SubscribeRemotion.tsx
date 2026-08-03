import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import React from "react";
import { Bell, BellRing, ChevronDown, User, ThumbsUp } from "lucide-react";

export type SubscribeRemotionProps = {
  channelName?: string;
  handle?: string;
  subCount?: string;
  avatarUrl?: string;
};

// Particle / Sprinkle Burst component for Subscribe tap
const SubscribeParticleBurst: React.FC<{ active: boolean; frame: number; triggerFrame: number }> = ({
  active, frame, triggerFrame,
}) => {
  if (!active) return null;
  const pFrame = Math.max(0, frame - triggerFrame);
  const colors = ["#FFD100", "#FFFFFF", "#F59E0B", "#38BDF8", "#EC4899"];

  return (
    <div style={{
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 40,
    }}>
      {/* Expanding Ripple Ring */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", borderRadius: "50%",
        border: "2px solid rgba(255, 209, 0, 0.7)", pointerEvents: "none",
        width: interpolate(pFrame, [0, 16], [10, 140], { extrapolateRight: "clamp" }),
        height: interpolate(pFrame, [0, 16], [10, 140], { extrapolateRight: "clamp" }),
        opacity: interpolate(pFrame, [0, 16], [1, 0], { extrapolateRight: "clamp" }),
      }} />

      {/* Burst Particles */}
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i * (360 / 18)) * (Math.PI / 180);
        const distance = 45 + random(`sub-p-dist-${i}`) * 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const color = colors[i % colors.length];
        const size = 4 + random(`sub-p-sz-${i}`) * 6;

        const progress = interpolate(pFrame, [0, 22], [0, 1], {
          extrapolateRight: "clamp", easing: Easing.out(Easing.quad),
        });
        const px = tx * progress;
        const py = ty * progress;
        const scale = interpolate(progress, [0, 0.35, 1], [0, 1.2, 0]);
        const opacity = interpolate(progress, [0, 0.4, 1], [1, 1, 0]);

        return (
          <div key={i} style={{
            position: "absolute", borderRadius: "50%", pointerEvents: "none",
            width: size, height: size, backgroundColor: color,
            transform: `translate(${px}px, ${py}px) scale(${scale})`,
            opacity,
            boxShadow: `0 0 8px ${color}`,
          }} />
        );
      })}
    </div>
  );
};

export const SubscribeRemotion: React.FC<SubscribeRemotionProps> = ({
  channelName = "Motionaix",
  handle = "@motionaix",
  subCount = "1.2M subscribers",
  avatarUrl,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Timing thresholds (30 fps frame based)
  // Total 150 frames = 5 seconds
  const fMoveToLike = Math.round(0.10 * durationInFrames); // f15
  const fClickLike  = Math.round(0.22 * durationInFrames); // f33
  const fMoveToSub  = Math.round(0.35 * durationInFrames); // f52
  const fClickSub  = Math.round(0.48 * durationInFrames); // f72
  const fMoveToBell = Math.round(0.60 * durationInFrames); // f90
  const fClickBell = Math.round(0.72 * durationInFrames); // f108
  const fExitMouse  = Math.round(0.85 * durationInFrames); // f127
  const fCardOutro  = Math.round(0.93 * durationInFrames); // f139

  const isLiked = frame >= fClickLike;
  const isSubscribed = frame >= fClickSub;
  const isBellRinging = frame >= fClickBell;

  // Particle burst starts exactly at fClickSub
  const showBurst = frame >= fClickSub && frame <= fClickSub + 25;

  // Banner Entrance Spring
  const introSpring = spring({
    frame,
    fps,
    config: { mass: 0.9, damping: 14, stiffness: 120 },
  });
  const introY = interpolate(introSpring, [0, 1], [90, 0]);
  const introScale = interpolate(introSpring, [0, 1], [0.88, 1]);
  const introOpacity = interpolate(introSpring, [0, 0.35], [0, 1], { extrapolateRight: "clamp" });

  // Banner Outro Spring
  const outroFrame = Math.max(0, frame - fCardOutro);
  const outroSpring = spring({
    frame: outroFrame,
    fps,
    config: { mass: 0.7, damping: 16, stiffness: 160 },
  });
  const outroY = interpolate(outroSpring, [0, 1], [0, 80]);
  const outroScale = interpolate(outroSpring, [0, 1], [1, 0.94]);
  const outroOpacity = interpolate(outroSpring, [0, 0.5], [1, 0], { extrapolateRight: "clamp" });

  const cardY = frame >= fCardOutro ? outroY : introY;
  const cardScale = frame >= fCardOutro ? outroScale : introScale;
  const cardOpacity = frame >= fCardOutro ? outroOpacity : introOpacity;

  // Multi-Stage Smooth Cursor Interpolation
  // Target Button Centers: Like: (37, 41), Sub: (212, 41), Bell: (382, 41), Idle: (450, 200)
  let mouseX = 450, mouseY = 200, mouseScale = 1, mouseOpacity = 0;

  const easeSmooth = Easing.bezier(0.25, 1, 0.35, 1);

  if (frame < fMoveToLike) {
    mouseOpacity = interpolate(frame, [fMoveToLike - 6, fMoveToLike], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    mouseX = 450; mouseY = 200;
  } else if (frame < fClickLike) {
    mouseOpacity = 1;
    mouseX = interpolate(frame, [fMoveToLike, fClickLike - 3], [450, 37], { easing: easeSmooth, extrapolateRight: "clamp" });
    mouseY = interpolate(frame, [fMoveToLike, fClickLike - 3], [200, 41], { easing: easeSmooth, extrapolateRight: "clamp" });
  } else if (frame < fClickLike + 6) {
    mouseOpacity = 1; mouseX = 37; mouseY = 41;
    mouseScale = interpolate(frame, [fClickLike, fClickLike + 3, fClickLike + 6], [1, 0.8, 1], { extrapolateRight: "clamp" });
  } else if (frame < fMoveToSub) {
    mouseOpacity = 1; mouseX = 37; mouseY = 41;
  } else if (frame < fClickSub) {
    mouseOpacity = 1;
    mouseX = interpolate(frame, [fMoveToSub, fClickSub - 3], [37, 212], { easing: easeSmooth, extrapolateRight: "clamp" });
    mouseY = interpolate(frame, [fMoveToSub, fClickSub - 3], [41, 41], { easing: easeSmooth, extrapolateRight: "clamp" });
  } else if (frame < fClickSub + 6) {
    mouseOpacity = 1; mouseX = 212; mouseY = 41;
    mouseScale = interpolate(frame, [fClickSub, fClickSub + 3, fClickSub + 6], [1, 0.8, 1], { extrapolateRight: "clamp" });
  } else if (frame < fMoveToBell) {
    mouseOpacity = 1; mouseX = 212; mouseY = 41;
  } else if (frame < fClickBell) {
    mouseOpacity = 1;
    mouseX = interpolate(frame, [fMoveToBell, fClickBell - 3], [212, 382], { easing: easeSmooth, extrapolateRight: "clamp" });
    mouseY = interpolate(frame, [fMoveToBell, fClickBell - 3], [41, 41], { easing: easeSmooth, extrapolateRight: "clamp" });
  } else if (frame < fClickBell + 6) {
    mouseOpacity = 1; mouseX = 382; mouseY = 41;
    mouseScale = interpolate(frame, [fClickBell, fClickBell + 3, fClickBell + 6], [1, 0.8, 1], { extrapolateRight: "clamp" });
  } else if (frame < fExitMouse) {
    mouseOpacity = 1; mouseX = 382; mouseY = 41;
  } else {
    mouseX = interpolate(frame, [fExitMouse, fCardOutro], [382, 450], { easing: easeSmooth, extrapolateRight: "clamp" });
    mouseY = interpolate(frame, [fExitMouse, fCardOutro], [41, 200], { easing: easeSmooth, extrapolateRight: "clamp" });
    mouseOpacity = interpolate(frame, [fExitMouse, fCardOutro], [1, 0], { extrapolateRight: "clamp" });
  }

  // Bell Shake Angle
  const bellShakeProgress = frame >= fClickBell && frame < fClickBell + 18
    ? interpolate(frame, [fClickBell, fClickBell + 3, fClickBell + 7, fClickBell + 11, fClickBell + 15, fClickBell + 18], [0, -22, 22, -12, 12, 0], { extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill style={{
      backgroundColor: "#030712", display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Standardized Background Grid */}
      <div style={{
        position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1,
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 50%, transparent 90%)",
      }} />

      {/* Ambient Radial Gradients */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.45, pointerEvents: "none", zIndex: 2 }}>
        <div style={{
          position: "absolute", top: "20%", left: "20%", width: 640, height: 640, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,209,0,0.5) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "20%", width: 640, height: 640, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)",
          filter: "blur(50px)",
        }} />
      </div>

      {/* Liquid Glass Lower Third Banner */}
      <div style={{
        position: "relative", display: "flex", alignItems: "center", gap: 40,
        background: "rgba(255, 255, 255, 0.09)",
        backdropFilter: "blur(28px) saturate(180%) brightness(1.15)",
        WebkitBackdropFilter: "blur(28px) saturate(180%) brightness(1.15)",
        padding: "30px 52px", borderRadius: 9999,
        border: "1px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.35), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.2), 0 20px 50px rgba(0,0,0,0.45)",
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity, zIndex: 10,
        overflow: "hidden",
      }}>
        {/* Specular Sheen Highlight */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
          pointerEvents: "none", zIndex: 15,
        }} />

        {/* Avatar */}
        <div style={{
          width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.25)", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2), 0 4px 14px rgba(0,0,0,0.3)", flexShrink: 0,
        }}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <User size={50} color="rgba(255,255,255,0.75)" />
          )}
        </div>

        {/* Text Metadata */}
        <div style={{ display: "flex", flexDirection: "column", paddingRight: 20 }}>
          <span style={{ color: "#ffffff", fontWeight: 800, fontSize: 36, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{channelName}</span>
          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 26, fontWeight: 500, marginTop: 6 }}>
            {handle} • {subCount}
          </span>
        </div>

        {/* Action Controls Area */}
        <div style={{ display: "flex", alignItems: "center", position: "relative", height: 90 }}>
          {/* Like Button */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 90, height: 90, borderRadius: "50%", marginRight: 20, zIndex: 10,
            background: isLiked ? "#FFD100" : "rgba(255,255,255,0.12)",
            color: isLiked ? "#000000" : "#ffffff",
            boxShadow: isLiked ? "0 0 24px rgba(255,209,0,0.6)" : "inset 0 1px 1px rgba(255,255,255,0.2)",
            transform: frame >= fClickLike && frame < fClickLike + 6 ? "scale(0.88)" : "scale(1)",
            transition: "all 0.15s ease",
          }}>
            <ThumbsUp size={36} fill={isLiked ? "currentColor" : "none"} />
          </div>

          {/* Subscribe Button & Particle Emission Position */}
          <div style={{ position: "relative" }}>
            <SubscribeParticleBurst active={showBurst} frame={frame} triggerFrame={fClickSub} />
            <div style={{
              position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
              height: 90, borderRadius: 9999, fontWeight: 700, fontSize: 30, zIndex: 10,
              width: isSubscribed ? 275 : 220,
              background: isSubscribed ? "rgba(255,255,255,0.12)" : "#ffffff",
              color: isSubscribed ? "rgba(255,255,255,0.85)" : "#000000",
              boxShadow: isSubscribed ? "inset 0 1px 1px rgba(255,255,255,0.2)" : "0 4px 20px rgba(255,255,255,0.4)",
              transform: frame >= fClickSub && frame < fClickSub + 6 ? "scale(0.92)" : "scale(1)",
              transition: "all 0.15s ease",
            }}>
              {isSubscribed ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
                  <Bell size={30} /> Subscribed <ChevronDown size={26} style={{ opacity: 0.7 }} />
                </span>
              ) : (
                <span>Subscribe</span>
              )}
            </div>
          </div>

          {/* Bell Ring Button */}
          <div style={{
            position: "absolute", left: 345, display: "flex", alignItems: "center", justifyContent: "center",
            width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.12)", color: "#ffffff", zIndex: 0,
            opacity: isSubscribed ? 1 : 0,
            transform: isSubscribed ? "scale(1) translateX(0)" : "scale(0.5) translateX(-80px)",
            transition: "all 0.35s cubic-bezier(0.2, 1, 0.3, 1)",
            boxShadow: "inset 0 1px 1px rgba(255,255,255,0.2)",
          }}>
            {isBellRinging ? (
              <BellRing size={36} fill="currentColor" style={{ transform: `rotate(${bellShakeProgress}deg)` }} />
            ) : (
              <Bell size={36} />
            )}
          </div>

          {/* Smooth Multi-Stage Frame-Driven Mouse Cursor */}
          <div style={{
            position: "absolute", zIndex: 50, pointerEvents: "none",
            transform: `translate(${mouseX}px, ${mouseY}px) scale(${mouseScale})`,
            opacity: mouseOpacity,
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.6))",
          }}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5.79v22.42l6.56-6.57h9.29L4.5.79z" fill="white" stroke="black" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
