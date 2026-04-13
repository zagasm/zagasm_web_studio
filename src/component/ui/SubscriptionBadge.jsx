import React from "react";
import { BadgeCheck } from "lucide-react";

export default function SubscriptionBadge({
  className = "",
  size,
  title = "Active subscription",
}) {
  return (
    <BadgeCheck
      aria-label={title}
      title={title}
      size={size}
      className={`tw:inline-block tw:shrink-0 tw:text-black ${className}`.trim()}
    />
  );
}
