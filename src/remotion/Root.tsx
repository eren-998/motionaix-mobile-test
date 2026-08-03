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
import { IncomingCallRemotion } from "../components/remotion/IncomingCallRemotion";
import { BatteryChargeRemotion } from "../components/remotion/BatteryChargeRemotion";

import { FolderRemotion } from "../components/remotion/FolderRemotion";
import { SubscribeRemotion } from "../components/remotion/SubscribeRemotion";
import { IosNotificationRemotion } from "../components/remotion/IosNotificationRemotion";
import { NewsArticleRemotion } from "../components/remotion/NewsArticleRemotion";
import { ChartEngineRemotion } from "../components/remotion/ChartEngineRemotion";
import { YoutubeOdometerRemotion } from "../components/remotion/YoutubeOdometerRemotion";
import { InstagramOdometerRemotion } from "../components/remotion/InstagramOdometerRemotion";

import { HalftoneRemotion } from "../components/remotion/HalftoneRemotion";
import { Sprite16Remotion } from "../components/remotion/Sprite16Remotion";
import { PunkCollageRemotion } from "../components/remotion/PunkCollageRemotion";
import { FatPixelRemotion } from "../components/remotion/FatPixelRemotion";
import { BootlegRemotion } from "../components/remotion/BootlegRemotion";
import { AsciiRemotion } from "../components/remotion/AsciiRemotion";
import { CmykRemotion } from "../components/remotion/CmykRemotion";
import { TeletextRemotion } from "../components/remotion/TeletextRemotion";
import { DitherRemotion } from "../components/remotion/DitherRemotion";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FolderRemotion"
        component={FolderRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          folderTitle: "Projects",
          filesCount: "318 Files",
          lastUpdated: "Last added time Oct 13, 2025",
          card1Title: "ui_mockup.png",
          card2Title: "hero_render.mp4",
          card3Title: "analytics.json",
        }}
      />
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
      <Composition
        id="IncomingCallRemotion"
        component={IncomingCallRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          callerName: "Claude Code",
          subtitle: "incoming call...",
        }}
      />
      <Composition
        id="BatteryChargeRemotion"
        component={BatteryChargeRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          targetPercentage: 78,
          label: "CHARGING",
        }}
      />

      {/* ── Converted from Framer Motion demos ── */}
      <Composition
        id="SubscribeRemotion"
        component={SubscribeRemotion}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          channelName: "Motionaix",
          handle: "@motionaix",
          subCount: "1.2M subscribers",
        }}
      />
      <Composition
        id="IosNotificationRemotion"
        component={IosNotificationRemotion}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          appName: "Messages",
          notiTitle: "Sarah Jenkins",
          notiMessage: "Are we still meeting at Blue Bottle Coffee at 5? ☕",
          notiTime: "now",
        }}
      />
      <Composition
        id="NewsArticleRemotion"
        component={NewsArticleRemotion}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          channelName: "THE HINDU",
          headline: "Trump signs order seeking to overhaul U.S. elections, including requiring {proof of citizenship}",
          date: "Published - March 26, 2026 07:38 am",
          body: "President Donald Trump signed a sweeping executive action to overhaul elections in the U.S. on Tuesday (March 25, 2026), including requiring {documentary proof} of citizenship to register to vote in federal elections.",
          highlightColor: "#FFF04D",
          textColor: "#000000",
          glowIntensity: 0,
          paperStyle: "vintage",
        }}
      />
      <Composition
        id="ChartEngineRemotion"
        component={ChartEngineRemotion}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: "REVENUE GROWTH",
          subtitle: "Q1 - Q4 Fiscal Year 2026",
          data: [
            { id: 1, label: "2023", value: 45, desc: "Initial Stage", color: "#E4E4E7" },
            { id: 2, label: "2024", value: 30, desc: "Market Dip", color: "#E4E4E7" },
            { id: 3, label: "2025", value: 85, desc: "Recovery", color: "#E4E4E7" },
            { id: 4, label: "2026", value: 140, desc: "Massive Scale", color: "#3B82F6" },
          ],
          yAxisGap: 20,
          yAxisMinLines: 5,
          showInsight: true,
          insightAnim: true,
          insightPosition: "TR",
          insightTitle: "Key Insight",
          insightText: "With a peak value reaching 140 during the 2026 phase, the metric indicates sustained scaling capabilities.",
        }}
      />
      <Composition
        id="YoutubeOdometerRemotion"
        component={YoutubeOdometerRemotion}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          channelName: "Motionaix",
          handle: "@motionaix",
          baseCount: 124000,
        }}
      />
      <Composition
        id="InstagramOdometerRemotion"
        component={InstagramOdometerRemotion}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          channelName: "Aesthetic Vibes",
          baseCount: 124000,
          igPosts: "1,204",
          igFollowing: "42",
          igCategory: "Digital Creator",
          igBio: "Creating visual experiences ✨\nCheck out the link below 👇",
          igLink: "linktr.ee/aestheticvibes",
        }}
      />
      <Composition
        id="HalftoneRemotion"
        component={HalftoneRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          mode: "image",
          imageUrl: "/demo-artwork.jpg",
          dotSize: 10,
          angle: 45,
          contrast: 1.6,
          whiteCutoff: 0.85,
          bgTint: "#1233e6",
        }}
      />
      <Composition
        id="Sprite16Remotion"
        component={Sprite16Remotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          imageUrl: "/demo-artwork.jpg",
          pixelSize: 12,
          colorCount: 16,
          outline: true,
          scanlines: true,
        }}
      />
      <Composition
        id="PunkCollageRemotion"
        component={PunkCollageRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          imageUrl: "/demo-artwork.jpg",
          threshold: 120,
          paperColor: "#ff0066",
          tapeColor: "#ccff00",
        }}
      />
      <Composition
        id="FatPixelRemotion"
        component={FatPixelRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          imageUrl: "/demo-artwork.jpg",
          blockSize: 18,
          posterize: 5,
        }}
      />
      <Composition
        id="BootlegRemotion"
        component={BootlegRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          imageUrl: "/demo-artwork.jpg",
          pixelSize: 12,
          colorShift: true,
          edgeOutline: true,
        }}
      />
      <Composition
        id="AsciiRemotion"
        component={AsciiRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          imageUrl: "/demo-artwork.jpg",
          charSize: 10,
          colorMode: "green",
        }}
      />
      <Composition
        id="CmykRemotion"
        component={CmykRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          imageUrl: "/demo-artwork.jpg",
          dotSize: 8,
          contrast: 1.3,
        }}
      />
      <Composition
        id="TeletextRemotion"
        component={TeletextRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          imageUrl: "/demo-artwork.jpg",
          gridSize: 14,
          scanlines: true,
        }}
      />
      <Composition
        id="DitherRemotion"
        component={DitherRemotion}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          imageUrl: "/demo-artwork.jpg",
          scale: 2,
          fgColor: "#000000",
          bgColor: "#ffffff",
        }}
      />
    </>
  );
};
