import React from "react";
import { Clock, ShieldCheck } from "lucide-react";

export default function QuickFacts() {
  return (
    <div className="tw:mt-2 tw:flex tw:flex-wrap tw:items-center tw:justify-center tw:gap-x-8 tw:gap-y-2 tw:text-sm tw:text-gray-600 tw:animate-fadeUp tw:animation-delay-300">
      <span className="tw:inline-flex tw:items-center tw:gap-2">
        <Clock size={16} /> 7 min setup
      </span>
      <span className="tw:inline-flex tw:items-center tw:gap-2">
        <ShieldCheck size={16} /> GDPR compliant
      </span>
    </div>
  );
}
