import React from "react";
import BlurBackdrop from "../../component/landing/BlurBackdrop";
import ContactHero from "../../component/contact/ContactHero";
import ContactFormSection from "../../component/contact/ContactFormSection";
import ContactMetaSection from "../../component/contact/ContactMetaSection";

export default function ContactPage() {
  return (
    <div className="tw:relative tw:min-h-screen tw:overflow-hidden">
      <BlurBackdrop />

      <div className="tw:relative tw:z-10 tw:pt-10 tw:md:pt-24 tw:pb-20 tw:px-4">
        <div className="tw:mx-auto tw:max-w-6xl tw:space-y-14 tw:md:space-y-16">
          <ContactHero />
          <ContactFormSection />
          <ContactMetaSection />
        </div>
      </div>
    </div>
  );
}
