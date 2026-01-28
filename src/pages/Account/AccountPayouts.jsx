import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  CalendarDays,
  Ticket,
  TrendingUp,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../../pages/auth/AuthContext";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const formatMoney = (value, symbol = "₦") => {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return `${symbol}0.00`;
  return `${symbol}${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const safeSymbol = (event) => event?.currency?.symbol || "₦";

const PageShell = ({ title, subtitle, children }) => (
  <div className="tw:w-full tw:pt-6 tw:md:pt-10 tw:pb-16">
    <div className="tw:mb-5 tw:flex tw:items-start tw:justify-between tw:gap-3">
      <div>
        <h1 className="tw:text-xl tw:md:text-2xl tw:font-bold tw:text-gray-900">
          {title}
        </h1>
        {subtitle ? (
          <span className="tw:mt-1 tw:text-sm tw:text-gray-500">{subtitle}</span>
        ) : null}
      </div>
    </div>
    {children}
  </div>
);

const SkeletonBlock = ({ className }) => (
  <div
    className={cx("tw:animate-pulse tw:bg-gray-200 tw:rounded-2xl", className)}
  />
);

const StatsSkeleton = () => (
  <div className="tw:grid tw:grid-cols-2 tw:md:grid-cols-4 tw:gap-3 tw:md:gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="tw:bg-white tw:rounded-3xl tw:p-4 tw:shadow-sm">
        <SkeletonBlock className="tw:h-4 tw:w-24" />
        <SkeletonBlock className="tw:mt-3 tw:h-7 tw:w-32" />
        <SkeletonBlock className="tw:mt-3 tw:h-3 tw:w-20" />
      </div>
    ))}
  </div>
);

const ListSkeleton = () => (
  <div className="tw:mt-4 tw:space-y-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="tw:bg-white tw:rounded-3xl tw:p-4 tw:shadow-sm tw:flex tw:items-center tw:gap-4"
      >
        <SkeletonBlock className="tw:h-14 tw:w-14 tw:rounded-2xl" />
        <div className="tw:flex-1">
          <SkeletonBlock className="tw:h-4 tw:w-44" />
          <SkeletonBlock className="tw:mt-2 tw:h-3 tw:w-72 tw:max-w-full" />
          <SkeletonBlock className="tw:mt-2 tw:h-3 tw:w-40" />
        </div>
        <SkeletonBlock className="tw:h-8 tw:w-20 tw:rounded-2xl" />
      </div>
    ))}
  </div>
);

const StatCard = ({ icon: Icon, label, value, hint }) => (
  <div className="tw:bg-white tw:rounded-3xl tw:p-4 tw:shadow-sm">
    <div className="tw:flex tw:items-center tw:justify-between">
      <span className="tw:text-sm tw:text-gray-500">{label}</span>
      {Icon ? <Icon className="tw:w-4 tw:h-4 tw:text-gray-400" /> : null}
    </div>
    <div className="tw:mt-2 tw:text-lg tw:md:text-xl tw:font-bold tw:text-gray-900">
      {value}
    </div>
    {hint ? (
      <div className="tw:mt-1 tw:text-xs tw:text-gray-500">{hint}</div>
    ) : null}
  </div>
);

const EventRow = ({ e }) => {
  const symbol = safeSymbol(e);
  const payout = e?.payout || {};
  const posterUrl = e?.poster?.[0]?.url;

  return (
    <div className="tw:bg-white tw:rounded-3xl tw:p-4 tw:shadow-sm tw:flex tw:flex-col tw:md:flex-row tw:md:items-center tw:gap-4">
      <div className="tw:flex tw:items-center tw:gap-4 tw:min-w-0">
        <div className="tw:size-14 tw:md:size-32 tw:rounded-2xl tw:bg-gray-100 tw:overflow-hidden tw:flex tw:items-center tw:justify-center tw:shrink-0">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={e?.title || "Event poster"}
              className="tw:h-full tw:w-full tw:object-cover"
              loading="lazy"
            />
          ) : (
            <CalendarDays className="tw:w-5 tw:h-5 tw:text-gray-400" />
          )}
        </div>

        <div className="tw:min-w-0">
          <div className="tw:flex tw:items-center tw:gap-2 tw:flex-wrap">
            <span className="tw:font-semibold tw:text-gray-900 tw:truncate tw:max-w-[72vw] tw:md:max-w-[420px]">
              {e?.title || "Untitled event"}
            </span>
            <span
              className={cx(
                "tw:text-xs tw:px-2 tw:py-1 tw:rounded-full",
                e?.status === "live"
                  ? "tw:bg-green-50 tw:text-green-700"
                  : "tw:bg-gray-50 tw:text-gray-600",
              )}
            >
              {e?.status || "unknown"}
            </span>
          </div>

          <div className="tw:mt-1 tw:text-sm tw:text-gray-600 tw:flex tw:items-center tw:gap-3 tw:flex-wrap">
            <span className="tw:flex tw:items-center tw:gap-1">
              <CalendarDays className="tw:w-4 tw:h-4 tw:text-gray-400" />
              {e?.eventDate || "No date"}
            </span>
            <span className="tw:flex tw:items-center tw:gap-1">
              <Ticket className="tw:w-4 tw:h-4 tw:text-gray-400" />
              {Number(e?.ticketsSold ?? 0).toLocaleString()} sold
            </span>
          </div>

          <div className="tw:mt-2 tw:text-xs tw:text-gray-500 tw:flex tw:items-center tw:gap-2 tw:flex-wrap">
            <span>
              Organizer share: {Number(payout?.organizer_share_percent ?? 0)}%
            </span>
            <span className="tw:text-gray-300">•</span>
            <span>
              Company share: {Number(payout?.company_share_percent ?? 0)}%
            </span>
            <span className="tw:text-gray-300">•</span>
            <span>
              Payments: {Number(payout?.successful_payments_count ?? 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="tw:flex tw:flex-col tw:md:items-end tw:gap-2 tw:md:ml-auto">
        <div className="tw:flex tw:items-center tw:justify-between tw:md:justify-end tw:gap-4">
          <div className="tw:text-sm tw:text-gray-500">Your payout</div>
          <div className="tw:text-base tw:font-bold tw:text-gray-900">
            {formatMoney(payout?.organizer_amount ?? 0, symbol)}
          </div>
        </div>

        <div className="tw:grid tw:grid-cols-2 tw:gap-2 tw:w-full tw:md:w-auto">
          <div className="tw:bg-gray-50 tw:rounded-2xl tw:px-3 tw:py-2">
            <div className="tw:text-[11px] tw:text-gray-500">Gross</div>
            <div className="tw:text-sm tw:font-semibold tw:text-gray-900">
              {formatMoney(payout?.total_amount ?? 0, symbol)}
            </div>
          </div>
          <div className="tw:bg-gray-50 tw:rounded-2xl tw:px-3 tw:py-2">
            <div className="tw:text-[11px] tw:text-gray-500">Company</div>
            <div className="tw:text-sm tw:font-semibold tw:text-gray-900">
              {formatMoney(payout?.company_amount ?? 0, symbol)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AccountPayouts() {
  const { user } = useAuth();
  const isOrganizer = !!user?.is_organiser_verified;

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all"); // all | live | draft | ended etc.

  const fetchPayouts = async () => {
    setLoading(true);
    setErrMsg("");

    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/v1/user/events", authHeaders(token));
      const list = res?.data?.data || [];
      setEvents(Array.isArray(list) ? list : []);
    } catch (e) {
      console.error(e);
      setErrMsg("Could not load payouts right now. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (events || [])
      .filter((e) => (isOrganizer ? true : false))
      .filter((e) => (status === "all" ? true : String(e?.status) === status))
      .filter((e) => {
        if (!q) return true;
        const haystack = [
          e?.title,
          e?.genre,
          e?.location,
          e?.eventDate,
          e?.slug,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => {
        const aVal = Number(a?.payout?.organizer_amount ?? 0);
        const bVal = Number(b?.payout?.organizer_amount ?? 0);
        return bVal - aVal;
      });
  }, [events, isOrganizer, query, status]);

  const summary = useMemo(() => {
    const list = filtered || [];
    const totalEvents = list.length;
    const totalTickets = list.reduce(
      (sum, e) => sum + Number(e?.ticketsSold ?? 0),
      0,
    );
    const totalGross = list.reduce(
      (sum, e) => sum + Number(e?.payout?.total_amount ?? 0),
      0,
    );
    const totalOrganizer = list.reduce(
      (sum, e) => sum + Number(e?.payout?.organizer_amount ?? 0),
      0,
    );

    // pick a symbol from the first item if present; otherwise default
    const symbol = list[0]?.currency?.symbol || "₦";

    return {
      totalEvents,
      totalTickets,
      totalGross: formatMoney(totalGross, symbol),
      totalOrganizer: formatMoney(totalOrganizer, symbol),
    };
  }, [filtered]);

  if (!isOrganizer) {
    return (
      <      >
        <div className="tw:bg-white tw:rounded-3xl tw:p-5 tw:shadow-sm tw:flex tw:items-start tw:gap-3 ">
          <AlertTriangle className="tw:w-5 tw:h-5 tw:text-amber-500 tw:mt-0.5" />
          <div>
            <div className="tw:font-semibold tw:text-gray-900">
              Access restricted
            </div>
            <div className="tw:text-sm tw:text-gray-600">
              You’ll see payouts here after your organiser account is verified.
            </div>
            <Link
              to="/account"
              className="tw:inline-flex tw:mt-3 tw:text-sm tw:font-semibold tw:text-gray-900"
            >
              Go back
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="tw:max-w-7xl tw:mx-auto tw:px-4 tw:sm:px-6 tw:lg:px-8 tw:pt-24 tw:md:pt-32 tw:pb-24">
      <div className="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:mb-4">
        <Link
          to="/account"
          className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-gray-900"
        >
          <ArrowLeft className="tw:w-4 tw:h-4" />
          Back
        </Link>
        <span className="tw:text-lg tw:md:text-xl tw:lg:text-2xl tw:xl:text-3xl tw:text-center">
            Payouts
        </span>

        <button
        style={{
            fontSize: 12,
            borderRadius: '20px'
        }}
          onClick={fetchPayouts}
          className="tw:bg-white tw:px-4 tw:py-2 tw:rounded-full tw:shadow-sm tw:hover:shadow-md tw:transition-all tw:text-sm tw:font-semibold tw:text-gray-900"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="tw:bg-white tw:rounded-3xl tw:p-4 tw:shadow-sm">
        <div className="tw:flex tw:flex-col tw:md:flex-row tw:md:items-center tw:gap-3">
          <div className="tw:flex-1 tw:flex tw:items-center tw:gap-2 tw:bg-gray-50 tw:rounded-2xl tw:px-3 tw:py-2">
            <Search className="tw:w-4 tw:h-4 tw:text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, date, location..."
              className="tw:w-full tw:bg-transparent tw:outline-none tw:text-sm tw:text-gray-800"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="tw:bg-gray-50 tw:rounded-2xl tw:px-3 tw:py-2 tw:text-sm tw:text-gray-800 tw:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="live">Live</option>
            <option value="draft">Draft</option>
            <option value="ended">Ended</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {errMsg ? (
          <div className="tw:mt-3 tw:text-sm tw:text-red-600">{errMsg}</div>
        ) : null}
      </div>

      {/* Stats */}
      <div className="tw:mt-4">
        {loading ? (
          <StatsSkeleton />
        ) : (
          <div className="tw:grid tw:grid-cols-2 tw:md:grid-cols-4 tw:gap-3 tw:md:gap-4">
            <StatCard
              icon={TrendingUp}
              label="Total organiser payout"
              value={summary.totalOrganizer}
              hint="Across filtered events"
            />
            <StatCard
              icon={Wallet}
              label="Total gross"
              value={summary.totalGross}
              hint="Before splits"
            />
            <StatCard
              icon={Ticket}
              label="Tickets sold"
              value={Number(summary.totalTickets).toLocaleString()}
              hint="Across filtered events"
            />
            <StatCard
              icon={CalendarDays}
              label="Events"
              value={Number(summary.totalEvents).toLocaleString()}
              hint="In this view"
            />
          </div>
        )}
      </div>

      {/* List */}
      {loading ? (
        <ListSkeleton />
      ) : filtered.length === 0 ? (
        <div className="tw:mt-4 tw:bg-white tw:rounded-3xl tw:p-6 tw:shadow-sm">
          <div className="tw:text-gray-900 tw:font-semibold">
            No payouts found
          </div>
          <div className="tw:mt-1 tw:text-sm tw:text-gray-600">
            Try changing your filters, or check back after ticket sales.
          </div>
        </div>
      ) : (
        <div className="tw:mt-4 tw:space-y-3">
          {filtered.map((e) => (
            <EventRow key={e?.id} e={e} />
          ))}
        </div>
      )}
    </div>
  );
}
