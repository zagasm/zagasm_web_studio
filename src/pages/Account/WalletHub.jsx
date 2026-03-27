import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight, Coins, Landmark, PlusCircle } from "lucide-react";

const walletItems = [
  {
    icon: Coins,
    label: "Crypto Wallet",
    description: "Manage your connected crypto wallets.",
    to: "/account/crypto-wallet",
  },
  {
    icon: PlusCircle,
    label: "Fund Wallet",
    description: "Add funds to your Zagasm wallet.",
    to: "/account/fund-wallet",
  },
  {
    icon: Landmark,
    label: "Payouts",
    description: "Review balances, requests, and payout history.",
    to: "/account/payouts",
  },
];

export default function WalletHub() {
  return (
    <div className="tw:min-h-screen tw:w-full tw:bg-[#F6F7FB] tw:px-4 tw:pb-16 tw:pt-24 tw:font-sans tw:md:px-6 tw:lg:px-8">
      <div className="tw:mx-auto tw:w-full tw:max-w-4xl">
        <div className="tw:rounded-[32px] tw:border tw:border-gray-100 tw:bg-white tw:p-5 tw:shadow-[0_18px_50px_rgba(15,23,42,0.08)] tw:md:p-7">
          <div className="tw:flex tw:flex-col tw:gap-4 tw:md:flex-row tw:md:items-center tw:md:justify-between">
            <div>
              <Link
                to="/account"
                className="tw:inline-flex tw:items-center tw:gap-2 tw:text-sm tw:font-medium tw:text-gray-500 hover:tw:text-gray-900"
              >
                <ArrowLeft className="tw:h-4 tw:w-4" />
                <span>Back to account</span>
              </Link>

              <h1 className="tw:mt-3 tw:text-2xl tw:font-semibold tw:text-gray-900 tw:md:text-3xl">
                Wallet
              </h1>
              <p className="tw:mt-2 tw:max-w-2xl tw:text-sm tw:text-gray-600 tw:md:text-base">
                Choose where you want to go for wallet management, funding, or payouts.
              </p>
            </div>
          </div>

          <div className="tw:mt-8 tw:grid tw:grid-cols-1 tw:gap-4">
            {walletItems.map(({ icon: Icon, label, description, to }) => (
              <Link
                key={label}
                to={to}
                className="tw:flex tw:items-center tw:justify-between tw:rounded-[28px] tw:border tw:border-gray-100 tw:bg-[#fbfbfd] tw:p-4 tw:transition hover:tw:border-gray-200 hover:tw:bg-white hover:tw:shadow-sm tw:md:p-5"
              >
                <div className="tw:flex tw:items-center tw:gap-4">
                  <span className="tw:flex tw:h-12 tw:w-12 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-white tw:shadow-sm">
                    <Icon className="tw:h-5 tw:w-5 tw:text-gray-700" />
                  </span>

                  <div>
                    <div className="tw:text-base tw:font-semibold tw:text-gray-900">
                      {label}
                    </div>
                    <div className="tw:mt-1 tw:text-sm tw:text-gray-500">
                      {description}
                    </div>
                  </div>
                </div>

                <ChevronRight className="tw:h-5 tw:w-5 tw:text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
