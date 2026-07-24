import "../app/globals.css";
import { Composition } from "remotion";
import { SubscriberCount } from "../components/remotion/SubscriberCount";
import { CinematicTechIntro } from "../components/remotion/CinematicTechIntro";
import { NewsHeadlineHighlight } from "../components/remotion/NewsHeadlineHighlight";
import { ProductDemoLayout } from "../components/remotion/ProductDemoLayout";
import { EarthTravel } from "../components/remotion/EarthTravel";
import { EarningsRemotion } from "../components/remotion/EarningsRemotion";
import { FileDownloadRemotion } from "../components/remotion/FileDownloadRemotion";
import { FireSliderRemotion } from "../components/remotion/FireSliderRemotion";
import { FollowerRemotion } from "../components/remotion/FollowerRemotion";
import { GoalRemotion } from "../components/remotion/GoalRemotion";
import { RevealRemotion } from "../components/remotion/RevealRemotion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FireSliderRemotion"
        component={FireSliderRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ val: 85, mode: "fire" }}
      />
      <Composition
        id="EarningsRemotion"
        component={EarningsRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ val: "45800" }}
      />
      <Composition
        id="FileDownloadRemotion"
        component={FileDownloadRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ prog: 85, fileName: "Update.zip" }}
      />
      <Composition
        id="FollowerRemotion"
        component={FollowerRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ count: 299500, label: "Followers" }}
      />
      <Composition
        id="GoalRemotion"
        component={GoalRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ val: 82, title: "Target Tracker" }}
      />
      <Composition
        id="RevealRemotion"
        component={RevealRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ text: "MotionAIx", accentColor: "#38bdf8" }}
      />
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
