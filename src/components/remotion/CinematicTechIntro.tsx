"use client";

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";

export type CinematicTechIntroProps = {
  titleLine1: string;
  titleLine2: string;
  accentColor: string;
};

/* ─── Glitch slice ─── */
const GlitchSlice = ({
  text,
  top,
  clipY,
  clipH,
  offsetX,
  color,
  fontSize,
}: {
  text: string;
  top: number;
  clipY: number;
  clipH: number;
  offsetX: number;
  color: string;
  fontSize: number;
}) => (
  <div
    style={{
      position: "absolute",
      top,
      left: "50%",
      transform: `translateX(calc(-50% + ${offsetX}px))`,
      fontSize,
      fontWeight: 900,
      letterSpacing: "-0.03em",
      color,
      clipPath: `inset(${clipY}px 0 ${clipH}px 0)`,
      whiteSpace: "nowrap",
      lineHeight: 1,
    }}
  >
    {text}
  </div>
);

export const CinematicTechIntro: React.FC<CinematicTechIntroProps> = ({
  titleLine1 = "PRECISION",
  titleLine2 = "MOTION",
  accentColor = "#FFD100",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  /* ── Phase timing ── */
  const glitchEnd = 1.2 * fps;
  const revealStart = 0.3 * fps;
  const revealEnd = 1.5 * fps;
  const streakStart = 0.5 * fps;
  const subtitleStart = 1.8 * fps;

  /* ── Glitch effect (first 1.2s): pseudo-random offsets ── */
  const isGlitching = frame < glitchEnd;
  const glitchIntensity = isGlitching
    ? interpolate(frame, [0, glitchEnd], [1, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  // Deterministic "random" from frame
  const pseudoRand = (seed: number) =>
    Math.sin(seed * 12.9898 + frame * 78.233) * 43758.5453 % 1;
  const glitchX1 = pseudoRand(1) * 40 * glitchIntensity;
  const glitchX2 = pseudoRand(2) * -30 * glitchIntensity;
  const glitchX3 = pseudoRand(3) * 25 * glitchIntensity;

  /* ── Main text reveal ── */
  const textOpacity = interpolate(frame, [revealStart, revealEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const textScale = interpolate(frame, [revealStart, revealEnd], [0.85, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  /* ── Light streaks ── */
  const streak1X = interpolate(frame, [streakStart, streakStart + 0.4 * fps], [-100, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const streak1Opacity = interpolate(
    frame,
    [streakStart, streakStart + 0.15 * fps, streakStart + 0.4 * fps],
    [0, 0.9, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const streak2X = interpolate(
    frame,
    [streakStart + 0.15 * fps, streakStart + 0.6 * fps],
    [110, -110],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const streak2Opacity = interpolate(
    frame,
    [
      streakStart + 0.15 * fps,
      streakStart + 0.3 * fps,
      streakStart + 0.6 * fps,
    ],
    [0, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  /* ── Horizontal scan line ── */
  const scanY = interpolate(frame, [0, durationInFrames], [-10, 110], {
    extrapolateRight: "clamp",
  });

  /* ── Subtitle ── */
  const subOpacity = interpolate(
    frame,
    [subtitleStart, subtitleStart + 0.6 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const subY = interpolate(
    frame,
    [subtitleStart, subtitleStart + 0.6 * fps],
    [16, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }
  );

  /* ── Exit fade ── */
  const exitStart = durationInFrames - 0.5 * fps;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fontSize = 90;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080808",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      {/* Scan line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${scanY}%`,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`,
          boxShadow: `0 0 20px ${accentColor}40`,
        }}
      />

      {/* Light streaks */}
      <div
        style={{
          position: "absolute",
          top: "38%",
          left: `${streak1X}%`,
          width: 300,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
          opacity: streak1Opacity,
          filter: "blur(1px)",
          boxShadow: `0 0 30px ${accentColor}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "62%",
          left: `${streak2X}%`,
          width: 200,
          height: 2,
          background: `linear-gradient(90deg, transparent, #ffffff, transparent)`,
          opacity: streak2Opacity,
          filter: "blur(1px)",
          boxShadow: "0 0 20px #ffffff80",
        }}
      />

      {/* Title container */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Line 1 */}
        <div style={{ position: "relative", height: fontSize + 10, width: "100%" }}>
          {/* Glitch layers */}
          {isGlitching && (
            <>
              <GlitchSlice
                text={titleLine1}
                top={0}
                clipY={0}
                clipH={fontSize * 0.6}
                offsetX={glitchX1}
                color={`${accentColor}99`}
                fontSize={fontSize}
              />
              <GlitchSlice
                text={titleLine1}
                top={0}
                clipY={fontSize * 0.3}
                clipH={fontSize * 0.3}
                offsetX={glitchX2}
                color="#FF000077"
                fontSize={fontSize}
              />
              <GlitchSlice
                text={titleLine1}
                top={0}
                clipY={fontSize * 0.6}
                clipH={0}
                offsetX={glitchX3}
                color="#00FFFF55"
                fontSize={fontSize}
              />
            </>
          )}
          {/* Main text */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: `translateX(-50%) scale(${textScale})`,
              fontSize,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              opacity: textOpacity,
              whiteSpace: "nowrap",
              lineHeight: 1,
              textShadow: `0 0 40px ${accentColor}30`,
            }}
          >
            {titleLine1}
          </div>
        </div>

        {/* Line 2 */}
        <div style={{ position: "relative", height: fontSize + 10, width: "100%" }}>
          {isGlitching && (
            <>
              <GlitchSlice
                text={titleLine2}
                top={0}
                clipY={0}
                clipH={fontSize * 0.5}
                offsetX={glitchX2}
                color={`${accentColor}99`}
                fontSize={fontSize}
              />
              <GlitchSlice
                text={titleLine2}
                top={0}
                clipY={fontSize * 0.5}
                clipH={0}
                offsetX={glitchX1}
                color="#FF000066"
                fontSize={fontSize}
              />
            </>
          )}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: `translateX(-50%) scale(${textScale})`,
              fontSize,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              background: `linear-gradient(135deg, ${accentColor}, #FFFFFF)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              opacity: textOpacity,
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            {titleLine2}
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: `${accentColor}AA`,
            opacity: subOpacity,
            transform: `translateY(${subY}px)`,
            marginTop: 16,
          }}
        >
          By MotionAIx
        </div>
      </div>

      {/* Corner accents */}
      <div style={{ position: "absolute", top: 24, left: 24, width: 40, height: 40, borderTop: `2px solid ${accentColor}40`, borderLeft: `2px solid ${accentColor}40`, opacity: textOpacity }} />
      <div style={{ position: "absolute", top: 24, right: 24, width: 40, height: 40, borderTop: `2px solid ${accentColor}40`, borderRight: `2px solid ${accentColor}40`, opacity: textOpacity }} />
      <div style={{ position: "absolute", bottom: 24, left: 24, width: 40, height: 40, borderBottom: `2px solid ${accentColor}40`, borderLeft: `2px solid ${accentColor}40`, opacity: textOpacity }} />
      <div style={{ position: "absolute", bottom: 24, right: 24, width: 40, height: 40, borderBottom: `2px solid ${accentColor}40`, borderRight: `2px solid ${accentColor}40`, opacity: textOpacity }} />
    </AbsoluteFill>
  );
};
