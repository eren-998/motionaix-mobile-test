"use client";

import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  AbsoluteFill,
} from "remotion";

/* ─── Props ─── */
export type SubscriberCountProps = {
  targetNumber: number;
  label: string;
  accentColor: string;
  bgColor: string;
};

/* ─── Helpers ─── */
const formatNumber = (n: number): string => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return Math.round(n).toLocaleString();
};

/* ─── Radial Pulse Ring ─── */
const PulseRing = ({ delay, color }: { delay: number; color: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - delay * fps);
  const cycle = (t / fps) % 2.5; // 2.5s loop
  const progress = Math.min(cycle / 1.8, 1);
  const scale = interpolate(progress, [0, 1], [0.6, 2.2], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 0.3, 1], [0, 0.35, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: "50%",
        border: `3px solid ${color}`,
        transform: `scale(${scale})`,
        opacity,
      }}
    />
  );
};

/* ─── Main Component ─── */
export const SubscriberCount: React.FC<SubscriberCountProps> = ({
  targetNumber = 100000,
  label = "Subscribers",
  accentColor = "#FFD100",
  bgColor = "#0D0D0D",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  /* ── Proportional count-up duration ── */
  const countDuration = Math.floor(durationInFrames * 0.7);
  const countProgress = interpolate(frame, [0, countDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const currentNumber = Math.round(countProgress * targetNumber);

  /* ── Number scale entrance ── */
  const scaleIn = interpolate(frame, [0, Math.floor(durationInFrames * 0.25)], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  /* ── Subtle bounce settle at the end of count ── */
  const settleFrame = countDuration;
  const bounceProgress =
    frame >= settleFrame
      ? interpolate(frame, [settleFrame, settleFrame + Math.floor(durationInFrames * 0.15)], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.sin),
        })
      : 0;
  const settleScale = frame >= settleFrame
    ? 1 + 0.06 * Math.sin(bounceProgress * Math.PI)
    : 1;

  /* ── Label fade + slide ── */
  const labelDelay = Math.floor(durationInFrames * 0.15);
  const labelOpacity = interpolate(frame, [labelDelay, labelDelay + Math.floor(durationInFrames * 0.2)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelY = interpolate(frame, [labelDelay, labelDelay + Math.floor(durationInFrames * 0.2)], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  /* ── Accent line width ── */
  const lineWidth = interpolate(frame, [Math.floor(durationInFrames * 0.1), Math.floor(durationInFrames * 0.45)], [0, 240], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  /* ── Exit fade (last 10% of frames) ── */
  const exitStart = Math.floor(durationInFrames * 0.9);
  const exitOpacity = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bgColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
        opacity: exitOpacity,
      }}
    >
      {/* Radial pulse rings */}
      <PulseRing delay={0} color={accentColor} />
      <PulseRing delay={0.8} color={accentColor} />
      <PulseRing delay={1.6} color={accentColor} />

      {/* Subtle radial glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* Content container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          zIndex: 10,
        }}
      >
        {/* Big number */}
        <div
          style={{
            fontSize: 140,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
            transform: `scale(${scaleIn * settleScale})`,
            lineHeight: 1,
            textShadow: `0 0 80px ${accentColor}40, 0 4px 20px rgba(0,0,0,0.5)`,
          }}
        >
          {formatNumber(currentNumber)}
        </div>

        {/* Accent line */}
        <div
          style={{
            height: 3,
            width: lineWidth,
            backgroundColor: accentColor,
            borderRadius: 2,
            boxShadow: `0 0 20px ${accentColor}60`,
          }}
        />

        {/* Label */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: `${accentColor}CC`,
            opacity: labelOpacity,
            transform: `translateY(${labelY}px)`,
            marginTop: 8,
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};
