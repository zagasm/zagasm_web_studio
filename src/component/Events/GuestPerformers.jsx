import React from "react";
import userImg from "../../assets/navbar_icons/users.png";
import { randomAvatar } from "../../utils/ui";

export default function GuestPerformers({ performers = [] }) {
  return (
    <div className="tw:px-5 tw:md:px-7 tw:py-3">
      <div className="tw:flex tw:items-center tw:justify-between tw:bg-[#fafafa] tw:border tw:border-gray-100 tw:rounded-2xl tw:px-4 tw:py-3">
        <div className="tw:flex tw:items-center tw:gap-2">
          <span className="tw:text-sm tw:font-medium">Guest Performer(s)</span>
        </div>
        <div className="tw:flex tw:items-center tw:gap-3">
          {performers.length > 0 ? (
            performers.slice(0, 4).map((p, i) => (
              <div key={i} className="tw:flex tw:items-center tw:gap-2">
                <img
                  src={p.image_url || randomAvatar(p.name || i)}
                  alt={p.name}
                  className="tw:h-8 tw:w-8 tw:rounded-full tw:ring-2 tw:ring-white tw:object-cover"
                  title={p.name}
                />
                <span className="tw:text-[11px] tw:text-gray-600 tw:tracking-tight">
                  {p.name}
                </span>
              </div>
            ))
          ) : (
            <span>NIL</span>
          )}
        </div>
      </div>
    </div>
  );
}
