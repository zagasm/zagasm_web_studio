import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../component/landing/Nav";
import SectionFooterCTA from "../component/landing/SectionFooterCTA";

export default function LandingLayout() {
  return (
    <>
      <div className="tw:min-h-screen tw:max-w-full tw:overflow-x-clip">

        {/* Top navigation */}
        <Nav />

        {/* Page content */}
        <main className="tw:flex-1 tw:lg:pt-20">
          <Outlet />
        </main>

        {/* Global footer */}
        <SectionFooterCTA />
      </div>
    </>
  );
}
