import React from "react";
import "./zagasm-landing.css";
import BlurBackdrop from "../../component/landing/BlurBackdrop";
import Nav from "../../component/landing/Nav";
import Hero from "../../component/landing/Hero";
import QuickFacts from "../../component/landing/QuickFacts";
import AutomationSection from "../../component/landing/AutomationSection";
import ThreeStepSection from "../../component/landing/ThreeStepSection";
import SectionFooterCTA from "../../component/landing/SectionFooterCTA";
import Footer from "../../component/landing/SectionFooterCTA";
import ThreeSplineIcon from "../../component/landing/ThreeSplineIcon";
import LiveHighlightsSection from "../../component/landing/LiveHighlightSection";
import LivePipelineSection from "../../component/landing/LivePipelineSection";

export default function ZagasmLanding() {
  return (
    <div className="tw:relative tw:min-h-screen tw:overflow-hidden tw:text-gray-800 tw:bg-[#faf7ff]">
      <BlurBackdrop />

      <Nav />

      <main className="tw:relative tw:z-10 tw:mt-10 tw:md:mt-20">
        <Hero />
        {/* <ThreeSplineIcon /> */}
        <AutomationSection
          title="Stream once. Zagasm does the rest"
          subtitle="Hit Go Live—Zagasm auto-clips verticals, adds captions & chapters, multistreams via RTMP to every platform, and logs your best moments to the CRM in real time."
          ctaTo="/auth/signup"
          ctaLabel="Start automating free"
          mediaSrc="/images/z1.png"
          mediaAlt="Auto-clip, multistream, and CRM logging powered by Zagasm"
        />

        <LiveHighlightsSection />

        <AutomationSection
          title="Turn live moments into momentum"
          subtitle="Queue replays, publish highlight cards, syndicate everywhere, and track conversions—without leaving the player. Less busywork, more impact."
          ctaTo="/auth/signup"
          ctaLabel="Start automating free"
          mediaSrc="/images/z2.png"
          mediaAlt="Highlight cards, replays, and cross-posting automation"
          right
        />

        <LivePipelineSection />

        <ThreeStepSection />
        <Footer />
      </main>
    </div>
  );
}
