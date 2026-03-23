import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Eye,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { api, authHeaders } from "../../lib/apiClient";
import { useAuth } from "../../pages/auth/AuthContext";
import { showError } from "../../component/ui/toast";

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

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const statusTone = (status) => {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "paid" || normalized === "completed") {
    return "tw:bg-emerald-50 tw:text-emerald-700";
  }
  if (normalized === "pending" || normalized === "processing") {
    return "tw:bg-amber-50 tw:text-amber-700";
  }
  if (normalized === "failed" || normalized === "rejected") {
    return "tw:bg-red-50 tw:text-red-700";
  }
  return "tw:bg-gray-50 tw:text-gray-700";
};

const HistorySkeleton = () => (
  <div className="tw:mt-4 tw:space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm tw:animate-pulse"
      >
        <div className="tw:h-4 tw:w-36 tw:rounded-xl tw:bg-gray-200" />
        <div className="tw:mt-3 tw:h-3 tw:w-full tw:max-w-[260px] tw:rounded-xl tw:bg-gray-100" />
        <div className="tw:mt-3 tw:h-3 tw:w-40 tw:rounded-xl tw:bg-gray-100" />
      </div>
    ))}
  </div>
);

function PayoutDetailsDialog({ open, payout, loading, onClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const symbol = getCurrencySymbol(
    payout?.currency || payout?.data?.currency || "NGN"
  );

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      <DialogTitle>Payout details</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <div className="tw:space-y-3 tw:py-2">
            <div className="tw:h-4 tw:w-36 tw:animate-pulse tw:rounded-xl tw:bg-gray-200" />
            <div className="tw:h-4 tw:w-52 tw:animate-pulse tw:rounded-xl tw:bg-gray-100" />
            <div className="tw:h-24 tw:w-full tw:animate-pulse tw:rounded-2xl tw:bg-gray-100" />
          </div>
        ) : payout ? (
          <div className="tw:space-y-4">
            <div className="tw:grid tw:grid-cols-2 tw:gap-3">
              <div className="tw:rounded-2xl tw:bg-[#faf8ff] tw:p-3">
                <div className="tw:text-xs tw:text-gray-500">Amount</div>
                <div className="tw:mt-1 tw:text-lg tw:font-semibold tw:text-gray-900">
                  {formatMoney(
                    payout?.amount || payout?.requested_amount || 0,
                    symbol
                  )}
                </div>
              </div>
              <div className="tw:rounded-2xl tw:bg-[#faf8ff] tw:p-3">
                <div className="tw:text-xs tw:text-gray-500">Status</div>
                <div className="tw:mt-1 tw:text-lg tw:font-semibold tw:text-gray-900 tw:capitalize">
                  {payout?.status || "unknown"}
                </div>
              </div>
            </div>

            <div className="tw:space-y-3">
              <div className="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:text-sm">
                <span className="tw:text-gray-500">Requested at</span>
                <span className="tw:text-gray-900">
                  {formatDateTime(
                    payout?.requested_at || payout?.created_at || payout?.date
                  )}
                </span>
              </div>
              <div className="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:text-sm">
                <span className="tw:text-gray-500">Paid at</span>
                <span className="tw:text-gray-900">
                  {formatDateTime(payout?.paid_at)}
                </span>
              </div>
              <div className="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:text-sm">
                <span className="tw:text-gray-500">Reference</span>
                <span className="tw:text-gray-900">
                  {payout?.reference || payout?.transaction_reference || payout?.id || "—"}
                </span>
              </div>
              <div className="tw:flex tw:items-center tw:justify-between tw:gap-3 tw:text-sm">
                <span className="tw:text-gray-500">Seen</span>
                <span className="tw:text-gray-900">
                  {payout?.seen_at || payout?.is_seen ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <div className="tw:rounded-2xl tw:bg-slate-50 tw:p-4">
              <div className="tw:mb-2 tw:text-xs tw:text-gray-500">Raw payload</div>
              <pre className="tw:max-h-72 tw:overflow-auto tw:text-xs tw:text-slate-700">
                {JSON.stringify(payout, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="tw:text-sm tw:text-gray-500">No payout selected.</div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function AccountPayoutHistory() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);

  const fetchHistory = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/organiser/payouts/history", {
        ...authHeaders(token),
        params: { per_page: 20, page },
      });
      setHistory(Array.isArray(res?.data?.data) ? res.data.data : []);
      setMeta(res?.data?.meta || meta);
    } catch (error) {
      console.error(error);
      showError("Could not load payout history.");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenDetails = async (payoutId) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const res = await api.get(
        `/organiser/payouts/${payoutId}`,
        authHeaders(token)
      );
      const payout = res?.data?.data || res?.data || null;
      setSelectedPayout(payout);

      try {
        await api.post(
          `/organiser/payouts/${payoutId}/seen`,
          {},
          authHeaders(token)
        );
        setHistory((prev) =>
          prev.map((item) =>
            String(item.id) === String(payoutId)
              ? { ...item, seen_at: new Date().toISOString(), is_seen: true }
              : item
          )
        );
      } catch (seenError) {
        console.error(seenError);
      }
    } catch (error) {
      console.error(error);
      showError("Could not load payout details.");
      setSelectedPayout(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const totals = useMemo(() => {
    const totalAmount = history.reduce(
      (sum, payout) => sum + Number(payout?.amount || payout?.requested_amount || 0),
      0
    );
    const pendingCount = history.filter((payout) =>
      ["pending", "processing"].includes(String(payout?.status || "").toLowerCase())
    ).length;

    return {
      totalAmount,
      pendingCount,
    };
  }, [history]);

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
            <span className="tw:text-lg tw:text-gray-900 tw:md:text-xl tw:lg:text-2xl">
              Payout history
            </span>
          </div>

          <button
            type="button"
            onClick={() => fetchHistory(meta.current_page || 1)}
            className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-gray-900 tw:shadow-sm tw:hover:shadow-md"
          >
            <RefreshCw className="tw:h-4 tw:w-4" />
            Refresh
          </button>
        </div>

        <div className="tw:mb-4 tw:grid tw:grid-cols-2 tw:gap-3 tw:md:grid-cols-4">
          <div className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
            <div className="tw:text-sm tw:text-gray-500">Total records</div>
            <div className="tw:mt-2 tw:text-xl tw:font-bold tw:text-gray-900">
              {loading ? "—" : Number(meta.total || 0).toLocaleString()}
            </div>
          </div>
          <div className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
            <div className="tw:text-sm tw:text-gray-500">Current page</div>
            <div className="tw:mt-2 tw:text-xl tw:font-bold tw:text-gray-900">
              {loading ? "—" : meta.current_page || 1}
            </div>
          </div>
          <div className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
            <div className="tw:text-sm tw:text-gray-500">Pending items</div>
            <div className="tw:mt-2 tw:text-xl tw:font-bold tw:text-gray-900">
              {loading ? "—" : totals.pendingCount}
            </div>
          </div>
          <div className="tw:rounded-3xl tw:bg-white tw:p-4 tw:shadow-sm">
            <div className="tw:text-sm tw:text-gray-500">Visible amount</div>
            <div className="tw:mt-2 tw:text-xl tw:font-bold tw:text-gray-900">
              {loading ? "—" : formatMoney(totals.totalAmount)}
            </div>
          </div>
        </div>

        {loading ? (
          <HistorySkeleton />
        ) : history.length === 0 ? (
          <div className="tw:rounded-3xl tw:bg-white tw:p-6 tw:shadow-sm">
            <div className="tw:font-semibold tw:text-gray-900">
              No payout history yet
            </div>
            <div className="tw:mt-1 tw:text-sm tw:text-gray-600">
              Completed and pending payout requests will appear here.
            </div>
          </div>
        ) : (
          <div className="tw:space-y-3">
            {history.map((payout) => {
              const symbol = getCurrencySymbol(payout?.currency);
              const isSeen = !!(payout?.seen_at || payout?.is_seen);
              const normalizedStatus = String(payout?.status || "").toLowerCase();

              return (
                <button
                  key={payout?.id}
                  type="button"
                  onClick={() => handleOpenDetails(payout.id)}
                  className="tw:w-full tw:rounded-3xl tw:bg-white tw:p-4 tw:text-left tw:shadow-sm tw:transition hover:tw:shadow-md"
                >
                  <div className="tw:flex tw:flex-col tw:gap-4 tw:md:flex-row tw:md:items-center tw:md:justify-between">
                    <div className="tw:min-w-0">
                      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2">
                        <span className="tw:font-semibold tw:text-gray-900">
                          {formatMoney(
                            payout?.amount || payout?.requested_amount || 0,
                            symbol
                          )}
                        </span>
                        <span
                          className={`tw:rounded-full tw:px-2.5 tw:py-1 tw:text-xs tw:capitalize ${statusTone(
                            payout?.status
                          )}`}
                        >
                          {payout?.status || "unknown"}
                        </span>
                        {!isSeen && (
                          <span className="tw:rounded-full tw:bg-blue-50 tw:px-2.5 tw:py-1 tw:text-xs tw:text-blue-700">
                            New
                          </span>
                        )}
                      </div>

                      <div className="tw:mt-2 tw:flex tw:flex-wrap tw:items-center tw:gap-3 tw:text-sm tw:text-gray-600">
                        <span className="tw:flex tw:items-center tw:gap-1">
                          <Clock3 className="tw:h-4 tw:w-4 tw:text-gray-400" />
                          {formatDateTime(
                            payout?.requested_at || payout?.created_at || payout?.date
                          )}
                        </span>
                        <span className="tw:flex tw:items-center tw:gap-1">
                          {normalizedStatus === "paid" ||
                          normalizedStatus === "completed" ? (
                            <CheckCircle2 className="tw:h-4 tw:w-4 tw:text-emerald-500" />
                          ) : (
                            <AlertCircle className="tw:h-4 tw:w-4 tw:text-amber-500" />
                          )}
                          {payout?.reference || payout?.transaction_reference || payout?.id}
                        </span>
                      </div>
                    </div>

                    <div className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-semibold tw:text-primary">
                      <Eye className="tw:h-4 tw:w-4" />
                      View details
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {meta.last_page > 1 && (
          <div className="tw:mt-6 tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3">
            <button
              type="button"
              disabled={meta.current_page <= 1 || loading}
              onClick={() => fetchHistory(meta.current_page - 1)}
              className="tw:rounded-full tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-gray-900 tw:shadow-sm disabled:tw:cursor-not-allowed disabled:tw:opacity-50"
            >
              Previous
            </button>
            <div className="tw:text-sm tw:text-gray-500">
              Page {meta.current_page} of {meta.last_page}
            </div>
            <button
              type="button"
              disabled={meta.current_page >= meta.last_page || loading}
              onClick={() => fetchHistory(meta.current_page + 1)}
              className="tw:rounded-full tw:bg-white tw:px-4 tw:py-2 tw:text-sm tw:font-semibold tw:text-gray-900 tw:shadow-sm disabled:tw:cursor-not-allowed disabled:tw:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <PayoutDetailsDialog
        open={detailOpen}
        payout={selectedPayout}
        loading={detailLoading}
        onClose={() => {
          if (!detailLoading) {
            setDetailOpen(false);
          }
        }}
      />
    </>
  );
}
