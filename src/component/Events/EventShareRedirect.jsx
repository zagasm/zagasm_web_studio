import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EventShareRedirect() {
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    if (!slug) return;

    // Redirect to your main event details route
    // ViewEvent will detect it's a slug and call the slug endpoint
    navigate(`/event/view/${slug}`, { replace: true });
  }, [slug, navigate]);

  return (
    <div className="tw:font-sans tw:min-h-[60vh] tw:flex tw:items-center tw:justify-center tw:bg-[#F5F5F7]">
      <div className="tw:flex tw:flex-col tw:items-center tw:gap-3">
        <div className="tw:h-8 tw:w-8 tw:border-2 tw:border-primary/30 tw:border-t-primary tw:rounded-full tw:animate-spin" />
        <span className="tw:text-sm tw:text-gray-600">Opening event…</span>
      </div>
    </div>
  );
}
