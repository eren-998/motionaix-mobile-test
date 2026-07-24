import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import React from "react";
import { ArrowDown, Target, Sparkles } from "lucide-react";

export const GoalRemotion: React.FC<{ val?: number; title?: string }> = ({
  val = 82,
  title = "Target Tracker",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const aeEase = Easing.bezier(0.16, 1, 0.3, 1);

  // Card entrance (proportional to total duration)
  const entranceEnd = Math.round(durationInFrames * 0.20);
  const entrance = interpolate(frame, [0, entranceEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: aeEase,
  });

  const cardScale = interpolate(entrance, [0, 1], [0.88, 1]);
  const cardY = interpolate(entrance, [0, 1], [40, 0]);
  const cardOpacity = entrance;

  // Track progress (0 to target `val` proportional to total duration)
  const progStart = Math.round(durationInFrames * 0.10);
  const progEnd = Math.round(durationInFrames * 0.85);
  const currentProgress = interpolate(frame, [progStart, progEnd], [0, val], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: aeEase,
  });

  // Pin marker spring bounce
  const pinBounce = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 12, stiffness: 130 },
  });

  // Light sweep pass across track
  const shineStart = Math.round(durationInFrames * 0.25);
  const shineEnd = Math.round(durationInFrames * 0.70);
  const shineProgress = interpolate(frame, [shineStart, shineEnd], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Golden stardust particles
  const goldSparks = Array.from({ length: 22 }).map((_, i) => {
    const delay = Math.round(random(`gDel-${i}`) * 25);
    const speed = 1.0 + random(`gSpd-${i}`) * 1.6;
    const rawP = ((frame - delay) * speed) / 60;
    const p = rawP < 0 ? 0 : rawP % 1;

    const x = (random(`gX-${i}`) - 0.5) * 480;
    const y = interpolate(p, [0, 1], [160, -160]);
    const opacity = interpolate(p, [0, 0.2, 0.8, 1], [0, 0.9, 0.9, 0]);
    const scale = interpolate(p, [0, 0.5, 1], [0.3, random(`gSz-${i}`) * 0.7 + 0.5, 0.2]);

    return { x, y, opacity, scale, key: i };
  });

  // Uniform scale
  const scaleX = width / 800;
  const scaleY = height / 450;
  const uniformScale = Math.min(scaleX, scaleY);

  return (
    <AbsoluteFill className="bg-[#171302] items-center justify-center overflow-hidden font-sans">
      <div
        style={{
          width: 800,
          height: 450,
          transform: `scale(${uniformScale})`,
          transformOrigin: "center center",
          position: "relative",
        }}
        className="flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#3a2e04_0%,#1a1502_50%,#090701_100%)] overflow-hidden"
      >
        {/* Luxury Gold Mesh Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab30825_1px,transparent_1px),linear-gradient(to_bottom,#eab30825_1px,transparent_1px)] bg-[size:26px_26px] [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_90%)]" />

        {/* Champion Arena Radial Gold Beam Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.34)_0%,rgba(217,119,6,0.16)_45%,transparent_80%)] pointer-events-none" />

        {/* Gold Stardust Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {goldSparks.map((s) => (
            <div
              key={s.key}
              className="absolute flex items-center justify-center text-amber-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]"
              style={{
                left: `calc(50% + ${s.x}px)`,
                top: `calc(50% + ${s.y}px)`,
                opacity: s.opacity,
                transform: `scale(${s.scale})`,
              }}
            >
              <Sparkles size={12} />
            </div>
          ))}
        </div>

        {/* Liquid Glass Target Tracker Card */}
        <div
          className="relative z-10 w-[540px] px-8 py-7 rounded-3xl border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(234,179,8,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)] flex flex-col overflow-hidden"
          style={{
            transform: `translateY(${cardY}px) scale(${cardScale})`,
            opacity: cardOpacity,
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(26,20,5,0.85) 50%, rgba(113,63,18,0.4) 100%)",
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

          {/* Header Title */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Target size={20} />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {title}
              </span>
            </div>
            <span className="text-xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
              {Math.round(currentProgress)}%
            </span>
          </div>

          {/* Target Track Area with Marker */}
          <div className="relative w-full h-16 flex items-center mb-2">
            {/* Base Track */}
            <div className="w-full h-5 bg-black/80 rounded-full border border-white/20 overflow-hidden relative shadow-[inset_0_4px_10px_rgba(0,0,0,0.9)]">
              {/* Progress Fill */}
              <div
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-300 rounded-full relative shadow-[0_0_25px_rgba(251,191,36,0.9)] overflow-hidden"
                style={{
                  width: `${currentProgress}%`,
                }}
              >
                {/* Diagonal stripes */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(255,255,255,0.3) 6px, rgba(255,255,255,0.3) 12px)",
                  }}
                />
              </div>
            </div>

            {/* Dynamic 3D Marker Pin */}
            <div
              className="absolute top-0 flex flex-col items-center -translate-x-1/2 -mt-3 z-20"
              style={{
                left: `${currentProgress}%`,
                transform: `translateX(-50%) scale(${pinBounce})`,
              }}
            >
              <div className="bg-gradient-to-b from-white via-yellow-100 to-amber-300 text-black text-xs font-black px-3 py-1 rounded-xl shadow-[0_10px_25px_rgba(251,191,36,0.8)] border border-yellow-200 flex items-center gap-1">
                <ArrowDown size={12} strokeWidth={4} /> {Math.round(currentProgress)}%
              </div>
              <div className="w-1 h-5 bg-gradient-to-b from-amber-300 to-transparent mt-0.5" />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
