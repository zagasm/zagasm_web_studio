import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../../pages/auth/AuthContext";
import { api } from "../../../../../lib/apiClient";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showError } from "../../../../../component/ui/toast";
import SelectField from "../../../../../component/form/SelectField";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const schema = z
  .object({
    price: z.number().min(0, "Ticket price must be at least 0"),
    maxTickets: z.enum(["limited", "unlimited"]),
    ticketLimit: z
      .number()
      .min(1, "Ticket limit must be at least 1")
      .optional(),
    currency: z.string().min(1, "Please select a currency"),
    hasBackstage: z.boolean().optional(),
    backstagePrice: z
      .number()
      .min(1, "Backstage price must be at least 1")
      .optional(),
  })
  .refine((d) => d.maxTickets !== "limited" || d.ticketLimit, {
    message: "Ticket limit is required when tickets are limited",
    path: ["ticketLimit"],
  })
  .refine((d) => !d.hasBackstage || !!d.backstagePrice, {
    message: "Backstage price is required when backstage is enabled",
    path: ["backstagePrice"],
  });

export default function TicketingStep({ defaultValues = {}, onBack, onNext }) {
  const { token } = useAuth();
  const [currencies, setCurrencies] = useState([]);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  // FX preview state
  const [fxPreview, setFxPreview] = useState(null); // holds API payload
  const [fxLoading, setFxLoading] = useState(false);
  const [fxError, setFxError] = useState(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      price: 0,
      maxTickets: "unlimited",
      currency: "",
      hasBackstage: false,
      backstagePrice: undefined,
      ...defaultValues,
    },
  });

  const maxTickets = watch("maxTickets");
  const currencyVal = watch("currency");
  const hasBackstage = watch("hasBackstage");
  const priceVal = watch("price");

  // Fetch currencies
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingCurrencies(true);
        const res = await api.get("/api/v1/currency", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list = res?.data?.currencies || res?.data?.data || [];
        if (mounted) setCurrencies(Array.isArray(list) ? list : []);
      } catch {
        showError("Failed to load currencies");
      } finally {
        mounted && setLoadingCurrencies(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [token]);

  const currencyOptions = useMemo(
    () =>
      currencies.map((c) => ({
        value: String(c.id),
        label: `${c.symbol} - ${c.name} (${c.code})`,
      })),
    [currencies]
  );

  useEffect(() => {
    if (!currencyOptions.length || currencyVal) return;
    setValue("currency", currencyOptions[0].value, { shouldValidate: true });
  }, [currencyOptions, currencyVal, setValue]);

  // FX rate preview: price → USD using backend endpoint
  useEffect(() => {
    const numericPrice =
      typeof priceVal === "number" ? priceVal : Number(priceVal);

    // reset when no currency or invalid price
    if (
      !currencyVal ||
      !numericPrice ||
      isNaN(numericPrice) ||
      numericPrice <= 0
    ) {
      setFxPreview(null);
      setFxError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setFxLoading(true);
        setFxError(null);

        const res = await api.get("/api/v1/fx/rate-to-usd", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          params: {
            currency_id: currencyVal,
            price: numericPrice,
          },
        });

        const payload = res?.data?.data || res?.data;
        if (!cancelled) {
          setFxPreview(payload || null);
        }
      } catch (err) {
        if (!cancelled) {
          setFxPreview(null);
          setFxError("Could not fetch USD equivalent right now.");
        }
      } finally {
        !cancelled && setFxLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currencyVal, priceVal, token]);

  const onSubmit = async (vals) => {
    // Enforce the $1 minimum using the FX endpoint result
    const priceInUsd = fxPreview ? Number(fxPreview.price_in_usd) : null;

    if (priceInUsd !== null && !isNaN(priceInUsd) && priceInUsd < 1) {
      showError("Ticket price is below $1. Please increase the amount.");
      return;
    }

    // If we don’t have FX data but we have a price & currency, you can either:
    // - trust backend to enforce it, or
    // - optionally fire a quick check here before calling onNext.
    // For now, we let the backend double-check.

    onNext(vals);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="tw:bg-white tw:rounded-2xl tw:p-5 tw:sm:p-7 tw:border tw:border-gray-100"
    >
      <span className="tw:block tw:text-lg tw:lg:text-2xl tw:sm:text-lg tw:font-semibold tw:mb-5">
        Ticketing &amp; Pricing
      </span>

      <div className="tw:space-y-5">
        {/* Ticket price + USD helper */}
        <div>
          <label className="tw:block tw:text-[15px] tw:mb-1">
            Ticket Price*
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("price", { valueAsNumber: true })}
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
          />
          {errors.price && (
            <p className="tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.price.message}
            </p>
          )}

          {/* FX preview line */}
          {currencyVal && priceVal > 0 && (
            <>
              {fxLoading && (
                <span className="tw:block tw:text-[11px] tw:text-slate-500 tw:mt-1">
                  Checking USD equivalent…
                </span>
              )}
              {fxError && (
                <span className="tw:block tw:text-[11px] tw:text-red-500 tw:mt-1">
                  {fxError}
                </span>
              )}
              {fxPreview && !fxError && (
                <span className="tw:block tw:text-[11px] tw:mt-1">
                  ≈{" "}
                  <span className="tw:font-semibold">
                    ${Number(fxPreview.price_in_usd || 0).toFixed(2)}
                  </span>{" "}
                  USD{" "}
                  {Number(fxPreview.price_in_usd || 0) < 1 && (
                    <span className="tw:text-amber-700 tw:ml-1">
                      (minimum allowed is $1.00)
                    </span>
                  )}
                </span>
              )}
            </>
          )}
        </div>

        {/* Currency as Autocomplete combo box */}
        <div>
          <label className="tw:block tw:text-[15px] tw:mb-1">Currency*</label>
          <Autocomplete
            options={currencyOptions}
            getOptionLabel={(option) => option.label || ""}
            value={
              currencyOptions.find((opt) => opt.value === currencyVal) || null
            }
            onChange={(event, newValue) => {
              setValue("currency", newValue ? newValue.value : "", {
                shouldValidate: true,
              });
            }}
            disabled
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={loadingCurrencies ? "Loading…" : "Currency locked"}
                size="small"
                error={!!errors.currency}
                helperText={errors.currency?.message}
              />
            )}
          />
        </div>

        {/* Ticket availability */}
        <SelectField
          label="Ticket Availability*"
          value={watch("maxTickets")}
          onChange={(v) => setValue("maxTickets", v, { shouldValidate: true })}
          options={[
            { value: "unlimited", label: "Unlimited tickets" },
            { value: "limited", label: "Limited tickets" },
          ]}
          error={errors?.maxTickets?.message}
        />

        {maxTickets === "limited" && (
          <div>
            <label className="tw:block tw:text-[15px] tw:mb-1">
              Total Number of Tickets*
            </label>
            <input
              type="number"
              min="1"
              {...register("ticketLimit", { valueAsNumber: true })}
              className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
            />
            {errors.ticketLimit && (
              <p className="tw:text-red-500 tw:text-xs tw:mt-1">
                {errors.ticketLimit.message}
              </p>
            )}
          </div>
        )}

        {/* Backstage access */}
        <div className="tw:flex tw:items-center tw:gap-3">
          <input
            id="has_backstage"
            type="checkbox"
            {...register("hasBackstage")}
            className="tw:h-4 tw:w-4 tw:rounded tw:border-gray-300"
          />
          <label
            htmlFor="has_backstage"
            className="tw:text-[15px] tw:select-none"
          >
            Offer backstage access
          </label>
        </div>

        {hasBackstage && (
          <div>
            <label className="tw:block tw:text-[15px] tw:mb-1">
              Backstage Price*
            </label>
            <input
              type="number"
              min="1"
              {...register("backstagePrice", { valueAsNumber: true })}
              className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
            />
            {errors.backstagePrice && (
              <p className="tw:text-red-500 tw:text-xs tw:mt-1">
                {errors.backstagePrice.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="tw:flex tw:justify-between tw:mt-6">
        <button
          style={{ borderRadius: 20 }}
          type="button"
          onClick={onBack}
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-200 hover:tw:bg-gray-50"
        >
          Back
        </button>
        <button
          style={{ borderRadius: 20 }}
          type="submit"
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:bg-primary tw:text-white hover:tw:bg-primarySecond"
        >
          Next
        </button>
      </div>
    </form>
  );
}
