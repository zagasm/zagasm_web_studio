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

export default function ZagasmLanding() {
  return (
    <div className="tw:relative tw:min-h-screen tw:overflow-hidden tw:text-gray-800 tw:bg-[#faf7ff]">
      <BlurBackdrop />

      <Nav />

      <main className="tw:relative tw:z-10 tw:mt-10 tw:md:mt-20">
        <Hero />
        <AutomationSection
          title="Let Zagasm do the busywork"
          subtitle="Record once. Auto-clip best moments, route RTMP to every platform, and log highlights to your CRM without leaving the player."
          ctaTo="/signup"
          ctaLabel="Start automating free"
          mediaSrc="/images/zagasm-automation.svg"
          mediaAlt="Automation workflow preview"
        />
        <AutomationSection
          title="Let Zagasm do the busywork"
          subtitle="Record once. Auto-clip best moments, route RTMP to every platform, and log highlights to your CRM without leaving the player."
          ctaTo="/signup"
          ctaLabel="Start automating free"
          mediaSrc="/images/cards.png"
          mediaAlt="Automation workflow preview"
          right
        />
        <ThreeStepSection />
        <Footer />
      </main>
    </div>
  );
}
