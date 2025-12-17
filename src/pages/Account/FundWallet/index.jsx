import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeaders } from "../../../lib/apiClient";
import { showError, showSuccess } from "../../../component/ui/toast";
import { useAuth } from "../../auth/AuthContext";
import { ChevronLeft } from "lucide-react";

const FUNDING_TYPES = [
  {
    id: "main",
    title: "Main Wallet",
    description: "General payments and ticket purchases open to everyone.",
  },
  {
    id: "organiser",
    title: "Organiser Wallet",
    description:
      "Keep payout-ready credit for your organiser-only tools and events.",
  },
  {
    id: "reseller",
    title: "Reseller Wallet",
    description:
      "Top up to distribute tickets on behalf of partners or sub-organisers.",
  },
];

export default function FundWalletPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [amount, setAmount] = useState(1000);
  const [fundingType, setFundingType] = useState("main");
  const [loading, setLoading] = useState(false);

  const selected = useMemo(
    () => FUNDING_TYPES.find((item) => item.id === fundingType),
    [fundingType]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!amount || Number(amount) <= 0) {
      showError("Enter a positive amount to continue.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(
        `/api/v1/wallet/topup/${fundingType}`,
        { amount: Number(amount) },
        authHeaders(token)
      );

      const payload = res?.data?.data;
      if (payload?.authorization_url) {
        showSuccess("Opening checkout…");
        window.location.href = payload.authorization_url;
        return;
      }

      showError("Unable to start wallet topup. Try again.");
    } catch (error) {
      console.error("Topup error", error);
      showError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to initiate wallet funding."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tw:w-full tw:max-w-3xl tw:mx-auto tw:px-4 tw:py-10 tw:pb-24 tw:font-sans tw:pt-24 tw:md:pt-28">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="tw:text-sm tw:text-primary bg-white tw:size-4 tw:underline tw:mb-4"
      >
        <ChevronLeft />
      </button>

      <div className="tw:mt-4 tw:bg-white tw:rounded-[28px] tw:shadow-2xl tw:px-3 tw:py-5 tw:md:px-7 tw:md:py-7 tw:border tw:border-gray-100 tw:space-y-6">
        <div className="tw:flex tw:flex-col tw:items-center tw:text-center tw:gap-2">
          <span className="tw:text-sm tw:uppercase tw:tracking-[0.3em] tw:text-gray-400">
            Wallet Funding
          </span>
          <span className="tw:text-3xl tw:font-semibold tw:text-gray-900">
            Fund your wallet in seconds
          </span>
          <span className="tw:text-sm tw:text-gray-500 tw:max-w-xl">
            Select a wallet type, pick how much you want to add, then head
            straight into the Paystack checkout. We keep you in context so your
            balance is updated as soon as you finish the payment.
          </span>
        </div>

        <div className="tw:grid tw:grid-cols-1 tw:gap-3">
          {FUNDING_TYPES.map((item) => (
            <button
              style={{
                borderRadius: 16,
              }}
              key={item.id}
              type="button"
              onClick={() => setFundingType(item.id)}
              className={`tw:w-full tw:rounded-2xl tw:border tw:px-4 tw:py-3 tw:text-left tw:transition tw:duration-150 ${
                fundingType === item.id
                  ? "tw:border-primary tw:bg-primary/5"
                  : "tw:border-gray-200 tw:bg-gray-50"
              }`}
            >
              <div className="tw:flex tw:items-center tw:justify-between">
                <span className="tw:text-base tw:font-semibold tw:text-gray-900">
                  {item.title}
                </span>
                {fundingType === item.id && (
                  <span className="tw:text-xs tw:text-primary">Selected</span>
                )}
              </div>
              <span className="tw:text-xs tw:text-gray-500 tw:mt-1">
                {item.description}
              </span>
            </button>
          ))}
        </div>

        <form className="tw:space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="tw:block tw:text-xs tw:font-semibold tw:text-gray-500 tw:mb-1">
              Amount (NGN)
            </label>
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="tw:w-full tw:rounded-2xl tw:border tw:border-gray-200 tw:bg-white tw:px-4 tw:py-3 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
              placeholder="Enter amount"
            />
          </div>

          <div className="tw:flex tw:flex-col tw:gap-3 tw:rounded-2xl tw:border tw:border-dashed tw:border-gray-200 tw:p-4 tw:bg-gray-50">
            <div className="tw:flex tw:items-center tw:justify-between">
              <span className="tw:text-sm tw:font-medium tw:text-gray-600">
                Funding target
              </span>
              <span className="tw:text-xs tw:text-gray-500">
                {selected?.title}
              </span>
            </div>
            <span className="tw:text-[13px] tw:text-gray-500">
              {selected?.description}
            </span>
          </div>

          <button
            style={{
              borderRadius: 16,
              fontSize: 12,
            }}
            type="submit"
            disabled={loading}
            className="tw:w-full tw:rounded-[20px] tw:bg-linear-to-r tw:from-primary tw:to-primarySecond tw:py-3 tw:text-sm tw:font-semibold tw:text-white tw:transition tw:duration-150 tw:hover:opacity-90 tw:disabled:opacity-60"
          >
            {loading ? "Processing…" : "Fund wallet"}
          </button>
        </form>
      </div>
    </div>
  );
}
