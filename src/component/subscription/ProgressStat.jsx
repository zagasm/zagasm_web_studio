import React from "react";
import { Check } from "lucide-react";
import { formatMoney } from "../../utils/pricingHelpers";

export default function ProgressStat({ label, value, target, ok, isMoney }) {
  const numericValue = Number(value) || 0;
  const numericTarget = Number(target) || 0;

  const ratio =
    numericTarget > 0 ? Math.min(1, numericValue / numericTarget) : 1;

  const displayValue = isMoney
    ? `₦${formatMoney(numericValue)}`
    : numericValue.toLocaleString();
  const displayTarget = isMoney
    ? `₦${formatMoney(numericTarget)}`
    : numericTarget.toLocaleString();

  return (
    <div className="tw:space-y-1">
      <div className="tw:flex tw:items-center tw:justify-between tw:text-[11px]">
        <span className="tw:text-white">{label}</span>
        <span className="tw:flex tw:items-center tw:gap-1">
          <span className="tw:text-white">
            {displayValue} / {displayTarget}
          </span>
          {ok && (
            <span className="tw:text-emerald-700 tw:bg-emerald-50 tw:px-1.5 tw:py-px tw:rounded-full tw:text-[9px] tw:flex tw:items-center tw:gap-1">
              <Check className="tw:w-3 tw:h-3" />
              <span>Done</span>
            </span>
          )}
        </span>
      </div>
      <div className="tw:h-1.5 tw:w-full tw:rounded-full tw:bg-slate-100 tw:overflow-hidden">
        <div
          className={`tw:h-full tw:rounded-full ${
            ok
              ? "tw:bg-emerald-500"
              : "tw:bg-linear-to-r tw:from-primary tw:to-primarySecond"
          } tw:transition-[width] tw:duration-700`}
          style={{ width: `${Math.min(100, ratio * 100)}%` }}
        />
      </div>
    </div>
  );
}
