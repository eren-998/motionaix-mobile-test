import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import React from "react";
import { Sparkles } from "lucide-react";

export const RevealRemotion: React.FC<{ text?: string; accentColor?: string }> = ({
  text = "MotionAIx",
  accentColor = "#38bdf8",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const aeEase = Easing.bezier(0.16, 1, 0.3, 1);

  // Text Reveal timing (proportional to total duration)
  const revealEnd = Math.round(durationInFrames * 0.50);
  const revealProgress = interpolate(frame, [0, revealEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: aeEase,
  });

  const blurAmount = interpolate(revealProgress, [0, 1], [40, 0]);
  const textOpacity = revealProgress;
  const textScale = interpolate(revealProgress, [0, 1], [0.8, 1]);
  const letterSpacing = interpolate(revealProgress, [0, 1], [-4, 2]);

  // Light Sheen Sweep across text (proportional to total duration)
  const sheenStart = Math.round(durationInFrames * 0.30);
  const sheenEnd = Math.round(durationInFrames * 0.80);
  const sheenProgress = interpolate(frame, [sheenStart, sheenEnd], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Background glow expand (proportional to total duration)
  const bgGlowStart = Math.round(durationInFrames * 0.10);
  const bgGlowEnd = Math.round(durationInFrames * 0.60);
  const bgGlowOpacity = interpolate(frame, [bgGlowStart, bgGlowEnd], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: aeEase,
  });

  // Particles
  const revealParticles = Array.from({ length: 26 }).map((_, i) => {
    const delay = Math.round(random(`rDel-${i}`) * 20);
    const speed = 1.0 + random(`rSpd-${i}`) * 1.5;
    const rawP = ((frame - delay) * speed) / 60;
    const p = rawP < 0 ? 0 : rawP % 1;

    const x = (random(`rX-${i}`) - 0.5) * 500;
    const y = (random(`rY-${i}`) - 0.5) * 250;
    const opacity = interpolate(p, [0, 0.3, 0.7, 1], [0, 0.9, 0.9, 0]);
    const scale = interpolate(p, [0, 0.5, 1], [0.2, random(`rSz-${i}`) * 0.8 + 0.4, 0.1]);

    return { x, y, opacity, scale, key: i };
  });

  // Scale uniform
  const scaleX = width / 800;
  const scaleY = height / 450;
  const uniformScale = Math.min(scaleX, scaleY);

  return (
    <AbsoluteFill className="bg-[#060a17] items-center justify-center overflow-hidden font-sans">
      <div
        style={{
          width: 800,
          height: 450,
          transform: `scale(${uniformScale})`,
          transformOrigin: "center center",
          position: "relative",
        }}
        className="flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_30%,#0f1c3f_0%,#060c21_50%,#02040d_100%)] overflow-hidden"
      >
        {/* Cinema Anamorphic Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf822_1px,transparent_1px),linear-gradient(to_bottom,#38bdf822_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_90%)]" />

        {/* Center Radial Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${accentColor}44 0%, transparent 70%)`,
            opacity: bgGlowOpacity,
          }}
        />

        {/* Floating Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {revealParticles.map((p) => (
            <div
              key={p.key}
              className="absolute flex items-center justify-center drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]"
              style={{
                left: `calc(50% + ${p.x}px)`,
                top: `calc(50% + ${p.y}px)`,
                opacity: p.opacity,
                transform: `scale(${p.scale})`,
                color: accentColor,
              }}
            >
              <Sparkles size={14} />
            </div>
          ))}
        </div>

        {/* Text Container */}
        <div className="relative z-10 max-w-[90%] px-6 text-center">
          <div
            className="relative inline-block font-display font-black text-5xl sm:text-6xl tracking-tight text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.7)]"
            style={{
              filter: `blur(${blurAmount}px)`,
              opacity: textOpacity,
              transform: `scale(${textScale})`,
              letterSpacing: `${letterSpacing}px`,
            }}
          >
            <span className="text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.8)]">
              {text}
            </span>

            {/* Light Sheen Sweep Overlay */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay blur-[1px]"
              style={{
                background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)",
                transform: `translateX(${sheenProgress}%)`,
                width: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
