import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing, random } from "remotion";
import React from "react";
import { FolderDown, CheckCircle2 } from "lucide-react";

export const FileDownloadRemotion: React.FC<{ prog?: number; fileName?: string }> = ({
  prog = 85,
  fileName = "Update.zip",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  // After Effects smooth bezier ease
  const aeEase = Easing.bezier(0.16, 1, 0.3, 1);

  // Entrance animation for main card (proportional to total duration)
  const entranceEnd = Math.round(durationInFrames * 0.20);
  const entranceProgress = interpolate(frame, [0, entranceEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: aeEase,
  });

  const cardScale = interpolate(entranceProgress, [0, 1], [0.85, 1]);
  const cardY = interpolate(entranceProgress, [0, 1], [40, 0]);
  const cardOpacity = entranceProgress;

  // Icon pop spring
  const iconScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  // Progress animation (0 to target `prog` proportional to total duration)
  const progStart = Math.round(durationInFrames * 0.10);
  const progEnd = Math.round(durationInFrames * 0.85);
  const currentProgress = interpolate(frame, [progStart, progEnd], [0, prog], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: aeEase,
  });

  // Shine sweep animation across card (proportional to total duration)
  const shineStart = Math.round(durationInFrames * 0.25);
  const shineEnd = Math.round(durationInFrames * 0.70);
  const shineProgress = interpolate(frame, [shineStart, shineEnd], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Particles / digital bits flowing into folder
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const pDelay = Math.round(random(`del-${i}`) * 30);
    const pSpeed = 1.2 + random(`spd-${i}`) * 1.5;
    const rawP = ((frame - pDelay) * pSpeed) / 60;
    const pProg = rawP < 0 ? 0 : rawP % 1;

    const startX = (random(`x-${i}`) - 0.5) * 350;
    const startY = 160 + random(`y-${i}`) * 80;
    const x = startX * (1 - pProg);
    const y = startY * (1 - pProg) - 40 * pProg;
    const opacity = interpolate(pProg, [0, 0.2, 0.8, 1], [0, 0.8, 0.8, 0]);
    const scale = interpolate(pProg, [0, 0.5, 1], [0.4, 1, 0.2]);

    return { x, y, opacity, scale, key: i };
  });

  // Scale uniform to fit viewport nicely
  const scaleX = width / 800;
  const scaleY = height / 450;
  const uniformScale = Math.min(scaleX, scaleY);

  return (
    <AbsoluteFill className="bg-[#030919] items-center justify-center overflow-hidden font-sans">
      <div
        style={{
          width: 800,
          height: 450,
          transform: `scale(${uniformScale})`,
          transformOrigin: "center center",
          position: "relative",
        }}
        className="flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#0b1e4d_0%,#040f2d_50%,#010614_100%)] overflow-hidden"
      >
        {/* Hexagonal Server Node Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f625_1px,transparent_1px),linear-gradient(to_bottom,#3b82f625_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_95%)]" />

        {/* Cyber Pulse Network Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.32)_0%,rgba(2,132,199,0.14)_45%,transparent_80%)] pointer-events-none" />

        {/* Floating Digital Data Bits */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.key}
              className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]"
              style={{
                left: `calc(50% + ${p.x}px)`,
                top: `calc(50% + ${p.y}px)`,
                opacity: p.opacity,
                transform: `scale(${p.scale})`,
              }}
            />
          ))}
        </div>

        {/* Liquid Glass Download Card */}
        <div
          className="relative z-10 w-[520px] px-8 py-7 rounded-3xl border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(59,130,246,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)] flex flex-col items-center overflow-hidden"
          style={{
            transform: `translateY(${cardY}px) scale(${cardScale})`,
            opacity: cardOpacity,
            background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(15,23,42,0.85) 50%, rgba(30,58,138,0.4) 100%)",
          }}
        >
          {/* Glass Gloss Lines */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />

          {/* Light Sweep */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              transform: `translateX(${shineProgress}%)`,
              width: "100%",
            }}
          />

          {/* Liquid Glass Folder Icon Container */}
          <div
            className="mb-5 p-5 rounded-2xl border border-white/30 bg-gradient-to-b from-white/20 to-white/5 shadow-[0_15px_30px_rgba(0,0,0,0.4),inset_0_2px_8px_rgba(255,255,255,0.4)] relative"
            style={{
              transform: `scale(${iconScale})`,
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-md pointer-events-none" />
            <FolderDown
              size={48}
              strokeWidth={1.5}
              className="text-white drop-shadow-[0_0_18px_rgba(59,130,246,0.9)] relative z-10"
            />
          </div>

          {/* File Label & Percentage Header */}
          <div className="w-full flex justify-between items-center mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">
                {fileName}
              </span>
              {currentProgress >= 100 && (
                <CheckCircle2 size={14} className="text-green-400 animate-pulse" />
              )}
            </div>
            <span className="text-base font-black text-blue-300 drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]">
              {Math.round(currentProgress)}%
            </span>
          </div>

          {/* Neon Liquid Progress Track */}
          <div className="w-full h-4 bg-black/70 rounded-full border border-white/20 p-[2.5px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)] relative overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 shadow-[0_0_20px_rgba(56,189,248,1)] relative overflow-hidden"
              style={{
                width: `${currentProgress}%`,
              }}
            >
              {/* Gloss overlay */}
              <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-b from-white/40 to-transparent" />
              {/* Leading spark */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-full bg-white rounded-full blur-[2px] shadow-[0_0_10px_#fff]" />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
