import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import {
  ArrowLeft,
  AlertTriangle,
  CalendarDays,
  History,
  Landmark,
  RefreshCw,
  Search,
  Ticket,
  TrendingUp,
  Wallet,
  BadgeCheck,
} from "lucide-react";
import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../../pages/auth/AuthContext";
import { showError, showPromise } from "../../component/ui/toast";

const cx = (...classes) => classes.filter(Boolean).join(" ");
const MINIMUM_WITHDRAWAL_AMOUNT = 10000;

const getCurrencySymbol = (currency) => {
  const normalized = String(currency || "").toUpperCase();
  if (normalized === "USD") return "$";
  if (normalized === "EUR") return "€";
  if (normalized === "GBP") return "£";
  return "₦";
};

const resolveCurrencySymbol = (payload) =>
  payload?.currency_symbol ||
  payload?.currency?.symbol ||
  getCurrencySymbol(payload?.currency?.code || payload?.currency);

const formatMoney = (value, symbol = "₦") => {
  const num = Number(value ?? 0);
  if (Number.isNaN(num)) return `${symbol}0.00`;
  return `${symbol}${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const normalizeCollection = (response) => {
  const root = response?.data || {};
  if (Array.isArray(root?.data)) return root.data;
  if (Array.isArray(root)) return root;
  return [];
};

const maskAccountNumber = (value = "") => {
  const accountNumber = String(value || "");
  return accountNumber.length <= 4
    ? accountNumber
    : `******${accountNumber.slice(-4)}`;
};

const getTicketSaleTitle = (item) =>
  item?.event_title || item?.title || item?.event?.title || "Untitled event";

const getTicketSaleDate = (item) =>
  item?.event_date ||
  item?.date ||
  item?.event?.event_date ||
  item?.event?.eventDate ||
  item?.event?.starts_at;

const getTicketSaleStatus = (item) =>
  item?.event_status || item?.status || item?.event?.status || "unknown";

const getTicketsSold = (item) =>
  Number(
    item?.tickets_sold_count ??
      item?.tickets_sold ??
      item?.ticketsSold ??
      item?.sold_count ??
      0
  );

const getBankDisplayName = (account) =>
  account?.bank_name || account?.bank?.name || "Bank account";

const getBankVerificationLabel = (account) => {
  if (typeof account?.verification_state === "string") {
    return account.verification_state;
  }
  if (typeof account?.verification_status === "string") {
    return account.verification_status;
  }
  if (account?.is_verified) return "verified";
  return "";
};

const SkeletonBlock = ({ className }) => (
  <div
    className={cx("tw:animate-pulse tw:rounded-2xl tw:bg-gray-200", className)}
  />
);

const StatsSkeleton = ({ cards = 3 }) => (
  <div className="tw:grid tw:grid-cols-1 tw:gap-3 tw:md:grid-cols-3">
    {Array.from({ length: cards }).map((_, index) => (
      <div key={index} className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
        <SkeletonBlock className="tw:h-4 tw:w-24" />
        <SkeletonBlock className="tw:mt-3 tw:h-7 tw:w-32" />
        <SkeletonBlock className="tw:mt-3 tw:h-3 tw:w-24" />
      </div>
    ))}
  </div>
);

const ListSkeleton = ({ rows = 4 }) => (
  <div className="tw:space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
        <SkeletonBlock className="tw:h-4 tw:w-40" />
        <SkeletonBlock className="tw:mt-3 tw:h-3 tw:w-full tw:max-w-[360px]" />
        <SkeletonBlock className="tw:mt-2 tw:h-3 tw:w-56" />
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

function WithdrawDialog({
  open,
  onClose,
  balance,
  accounts,
  amount,
  onAmountChange,
  selectedAccountId,
  onSelectAccount,
  onSubmit,
  submitting,
}) {
  const symbol = resolveCurrencySymbol(balance);
  const availableBalance = Number(balance?.available_balance ?? 0);
  const minimumAmount = Number(
    balance?.minimum_withdrawal_amount ?? MINIMUM_WITHDRAWAL_AMOUNT
  );
  const hasAccounts = accounts.length > 0;

  return (
    <Transition show={open} as={Fragment} appear>
      <Dialog
        as="div"
        className="tw:relative tw:z-50"
        onClose={submitting ? () => {} : onClose}
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
              <Dialog.Panel className="tw:w-full tw:max-w-xl tw:rounded-3xl tw:border tw:border-gray-100 tw:bg-white tw:p-5 tw:shadow-[0_24px_64px_rgba(15,23,42,0.18)] tw:sm:p-6">
                <span className="tw:text-xl tw:font-semibold tw:text-gray-900">
                  Request withdrawal
                </span>
                <p className="tw:mt-1 tw:text-xs tw:text-gray-500">
                  Choose a saved bank account and withdraw from your available balance.
                </p>

                <div className="tw:mt-5 tw:grid tw:grid-cols-2 tw:gap-3">
                  <div className="tw:rounded-2xl tw:bg-[#faf8ff] tw:p-3">
                    <div className="tw:text-xs tw:text-gray-500">Available balance</div>
                    <div className="tw:mt-1 tw:text-lg tw:font-semibold tw:text-gray-900">
                      {formatMoney(availableBalance, symbol)}
                    </div>
                  </div>
                  <div className="tw:rounded-2xl tw:bg-[#faf8ff] tw:p-3">
                    <div className="tw:text-xs tw:text-gray-500">Minimum withdrawal</div>
                    <div className="tw:mt-1 tw:text-lg tw:font-semibold tw:text-gray-900">
                      {formatMoney(minimumAmount, symbol)}
                    </div>
                  </div>
                </div>

                <div className="tw:mt-4">
                  <label className="tw:mb-1 tw:block tw:text-sm tw:font-medium tw:text-gray-700">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    min="0"
                    onChange={(event) => onAmountChange(event.target.value)}
                    className="tw:h-12 tw:w-full tw:rounded-2xl tw:border tw:border-gray-200 tw:bg-white tw:px-4 tw:text-sm tw:text-gray-900 tw:outline-none focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="tw:mt-4">
                  <label className="tw:mb-2 tw:block tw:text-sm tw:font-medium tw:text-gray-700">
                    Bank account
                  </label>
                  {!hasAccounts ? (
                    <div className="tw:rounded-2xl tw:border tw:border-amber-200 tw:bg-amber-50 tw:p-3 tw:text-sm tw:text-amber-800">
                      Add a bank account first before submitting a withdrawal.
                    </div>
                  ) : (
                    <div className="tw:max-h-64 tw:space-y-2 tw:overflow-y-auto">
                      {accounts.map((account) => {
                        const verificationLabel = getBankVerificationLabel(account);
                        const checked = String(selectedAccountId) === String(account?.id);

                        return (
                          <label
                            key={account?.id}
                            className={cx(
                              "tw:flex tw:cursor-pointer tw:items-start tw:justify-between tw:gap-3 tw:rounded-2xl tw:border tw:p-3",
                              checked
                                ? "tw:border-primary tw:bg-primary/5"
                                : "tw:border-gray-200 tw:bg-white"
                            )}
                          >
                            <div className="tw:min-w-0">
                              <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                                <span className="tw:font-semibold tw:text-gray-900">
                                  {getBankDisplayName(account)}
                                </span>
                                {account?.is_default ? (
                                  <span className="tw:rounded-full tw:bg-primary/10 tw:px-2 tw:py-1 tw:text-[11px] tw:font-semibold tw:text-primary">
                                    Default
                                  </span>
                                ) : null}
                                {verificationLabel ? (
                                  <span className="tw:rounded-full tw:bg-emerald-50 tw:px-2 tw:py-1 tw:text-[11px] tw:font-semibold tw:text-emerald-700 tw:capitalize">
                                    {verificationLabel}
                                  </span>
                                ) : null}
                              </div>
                              <div className="tw:mt-1 tw:text-sm tw:text-gray-600">
                                {account?.account_name || "Account holder"} •{" "}
                                {maskAccountNumber(account?.account_number)}
                              </div>
                            </div>
                            <input
                              type="radio"
                              name="withdraw-bank-account"
                              checked={checked}
                              onChange={() => onSelectAccount(account?.id)}
                              className="tw:mt-1"
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="tw:mt-6 tw:flex tw:items-center tw:justify-end tw:gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    style={{ borderRadius: 20, fontSize: 12 }}
                    className="tw:inline-flex tw:h-11 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-gray-100 tw:px-4 tw:text-sm tw:font-medium tw:text-gray-800 tw:transition hover:tw:bg-gray-200 disabled:tw:cursor-not-allowed disabled:tw:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={submitting || !hasAccounts}
                    style={{ borderRadius: 20, fontSize: 12 }}
                    className="tw:inline-flex tw:h-11 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary tw:px-4 tw:text-sm tw:font-medium tw:text-white tw:transition hover:tw:bg-primarySecond disabled:tw:cursor-not-allowed disabled:tw:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit withdrawal"}
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

  const [balance, setBalance] = useState(null);
  const [ticketSales, setTicketSales] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketSalesLoading, setTicketSalesLoading] = useState(true);
  const [sectionError, setSectionError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedWithdrawBankAccountId, setSelectedWithdrawBankAccountId] =
    useState("");
  const [submittingWithdraw, setSubmittingWithdraw] = useState(false);

  const fetchBalance = async () => {
    const res = await api.get("/api/v1/organiser/payouts/balance", authHeaders(token));
    return res?.data?.data || null;
  };

  const fetchTicketSales = async () => {
    const res = await api.get("/api/v1/organiser/payouts/ticket-sales", {
      ...authHeaders(token),
      params: { per_page: 20, page: 1 },
    });
    return normalizeCollection(res);
  };

  const fetchBankAccounts = async () => {
    const res = await api.get(
      "/api/v1/organiser/kyc/bank-accounts",
      authHeaders(token)
    );
    return normalizeCollection(res);
  };

  const loadPage = async () => {
    setLoading(true);
    setTicketSalesLoading(true);
    setSectionError("");

    try {
      const [balanceResult, ticketSalesResult, bankAccountsResult] =
        await Promise.all([
          fetchBalance(),
          fetchTicketSales(),
          fetchBankAccounts(),
        ]);

      setBalance(balanceResult);
      setTicketSales(ticketSalesResult);
      setBankAccounts(bankAccountsResult);
    } catch (error) {
      console.error(error);
      setSectionError("Could not load payout information right now. Please try again.");
    } finally {
      setLoading(false);
      setTicketSalesLoading(false);
    }
  };

  useEffect(() => {
    if (!isOrganizer) return;
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOrganizer]);

  useEffect(() => {
    const defaultAccount = bankAccounts.find((account) => account?.is_default);
    console.log({ bankAccounts, defaultAccount, selectedWithdrawBankAccountId });
    if (!defaultAccount && bankAccounts.length === 0) {
      setSelectedWithdrawBankAccountId("");
      return;
    }

    setSelectedWithdrawBankAccountId((current) => {
      if (
        current &&
        bankAccounts.some((account) => String(account?.bank_id) === String(current))
      ) {
        return current;
      }
      return defaultAccount?.bank_id || bankAccounts[0]?.bank_id || "";
    });
  }, [bankAccounts]);

  const balanceSymbol = resolveCurrencySymbol(balance);
  const minimumWithdrawalAmount = Number(
    balance?.minimum_withdrawal_amount ?? MINIMUM_WITHDRAWAL_AMOUNT
  );

  const filteredTicketSales = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return ticketSales.filter((item) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : String(getTicketSaleStatus(item)).toLowerCase() === statusFilter;

      if (!matchesStatus) return false;
      if (!query) return true;

      const haystack = [
        getTicketSaleTitle(item),
        getTicketSaleStatus(item),
        getTicketSaleDate(item),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [ticketSales, searchQuery, statusFilter]);

  const ticketSalesTotals = useMemo(() => {
    return filteredTicketSales.reduce(
      (acc, item) => {
        acc.totalTicketSales += Number(item?.total_ticket_sales ?? 0);
        acc.ticketsSold += getTicketsSold(item);
        return acc;
      },
      {
        totalTicketSales: 0,
        ticketsSold: 0,
      }
    );
  }, [filteredTicketSales]);

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount);
    const availableBalance = Number(balance?.available_balance ?? 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      showError("Enter a valid withdrawal amount.");
      return;
    }

    if (amount < minimumWithdrawalAmount) {
      showError(
        `Minimum withdrawal amount is ${formatMoney(
          minimumWithdrawalAmount,
          balanceSymbol
        )}.`
      );
      return;
    }

    if (amount > availableBalance) {
      showError("Requested amount is higher than your available balance.");
      return;
    }

    if (!selectedWithdrawBankAccountId) {
      showError("Select a bank account for this withdrawal.");
      return;
    }

    try {
      setSubmittingWithdraw(true);
      await showPromise(
        api.post(
          "/api/v1/organiser/payouts/withdraw",
          {
            amount,
            bank_account_id: selectedWithdrawBankAccountId,
          },
          authHeaders(token)
        ),
        {
          loading: "Submitting withdrawal...",
          success: "Withdrawal request submitted.",
          error: "Unable to submit withdrawal request.",
        }
      );

      setWithdrawAmount("");
      setWithdrawOpen(false);
      await loadPage();
    } finally {
      setSubmittingWithdraw(false);
    }
  };

  if (!isOrganizer) {
    return (
      <div className="tw:rounded-3xl tw:bg-white tw:p-5 tw:shadow-sm tw:flex tw:items-start tw:gap-3">
        <AlertTriangle className="tw:mt-0.5 tw:h-5 tw:w-5 tw:text-amber-500" />
        <div>
          <div className="tw:font-semibold tw:text-gray-900">Access restricted</div>
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
    );
  }

  return (
    <>
      <div className="tw:mx-auto tw:max-w-6xl tw:px-4 tw:pb-24 tw:pt-24 tw:sm:px-6 tw:md:pt-32 tw:lg:px-8">
        <div className="tw:mb-4 tw:flex tw:flex-col tw:gap-3 tw:md:flex-row tw:md:items-center tw:md:justify-between">
          <div className="tw:flex tw:items-center tw:gap-3">
            <Link
              to="/account/payouts"
              className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-gray-900"
            >
              <ArrowLeft className="tw:h-4 tw:w-4" />
              Back
            </Link>
            <div>
              <div className="tw:text-lg tw:font-bold tw:text-gray-900 tw:md:text-2xl">
                Request withdrawal
              </div>
              <div className="tw:text-sm tw:text-gray-500">
                Review your balance and submit a payout request.
              </div>
            </div>
          </div>

          <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
            <Link
              to="/account/payouts/history"
              className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-gray-900 tw:shadow-sm tw:hover:shadow-md"
            >
              <History className="tw:h-4 tw:w-4" />
              Withdrawal history
            </Link>
            <button
              type="button"
              onClick={() => setWithdrawOpen(true)}
              style={{ borderRadius: 12 }}
              className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-primary tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-white tw:shadow-sm hover:tw:bg-primarySecond"
            >
              <Landmark className="tw:h-4 tw:w-4" />
              Withdraw
            </button>
            <button
              type="button"
              onClick={loadPage}
              className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-gray-900 tw:shadow-sm tw:hover:shadow-md"
            >
              <RefreshCw className="tw:h-4 tw:w-4" />
              Refresh
            </button>
          </div>
        </div>

        {sectionError ? (
          <div className="tw:mb-4 tw:rounded-2xl tw:border tw:border-red-200 tw:bg-red-50 tw:p-3 tw:text-sm tw:text-red-700">
            {sectionError}
          </div>
        ) : null}

        <section className="tw:mb-4">
          {loading ? (
            <StatsSkeleton cards={3} />
          ) : (
            <div className="tw:grid tw:grid-cols-1 tw:gap-3 tw:md:grid-cols-3">
              <StatCard
                icon={Wallet}
                label="Available balance"
                value={formatMoney(balance?.available_balance ?? 0, balanceSymbol)}
                hint={`Minimum withdrawal ${formatMoney(minimumWithdrawalAmount, balanceSymbol)}`}
              />
              <StatCard
                icon={TrendingUp}
                label="Ticket sales"
                value={formatMoney(balance?.total_ticket_sales ?? 0, balanceSymbol)}
                hint="Total processed ticket sales"
              />
              <StatCard
                icon={Ticket}
                label="Tickets sold"
                value={ticketSalesTotals.ticketsSold.toLocaleString()}
                hint={`${filteredTicketSales.length.toLocaleString()} event records`}
              />
            </div>
          )}
        </section>

        <section className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
          <div className="tw:flex tw:flex-col tw:gap-3 tw:md:flex-row tw:md:items-center tw:md:justify-between">
            <div>
              <div className="tw:text-lg tw:font-semibold tw:text-gray-900">
                Ticket sales
              </div>
              <div className="tw:text-sm tw:text-gray-500">
                Simple event sales view for payout tracking.
              </div>
            </div>
            <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
              <div className="tw:flex tw:flex-1 tw:items-center tw:gap-2 tw:rounded-2xl tw:bg-gray-50 tw:px-3 tw:py-2 tw:md:min-w-[280px]">
                <Search className="tw:h-4 tw:w-4 tw:text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by title, date, status..."
                  className="tw:w-full tw:bg-transparent tw:text-sm tw:text-gray-800 tw:outline-none"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="tw:rounded-2xl tw:bg-gray-50 tw:px-3 tw:py-2 tw:text-sm tw:text-gray-800 tw:outline-none"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="tw:mt-4">
            {ticketSalesLoading ? (
              <ListSkeleton rows={4} />
            ) : filteredTicketSales.length === 0 ? (
              <div className="tw:rounded-3xl tw:border tw:border-dashed tw:border-gray-200 tw:bg-[#fcfcfe] tw:p-6 tw:text-sm tw:text-gray-500">
                No ticket sales yet.
              </div>
            ) : (
              <div className="tw:space-y-3">
                {filteredTicketSales.map((item, index) => (
                  <div
                    key={item?.id || item?.event_id || `${getTicketSaleTitle(item)}-${index}`}
                    className="tw:rounded-3xl tw:border tw:border-gray-100 tw:bg-[#fcfcfe] tw:p-4"
                  >
                    <div className="tw:flex tw:flex-col tw:gap-4 tw:lg:flex-row tw:lg:items-start tw:lg:justify-between">
                      <div className="tw:min-w-0">
                        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                          <span className="tw:font-semibold tw:text-gray-900">
                            {getTicketSaleTitle(item)}
                          </span>
                          <span className="tw:rounded-full tw:bg-gray-100 tw:px-2.5 tw:py-1 tw:text-xs tw:text-gray-700 tw:capitalize">
                            {getTicketSaleStatus(item)}
                          </span>
                        </div>
                        <div className="tw:mt-2 tw:flex tw:flex-wrap tw:items-center tw:gap-4 tw:text-sm tw:text-gray-600">
                          <span className="tw:flex tw:items-center tw:gap-1">
                            <CalendarDays className="tw:h-4 tw:w-4 tw:text-gray-400" />
                            {formatDate(getTicketSaleDate(item))}
                          </span>
                          <span className="tw:flex tw:items-center tw:gap-1">
                            <Ticket className="tw:h-4 tw:w-4 tw:text-gray-400" />
                            {getTicketsSold(item).toLocaleString()} sold
                          </span>
                        </div>
                      </div>

                      <div className="tw:grid tw:grid-cols-2 tw:gap-2 tw:lg:min-w-[280px]">
                        <div className="tw:rounded-2xl tw:bg-white tw:px-3 tw:py-2">
                          <div className="tw:text-[11px] tw:text-gray-500">Ticket sales</div>
                          <div className="tw:text-sm tw:font-semibold tw:text-gray-900">
                            {formatMoney(item?.total_ticket_sales ?? 0, balanceSymbol)}
                          </div>
                        </div>
                        <div className="tw:rounded-2xl tw:bg-white tw:px-3 tw:py-2">
                          <div className="tw:text-[11px] tw:text-gray-500">Tickets sold</div>
                          <div className="tw:text-sm tw:font-semibold tw:text-gray-900">
                            {getTicketsSold(item).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {!bankAccounts.length ? (
          <div className="tw:mt-4 tw:rounded-3xl tw:border tw:border-amber-200 tw:bg-amber-50 tw:p-4 tw:text-sm tw:text-amber-800">
            No saved bank account found. Add one from{" "}
            <Link to="/account/bank-accounts" className="tw:font-semibold tw:underline">
              My bank accounts
            </Link>{" "}
            before requesting a withdrawal.
          </div>
        ) : null}
      </div>

      <WithdrawDialog
        open={withdrawOpen}
        onClose={() => {
          if (!submittingWithdraw) {
            setWithdrawOpen(false);
          }
        }}
        balance={balance}
        accounts={bankAccounts}
        amount={withdrawAmount}
        onAmountChange={setWithdrawAmount}
        selectedAccountId={selectedWithdrawBankAccountId}
        onSelectAccount={setSelectedWithdrawBankAccountId}
        onSubmit={handleWithdraw}
        submitting={submittingWithdraw}
      />
    </>
  );
}
