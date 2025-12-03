import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { api, authHeaders } from "../../lib/apiClient";
import { showError, showPromise } from "../../component/ui/toast";

import BillingToggle from "../../component/subscription/BillingToggle";
import PlanCard from "../../component/subscription/PlanCard";
import FreeEligibilityCard from "../../component/subscription/FreeEligibility";
import SmallSupportCard from "../../component/subscription/SmallSupportCard";
import PlansSkeleton from "../../component/subscription/PlansSkeleton";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SubscriptionsPage({}) {
  const { token: authToken, user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [plansMeta, setPlansMeta] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const [eligibility, setEligibility] = useState(null);
  const [loadingEligibility, setLoadingEligibility] = useState(true);

  const [billingInterval, setBillingInterval] = useState("monthly");
  const [initializingPlanId, setInitializingPlanId] = useState(null);

  const isAuthenticated = !!authToken;

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!user) return;

    if (user.subscription != null) {
      navigate("/account", { replace: true });
    }
  }, [user, isAuthenticated, navigate]);

  useEffect(() => {
    fetchPlans();
    fetchEligibility();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPlans(page = 1) {
    try {
      setLoadingPlans(true);
      const res = await api.get("/api/v1/subscription-plans", {
        params: { page },
        ...authHeaders(authToken),
      });

      const payload = res?.data?.data;
      const items = payload?.data || [];
      setPlans(items);
      setPlansMeta({
        currentPage: payload?.current_page,
        lastPage: payload?.last_page,
        total: payload?.total,
      });
    } catch (err) {
      console.error(err);
      showError("Unable to load subscription plans.");
    } finally {
      setLoadingPlans(false);
    }
  }

  async function fetchEligibility() {
    try {
      setLoadingEligibility(true);
      const res = await api.get("/api/v1/free-plan/eligibility", {
        ...authHeaders(authToken),
      });
      setEligibility(res?.data?.data || null);
    } catch (err) {
      console.error(err);
      // non-blocking error
    } finally {
      setLoadingEligibility(false);
    }
  }

  function handleChangeInterval(next) {
    setBillingInterval(next);
  }

  async function handleSubscribe(plan) {
    if (!isAuthenticated) {
      showError("Please sign in to subscribe.");
      return;
    }

    try {
      setInitializingPlanId(plan.id);

      const promise = api.post(
        `/api/v1/user/subscription/create`,
        {
          plan_id: plan.id,
          billing_interval: billingInterval,
          channel: "card",
        },
        authHeaders(authToken)
      );

      showPromise(promise, {
        loading: "Initializing secure Paystack checkout…",
        success: "Redirecting to Paystack…",
        error: "Unable to start subscription. Please try again.",
      });

      const res = await promise;

      const data = res?.data?.data || res?.data || {};
      const redirectUrl =
        data.authorization_url ||
        data.checkout_url ||
        data.url ||
        data.redirect_url;

      if (!redirectUrl) {
        showError("Payment link not provided by server.");
        return;
      }

      window.location.href = redirectUrl;
    } catch (err) {
      console.error(err);
    } finally {
      setInitializingPlanId(null);
    }
  }

  const isFreeEligibleGlobal = eligibility?.eligible === true;

  return (
    <div className="tw:min-h-screen tw:bg-[#f5f5f7] tw:text-slate-900 tw:pt-24 tw:md:pt-28 tw:px-4 tw:pb-20 tw:flex tw:justify-center">
      <div className="tw:w-full tw:max-w-6xl">
        {/* Header */}
        <div className="tw:flex tw:flex-col tw:items-center tw:text-center tw:gap-4 tw:mb-10">
          <div className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-primary/5 tw:px-4 tw:py-1 tw:border tw:border-primary/15">
            <Sparkles className="tw:w-4 tw:h-4 tw:text-primary" />
            <span className="tw:text-xs tw:uppercase tw:tracking-[0.18em] tw:text-primary">
              Zagasm Studios • Subscriptions
            </span>
          </div>

          <div className="tw:max-w-3xl">
            <span className="tw:block tw:text-3xl tw:md:text-4xl tw:lg:text-5xl tw:font-semibold tw:leading-tight">
              Plans that scale with{" "}
              <span className="tw:bg-linear-to-r tw:from-primary tw:to-primarySecond tw:bg-clip-text tw:text-transparent">
                your events
              </span>
            </span>
          </div>

          <div className="tw:max-w-2xl">
            <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-600">
              Unlock more templates, more reach and deeper insights — without
              overthinking pricing. Switch between monthly and yearly anytime.
            </span>
          </div>

          <BillingToggle
            value={billingInterval}
            onChange={handleChangeInterval}
          />

          {!isAuthenticated && (
            <span className="tw:text-xs tw:mt-1 tw:text-amber-700">
              You’re viewing plans as a guest.{" "}
              <span className="tw:font-medium">
                Sign in to actually subscribe.
              </span>
            </span>
          )}
        </div>

        {/* Layout: Plans + side panel */}
        <div className="tw:grid tw:grid-cols-1 tw:lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] tw:gap-6">
          {/* Plans */}
          <section>
            {loadingPlans ? (
              <PlansSkeleton />
            ) : plans.length === 0 ? (
              <div className="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-white tw:px-6 tw:py-10 tw:text-center tw:shadow-sm">
                <span className="tw:text-slate-500 tw:text-sm">
                  No subscription plans are available yet.
                </span>
              </div>
            ) : (
              <div className="tw:grid tw:grid-cols-1 tw:gap-5">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    billingInterval={billingInterval}
                    selecting={initializingPlanId === plan.id}
                    isFreeEligibleGlobal={isFreeEligibleGlobal}
                    onSubscribe={() => handleSubscribe(plan)}
                  />
                ))}
              </div>
            )}

            {/* Pagination footer */}
            {plansMeta && plansMeta.lastPage > 1 && (
              <div className="tw:flex tw:items-center tw:justify-between tw:mt-6 tw:text-xs tw:text-slate-500">
                <span>
                  Page {plansMeta.currentPage} of {plansMeta.lastPage}
                </span>
                <div className="tw:flex tw:gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      fetchPlans(Math.max(1, plansMeta.currentPage - 1))
                    }
                    disabled={plansMeta.currentPage <= 1 || loadingPlans}
                    className="tw:px-3 tw:py-1 tw:rounded-full tw:border tw:border-slate-200 tw:bg-white disabled:tw:opacity-40 tw:text-slate-700 tw:shadow-sm"
                  >
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      fetchPlans(
                        Math.min(plansMeta.lastPage, plansMeta.currentPage + 1)
                      )
                    }
                    disabled={
                      plansMeta.currentPage >= plansMeta.lastPage ||
                      loadingPlans
                    }
                    className="tw:px-3 tw:py-1 tw:rounded-full tw:border tw:border-slate-200 tw:bg-white disabled:tw:opacity-40 tw:text-slate-700 tw:shadow-sm"
                  >
                    <span>Next</span>
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Side panel */}
          <aside className="tw:space-y-4">
            <FreeEligibilityCard
              eligibility={eligibility}
              loading={loadingEligibility}
            />
            {/* <SmallSupportCard /> */}
          </aside>
        </div>
      </div>
    </div>
  );
}
