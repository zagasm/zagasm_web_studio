import React from "react";
import AboutHeroSection from "../../component/about/AboutHeroSection";
import AboutPipelineSection from "../../component/about/AboutPipelineSection";
import AboutEcosystemSection from "../../component/about/AboutEcosystemSection";
import AboutFaqSection from "../../component/about/AboutFaqSection";
import BlurBackdrop from "../../component/landing/BlurBackdrop";

export default function AboutPage() {
  return (
    <div className="tw:relative tw:overflow-hidden tw:min-h-screen">
      <BlurBackdrop />

      <div className="tw:mx-auto tw:max-w-6xl tw:px-5 tw:py-16 tw:md:py-20 tw:space-y-16 tw:md:space-y-20">
        <AboutHeroSection />
        <AboutPipelineSection />
        <AboutEcosystemSection />
        <AboutFaqSection />
      </div>
    </div>
  );
}
