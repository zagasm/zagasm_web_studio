import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// MUI (inputs, combos, modal, stepper)
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Step,
  StepLabel,
  Stepper,
  TextField,
  useMediaQuery,
  Autocomplete,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { showError, showSuccess, showPromise } from "../../component/ui/toast";

const BANKS_CACHE_KEY = "zagasm_banks_cache_v1";
const BANKS_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function loadBanksFromCache() {
  try {
    const raw = localStorage.getItem(BANKS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.banks || !parsed.updatedAt) return null;

    const isExpired = Date.now() - parsed.updatedAt > BANKS_CACHE_TTL_MS;
    if (isExpired) return null;

    return parsed.banks;
  } catch {
    return null;
  }
}

function saveBanksToCache(banks) {
  try {
    localStorage.setItem(
      BANKS_CACHE_KEY,
      JSON.stringify({ banks, updatedAt: Date.now() })
    );
  } catch {
    // ignore
  }
}

const BecomeOrganiser = () => {
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("md"));

  // first screen: verification method
  const [verificationMethod, setVerificationMethod] = useState(null); // "bank" | "crypto" | null

  // bank flow: 2 steps (0 = account details, 1 = BVN)
  const [bankStep, setBankStep] = useState(0);

  const [banks, setBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [banksError, setBanksError] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifiedAccount, setVerifiedAccount] = useState(null);
  const [autoVerifyError, setAutoVerifyError] = useState(null);
  const [savingBank, setSavingBank] = useState(false);

  // BVN
  const [bvn, setBvn] = useState("");
  const [bvnLoading, setBvnLoading] = useState(false);
  const [bvnError, setBvnError] = useState(null);

  // crypto flow (front-end only for now)
  const [cryptoNetwork, setCryptoNetwork] = useState("USDT-TRC20");
  const [cryptoAddress, setCryptoAddress] = useState("");
  const [cryptoTag, setCryptoTag] = useState("");

  const [processingOpen, setProcessingOpen] = useState(false);

  const profileName = useMemo(
    () =>
      user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
    [user]
  );

  // fetch banks with cache only when user chose bank method
  useEffect(() => {
    if (verificationMethod !== "bank") return;

    const cached = loadBanksFromCache();
    if (cached) {
      setBanks(cached);
      return;
    }

    const fetchBanks = async () => {
      setBanksLoading(true);
      setBanksError(null);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/banks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const list = res.data?.banks || [];
        setBanks(list);
        saveBanksToCache(list);
      } catch (e) {
        const message =
          e?.response?.data?.message || "Unable to fetch banks at the moment.";
        setBanksError(message);
        showError(message);
      } finally {
        setBanksLoading(false);
      }
    };

    fetchBanks();
  }, [verificationMethod, token]);

  // auto-verify bank when bank + 10-digit account number are available
  useEffect(() => {
    const canVerify =
      verificationMethod === "bank" &&
      bankStep === 0 &&
      selectedBank &&
      accountNumber &&
      accountNumber.length === 10;

    if (!canVerify) {
      setVerifiedAccount(null);
      setAutoVerifyError(null);
      return;
    }

    let cancelled = false;
    const runVerify = async () => {
      setVerifyLoading(true);
      setAutoVerifyError(null);
      try {
        const promise = axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/banks/verify`,
          {
            bank_code: selectedBank.code,
            account_number: accountNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // optional toast while verifying
        showPromise(promise, {
          loading: "Verifying bank details...",
          success: "Bank account verified",
          error: "Unable to verify bank account",
        });

        const res = await promise;

        if (cancelled) return;

        const data = res.data?.data;
        setVerifiedAccount(data || null);
      } catch (e) {
        if (cancelled) return;
        const message =
          e?.response?.data?.message ||
          "We couldn't verify this account. Please check the details.";
        setVerifiedAccount(null);
        setAutoVerifyError(message);
        showError(message);
      } finally {
        if (!cancelled) setVerifyLoading(false);
      }
    };

    runVerify();

    return () => {
      cancelled = true;
    };
  }, [verificationMethod, bankStep, selectedBank, accountNumber, token]);

  // save bank details before going to BVN step
  const handleSaveBankAndContinue = async () => {
    if (!selectedBank || !accountNumber || accountNumber.length !== 10) return;
    if (!verifiedAccount) {
      showError("Please wait for your bank account to be verified.");
      return;
    }

    setSavingBank(true);
    try {
      const promise = axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/organiser/kyc/bank/save`,
        {
          bank_code: selectedBank.code,
          account_number: accountNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await showPromise(promise, {
        loading: "Saving bank details...",
        success: "Bank details saved",
        error: "Failed to save bank details",
      });

      setBankStep(1); // move to "Verify identity" (BVN)
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        "We couldn't save your bank details. Please try again.";
      showError(message);
    } finally {
      setSavingBank(false);
    }
  };

  const handleSubmitBvn = async () => {
    if (!bvn || bvn.length < 11) return;

    setBvnLoading(true);
    setBvnError(null);

    try {
      const promise = axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/organiser/kyc/bvn`,
        {
          bvn,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await showPromise(promise, {
        loading: "Submitting BVN...",
        success: "BVN submitted, we’re processing your verification",
        error: "Failed to submit BVN",
      });

      await refreshUser();

      setProcessingOpen(true);

      setTimeout(() => {
        setProcessingOpen(false);
        showSuccess("We’re reviewing your details");
        navigate(`/profile/${user?.id}`);
      }, 2500);
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        "We couldn't verify your BVN. Please confirm and try again.";
      setBvnError(message);
      showError(message);
    } finally {
      setBvnLoading(false);
    }
  };

  const handleCryptoSubmit = async () => {
    if (!cryptoAddress) {
      showError("Please enter your wallet address.");
      return;
    }

    // front-end only for now – just show promise UI
    const fakePromise = new Promise((resolve) =>
      setTimeout(() => resolve(true), 1500)
    );

    await showPromise(fakePromise, {
      loading: "Saving crypto payout details...",
      success: "Crypto payout details saved",
      error: "Failed to save crypto payout details",
    });

    setProcessingOpen(true);
    setTimeout(() => {
      setProcessingOpen(false);
      showSuccess("We’re reviewing your details");
      navigate(`/profile/${user?.id}`);
    }, 2000);
  };

  // STEP 0: Choose verification method
  const renderMethodChoice = () => (
    <div className="tw:w-full tw:min-h-[260px] tw:flex tw:flex-col tw:gap-6">
      <div>
        <span className="tw:inline-flex tw:items-center tw:gap-2 tw:text-[11px] tw:font-medium tw:uppercase tw:tracking-[0.16em] tw:text-gray-500 tw:bg-lightPurple/60 tw:px-3 tw:py-1 tw:rounded-full">
          <span className="tw:w-1.5 tw:h-1.5 tw:rounded-full tw:bg-primary" />
          Organiser onboarding
        </span>
        <h1 className="tw:mt-3 tw:text-2xl tw:md:text-3xl tw:font-semibold tw:text-[#111827]">
          Choose how you want to be verified
        </h1>
        <p className="tw:mt-2 tw:text-xs tw:md:text-sm tw:text-gray-600 tw:max-w-xl">
          Pick a verification method to connect payouts and unlock organiser
          tools. You can update your payout details later from your profile.
        </p>
      </div>

      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-4 tw:mt-2">
        {/* Bank method card */}
        <button
          style={{
            borderRadius: 8,
          }}
          type="button"
          onClick={() => {
            setVerificationMethod("bank");
            setBankStep(0);
          }}
          className={`tw:group tw:w-full tw:text-left tw:rounded-2xl tw:border tw:px-4 tw:py-4 tw:transition tw:duration-150 tw:bg-white tw:shadow-sm hover:tw:shadow-md ${
            verificationMethod === "bank"
              ? "tw:border-primary tw:bg-lightPurple/40 tw:ring-2 tw:ring-primary/20"
              : "tw:border-gray-200 hover:tw:border-gray-300"
          }`}
        >
          <div className="tw:flex tw:items-start tw:gap-3">
            <div className="tw:flex tw:items-center tw:justify-center tw:w-9 tw:h-9 tw:rounded-xl tw:bg-primary/10 tw:text-primary tw:text-sm tw:font-semibold">
              ₦
            </div>
            <div className="tw:flex-1">
              <span className="tw:block tw:text-sm tw:font-semibold tw:mb-1">
                Bank verification
              </span>
              <span className="tw:block tw:text-xs tw:text-gray-600 tw:leading-relaxed">
                Connect a Nigerian bank account and verify it with your BVN.
                Best for naira payouts and local events.
              </span>
            </div>
          </div>
          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-[11px] tw:text-primary tw:font-medium tw:mt-3 tw:opacity-80 group-hover:tw:opacity-100">
            Recommended for organisers in Nigeria
          </span>
        </button>

        {/* Crypto method card */}
        {/* <button
          style={{
            borderRadius: 8,
          }}
          type="button"
          onClick={() => {
            setVerificationMethod("crypto");
          }}
          className={`tw:group tw:w-full tw:text-left tw:rounded-2xl tw:border tw:px-4 tw:py-4 tw:transition tw:duration-150 tw:bg-white tw:shadow-sm hover:tw:shadow-md ${
            verificationMethod === "crypto"
              ? "tw:border-primary tw:bg-lightPurple/40 tw:ring-2 tw:ring-primary/20"
              : "tw:border-gray-200 hover:tw:border-gray-300"
          }`}
        >
          <div className="tw:flex tw:items-start tw:gap-3">
            <div className="tw:flex tw:items-center tw:justify-center tw:w-9 tw:h-9 tw:rounded-xl tw:bg-[#0F172A] tw:text-white tw:text-xs tw:font-semibold">
              ₿
            </div>
            <div className="tw:flex-1">
              <span className="tw:block tw:text-sm tw:font-semibold tw:mb-1">
                Crypto verification
              </span>
              <span className="tw:block tw:text-xs tw:text-gray-600 tw:leading-relaxed">
                Add a stablecoin or BTC wallet for payouts. We’ll still review
                your profile details to keep buyers safe.
              </span>
            </div>
          </div>
          <span className="tw:inline-flex tw:items-center tw:gap-1 tw:text-[11px] tw:text-gray-700 tw:font-medium tw:mt-3">
            Ideal for international payouts
          </span>
        </button> */}
      </div>

      <div className="tw:flex tw:justify-end tw:mt-2">
        <button
          style={{
            borderRadius: 8,
          }}
          type="button"
          disabled={!verificationMethod}
          className="tw:inline-flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:rounded-xl tw:text-xs tw:md:text-sm tw:font-semibold tw:bg-primary tw:text-white disabled:tw:opacity-50 disabled:tw:cursor-not-allowed tw:shadow-sm hover:tw:shadow-md tw:transition"
        >
          <span>
            {verificationMethod
              ? "Method selected"
              : "Select a method to continue"}
          </span>
          {verificationMethod && (
            <span className="tw:text-[10px] tw:bg-white/15 tw:rounded-full tw:px-2 tw:py-0.5">
              Step 1 of 2
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // BANK STEP 1: Account details + auto verification
  const renderBankAccountStep = () => (
    <div className="tw:space-y-4">
      <div>
        <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.16em] tw:text-gray-500 tw:mb-1">
          Payout account
        </span>
        <span className="tw:block tw:text-lg tw:md:text-xl tw:font-semibold tw:mb-1">
          Add your bank account
        </span>
        <span className="tw:block tw:text-xs tw:md:text-sm tw:text-gray-600 tw:max-w-xl">
          We&apos;ll send your payouts to this account. Make sure it matches
          your BVN and profile name to avoid delays.
        </span>
      </div>

      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-3 tw:gap-3">
        <div className="tw:md:col-span-1">
          <TextField
            label="Account number"
            fullWidth
            value={accountNumber}
            onChange={(e) =>
              setAccountNumber(e.target.value.replace(/\D/g, ""))
            }
            inputProps={{ maxLength: 10 }}
          />
        </div>
        <div className="tw:md:col-span-2">
          <Autocomplete
            options={banks}
            getOptionLabel={(option) => option.name || ""}
            loading={banksLoading}
            value={selectedBank}
            onChange={(_, value) => setSelectedBank(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select bank"
                helperText={
                  banksError ? banksError : "Start typing to search your bank"
                }
                error={Boolean(banksError)}
              />
            )}
          />
        </div>
      </div>

      {/* Auto-verified account name */}
      <div className="tw:mt-2">
        {verifyLoading && (
          <span className="tw:block tw:text-[11px] tw:text-gray-500">
            Verifying account details...
          </span>
        )}
        {verifiedAccount && !verifyLoading && (
          <div className="tw:bg-[#F5F5F7] tw:rounded-2xl tw:px-4 tw:py-3 tw:flex tw:flex-col tw:gap-1 tw:border tw:border-gray-200">
            <span className="tw:text-[11px] tw:uppercase tw:tracking-[0.12em] tw:text-gray-500">
              Account name (from bank)
            </span>
            <span className="tw:text-sm tw:font-semibold tw:text-[#111827]">
              {verifiedAccount.account_name}
            </span>
            <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-2 tw:mt-1">
              <span className="tw:text-[11px] tw:text-gray-500">
                Profile name:
              </span>
              <span className="tw:text-[11px] tw:font-medium tw:text-gray-800 tw:bg-white tw:rounded-full tw:px-2 tw:py-0.5">
                {profileName || "Not set"}
              </span>
            </div>
          </div>
        )}
        {autoVerifyError && (
          <span className="tw:block tw:text-xs tw:text-red-500 tw:mt-1">
            {autoVerifyError}
          </span>
        )}
      </div>

      <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:mt-4">
        <button
          style={{
            borderRadius: 8,
          }}
          type="button"
          className="tw:inline-flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-300 tw:text-xs tw:md:text-sm tw:font-medium tw:bg-white hover:tw:bg-gray-50 tw:transition"
          onClick={() => {
            setVerificationMethod(null);
            setBankStep(0);
          }}
        >
          <span>Change method</span>
        </button>
        <button
          style={{
            borderRadius: 8,
          }}
          type="button"
          className="tw:inline-flex tw:items-center tw:gap-2 tw:px-5 tw:py-2 tw:rounded-xl tw:bg-primary tw:text-white tw:text-xs tw:md:text-sm tw:font-semibold tw:shadow-sm hover:tw:shadow-md disabled:tw:opacity-50 disabled:tw:cursor-not-allowed tw:transition"
          disabled={
            !selectedBank ||
            !accountNumber ||
            accountNumber.length !== 10 ||
            !verifiedAccount ||
            savingBank ||
            verifyLoading
          }
          onClick={handleSaveBankAndContinue}
        >
          <span>{savingBank ? "Saving..." : "Continue to identity check"}</span>
        </button>
      </div>
    </div>
  );

  // BANK STEP 2: BVN
  const renderBvnStep = () => (
    <div className="tw:space-y-4">
      <div>
        <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.16em] tw:text-gray-500 tw:mb-1">
          Identity check
        </span>
        <span className="tw:block tw:text-lg tw:md:text-xl tw:font-semibold tw:mb-1">
          Verify your identity (BVN)
        </span>
        <span className="tw:block tw:text-xs tw:md:text-sm tw:text-gray-600 tw:max-w-xl">
          We use your BVN to confirm that your bank account belongs to you. We
          don&apos;t share this with anyone, and it doesn&apos;t give us access
          to your funds.
        </span>
      </div>

      <div className="tw:max-w-sm">
        <TextField
          label="BVN"
          fullWidth
          value={bvn}
          onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
          inputProps={{ maxLength: 11 }}
          error={Boolean(bvnError)}
          helperText={
            bvnError || "Enter the 11-digit BVN linked to this account"
          }
        />
        <p className="tw:mt-2 tw:text-[11px] tw:text-gray-500">
          Your BVN is encrypted and used only for verification purposes.
        </p>
      </div>

      <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:mt-4">
        <button
          style={{
            borderRadius: 8,
          }}
          type="button"
          className="tw:inline-flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-300 tw:text-xs tw:md:text-sm tw:font-medium tw:bg-white hover:tw:bg-gray-50 tw:transition"
          onClick={() => setBankStep(0)}
        >
          <span>Back to bank details</span>
        </button>
        <button
          type="button"
          className="tw:inline-flex tw:items-center tw:gap-2 tw:px-5 tw:py-2 tw:rounded-xl tw:bg-primary tw:text-white tw:text-xs tw:md:text-sm tw:font-semibold tw:shadow-sm hover:tw:shadow-md disabled:tw:opacity-50 disabled:tw:cursor-not-allowed tw:transition"
          disabled={!bvn || bvn.length < 11 || bvnLoading}
          onClick={handleSubmitBvn}
        >
          <span>{bvnLoading ? "Submitting..." : "Submit BVN"}</span>
        </button>
      </div>
    </div>
  );

  // CRYPTO DETAILS (after selecting crypto method)
  const renderCryptoStep = () => (
    <div className="tw:space-y-4">
      <div>
        <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.16em] tw:text-gray-500 tw:mb-1">
          Payout wallet
        </span>
        <span className="tw:block tw:text-lg tw:md:text-xl tw:font-semibold tw:mb-1">
          Add your crypto payout details
        </span>
        <span className="tw:block tw:text-xs tw:md:text-sm tw:text-gray-600 tw:max-w-xl">
          We&apos;ll use this wallet to send your payouts. Only add a wallet you
          control and have backed up.
        </span>
      </div>

      <div className="tw:grid tw:grid-cols-1 tw:gap-3 tw:max-w-xl">
        <div>
          <TextField
            select
            fullWidth
            SelectProps={{ native: true }}
            label="Network"
            value={cryptoNetwork}
            onChange={(e) => setCryptoNetwork(e.target.value)}
          >
            <option value="USDT-TRC20">USDT (TRC20)</option>
            <option value="USDT-ERC20">USDT (ERC20)</option>
            <option value="USDC-ERC20">USDC (ERC20)</option>
            <option value="BTC">BTC</option>
          </TextField>
        </div>
        <div>
          <TextField
            label="Wallet address"
            fullWidth
            value={cryptoAddress}
            onChange={(e) => setCryptoAddress(e.target.value)}
          />
        </div>
        <div>
          <TextField
            label="Memo / Tag (optional)"
            fullWidth
            value={cryptoTag}
            onChange={(e) => setCryptoTag(e.target.value)}
          />
        </div>
      </div>

      <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:mt-4">
        <button
          style={{
            borderRadius: 8,
          }}
          type="button"
          className="tw:inline-flex tw:items-center tw:gap-2 tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-300 tw:text-xs tw:md:text-sm tw:font-medium tw:bg-white hover:tw:bg-gray-50 tw:transition"
          onClick={() => {
            setVerificationMethod(null);
          }}
        >
          <span>Change method</span>
        </button>
        <button
          style={{
            borderRadius: 8,
          }}
          type="button"
          className="tw:inline-flex tw:items-center tw:gap-2 tw:px-5 tw:py-2 tw:rounded-xl tw:bg-primary tw:text-white tw:text-xs tw:md:text-sm tw:font-semibold tw:shadow-sm hover:tw:shadow-md disabled:tw:opacity-50 disabled:tw:cursor-not-allowed tw:transition"
          disabled={!cryptoAddress}
          onClick={handleCryptoSubmit}
        >
          <span>Save and continue</span>
        </button>
      </div>
    </div>
  );

  const bankStepperSteps = ["Account details", "Verify identity"];

  return (
    <div className="tw:min-h-screen tw:bg-linear-to-b tw:from-lightPurple/60 tw:via-[#F8F5FF] tw:to-white tw:pt-24 tw:md:pt-28 tw:px-4">
      <div className="tw:max-w-6xl tw:mx-auto tw:pb-10">
        {/* Top heading strip */}
        <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:mb-4">
          <div>
            <p className="tw:text-[11px] tw:uppercase tw:font-medium tw:text-primary tw:tracking-[0.16em]">
              Zagasm Studios · Organisers
            </p>
            <span className="tw:text-xl tw:md:text-2xl tw:font-semibold tw:text-[#111827] tw:mt-1">
              Set up payouts & verification
            </span>
          </div>
          <div className="tw:hidden tw:md:flex tw:flex-col tw:items-end tw:text-right">
            <span className="tw:text-[11px] tw:text-gray-500">
              Logged in as
            </span>
            <span className="tw:text-xs tw:font-medium tw:text-gray-800">
              {profileName || user?.email || "Your account"}
            </span>
          </div>
        </div>

        {/* Main layout: wizard + info card */}
        <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] tw:gap-6">
          {/* Wizard card */}
          <div className="tw:bg-white tw:rounded-3xl tw:px-4 tw:py-5 tw:md:px-6 tw:md:py-6 tw:shadow-[0_18px_45px_rgba(15,23,42,0.08)] tw:border tw:border-white/60">
            {/* stepper only when bank method is selected */}
            {verificationMethod === "bank" && (
              <div className="tw:mb-5 tw:border-b tw:border-gray-100 tw:pb-4">
                <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
                  <span className="tw:text-[11px] tw:text-gray-500 tw:font-medium">
                    Bank verification ·{" "}
                    <span className="tw:text-primary">
                      Step {bankStep + 1} of {bankStepperSteps.length}
                    </span>
                  </span>
                </div>
                <Stepper
                  activeStep={bankStep}
                  alternativeLabel={!isSmall}
                  orientation={isSmall ? "vertical" : "horizontal"}
                >
                  {bankStepperSteps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            )}

            {/* content */}
            <div className="tw:mt-2">
              {!verificationMethod && renderMethodChoice()}
              {verificationMethod === "bank" &&
                bankStep === 0 &&
                renderBankAccountStep()}
              {verificationMethod === "bank" &&
                bankStep === 1 &&
                renderBvnStep()}
              {verificationMethod === "crypto" && renderCryptoStep()}
            </div>
          </div>

          {/* Onboarding info / benefits card */}
          <div className="tw:rounded-3xl tw:px-4 tw:py-5 tw:md:px-6 tw:md:py-6 tw:text-white tw:bg-linear-to-br tw:from-[#170F2E] tw:via-[#3B1E73] tw:to-[#9105B4] tw:shadow-[0_18px_45px_rgba(15,23,42,0.5)] tw:relative tw:overflow-hidden">
            <div className="tw:absolute tw:inset-0 tw:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14)_0,transparent_55%)] tw:pointer-events-none" />
            <div className="tw:relative tw:space-y-4">
              <span className="tw:block tw:text-[11px] tw:uppercase tw:text-gray-200 tw:font-medium tw:tracking-[0.16em]">
                Why we verify organisers
              </span>
              <h3 className="tw:text-xl tw:md:text-2xl tw:font-semibold tw:mb-2">
                Build trust with attendees and get paid faster
              </h3>

              <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:mt-3">
                <div className="tw:bg-white/5 tw:rounded-2xl tw:px-4 tw:py-3 tw:border tw:border-white/10">
                  <span className="tw:block tw:text-xs tw:font-semibold tw:mb-1">
                    What you&apos;ll need
                  </span>
                  <span className="tw:block tw:text-[11px] tw:text-gray-100 tw:leading-relaxed">
                    • A bank account or crypto wallet
                    <br />
                    • Your BVN (for bank payouts)
                    <br />• A few minutes to confirm your details
                  </span>
                </div>
                <div className="tw:bg-white/5 tw:rounded-2xl tw:px-4 tw:py-3 tw:border tw:border-white/10">
                  <span className="tw:block tw:text-xs tw:font-semibold tw:mb-1">
                    What you get
                  </span>
                  <span className="tw:block tw:text-[11px] tw:text-gray-100 tw:leading-relaxed">
                    • Fast, reliable payouts
                    <br />
                    • Better trust with attendees
                    <br />• Access to organiser analytics and tools
                  </span>
                </div>
              </div>

              <div className="tw:mt-3 tw:pt-3 tw:border-t tw:border-white/10 tw:flex tw:flex-col tw:gap-1 tw:text-[11px] tw:text-gray-100">
                <span>
                  We run automated checks first. In some cases, our team may ask
                  for a little more info before activating payouts.
                </span>
                <span className="tw:opacity-80">
                  Need help? You can always update your payout details from
                  Settings &gt; Payouts.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing modal */}
      <Dialog open={processingOpen} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          Processing verification
        </DialogTitle>
        <DialogContent>
          <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:gap-3 tw:py-4">
            <div className="tw:w-24 tw:h-24 tw:rounded-full tw:bg-lightPurple/70 tw:flex tw:items-center tw:justify-center tw:mb-1">
              <img
                src="/images/processing.gif"
                alt="Processing"
                className="tw:w-20 tw:h-20 tw:object-contain"
              />
            </div>
            <span className="tw:block tw:text-sm tw:text-center tw:text-gray-700">
              We&apos;re verifying your details. This usually takes a short
              while. You can continue using the app — we&apos;ll update your
              profile once it&apos;s done.
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BecomeOrganiser;
