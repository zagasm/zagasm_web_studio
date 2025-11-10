import React from "react";

export default function RecommendedSettings({ settings }) {
  if (!settings) return null;
  return (
    <div>
      <div className="tw:font-semibold tw:mb-2">Recommended Settings:</div>
      <div className="tw:rounded-2xl tw:bg-white tw:border tw:border-lightPurple tw:p-4 tw:space-y-1 tw:text-sm">
        {Object.entries(settings).map(([k, v]) => (
          <div key={k} className="tw:flex tw:justify-between tw:gap-4">
            <span className="tw:text-gray-600 tw:capitalize">
              {k.replaceAll("_", " ")}
            </span>
            <span className="tw:font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
