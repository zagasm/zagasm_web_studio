import React from "react";
import { Sparkles, AlertTriangle } from "lucide-react";
import ProgressStat from "./ProgressStat";

export default function FreeEligibilityCard({ eligibility, loading }) {
  if (loading) {
    return (
      <div className="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-white tw:p-5 tw:space-y-3 tw:shadow-sm">
        <div className="tw:h-4 tw:w-32 tw:bg-slate-100 tw:rounded-full tw:animate-pulse" />
        <div className="tw:h-10 tw:w-full tw:bg-slate-100 tw:rounded-2xl tw:animate-pulse" />
        <div className="tw:h-3 tw:w-full tw:bg-slate-100 tw:rounded-full tw:animate-pulse" />
      </div>
    );
  }

  if (!eligibility) {
    return (
      <div className="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-linear-to-br tw:from-black tw:to-primary tw:p-5 tw:space-y-4 tw:shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
        <AlertTriangle className="tw:w-5 tw:h-5 tw:text-amber-500 tw:mt-0.5" />
        <div>
          <span className="tw:block tw:font-medium tw:text-white">
            Free cycles
          </span>
          <span className="tw:block tw:text-xs tw:mt-1 tw:text-white">
            Become an organiser to be eligible for free subscription time by
            hitting your targets.
          </span>
        </div>
      </div>
    );
  }

  const { cycle, metrics, requirements, conditions, score, eligible } =
    eligibility;

  const daysLeft = cycle?.days_left ?? 0;
  const totalWindowDays = daysLeft > 0 ? daysLeft + 1 : 28;
  const elapsedRatio = 1 - daysLeft / totalWindowDays;
  const timeProgress = Math.max(0, Math.min(1, elapsedRatio));

  const stats = [
    {
      label: "Events hosted",
      value: metrics?.events_count ?? 0,
      target: requirements?.min_events ?? 0,
      ok: conditions?.events_ok,
    },
    {
      label: "Paid tickets sold",
      value: metrics?.payments_count ?? 0,
      target: requirements?.min_payments_count ?? 0,
      ok: conditions?.payments_count_ok,
    },
    {
      label: "Total revenue",
      value: metrics?.payments_sum ?? 0,
      target: requirements?.min_revenue_sum ?? 0,
      ok: conditions?.revenue_ok,
      isMoney: true,
    },
    {
      label: "Closed events",
      value: metrics?.closed_events_count ?? 0,
      target: requirements?.min_closed_events ?? 0,
      ok: conditions?.closed_events_ok,
    },
  ];

  return (
    <div className="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-linear-to-br tw:from-black tw:to-primary tw:p-5 tw:space-y-4 tw:shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
      <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
        <div>
          <div className="tw:flex tw:items-center tw:gap-2">
            <span className="tw:inline-flex tw:size-8 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary/10 tw:border tw:border-primary/30">
              <Sparkles className="tw:w-4 tw:h-4 tw:text-primary" />
            </span>
            <div>
              <span className="tw:block tw:text-sm tw:font-semibold tw:text-white">
                Free-plan eligibility
              </span>
              <span className="tw:block tw:text-[11px] tw:text-white tw:mt-0.5">
                Hit your targets this cycle to unlock free subscription time.
              </span>
            </div>
          </div>
        </div>

        <div className="tw:text-right">
          <span
            className={`tw:inline-flex tw:px-2.5 tw:py-1 tw:rounded-full tw:text-[10px] tw:uppercase tw:tracking-[0.16em] ${
              eligible
                ? "tw:bg-emerald-50 tw:text-emerald-700 tw:border tw:border-emerald-200"
                : "tw:bg-slate-100 tw:text-slate-500 tw:border tw:border-slate-200"
            }`}
          >
            {eligible ? "Eligible" : "In progress"}
          </span>
          <span className="tw:block tw:text-[11px] tw:text-white tw:mt-1">
            Score:{" "}
            <span className="tw:font-semibold tw:text-white">
              {score ?? 0}
            </span>
          </span>
        </div>
      </div>

      {/* Timeline / days left */}
      {cycle && (
        <div className="tw:text-[11px] tw:text-white">
          <div className="tw:flex tw:items-center tw:justify-between tw:mb-1">
            <span>Current cycle</span>
            <span>
              {Math.round(daysLeft)} day
              {Math.round(daysLeft) === 1 ? "" : "s"} left
            </span>
          </div>
          <div className="tw:h-1.5 tw:w-full tw:rounded-full tw:bg-slate-100 tw:overflow-hidden">
            <div
              className="tw:h-full tw:rounded-full tw:bg-linear-to-r tw:from-primary tw:to-primarySecond tw:transition-[width] tw:duration-700"
              style={{ width: `${Math.min(100, timeProgress * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="tw:space-y-3 tw:mt-3">
        {stats.map((stat) => (
          <ProgressStat key={stat.label} {...stat} />
        ))}
      </div>

      <span className="tw:block tw:text-[11px] tw:text-white tw:mt-1">
        Once all requirements are marked complete before the cycle closes,
        you’ll automatically qualify for a free period on eligible plans.
      </span>
    </div>
  );
}
