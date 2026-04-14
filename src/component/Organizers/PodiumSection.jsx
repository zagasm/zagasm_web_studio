import React from "react";
import PodiumCard from "./PodiumCard";

export default function PodiumSection({
  top3 = [],
  onToggleFollow,
}) {
  return (
    <div className="tw:relative tw:rounded-3xl tw:bg-white">
      <div className="tw:grid tw:grid-cols-3 tw:items-stretch tw:gap-2 tw:py-2 tw:sm:gap-4 tw:md:gap-6">
        <div className="tw:flex tw:justify-center">
          {top3[1] ? (
            <PodiumCard
              org={top3[1]}
              position={2}
              onToggleFollow={onToggleFollow}
            />
          ) : null}
        </div>

        <div className="tw:flex tw:justify-center">
          {top3[0] ? (
            <PodiumCard
              org={top3[0]}
              position={1}
              onToggleFollow={onToggleFollow}
            />
          ) : null}
        </div>

        <div className="tw:flex tw:justify-center">
          {top3[2] ? (
            <PodiumCard
              org={top3[2]}
              position={3}
              onToggleFollow={onToggleFollow}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
