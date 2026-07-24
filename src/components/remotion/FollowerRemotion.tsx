import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import React from "react";
import { Users, Sparkles } from "lucide-react";

export const FollowerRemotion: React.FC<{ count?: number; label?: string }> = ({
  count = 299500,
  label = "Followers",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const aeEase = Easing.bezier(0.16, 1, 0.3, 1);

  // Entrance timing (proportional to total duration)
  const entranceEnd = Math.round(durationInFrames * 0.20);
  const entrance = interpolate(frame, [0, entranceEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: aeEase,
  });

  const cardScale = interpolate(entrance, [0, 1], [0.85, 1]);
  const cardY = interpolate(entrance, [0, 1], [35, 0]);
  const cardOpacity = entrance;

  // Icon bounce spring
  const iconBounce = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 10, stiffness: 140 },
  });

  // Animated follower count (0 -> count proportional to total duration)
  const countStart = Math.round(durationInFrames * 0.10);
  const countEnd = Math.round(durationInFrames * 0.85);
  const currentCount = Math.round(
    interpolate(frame, [countStart, countEnd], [0, count], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: aeEase,
    })
  );

  // Shine sweep (proportional to total duration)
  const shineStart = Math.round(durationInFrames * 0.25);
  const shineEnd = Math.round(durationInFrames * 0.70);
  const shineProgress = interpolate(frame, [shineStart, shineEnd], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Floating sparkle particles
  const sparkles = Array.from({ length: 24 }).map((_, i) => {
    const delay = Math.round(random(`spkDel-${i}`) * 25);
    const speed = 1.0 + random(`spkSpd-${i}`) * 1.5;
    const rawP = ((frame - delay) * speed) / 60;
    const p = rawP < 0 ? 0 : rawP % 1;

    const x = (random(`spkX-${i}`) - 0.5) * 440;
    const y = interpolate(p, [0, 1], [180, -180]);
    const opacity = interpolate(p, [0, 0.2, 0.8, 1], [0, 0.85, 0.85, 0]);
    const scale = interpolate(p, [0, 0.5, 1], [0.2, random(`spkSz-${i}`) * 0.8 + 0.5, 0.2]);

    return { x, y, opacity, scale, key: i };
  });

  // Uniform scale
  const scaleX = width / 800;
  const scaleY = height / 450;
  const uniformScale = Math.min(scaleX, scaleY);

  return (
    <AbsoluteFill className="bg-[#1d061b] items-center justify-center overflow-hidden font-sans">
      <div
        style={{
          width: 800,
          height: 450,
          transform: `scale(${uniformScale})`,
          transformOrigin: "center center",
          position: "relative",
        }}
        className="flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#3d0c38_0%,#1c041b_50%,#090109_100%)] overflow-hidden"
      >
        {/* Social Connection Constellation Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ec489928_1px,transparent_1px),linear-gradient(to_bottom,#ec489928_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_90%)]" />

        {/* Creator Studio Ambient Energy Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.32)_0%,rgba(168,85,247,0.16)_45%,transparent_80%)] pointer-events-none" />

        {/* Floating Sparkles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {sparkles.map((s) => (
            <div
              key={s.key}
              className="absolute flex items-center justify-center text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]"
              style={{
                left: `calc(50% + ${s.x}px)`,
                top: `calc(50% + ${s.y}px)`,
                opacity: s.opacity,
                transform: `scale(${s.scale})`,
              }}
            >
              <Sparkles size={14} />
            </div>
          ))}
        </div>

        {/* Liquid Glass Social Badge Card */}
        <div
          className="relative z-10 px-8 py-6 rounded-3xl border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(236,72,153,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center gap-6 overflow-hidden"
          style={{
            transform: `translateY(${cardY}px) scale(${cardScale})`,
            opacity: cardOpacity,
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(24,9,30,0.85) 50%, rgba(131,24,67,0.4) 100%)",
          }}
        >
          {/* Top Edge Gloss */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />

          {/* Light Sweep Pass */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              transform: `translateX(${shineProgress}%)`,
              width: "100%",
            }}
          />

          {/* Avatar / Users Icon Badge */}
          <div
            className="w-16 h-16 bg-gradient-to-tr from-pink-600 via-pink-500 to-amber-400 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.6)] border border-white/30 relative overflow-hidden"
            style={{
              transform: `scale(${iconBounce})`,
            }}
          >
            <div className="absolute inset-0 bg-white/20 blur-sm pointer-events-none" />
            <Users size={30} className="text-white drop-shadow-md relative z-10" fill="currentColor" />
          </div>

          {/* Followers Count & Label */}
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-widest text-pink-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {label}
            </span>
            <span className="font-display font-black text-4xl sm:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-pink-100 to-pink-300 drop-shadow-[0_2px_15px_rgba(236,72,153,0.7)]">
              {currentCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
