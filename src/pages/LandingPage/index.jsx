import React, { useEffect, useState } from "react";
import "./zagasm-landing.css";
import BlurBackdrop from "../../component/landing/BlurBackdrop";
import Hero from "../../component/landing/Hero";
import AutomationSection from "../../component/landing/AutomationSection";
import ThreeStepSection from "../../component/landing/ThreeStepSection";
import LiveHighlightsSection from "../../component/landing/LiveHighlightSection";
import LivePipelineSection from "../../component/landing/LivePipelineSection";

export default function ZagasmLanding() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 250);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="tw:relative tw:min-h-screen tw:overflow-hidden">
      <BlurBackdrop />

      <div className="tw:relative tw:z-10 tw:pt-8 tw:md:pt-52">
        <Hero />

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
      </div>

      {showBackToTop && (
        <button
          style={{ borderRadius: "50%" }}
          type="button"
          onClick={scrollToTop}
          aria-label="Back to top"
          className="tw:fixed tw:bottom-6 tw:right-6 tw:z-50 tw:flex tw:h-11 tw:w-11 tw:items-center tw:justify-center tw:rounded-full tw:bg-primary tw:text-white tw:shadow-[0_18px_40px_rgba(0,0,0,0.25)] tw:transition tw:hover:scale-105 tw:hover:shadow-[0_22px_55px_rgba(0,0,0,0.3)] tw:focus-visible:tw:outline-none tw:focus-visible:tw:ring-2 tw:focus-visible:tw:ring-primarySecond tw:focus-visible:tw:ring-offset-2 tw:focus-visible:tw:ring-offset-[#faf7ff]"
        >
          <span className="tw:-mt-0.5 tw:text-lg">↑</span>
        </button>
      )}
    </div>
  );
}
