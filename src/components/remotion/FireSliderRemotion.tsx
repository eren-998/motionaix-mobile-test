import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, random, Easing } from "remotion";
import React, { useContext } from "react";
import { ExportModeContext } from "@/lib/export-context";

export interface FireSliderRemotionProps {
  val?: number;
  mode?: "fire" | "cold";
}

/* ──────────────────────────────────────────────────────────────────────────
   FireSliderRemotion – Ultra High-Fidelity Physics & Realistic Particles
   
   Upgrades:
   • 100% Crisp & Visible Percentage Text (Eliminated webkit text-clip opacity bug).
   • Real Fire Embers & Real Vector Ice Crystal Snowflakes (No simple dots!).
   • 140+ Physics Particles (Flame Sparks, Ember Ash, 6-Point Snowflakes, Frost Diamonds).
   • Ultra-Smooth Easing curves.
   ────────────────────────────────────────────────────────────────────────── */
export const FireSliderRemotion: React.FC<FireSliderRemotionProps> = ({
  val = 85,
  mode = "fire",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();
  const isFire = mode === "fire";

  // Scaling helpers (1920 x 1080 design baseline)
  const u = (px: number) => (px / 1920) * width;
  const uh = (px: number) => (px / 1080) * height;

  // ── Ultra-Smooth Easing ──
  const aeEase = Easing.bezier(0.16, 1, 0.3, 1);
  const snapEase = Easing.bezier(0.34, 1.25, 0.64, 1);

  // ── 1. Card Entrance (proportional to total duration) ──
  const entranceEnd = Math.round(durationInFrames * 0.20);
  const entranceP = interpolate(frame, [0, entranceEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: snapEase,
  });
  const boxY = interpolate(entranceP, [0, 1], [uh(50), 0]);
  const boxScale = interpolate(entranceP, [0, 1], [0.88, 1]);
  const boxOpacity = interpolate(entranceP, [0, 1], [0, 1]);

  // ── 2. Fluid Slider Fill (0% → val%, proportional to total duration) ──
  const fillStart = Math.round(durationInFrames * 0.10);
  const fillEnd = Math.round(durationInFrames * 0.85);
  const sliderP = interpolate(frame, [fillStart, fillEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: aeEase,
  });
  const currentVal = sliderP * val;
  const displayVal = Math.round(currentVal);

  // Ambient Light Breathing
  const pulseSlow = 0.88 + Math.sin(frame * 0.08) * 0.12;

  // ── Particles System (reduced during export to speed up html-to-image) ──
  const isExporting = useContext(ExportModeContext);
  const numParticles = isExporting ? 20 : 70;
  const numSparks = isExporting ? 15 : 50;
  const numDust = isExporting ? 10 : 30;

  return (
    <AbsoluteFill
      style={{
        background: isFire
          ? "radial-gradient(ellipse at 50% 40%, #1a0803 0%, #0d0301 50%, #050100 100%)"
          : "radial-gradient(ellipse at 50% 40%, #031826 0%, #020d14 50%, #010609 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          STAGE 1: ATMOSPHERIC BACKGROUND & AMBIENT GLOW (TAILORED THEMES)
          ───────────────────────────────────────────────────────────── */}
      
      {/* Cybernetic Matrix Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage: isFire
            ? `linear-gradient(to right, rgba(249,115,22,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(249,115,22,0.18) 1px, transparent 1px)`
            : `linear-gradient(to right, rgba(34,211,238,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.18) 1px, transparent 1px)`,
          backgroundSize: `${u(48)}px ${uh(48)}px`,
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 75%)",
        }}
      />

      {/* Core Volumetric Glow Flare */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isFire
            ? "radial-gradient(ellipse at 50% 50%, rgba(249,115,22,0.32) 0%, rgba(220,38,38,0.16) 45%, transparent 80%)"
            : "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.32) 0%, rgba(37,99,235,0.16) 45%, transparent 80%)",
          opacity: pulseSlow,
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          STAGE 2: REALISTIC PARTICLES SYSTEM (EMBERS & SNOWFLAKES)
          ───────────────────────────────────────────────────────────── */}

      {/* LAYER 1: Realistic Fire Flame Embers OR 6-Point Ice Snowflakes */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: numParticles }).map((_, i) => {
          const durSec = 2.4 + random(`pDur-${i}`) * 2.2;
          const durFrames = Math.round(durSec * fps);
          const delayFrames = Math.round(random(`pDel-${i}`) * 1.5 * fps);
          const p = ((frame - delayFrames) / durFrames) % 1;
          const progress = p < 0 ? 0 : p;

          // Physics Y Motion (Upwards for Fire, Downwards for Ice)
          const yPct = isFire
            ? interpolate(progress, [0, 1], [108, -8])
            : interpolate(progress, [0, 1], [-8, 108]);

          // Heat turbulence / Cold wind sway
          const swayX = Math.sin(frame * 0.04 + i * 1.8) * u(35);
          const xPct = 1 + (i * 98) / numParticles;
          const opacity = interpolate(progress, [0, 0.15, 0.85, 1], [0, 0.85, 0.85, 0]);
          const scale = 0.5 + random(`pSc-${i}`) * 0.7;
          const rotate = isFire ? Math.sin(frame * 0.06 + i) * 30 : interpolate(progress, [0, 1], [0, 360]);

          const pSize = u(18);

          return (
            <div
              key={`particle-${i}`}
              style={{
                position: "absolute",
                left: `${xPct}%`,
                top: `${yPct}%`,
                width: pSize,
                height: pSize,
                transform: `translate(${swayX}px, 0) scale(${scale}) rotate(${rotate}deg)`,
                opacity: frame >= delayFrames ? opacity : 0,
                filter: isFire
                  ? `drop-shadow(0 0 6px rgba(249,115,22,0.9))`
                  : `drop-shadow(0 0 6px rgba(34,211,238,0.9))`,
              }}
            >
              {isFire ? (
                /* Real Fire Flame Spark Teardrop SVG */
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C12 2 6 8.5 6 13.5C6 16.5 7.5 19 10 20.5C10 20.5 9 17 12 14C15 17 14 20.5 14 20.5C16.5 19 18 16.5 18 13.5C18 8.5 12 2 12 2Z"
                    fill="url(#fireEmberGrad)"
                  />
                  <defs>
                    <linearGradient id="fireEmberGrad" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#fef08a" />
                      <stop offset="0.5" stopColor="#f97316" />
                      <stop offset="1" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>
              ) : (
                /* Real 6-Point Ice Snowflake SVG */
                <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M12 5L10 8M12 5L14 8M12 19L10 16M12 19L14 16M5 12L8 10M5 12L8 14M19 12L16 10M19 12L16 14" stroke="#a5f3fc" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="2" fill="#38bdf8" />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* LAYER 2: Fine High-Velocity Sparks & Frost Crystal Diamonds */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: numSparks }).map((_, i) => {
          const durSec = 1.1 + random(`sDur-${i}`) * 1.1;
          const durFrames = Math.round(durSec * fps);
          const delayFrames = Math.round(random(`sDel-${i}`) * 1 * fps);
          const p = ((frame - delayFrames) / durFrames) % 1;
          const progress = p < 0 ? 0 : p;

          const yPct = isFire
            ? interpolate(progress, [0, 1], [104, -4], { easing: Easing.out(Easing.quad) })
            : interpolate(progress, [0, 1], [-4, 104], { easing: Easing.out(Easing.quad) });
          const burstX = (random(`sX-${i}`) - 0.5) * u(110) + Math.sin(frame * 0.1 + i) * u(15);
          const xPct = 3 + (i * 94) / numSparks;
          const flicker = 0.8 + Math.sin(frame * 0.4 + i * 4) * 0.2;
          const opacity = interpolate(progress, [0, 0.1, 0.9, 1], [0, flicker, flicker, 0]);

          const sparkSize = isFire ? u(5) : u(12);

          return (
            <div
              key={`spark-${i}`}
              style={{
                position: "absolute",
                left: `${xPct}%`,
                top: `${yPct}%`,
                width: sparkSize,
                height: isFire ? u(18) : sparkSize,
                borderRadius: isFire ? u(4) : "20%",
                background: isFire
                  ? "linear-gradient(to top, #fbbf24, #fef08a, #ffffff)"
                  : "linear-gradient(135deg, #e0f2fe, #ffffff, #7dd3fc)",
                boxShadow: isFire
                  ? `0 0 ${u(10)}px rgba(253,224,71,0.9)`
                  : `0 0 ${u(10)}px rgba(255,255,255,0.9)`,
                transform: `translate(${burstX}px, 0) rotate(${isFire ? 0 : 45}deg)`,
                opacity: frame >= delayFrames ? opacity : 0,
              }}
            />
          );
        })}
      </div>

      {/* LAYER 3: Ambient Floating Micro Ash / Cold Frost Dust */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: numDust }).map((_, i) => {
          const xPct = random(`dstX-${i}`) * 96 + 2;
          const yPct = random(`dstY-${i}`) * 96 + 2;
          const opacity = (Math.sin(frame * 0.12 + i * 2) + 1) / 2 * 0.75;
          const sz = u(3 + random(`dstSz-${i}`) * 3);

          return (
            <div
              key={`dust-${i}`}
              style={{
                position: "absolute",
                left: `${xPct}%`,
                top: `${yPct}%`,
                width: sz,
                height: sz,
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: isFire
                  ? `0 0 ${u(6)}px rgba(251,146,60,0.9)`
                  : `0 0 ${u(6)}px rgba(103,232,249,0.9)`,
                opacity,
              }}
            />
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          STAGE 3: MAIN GLASS CARD CONTAINER (PERFECTLY ALIGNED)
          ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: u(1200),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: `${uh(48)} ${u(60)}`,
          borderRadius: u(36),
          border: "1px solid rgba(255,255,255,0.18)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.5) 100%)",
          boxShadow: `
            0 ${uh(30)}px ${u(80)}px rgba(0,0,0,0.85),
            0 0 ${u(45)}px ${isFire ? "rgba(249,115,22,0.14)" : "rgba(34,211,238,0.14)"},
            inset 0 1.5px 3px rgba(255,255,255,0.35),
            inset 0 -1.5px 4px rgba(0,0,0,0.5)
          `,
          overflow: "hidden",
          transform: `translateY(${boxY}px) scale(${boxScale})`,
          opacity: boxOpacity,
        }}
      >
        {/* Top Metallic Border Highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: u(2),
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.7), transparent)",
          }}
        />

        {/* ─────────────────────────────────────────────────────────────
            CENTERED DISPLAY: ONLY THE PERCENTAGE TEXT (100% VISIBLE)
            ───────────────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: u(6),
            marginBottom: uh(28),
            position: "relative",
            zIndex: 20,
          }}
        >
          {/* Crisp, Vibrant Percentage Value Number */}
          <span
            style={{
              fontSize: u(104),
              fontWeight: 900,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "#ffffff",
              textShadow: isFire
                ? `0 0 ${u(25)}px rgba(249,115,22,0.9), 0 0 ${u(10)}px rgba(253,224,71,0.9), 0 ${u(4)}px ${u(12)}px rgba(0,0,0,0.9)`
                : `0 0 ${u(25)}px rgba(34,211,238,0.9), 0 0 ${u(10)}px rgba(165,243,252,0.9), 0 ${u(4)}px ${u(12)}px rgba(0,0,0,0.9)`,
            }}
          >
            {displayVal}
          </span>

          {/* Percentage Sign */}
          <span
            style={{
              fontSize: u(48),
              fontWeight: 800,
              color: isFire ? "#fb923c" : "#38bdf8",
              textShadow: isFire
                ? `0 0 ${u(15)}px rgba(249,115,22,0.8), 0 ${u(2)}px ${u(6)}px rgba(0,0,0,0.9)`
                : `0 0 ${u(15)}px rgba(56,189,248,0.8), 0 ${u(2)}px ${u(6)}px rgba(0,0,0,0.9)`,
            }}
          >
            %
          </span>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            STAGE 4: CLEAN RECESSED SLIDER TRACK & SOLID GRADIENT BAR
            ───────────────────────────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            height: uh(88),
            background: "rgba(4, 8, 16, 0.92)",
            borderRadius: u(28),
            border: `${u(2)}px solid rgba(255,255,255,0.14)`,
            boxShadow: `
              inset 0 ${uh(5)}px ${u(20)}px rgba(0,0,0,0.95),
              0 0 ${u(15)}px rgba(0,0,0,0.5)
            `,
            position: "relative",
            display: "flex",
            alignItems: "center",
            padding: u(8),
            overflow: "visible",
            zIndex: 20,
          }}
        >
          {/* Track Baseline Rail */}
          <div
            style={{
              position: "absolute",
              left: "2%",
              right: "2%",
              top: "50%",
              transform: "translateY(-50%)",
              height: u(4),
              background: "rgba(255,255,255,0.06)",
              borderRadius: u(10),
            }}
          />

          {/* Clean, Vibrant Solid Gradient Bar Fill */}
          <div
            style={{
              height: "100%",
              width: `${currentVal}%`,
              borderRadius: u(20),
              background: isFire
                ? "linear-gradient(90deg, #dc2626 0%, #f97316 60%, #fbbf24 100%)"
                : "linear-gradient(90deg, #1d4ed8 0%, #38bdf8 60%, #a5f3fc 100%)",
              boxShadow: isFire
                ? `0 0 ${u(24)}px rgba(249,115,22,0.85), inset 0 1px 2px rgba(255,255,255,0.5)`
                : `0 0 ${u(24)}px rgba(56,189,248,0.85), inset 0 1px 2px rgba(255,255,255,0.5)`,
              position: "relative",
            }}
          />

          {/* ─────────────────────────────────────────────────────────────
              STAGE 5: SLEEK 3D GLASS KNOB WITH EMBEDDED ICON
              ───────────────────────────────────────────────────────────── */}
          <div
            style={{
              position: "absolute",
              left: `${currentVal}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            {/* Soft Ambient Knob Glow */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: u(116),
                height: u(116),
                borderRadius: "50%",
                background: isFire
                  ? "radial-gradient(circle, rgba(249,115,22,0.35) 0%, transparent 70%)"
                  : "radial-gradient(circle, rgba(56,189,248,0.35) 0%, transparent 70%)",
                filter: `blur(${u(6)}px)`,
              }}
            />

            {/* Outer Bezel Knob */}
            <div
              style={{
                width: u(82),
                height: u(82),
                borderRadius: "50%",
                background: "linear-gradient(145deg, #ffffff 0%, #cbd5e1 50%, #64748b 100%)",
                border: `${u(3)}px solid ${isFire ? "rgba(251,146,60,0.8)" : "rgba(125,211,252,0.8)"}`,
                boxShadow: `
                  0 0 ${u(28)}px ${isFire ? "rgba(249,115,22,0.7)" : "rgba(56,189,248,0.7)"},
                  0 ${uh(8)}px ${u(20)}px rgba(0,0,0,0.7),
                  inset 0 2px 4px rgba(255,255,255,0.9),
                  inset 0 -2px 5px rgba(0,0,0,0.5)
                `,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Specular Highlight */}
              <div
                style={{
                  position: "absolute",
                  top: "4%",
                  left: "12%",
                  right: "12%",
                  height: "38%",
                  borderRadius: "50%",
                  background: "linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.05))",
                }}
              />

              {/* Inner Glowing Core Lens */}
              <div
                style={{
                  width: u(48),
                  height: u(48),
                  borderRadius: "50%",
                  background: isFire
                    ? "radial-gradient(circle at 35% 35%, #fef08a 0%, #f97316 55%, #b91c1c 100%)"
                    : "radial-gradient(circle at 35% 35%, #ffffff 0%, #38bdf8 55%, #1e3a8a 100%)",
                  boxShadow: isFire
                    ? `0 0 ${u(14)}px rgba(249,115,22,0.8), inset 0 1px 2px rgba(255,255,255,0.6)`
                    : `0 0 ${u(14)}px rgba(56,189,248,0.8), inset 0 1px 2px rgba(255,255,255,0.6)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 5,
                }}
              >
                {/* Vector SVG Icon */}
                {isFire ? (
                  <svg width={u(25)} height={u(25)} viewBox="0 0 24 24" fill="#ffffff" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}>
                    <path d="M12 2C12 2 6 8.5 6 13.5C6 16.5 7.5 19 10 20.5C10 20.5 9 17 12 14C15 17 14 20.5 14 20.5C16.5 19 18 16.5 18 13.5C18 8.5 12 2 12 2Z" />
                  </svg>
                ) : (
                  <svg width={u(23)} height={u(23)} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))" }}>
                    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
