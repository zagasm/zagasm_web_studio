import React from "react";
import { Helmet } from "react-helmet-async";
import HeroBanner from "../../component/dataProtection/HeroBanner";
import RequestFormCard from "../../component/dataProtection/RequestFormCard";
import RightsGrid from "../../component/dataProtection/RightsGrid";
import ProcessSteps from "../../component/dataProtection/ProcessSteps";
import DataFormatList from "../../component/dataProtection/DataFormatList";
import DeleteAccountBox from "../../component/dataProtection/DeleteAccountBox";
import ContactBox from "../../component/dataProtection/ContactBox";
import FooterBlurb from "../../component/dataProtection/FooterBlurb";
import { ToastHost } from "../../component/ui/toast";
import { Link } from "react-router-dom";

export default function DataProtectionPage() {
  return (
    <main className="tw:min-h-screen tw:bg-white tw:text-gray-900 tw:font-sans">
      <Helmet>
        <title>Data Protection & Privacy Rights — Zagasm Studios</title>
      </Helmet>

      <div className="tw:relative tw:z-10 tw:max-w-7xl tw:mx-auto tw:px-4 tw:md:px-6 lg:tw:px-8 tw:py-5 tw:flex tw:items-center tw:justify-between">
        <Link to="/" className="tw:inline-flex tw:items-center tw:gap-3">
          <img
            src="/images/logo.png"
            alt="Zagasm Studio"
            className="tw:w-[100px] tw:md:w-[150px]"
          />
        </Link>

        <Link
          to="/auth/signin"
          className="tw:inline-flex tw:items-center tw:gap-2 tw:bg-primary tw:hover:bg-primary/80 text-white tw:px-5 tw:md:px-8 tw:py-3 tw:rounded-full tw:font-medium tw:shadow-sm hover:tw:shadow tw:transition-all tw:duration-300"
        >
          Get Started
        </Link>
      </div>

      <section className="tw:max-w-5xl tw:mx-auto tw:px-4 tw:py-6 tw:sm:py-10">
        <div className="tw:text-3xl tw:sm:text-4xl tw:font-semibold tw:tracking-tight">
          Data Protection &amp; Privacy Rights
        </div>
        <div className="tw:text-sm tw:text-gray-500 tw:mt-1">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </section>

      <HeroBanner />

      <section className="tw:max-w-5xl tw:mx-auto tw:px-4 tw:py-10">
        <div className="tw:mb-10">
          <span className="tw:text-xl tw:sm:text-2xl tw:font-semibold">
            Request Your Account Information
          </span>
          <span className=" tw:block tw:mt-2 tw:text-gray-600">
            In line with global and African data protection standards (e.g.,
            GDPR/CCPA/local regulations), you can request a copy of the personal
            data we process while you use Zagasm Studios across{" "}
            <span className="tw:font-medium">Live</span>,{" "}
            <span className="tw:font-medium">Events</span>,{" "}
            <span className="tw:font-medium">Creators</span>,{" "}chat and other
            modules.
          </span>
          <ul className="tw:list-disc tw:pl-6 tw:mt-4 tw:space-y-1 tw:text-gray-700">
            <li>Profile and account settings</li>
            <li>Streams, events, posts, comments, and reactions</li>
            <li>Uploaded media (thumbnails, clips, posters)</li>
            <li>Messages, chat activity and community interactions</li>
            <li>Creator earnings, payouts, tickets and invoices</li>
            <li>Security and login activity logs</li>
          </ul>
        </div>

        <RequestFormCard />

        <RightsGrid />

        <ProcessSteps />

        <DataFormatList />

        <DeleteAccountBox />

        <ContactBox />
      </section>

      <FooterBlurb />
    </main>
  );
}
