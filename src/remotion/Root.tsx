import { Composition } from "remotion";
import { SubscriberCount } from "../components/remotion/SubscriberCount";
import { CinematicTechIntro } from "../components/remotion/CinematicTechIntro";
import { NewsHeadlineHighlight } from "../components/remotion/NewsHeadlineHighlight";
import { ProductDemoLayout } from "../components/remotion/ProductDemoLayout";
import { EarthTravel } from "../components/remotion/EarthTravel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Earth Travel (3D Globe Flight) ── */}
      <Composition
        id="EarthTravel"
        component={EarthTravel}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          origin: "mumbai",
          destination: "tokyo",
        }}
      />

      <Composition
        id="SubscriberCount"
        component={SubscriberCount}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          targetNumber: 100000,
          label: "Subscribers",
          accentColor: "#FFD100",
          bgColor: "#0D0D0D",
        }}
      />
      <Composition
        id="CinematicTechIntro"
        component={CinematicTechIntro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          titleLine1: "PRECISION",
          titleLine2: "MOTION",
          accentColor: "#FFD100",
        }}
      />
      <Composition
        id="NewsHeadlineHighlight"
        component={NewsHeadlineHighlight}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          headline: "OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities",
          highlightWords: ["Revolutionary", "Reasoning", "Capabilities"],
          accentColor: "#FFD100",
          source: "TechCrunch",
        }}
      />
      <Composition
        id="ProductDemoLayout"
        component={ProductDemoLayout}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          productName: "MotionAIx",
          tagline: "Motion graphics for everyone",
          features: [
            "Ready-made templates",
            "One-click export",
            "Custom branding",
            "Browser-based editor",
          ],
          accentColor: "#FFD100",
        }}
      />
    </>
  );
};
