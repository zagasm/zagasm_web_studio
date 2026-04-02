import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeft,
  Search,
  CalendarDays,
  Ticket,
  TrendingUp,
  Wallet,
  AlertTriangle,
  History,
  Landmark,
  RefreshCw,
} from "lucide-react";
import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../../pages/auth/AuthContext";
import { showError, showPromise } from "../../component/ui/toast";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const getCurrencySymbol = (currency) => {
  const normalized = String(currency || "").toUpperCase();
  if (normalized === "USD") return "$";
  if (normalized === "EUR") return "€";
  if (normalized === "GBP") return "£";
  return "₦";
};

const formatMoney = (value, symbol = "₦") => {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return `${symbol}0.00`;
  return `${symbol}${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const safeSymbol = (event) =>
  event?.currency?.symbol ||
  getCurrencySymbol(event?.currency?.code || event?.currency);

const SkeletonBlock = ({ className }) => (
  <div
    className={cx("tw:animate-pulse tw:rounded-2xl tw:bg-gray-200", className)}
  />
);

const StatsSkeleton = ({ cards = 4 }) => (
  <div className="tw:grid tw:grid-cols-2 tw:gap-3 tw:md:grid-cols-4 tw:md:gap-4">
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
        <SkeletonBlock className="tw:h-4 tw:w-24" />
        <SkeletonBlock className="tw:mt-3 tw:h-7 tw:w-32" />
        <SkeletonBlock className="tw:mt-3 tw:h-3 tw:w-20" />
      </div>
    ))}
  </div>
);

const ListSkeleton = () => (
  <div className="tw:mt-4 tw:space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="tw:flex tw:items-center tw:gap-4 tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm"
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
  <div className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
    <div className="tw:flex tw:items-center tw:justify-between">
      <span className="tw:text-sm tw:text-gray-500">{label}</span>
      {Icon ? <Icon className="tw:h-4 tw:w-4 tw:text-gray-400" /> : null}
    </div>
    <div className="tw:mt-2 tw:text-lg tw:font-bold tw:text-gray-900 tw:md:text-xl">
      {value}
    </div>
    {hint ? <div className="tw:mt-1 tw:text-xs tw:text-gray-500">{hint}</div> : null}
  </div>
);

const EventRow = ({ event }) => {
  const symbol = safeSymbol(event);
  const payout = event?.payout || {};
  const posterUrl = event?.poster?.[0]?.url;

  return (
    <div className="tw:flex tw:flex-col tw:gap-4 tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm tw:md:flex-row tw:md:items-center">
      <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-4">
        <div className="tw:flex tw:size-14 tw:shrink-0 tw:items-center tw:justify-center tw:overflow-hidden tw:rounded-2xl tw:bg-gray-100 tw:md:size-32">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={event?.title || "Event poster"}
              className="tw:h-full tw:w-full tw:object-cover"
              loading="lazy"
            />
          ) : (
            <CalendarDays className="tw:h-5 tw:w-5 tw:text-gray-400" />
          )}
        </div>

        <div className="tw:min-w-0">
          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
            <span className="tw:max-w-[72vw] tw:truncate tw:font-semibold tw:text-gray-900 tw:md:max-w-[420px]">
              {event?.title || "Untitled event"}
            </span>
            <span
              className={cx(
                "tw:rounded-full tw:px-2 tw:py-1 tw:text-xs",
                event?.status === "live"
                  ? "tw:bg-green-50 tw:text-green-700"
                  : "tw:bg-gray-50 tw:text-gray-600"
              )}
            >
              {event?.status || "unknown"}
            </span>
          </div>

          <div className="tw:mt-1 tw:flex tw:flex-wrap tw:items-center tw:gap-3 tw:text-sm tw:text-gray-600">
            <span className="tw:flex tw:items-center tw:gap-1">
              <CalendarDays className="tw:h-4 tw:w-4 tw:text-gray-400" />
              {event?.eventDate || "No date"}
            </span>
            <span className="tw:flex tw:items-center tw:gap-1">
              <Ticket className="tw:h-4 tw:w-4 tw:text-gray-400" />
              {Number(event?.ticketsSold ?? 0).toLocaleString()} sold
            </span>
          </div>

          <div className="tw:mt-2 tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:text-xs tw:text-gray-500">
            <span>Organizer share: {Number(payout?.organizer_share_percent ?? 0)}%</span>
            <span className="tw:text-gray-300">•</span>
            <span>Company share: {Number(payout?.company_share_percent ?? 0)}%</span>
            <span className="tw:text-gray-300">•</span>
            <span>Payments: {Number(payout?.successful_payments_count ?? 0)}</span>
          </div>
        </div>
      </div>

      <div className="tw:flex tw:flex-col tw:gap-2 tw:md:ml-auto tw:md:items-end">
        <div className="tw:flex tw:items-center tw:justify-between tw:gap-4 tw:md:justify-end">
          <div className="tw:text-sm tw:text-gray-500">Your payout</div>
          <div className="tw:text-base tw:font-bold tw:text-gray-900">
            {formatMoney(payout?.organizer_amount ?? 0, symbol)}
          </div>
        </div>

        <div className="tw:grid tw:w-full tw:grid-cols-2 tw:gap-2 tw:md:w-auto">
          <div className="tw:rounded-2xl tw:bg-gray-50 tw:px-3 tw:py-2">
            <div className="tw:text-[11px] tw:text-gray-500">Gross</div>
            <div className="tw:text-sm tw:font-semibold tw:text-gray-900">
              {formatMoney(payout?.total_amount ?? 0, symbol)}
            </div>
          </div>
          <div className="tw:rounded-2xl tw:bg-gray-50 tw:px-3 tw:py-2">
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

function WithdrawDialog({
  open,
  onClose,
  balance,
  amount,
  onAmountChange,
  onSubmit,
  submitting,
}) {
  const symbol = getCurrencySymbol(balance?.currency);
  const availableBalance = Number(balance?.available_balance ?? 0);
  const minimumAmount = Number(balance?.minimum_payout_amount ?? 0);
  const canRequest = !!balance?.can_request_payout;

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog
        as="div"
        className="tw:relative tw:z-50"
        onClose={submitting ? () => { } : onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="tw:transition tw:ease-out tw:duration-200"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:transition tw:ease-in tw:duration-150"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <div className="tw:fixed tw:inset-0 tw:bg-black/40" />
        </Transition.Child>

        <div className="tw:fixed tw:inset-0 tw:overflow-y-auto">
          <div className="tw:flex tw:min-h-full tw:items-center tw:justify-center tw:p-4">
            <Transition.Child
              as={Fragment}
              enter="tw:transition tw:ease-out tw:duration-200"
              enterFrom="tw:opacity-0 tw:translate-y-2 tw:sm:translate-y-0 tw:sm:scale-95"
              enterTo="tw:opacity-100 tw:translate-y-0 tw:sm:scale-100"
              leave="tw:transition tw:ease-in tw:duration-150"
              leaveFrom="tw:opacity-100 tw:sm:scale-100"
              leaveTo="tw:opacity-0 tw:translate-y-2 tw:sm:translate-y-0 tw:sm:scale-95"
            >
              <Dialog.Panel className="tw:w-full tw:max-w-lg tw:rounded-3xl tw:border tw:border-gray-100 tw:bg-white tw:p-5 tw:shadow-[0_24px_64px_rgba(15,23,42,0.18)] tw:sm:p-6">
                <span className="tw:text-xl tw:font-semibold tw:text-gray-900">
                  Request payout
                </span>
                <p className="tw:mt-1 tw:text-xs tw:text-gray-500">
                  Withdraw part of your available organiser balance.
                </p>

                <div className="tw:mt-5 tw:grid tw:grid-cols-2 tw:gap-3">
                  <div className="tw:rounded-2xl tw:bg-[#faf8ff] tw:p-3">
                    <div className="tw:text-xs tw:text-gray-500">
                      Available balance
                    </div>
                    <div className="tw:mt-1 tw:text-lg tw:font-semibold tw:text-gray-900">
                      {formatMoney(availableBalance, symbol)}
                    </div>
                  </div>
                  <div className="tw:rounded-2xl tw:bg-[#faf8ff] tw:p-3">
                    <div className="tw:text-xs tw:text-gray-500">
                      Minimum payout
                    </div>
                    <div className="tw:mt-1 tw:text-lg tw:font-semibold tw:text-gray-900">
                      {formatMoney(minimumAmount, symbol)}
                    </div>
                  </div>
                </div>

                <div className="tw:mt-4">
                  <label className="tw:mb-1 tw:block tw:text-sm tw:font-medium tw:text-gray-700">
                    Amount ({balance?.currency || "NGN"})
                  </label>
                  <input
                    type="number"
                    value={amount}
                    min="0"
                    onChange={(event) => onAmountChange(event.target.value)}
                    className="tw:h-12 tw:w-full tw:rounded-2xl tw:border tw:border-gray-200 tw:bg-white tw:px-4 tw:text-sm tw:text-gray-900 tw:outline-none focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20"
                  />
                </div>

                {!canRequest && (
                  <div className="tw:mt-4 tw:rounded-2xl tw:border tw:border-amber-200 tw:bg-amber-50 tw:p-3 tw:text-xs tw:text-amber-800">
                    Payout requests are not available yet. Your available
                    balance must meet the minimum payout requirement first.
                  </div>
                )}

                <div className="tw:mt-6 tw:flex tw:items-center tw:justify-end tw:gap-2">
                  <button
                    style={{
                      fontSize: 12,
                      borderRadius: 20,
                    }}
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="tw:inline-flex tw:h-11 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-gray-100 tw:px-4 tw:text-sm tw:font-medium tw:text-gray-800 tw:transition hover:tw:bg-gray-200 disabled:tw:cursor-not-allowed disabled:tw:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      fontSize: 12,
                      borderRadius: 20,
                    }}
                    type="button"
                    onClick={onSubmit}
                    disabled={submitting || !canRequest}
                    className="tw:inline-flex tw:h-11 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary tw:px-4 tw:text-sm tw:font-medium tw:text-white tw:transition hover:tw:bg-primarySecond disabled:tw:cursor-not-allowed disabled:tw:opacity-60"
                  >
                    {submitting ? "Requesting..." : "Request payout"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default function AccountPayouts() {
  const { user, token } = useAuth();
  const isOrganizer = !!user?.is_organiser_verified;

  const [events, setEvents] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);

  const fetchPayoutEvents = async () => {
    setLoading(true);
    setErrMsg("");

    try {
      const res = await api.get("/api/v1/user/events", authHeaders(token));
      const list = res?.data?.data || [];
      setEvents(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error(error);
      setErrMsg("Could not load payouts right now. Please try again.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    setBalanceLoading(true);
    try {
      const res = await api.get("/api/v1/organiser/payouts/balance", authHeaders(token));
      setBalance(res?.data?.data || null);
    } catch (error) {
      console.error(error);
      showError("Could not load organiser payout balance.");
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  };

  const refreshPageData = async () => {
    await Promise.all([fetchPayoutEvents(), fetchBalance()]);
  };

  useEffect(() => {
    refreshPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return (events || [])
      .filter(() => isOrganizer)
      .filter((event) =>
        status === "all" ? true : String(event?.status) === status
      )
      .filter((event) => {
        if (!q) return true;
        const haystack = [
          event?.title,
          event?.genre,
          event?.location,
          event?.eventDate,
          event?.slug,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .sort((a, b) => {
        const aValue = Number(a?.payout?.organizer_amount ?? 0);
        const bValue = Number(b?.payout?.organizer_amount ?? 0);
        return bValue - aValue;
      });
  }, [events, isOrganizer, query, status]);

  const eventSummary = useMemo(() => {
    const list = filtered || [];
    const totalEvents = list.length;
    const totalTickets = list.reduce(
      (sum, event) => sum + Number(event?.ticketsSold ?? 0),
      0
    );
    const totalGross = list.reduce(
      (sum, event) => sum + Number(event?.payout?.total_amount ?? 0),
      0
    );
    const totalOrganizer = list.reduce(
      (sum, event) => sum + Number(event?.payout?.organizer_amount ?? 0),
      0
    );

    const symbol = list[0]?.currency?.symbol || "₦";

    return {
      totalEvents,
      totalTickets,
      totalGross: formatMoney(totalGross, symbol),
      totalOrganizer: formatMoney(totalOrganizer, symbol),
    };
  }, [filtered]);

  const balanceSymbol = getCurrencySymbol(balance?.currency);

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    const minimumAmount = Number(balance?.minimum_payout_amount ?? 0);
    const availableBalance = Number(balance?.available_balance ?? 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      showError("Enter a valid payout amount.");
      return;
    }

    if (amount < minimumAmount) {
      showError(
        `Minimum payout amount is ${formatMoney(minimumAmount, balanceSymbol)}.`
      );
      return;
    }

    if (amount > availableBalance) {
      showError("Requested amount is higher than your available balance.");
      return;
    }

    try {
      setSubmittingWithdraw(true);
      await showPromise(
        api.post(
          "/organiser/payouts/request",
          { amount },
          authHeaders(token)
        ),
        {
          loading: "Submitting payout request…",
          success: "Payout request submitted",
          error: "Unable to submit payout request",
        }
      );
      setWithdrawAmount("");
      setWithdrawOpen(false);
      fetchBalance();
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  if (!isOrganizer) {
    return (
      <>
        <div className="tw:rounded-3xl tw:bg-white tw:p-5 tw:shadow-sm tw:flex tw:items-start tw:gap-3">
          <AlertTriangle className="tw:mt-0.5 tw:h-5 tw:w-5 tw:text-amber-500" />
          <div>
            <div className="tw:font-semibold tw:text-gray-900">
              Access restricted
            </div>
            <div className="tw:text-sm tw:text-gray-600">
              You’ll see payouts here after your organiser account is verified.
            </div>
            <Link
              to="/account"
              className="tw:mt-3 tw:inline-flex tw:text-sm tw:font-semibold tw:text-gray-900"
            >
              Go back
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="tw:mx-auto tw:max-w-7xl tw:px-4 tw:pb-24 tw:pt-24 tw:sm:px-6 tw:md:pt-32 tw:lg:px-8">
        <div className="tw:mb-4 tw:flex tw:flex-col tw:gap-3 tw:md:flex-row tw:md:items-center tw:md:justify-between">
          <div className="tw:flex tw:items-center tw:gap-3">
            <Link
              to="/account"
              className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-gray-900"
            >
              <ArrowLeft className="tw:h-4 tw:w-4" />
            </Link>
            <span className="tw:text-lg tw:font-bold tw:text-gray-900 tw:md:text-xl tw:lg:text-2xl tw:xl:text-3xl">
              Payouts
            </span>
          </div>

          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
            <Link
              to="/account/payouts/history"
              className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-gray-900 tw:shadow-sm tw:hover:shadow-md"
            >
              <History className="tw:h-4 tw:w-4" />
              Payout history
            </Link>
            <button
              type="button"
              style={{
                borderRadius: 12,

              }}
              onClick={() => setWithdrawOpen(true)}
              className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-primary tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-white tw:shadow-sm hover:tw:bg-primarySecond"
            >
              <Landmark className="tw:h-4 tw:w-4" />
              Withdraw
            </button>
            <button
              type="button"
              onClick={refreshPageData}
              className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-gray-900 tw:shadow-sm tw:hover:shadow-md"
            >
              <RefreshCw className="tw:h-4 tw:w-4" />
              Refresh
            </button>
          </div>
        </div>

        <div className="tw:mb-4">
          {balanceLoading ? (
            <StatsSkeleton />
          ) : (
            <div className="tw:grid tw:grid-cols-2 tw:gap-3 tw:md:grid-cols-4 tw:md:gap-4">
              <StatCard
                icon={Wallet}
                label="Available balance"
                value={formatMoney(balance?.available_balance ?? 0, balanceSymbol)}
                hint={
                  balance?.can_request_payout
                    ? "Ready for payout request"
                    : `Minimum payout is ${formatMoney(
                      balance?.minimum_payout_amount ?? 0,
                      balanceSymbol
                    )}`
                }
              />
              <StatCard
                icon={TrendingUp}
                label="Organiser share"
                value={formatMoney(balance?.organiser_share ?? 0, balanceSymbol)}
                hint="Total revenue share"
              />
              <StatCard
                icon={History}
                label="Pending payouts"
                value={formatMoney(balance?.pending_payouts ?? 0, balanceSymbol)}
                hint="Not yet processed"
              />
              <StatCard
                icon={Landmark}
                label="Total paid out"
                value={formatMoney(balance?.total_paid_out ?? 0, balanceSymbol)}
                hint={`Currency: ${balance?.currency || "NGN"}`}
              />
            </div>
          )}
        </div>

        <div className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
          <div className="tw:flex tw:flex-col tw:gap-3 tw:md:flex-row tw:md:items-center">
            <div className="tw:flex tw:flex-1 tw:items-center tw:gap-2 tw:rounded-2xl tw:bg-gray-50 tw:px-3 tw:py-2">
              <Search className="tw:h-4 tw:w-4 tw:text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, date, location..."
                className="tw:w-full tw:bg-transparent tw:text-sm tw:text-gray-800 tw:outline-none"
              />
            </div>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="tw:rounded-2xl tw:bg-gray-50 tw:px-3 tw:py-2 tw:text-sm tw:text-gray-800 tw:outline-none"
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

        <div className="tw:mt-4">
          {loading ? (
            <StatsSkeleton />
          ) : (
            <div className="tw:grid tw:grid-cols-2 tw:gap-3 tw:md:grid-cols-4 tw:md:gap-4">
              <StatCard
                icon={TrendingUp}
                label="Total organiser payout"
                value={eventSummary.totalOrganizer}
                hint="Across filtered events"
              />
              <StatCard
                icon={Wallet}
                label="Total gross"
                value={eventSummary.totalGross}
                hint="Before splits"
              />
              <StatCard
                icon={Ticket}
                label="Tickets sold"
                value={Number(eventSummary.totalTickets).toLocaleString()}
                hint="Across filtered events"
              />
              <StatCard
                icon={CalendarDays}
                label="Events"
                value={Number(eventSummary.totalEvents).toLocaleString()}
                hint="In this view"
              />
            </div>
          )}
        </div>

        {loading ? (
          <ListSkeleton />
        ) : filtered.length === 0 ? (
          <div className="tw:mt-4 tw:rounded-3xl tw:bg-white tw:p-6 tw:shadow-sm">
            <div className="tw:font-semibold tw:text-gray-900">No payouts found</div>
            <div className="tw:mt-1 tw:text-sm tw:text-gray-600">
              Try changing your filters, or check back after ticket sales.
            </div>
          </div>
        ) : (
          <div className="tw:mt-4 tw:space-y-3">
            {filtered.map((event) => (
              <EventRow key={event?.id} event={event} />
            ))}
          </div>
        )}
      </div>

      <WithdrawDialog
        open={withdrawOpen}
        onClose={() => {
          if (!submittingWithdraw) {
            setWithdrawOpen(false);
          }
        }}
        balance={balance}
        amount={withdrawAmount}
        onAmountChange={setWithdrawAmount}
        onSubmit={handleWithdraw}
        submitting={submittingWithdraw}
      />
    </>
  );
}
