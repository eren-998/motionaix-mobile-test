"use client";

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";

export type ProductDemoLayoutProps = {
  productName: string;
  tagline: string;
  features: string[];
  accentColor: string;
};

export const ProductDemoLayout: React.FC<ProductDemoLayoutProps> = ({
  productName = "MotionAIx",
  tagline = "Motion graphics for everyone",
  features = [
    "Ready-made templates",
    "One-click export",
    "Custom branding",
    "Browser-based editor",
  ],
  accentColor = "#FFD100",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  /* ── Left panel (product mockup) slide-in ── */
  const panelX = interpolate(frame, [0, 0.8 * fps], [-60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const panelOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  /* ── Right panel heading ── */
  const headDelay = 0.3 * fps;
  const headOpacity = interpolate(frame, [headDelay, headDelay + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headY = interpolate(frame, [headDelay, headDelay + 0.6 * fps], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  /* ── Feature bullets stagger ── */
  const featureStart = 0.7 * fps;
  const featureStagger = 0.25 * fps;

  /* ── Decorative border line ── */
  const borderHeight = interpolate(frame, [0.4 * fps, 1.5 * fps], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  /* ── Floating dots (decorative) ── */
  const dot1Y = interpolate(frame, [0, durationInFrames], [0, -30], {
    extrapolateRight: "clamp",
  });
  const dot2Y = interpolate(frame, [0, durationInFrames], [0, 20], {
    extrapolateRight: "clamp",
  });

  /* ── Exit ── */
  const exitStart = durationInFrames - 0.5 * fps;
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0B0B0B",
        fontFamily: "Inter, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
        overflow: "hidden",
      }}
    >
      {/* Subtle gradient blob */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`,
          filter: "blur(80px)",
        }}
      />

      {/* Main split layout */}
      <div
        style={{
          display: "flex",
          width: "86%",
          maxWidth: 920,
          gap: 48,
          alignItems: "center",
        }}
      >
        {/* LEFT — Product mockup */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${panelX}px)`,
            opacity: panelOpacity,
          }}
        >
          <div
            style={{
              width: "100%",
              aspectRatio: "4/3",
              borderRadius: 20,
              backgroundColor: "#181818",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Browser bar */}
            <div
              style={{
                height: 36,
                backgroundColor: "#222",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 14px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FF5F57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FEBC2E" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#28C840" }} />
              <div style={{ flex: 1, height: 16, backgroundColor: "#333", borderRadius: 8, marginLeft: 12 }} />
            </div>
            {/* Content area */}
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: 24,
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    background: `linear-gradient(135deg, ${accentColor}, #FFFFFF)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {productName}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginTop: 8,
                  }}
                >
                  {tagline}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider line */}
        <div
          style={{
            width: 2,
            height: `${borderHeight}%`,
            maxHeight: 280,
            background: `linear-gradient(180deg, transparent, ${accentColor}60, transparent)`,
            borderRadius: 1,
          }}
        />

        {/* RIGHT — Features */}
        <div style={{ flex: 1 }}>
          {/* Title */}
          <div
            style={{
              opacity: headOpacity,
              transform: `translateY(${headY}px)`,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: accentColor,
                marginBottom: 12,
              }}
            >
              Features
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 800,
                color: "#FFFFFF",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              Everything you need
            </div>
          </div>

          {/* Feature bullets */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {features.map((feature, i) => {
              const fStart = featureStart + i * featureStagger;
              const fOpacity = interpolate(frame, [fStart, fStart + 0.4 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const fX = interpolate(frame, [fStart, fStart + 0.5 * fps], [30, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.quad),
              });
              const checkScale = interpolate(
                frame,
                [fStart + 0.2 * fps, fStart + 0.5 * fps],
                [0, 1],
                {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.exp),
                }
              );

              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    opacity: fOpacity,
                    transform: `translateX(${fX}px)`,
                  }}
                >
                  {/* Check icon */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: `${accentColor}18`,
                      border: `1px solid ${accentColor}40`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transform: `scale(${checkScale})`,
                      flexShrink: 0,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M3 7L6 10L11 4"
                        stroke={accentColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    {feature}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Floating dots */}
          <div
            style={{
              position: "absolute",
              top: "15%",
              right: "8%",
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: `${accentColor}40`,
              transform: `translateY(${dot1Y}px)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "20%",
              right: "15%",
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: `${accentColor}25`,
              transform: `translateY(${dot2Y}px)`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
