import React, { useEffect, useState } from "react";
import { api, authHeaders } from "../../lib/apiClient";
import { showError } from "../../component/ui/toast";
import AddWalletModal from "../../component/crypto/AddWalletModal";
import { useAuth } from "../../pages/auth/AuthContext";
import VerifyWalletModal from "../../component/crypto/VerifyWalletModal";

export default function CryptoWalletsPage() {
  const { token } = useAuth();

  const [wallets, setWallets] = useState([]);
  const [options, setOptions] = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(true);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [walletToVerify, setWalletToVerify] = useState(null);
  const [ownershipInfo, setOwnershipInfo] = useState(null);
  function openVerify(wallet, ownership = null) {
    setWalletToVerify(wallet);
    setOwnershipInfo(ownership);
    setVerifyModalOpen(true);
  }

  function handleWalletCreated(newWallet, ownership) {
    if (!newWallet) {
      fetchWallets();
      return;
    }
    setWallets((prev) => {
      const filtered = prev.filter((w) => w.id !== newWallet.id);
      return [newWallet, ...filtered];
    });

    // if wallet is pending, prompt verification immediately
    if (
      newWallet.status === "pending" ||
      (!newWallet.verified_at && newWallet.status !== "verified")
    ) {
      openVerify(newWallet, ownership || null);
    }
  }

  function handleWalletVerified(updatedWallet) {
    if (!updatedWallet) return;
    setWallets((prev) =>
      prev.map((w) => (w.id === updatedWallet.id ? updatedWallet : w))
    );
  }

  useEffect(() => {
    if (!token) return;
    fetchWallets();
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function fetchWallets() {
    setLoadingWallets(true);
    try {
      const res = await api.get("/api/v1/crypto-wallets", authHeaders(token));
      setWallets(res?.data?.data || []);
    } catch (err) {
      showError("Could not load crypto wallets.");
    } finally {
      setLoadingWallets(false);
    }
  }

  async function fetchOptions() {
    setLoadingOptions(true);
    try {
      const res = await api.get("/api/v1/crypto/options", authHeaders(token));
      setOptions(res?.data?.data || []);
    } catch (err) {
      showError("Could not load crypto options.");
    } finally {
      setLoadingOptions(false);
    }
  }

  function handleWalletCreated(newWallet) {
    if (!newWallet) {
      fetchWallets();
      return;
    }
    setWallets((prev) => {
      const filtered = prev.filter((w) => w.id !== newWallet.id);
      return [newWallet, ...filtered];
    });
  }

  const hasWallets = wallets && wallets.length > 0;

  return (
    <div className="tw:min-h-[calc(100vh-80px)] tw:bg-[#FFFFFF] tw:text-[#12001F] tw:mt-20 tw:pb-24 tw:px-4 tw:sm:px-6 tw:lgtw:px-12 tw:py-8 tw:flex tw:justify-center">
      <div className="tw:w-full tw:max-w-6xl tw:space-y-6">
        {/* Header */}
        <div className="tw:flex tw:flex-col tw:md:flex-row tw:items-start tw:md:items-center tw:justify-between tw:gap-4">
          <div className="tw:space-y-1.5">
            <span className="tw:block tw:text-lg tw:sm:text-2xl tw:font-semibold tw:text-[#140022]">
              Crypto payout wallets
            </span>
            <span className="tw:block tw:text-xs tw:sm:text-sm tw:text-[#6D5B9C] tw:max-w-xl">
              Plug in the wallets you trust, then route event payouts, tips and
              subscriptions directly to on-chain addresses you control.
            </span>
          </div>

          <button
            style={{
              borderRadius: 16,
              fontSize: 12,
            }}
            type="button"
            onClick={() => setModalOpen(true)}
            className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-2xl tw:px-4 tw:py-2.5 tw:text-xs tw:font-semibold tw:text-white tw:bg-[radial-gradient(circle_at_0%_0%,#C115B5,transparent_55%),radial-gradient(circle_at_100%_0%,#8F07E7,transparent_55%),linear-gradient(135deg,#8F07E7,#C115B5)] tw:shadow-[0_12px_32px_rgba(143,7,231,0.35)] hover:tw:scale-[1.01] tw:transition disabled:tw:opacity-60"
          >
            <span className="tw:inline-flex tw:h-5 tw:w-5 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/15 tw:text-xs">
              +
            </span>
            <span>Add new wallet</span>
          </button>
        </div>

        {/* Highlight strip */}
        <div className="tw:rounded-3xl tw:border tw:border-[#E1D5FF] tw:bg-[radial-gradient(circle_at_0%_0%,#F4E6FD,transparent_60%),radial-gradient(circle_at_100%_0%,#FFF1FB,transparent_60%),linear-gradient(135deg,#FFFFFF,#F8F4FF)] tw:px-4 tw:sm:px-6 tw:py-4 tw:flex tw:flex-col tw:md:flex-row tw:items-start tw:md:items-center tw:justify-between tw:gap-4">
          <div className="tw:flex tw:items-center tw:gap-3">
            <div className="tw:h-10 tw:w-10 tw:rounded-2xl tw:bg-[#8F07E7]/8 tw:flex tw:items-center tw:justify-center tw:shrink-0">
              <span className="tw:text-lg">🪙</span>
            </div>
            <div className="tw:space-y-0.5">
              <span className="tw:block tw:text-xs tw:uppercase tw:tracking-[0.18em] tw:text-[#8354D3]">
                On-chain ready
              </span>
              <span className="tw:block tw:text-sm tw:sm:text-base tw:text-[#2B123F]">
                Keep your creator earnings in stablecoins or native assets, no
                forced conversions.
              </span>
            </div>
          </div>

          <div className="tw:flex tw:items-center tw:gap-4">
            <div className="tw:flex tw:flex-col tw:items-start tw:gap-0.5">
              <span className="tw:text-[11px] tw:text-[#7A68AF]">
                Connected wallets
              </span>
              <span className="tw:text-base tw:font-semibold tw:text-[#211034]">
                {loadingWallets ? "…" : wallets.length}
              </span>
            </div>
            <div className="tw:h-10 tw:w-px tw:bg-linear-to-b tw:from-transparent tw:via-[#D3C5FF] tw:to-transparent" />
            <div className="tw:flex tw:flex-col tw:items-start tw:gap-0.5">
              <span className="tw:text-[11px] tw:text-[#7A68AF]">
                Supported assets
              </span>
              <span className="tw:text-base tw:font-semibold tw:text-[#211034]">
                {loadingOptions ? "…" : options.length}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="tw:mt-4 tw:space-y-4">
          {loadingWallets ? (
            <div className="tw:grid tw:sm:grid-cols-2 tw:lgtw:grid-cols-3 tw:gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="tw:h-32 tw:rounded-2xl tw:bg-[#F5F0FF] tw:border tw:border-[#E1D6FF] tw:animate-pulse tw:relative tw:overflow-hidden"
                >
                  <div className="tw:absolute tw:inset-0 tw:bg-[linear-gradient(110deg,transparent_0%,transparent_45%,rgba(255,255,255,0.8)_52%,transparent_60%,transparent_100%)] tw:animate-[shimmer_1.2s_infinite]" />
                </div>
              ))}
            </div>
          ) : !hasWallets ? (
            <div className="tw:rounded-3xl tw:border tw:border-dashed tw:border-[#D8C9FF] tw:bg-[radial-gradient(circle_at_0%_0%,#F4E6FD,transparent_55%),radial-gradient(circle_at_100%_0%,#FFF3FB,transparent_55%),linear-gradient(135deg,#FFFFFF,#F8F4FF)] tw:px-6 tw:md:px-10 tw:py-10 tw:flex tw:flex-col tw:items-center tw:justify-center tw:text-center tw:gap-4">
              <div className="tw:flex tw:items-center tw:justify-center tw:gap-3">
                <span className="tw:block tw:text-base tw:sm:text-lg tw:font-semibold tw:text-[#160322]">
                  No wallets yet. Let’s connect your first one.
                </span>
              </div>
              <span className="tw:block tw:text-xs tw:sm:text-sm tw:text-[#6B5AA0] tw:max-w-md">
                Add a USDT, USDC, BTC, ETH or SOL wallet to start receiving
                payouts from your live events. You can always add more or change
                your primary later.
              </span>
              <button
                style={{
                  borderRadius: 20,
                  fontSize: 12,
                }}
                type="button"
                onClick={() => setModalOpen(true)}
                className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-2xl tw:px-5 tw:py-2.5 tw:text-xs tw:font-semibold tw:text-white tw:bg-[radial-gradient(circle_at_0%_0%,#C115B5,transparent_55%),radial-gradient(circle_at_100%_0%,#8F07E7,transparent_55%),linear-gradient(135deg,#8F07E7,#C115B5)] tw:shadow-[0_12px_35px_rgba(143,7,231,0.4)] hover:tw:scale-[1.02] tw:transition"
              >
                <span className="tw:text-sm">＋</span>
                <span>Connect payout wallet</span>
              </button>
              <span className="tw:block tw:text-[10px] tw:text-[#8271B9] tw:max-w-sm">
                For now, keep things simple: one primary wallet for all payouts.
                As we roll out multi-wallet routing, you’ll be able to split
                flows per event or per revenue type.
              </span>
            </div>
          ) : (
            <div className="tw:grid tw:sm:grid-cols-2 tw:lgtw:grid-cols-3 tw:gap-4">
              {wallets.map((wallet) => {
                const isVerified =
                  wallet.status === "verified" || !!wallet.verified_at;
                const isPending =
                  wallet.status === "pending" ||
                  (!isVerified && wallet.status !== "failed");

                return (
                  <div
                    key={
                      wallet.id ||
                      `${wallet.currency}-${wallet.network}-${wallet.address}`
                    }
                    className="tw:relative tw:rounded-2xl tw:border tw:border-[#E1D6FF] tw:bg-[radial-gradient(circle_at_0%_0%,rgba(143,7,231,0.06),transparent_60%),linear-gradient(145deg,#FFFFFF,#F7F3FF)] tw:p-4 tw:flex tw:flex-col tw:gap-3 tw:overflow-hidden"
                  >
                    {wallet.is_primary && (
                      <span className="tw:absolute tw:right-3 tw:top-3 tw:rounded-full tw:bg-[#DCFCE7] tw:border tw:border-[#4ADE80]/60 tw:px-2 tw:py-0.5 tw:text-[10px] tw:uppercase tw:tracking-wide tw:text-[#166534]">
                        Primary
                      </span>
                    )}

                    <div className="tw:flex tw:items-center tw:gap-2">
                      <div className="tw:flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-[#F4E6FD] tw:text-sm tw:font-semibold tw:text-[#3B0764]">
                        <span>{wallet.currency?.toUpperCase?.() || "CR"}</span>
                      </div>
                      <div className="tw:flex tw:flex-col tw:gap-0.5 tw:min-w-0">
                        <span className="tw:text-xs tw:font-semibold tw:text-[#1E1034] tw:truncate">
                          {wallet.currency?.toUpperCase?.()} •{" "}
                          {wallet.network_type === "testnet"
                            ? `${wallet.network} (testnet)`
                            : wallet.network}
                        </span>
                        <span className="tw:text-[10px] tw:text-[#7C6AAE] tw:truncate">
                          {wallet.address}
                        </span>
                      </div>
                    </div>

                    <div className="tw:flex tw:items-center tw:justify-between tw:gap-2 tw:mt-1">
                      <span className="tw:inline-flex tw:items-center tw:gap-1 tw:rounded-full tw:px-2 tw:py-1 tw:text-[10px]">
                        {/* <span className="tw:inline-block tw:h-1.5 tw:w-1.5 tw:rounded-full tw:bg-[#22C55E]" /> */}
                        {/* <span className="tw:text-[#166534]">
                          {wallet.network_type === "prod"
                            ? "Live payouts enabled"
                            : "Testnet only"}
                        </span> */}
                      </span>

                      <span className="tw:flex tw:flex-col tw:items-end tw:gap-0.5">
                        <span className="tw:text-[10px] tw:text-[#8A7BB3]">
                          {wallet.created_at
                            ? new Date(wallet.created_at).toLocaleDateString()
                            : "Added"}
                        </span>
                        {!isVerified && (
                          <button
                            type="button"
                            onClick={() => openVerify(wallet, null)}
                            className="tw:text-[10px] tw:text-[#DC2626] tw:underline tw:underline-offset-2 tw:decoration-dotted hover:tw:text-[#B91C1C] tw:transition"
                          >
                            <span>Verify</span>
                          </button>
                        )}
                      </span>
                    </div>

                    
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal */}
        <AddWalletModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          token={token}
          options={options}
          onCreated={handleWalletCreated}
        />
        <VerifyWalletModal
          open={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          token={token}
          wallet={walletToVerify}
          ownership={ownershipInfo}
          onVerified={handleWalletVerified}
        />
      </div>
    </div>
  );
}
