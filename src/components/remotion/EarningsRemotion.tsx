import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random, Easing } from "remotion";
import React from "react";

export const EarningsRemotion: React.FC<{ val?: string }> = ({ val = "45800" }) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig(); // 800 x 450

  // Curated premium finance emojis
  const emojis = ["💸", "💰", "💵", "🤑", "🪙", "📈"];
  const numEmojis = 30;
  
  // After Effects style custom bezier ease: cubic-bezier(0.16, 1, 0.3, 1)
  const aeEase = Easing.bezier(0.16, 1, 0.3, 1);
  const floatEaseOut = Easing.out(Easing.quad);

  // Entrance timing (proportional to total duration)
  const entranceEnd = Math.round(durationInFrames * 0.20);
  const textProgressIn = interpolate(frame, [0, entranceEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: aeEase,
  });

  // Solid, locked-in card entrance properties
  const boxY = interpolate(textProgressIn, [0, 1], [45, 0]);
  const boxOpacity = interpolate(textProgressIn, [0, 1], [0, 1]);
  const boxScale = interpolate(textProgressIn, [0, 1], [0.88, 1]);

  // Dynamic earnings count up (proportional to total duration)
  const countStart = Math.round(durationInFrames * 0.10);
  const countEnd = Math.round(durationInFrames * 0.85);
  const countP = interpolate(frame, [countStart, countEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: aeEase,
  });
  const currentVal = Math.round(countP * Number(val || 0));

  // Liquid Glass Shine sweep animation across card
  const shineStart = Math.round(durationInFrames * 0.25);
  const shineEnd = Math.round(durationInFrames * 0.70);
  const shineProgress = interpolate(frame, [shineStart, shineEnd], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Scale canvas uniform
  const scaleX = width / 400;
  const scaleY = height / 225;
  const uniformScale = Math.min(scaleX, scaleY);

  return (
    <AbsoluteFill className="bg-[#02170c] items-center justify-center overflow-hidden">
      <div 
        style={{ 
          width: 400, 
          height: 225, 
          transform: `scale(${uniformScale})`, 
          transformOrigin: "center center",
          position: "relative",
          overflow: "hidden"
        }}
        className="flex items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#05361d_0%,#02170c_60%,#010c06_100%)]"
      >
        {/* Background Financial Matrix Grid */}
        <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(to_right,#4ade8022_1px,transparent_1px),linear-gradient(to_bottom,#4ade8022_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_90%)]" />

        {/* Center Radial Wealth Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(74,222,128,0.28)_0%,rgba(16,185,129,0.12)_45%,transparent_75%)] pointer-events-none" />

        {/* Footer Glow emanating directly from bottom edge of video */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-[#4ade80]/45 via-[#22c55e]/18 to-transparent pointer-events-none z-0"
          style={{
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        />
        <div 
          className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-[420px] h-[100px] bg-[#4ade80]/35 rounded-[100%] blur-2xl pointer-events-none z-0"
          style={{
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        />

        {/* Falling / Floating Emojis */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {Array.from({ length: numEmojis }).map((_, i) => {
            const particleDurSec = 2.0 + random(`pDur-${i}`) * 1.5;
            const particleDurFrames = Math.round(particleDurSec * fps);
            
            const particleDelaySec = random(`pDel-${i}`) * 1.8;
            const particleDelayFrames = Math.round(particleDelaySec * fps);
            
            const rawProgress = (frame - particleDelayFrames) / particleDurFrames;
            const progress = rawProgress < 0 ? 0 : rawProgress % 1;
            
            // Subtle horizontal drift
            const xWobble = Math.sin((frame / 18) + i * 2) * (6 + random(`wob-${i}`) * 8);

            // Y movement: bottom to top
            const y = interpolate(progress, [0, 1], [240, -50], {
              easing: floatEaseOut,
            });
            
            // Opacity envelope
            const opacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 0.9, 0.9, 0]);
            
            // Scale
            const scaleMax = 0.65 + random(`s1-${i}`) * 0.55;
            const scale = interpolate(progress, [0, 0.3, 0.7, 1], [0.2, scaleMax, scaleMax, 0]);
            
            // Rotation
            const dir = random(`dir-${i}`) > 0.5 ? 1 : -1;
            const rotate = interpolate(progress, [0, 1], [0, dir * 280]);

            return (
              <div
                key={i}
                className="absolute text-xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]"
                style={{
                  left: `${6 + (i * 88) / numEmojis}%`,
                  transform: `translate(${xWobble}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
                  transformOrigin: "center center",
                  opacity: frame >= particleDelayFrames ? opacity : 0,
                }}
              >
                {emojis[i % emojis.length]}
              </div>
            );
          })}
        </div>

        {/* Main Apple-Style Liquid Glass Card (Rock Solid, No Floating) */}
        <div className="relative z-10 w-full px-4 flex justify-center mt-[-10px]">
          <div
            className="relative overflow-hidden px-8 py-5 rounded-3xl border border-white/20 bg-gradient-to-b from-white/10 via-white/[0.04] to-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(74,222,128,0.25),inset_0_1px_2px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center gap-1.5"
            style={{
              transform: `translateY(${boxY}px) scale(${boxScale})`,
              transformOrigin: "center center",
              opacity: boxOpacity,
              background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(15,23,42,0.75) 45%, rgba(6,78,59,0.4) 100%)",
            }}
          >
            {/* Liquid Glass Highlight Rim / Top Gloss */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-white/40 via-transparent to-transparent" />

            {/* AE-Style Liquid Glass Shine Sweep Pass */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background: `linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)`,
                transform: `translateX(${shineProgress}%)`,
                width: "100%",
              }}
            />

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Total Earnings
            </span>

            <span 
              className="font-display font-black tracking-tighter text-4xl text-transparent bg-clip-text bg-gradient-to-b from-[#ffffff] via-[#86efac] to-[#22c55e] drop-shadow-[0_2px_16px_rgba(74,222,128,0.6)]"
            >
              ${currentVal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};


