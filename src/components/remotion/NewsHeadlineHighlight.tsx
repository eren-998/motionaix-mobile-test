"use client";

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";

export type NewsHeadlineHighlightProps = {
  headline: string;
  highlightWords: string[];
  accentColor: string;
  source: string;
};

export const NewsHeadlineHighlight: React.FC<NewsHeadlineHighlightProps> = ({
  headline = "OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities",
  highlightWords = ["Revolutionary", "Reasoning", "Capabilities"],
  accentColor = "#FFD100",
  source = "TechCrunch",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  /* ── Article card slide-in ── */
  const cardSlideY = interpolate(frame, [0, 0.8 * fps], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const cardOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Magnifying glass sweep ── */
  const sweepStart = 1.0 * fps;
  const sweepEnd = 2.5 * fps;
  const magX = interpolate(frame, [sweepStart, sweepEnd], [-15, 105], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const magOpacity = interpolate(
    frame,
    [sweepStart, sweepStart + 0.2 * fps, sweepEnd - 0.3 * fps, sweepEnd],
    [0, 0.85, 0.85, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  /* ── Word highlighting (staggered) ── */
  const highlightStagger = 0.4 * fps;
  const highlightStart = 1.5 * fps;

  /* ── Source badge ── */
  const badgeDelay = 0.3 * fps;
  const badgeOpacity = interpolate(frame, [badgeDelay, badgeDelay + 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const badgeX = interpolate(frame, [badgeDelay, badgeDelay + 0.5 * fps], [-20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  /* ── Decorative elements ── */
  const lineWidth = interpolate(frame, [0.5 * fps, 1.5 * fps], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  /* ── Exit ── */
  const exitStart = durationInFrames - 0.5 * fps;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Render headline words with highlight ── */
  const words = headline.split(" ");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0A0A0A",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
        overflow: "hidden",
      }}
    >
      {/* Background texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.015) 40px, rgba(255,255,255,0.015) 41px)",
        }}
      />

      {/* Article card */}
      <div
        style={{
          width: "82%",
          maxWidth: 820,
          backgroundColor: "#141414",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "48px 52px",
          transform: `translateY(${cardSlideY}px)`,
          opacity: cardOpacity,
          position: "relative",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Source badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
            opacity: badgeOpacity,
            transform: `translateX(${badgeX}px)`,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: accentColor,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: accentColor,
            }}
          >
            {source}
          </span>
          <div
            style={{
              height: 1,
              width: `${lineWidth}%`,
              backgroundColor: `${accentColor}30`,
            }}
          />
        </div>

        {/* Headline */}
        <h2
          style={{
            fontSize: 42,
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            color: "#FFFFFF",
            margin: 0,
          }}
        >
          {words.map((word, i) => {
            const isHighlighted = highlightWords.some(
              (hw) => word.toLowerCase().includes(hw.toLowerCase())
            );
            const highlightIndex = isHighlighted
              ? highlightWords.findIndex((hw) =>
                  word.toLowerCase().includes(hw.toLowerCase())
                )
              : -1;

            // Highlight background wipe
            const wordStart = highlightStart + highlightIndex * highlightStagger;
            const hlProgress = isHighlighted
              ? interpolate(frame, [wordStart, wordStart + 0.4 * fps], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.quad),
                })
              : 0;

            return (
              <span key={i} style={{ position: "relative", display: "inline" }}>
                {isHighlighted && (
                  <span
                    style={{
                      position: "absolute",
                      left: -4,
                      right: -4,
                      top: 2,
                      bottom: 2,
                      background: `${accentColor}25`,
                      borderRadius: 4,
                      transform: `scaleX(${hlProgress})`,
                      transformOrigin: "left",
                    }}
                  />
                )}
                <span
                  style={{
                    position: "relative",
                    color: isHighlighted && hlProgress > 0.5 ? accentColor : "#FFFFFF",
                  }}
                >
                  {word}
                </span>
                {" "}
              </span>
            );
          })}
        </h2>

        {/* Fake article lines */}
        <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
          {[85, 92, 70, 60].map((w, i) => {
            const lineDelay = 0.6 * fps + i * 0.1 * fps;
            const lineOp = interpolate(frame, [lineDelay, lineDelay + 0.3 * fps], [0, 0.2], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  height: 8,
                  width: `${w}%`,
                  backgroundColor: "#FFFFFF",
                  borderRadius: 4,
                  opacity: lineOp,
                }}
              />
            );
          })}
        </div>

        {/* Magnifying glass */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: `${magX}%`,
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `3px solid ${accentColor}`,
            boxShadow: `0 0 30px ${accentColor}40, inset 0 0 20px ${accentColor}10`,
            opacity: magOpacity,
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Handle */}
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: -16,
              width: 4,
              height: 28,
              backgroundColor: accentColor,
              borderRadius: 2,
              transform: "rotate(-45deg)",
              transformOrigin: "top center",
              boxShadow: `0 0 10px ${accentColor}60`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
