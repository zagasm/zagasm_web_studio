import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../component/landing/Nav";
import SectionFooterCTA from "../component/landing/SectionFooterCTA";

export default function LandingLayout() {
  return (
    <div className="tw:min-h-screen tw:bg-[#faf7ff] tw:text-gray-800 tw:flex tw:flex-col">
      {/* Top navigation */}
      <Nav />

      {/* Page content */}
      <main className="tw:flex-1 tw:pt-20">
        <Outlet />
      </main>

      {/* Global footer */}
      <SectionFooterCTA />
    </div>
  );
}
