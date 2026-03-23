import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../../pages/auth/AuthContext";
import { api } from "../../../../../lib/apiClient";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showError } from "../../../../../component/ui/toast";
import SelectField from "../../../../../component/form/SelectField";

const DISPLAY_CURRENCIES = [
  {
    value: "NGN",
    label: "Nigerian Naira",
    subLabel: "Minimum ticket price: ₦3,000",
    symbol: "₦",
    minimum: 3000,
  },
  {
    value: "USD",
    label: "US Dollar",
    subLabel: "Minimum ticket price: $3",
    symbol: "$",
    minimum: 3,
  },
];

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

function normalizeAmountInput(rawValue) {
  const raw = String(rawValue || "");
  const stripped = raw.replace(/,/g, "").replace(/[^\d.]/g, "");

  if (!stripped) return "";

  const firstDotIndex = stripped.indexOf(".");
  if (firstDotIndex === -1) {
    return stripped.replace(/^0+(?=\d)/, "");
  }

  const integerPart = stripped.slice(0, firstDotIndex).replace(/^0+(?=\d)/, "");
  const decimalPart = stripped
    .slice(firstDotIndex + 1)
    .replace(/\./g, "")
    .slice(0, 2);

  return `${integerPart || "0"}.${decimalPart}`;
}

function formatAmountDisplay(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  const normalized = normalizeAmountInput(value);
  if (!normalized) return "";

  const [integerPart, decimalPart] = normalized.split(".");
  const formattedInteger = Number(integerPart || 0).toLocaleString("en-NG");
  return decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;
}

function parseAmount(value) {
  const cleaned = String(value || "").replace(/,/g, "");
  if (!cleaned) return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function findCurrencyByCode(currencies, code) {
  return currencies.find((currency) => {
    const normalizedCode = String(currency?.code || "").toUpperCase();
    const normalizedSymbol = String(currency?.symbol || "").toUpperCase();
    const normalizedName = String(currency?.name || "").toUpperCase();

    return (
      normalizedCode === code ||
      normalizedSymbol === code ||
      normalizedName.includes(code)
    );
  });
}

const schema = z
  .object({
    priceInput: z.string().min(1, "Enter a ticket price"),
    maxTickets: z.enum(["limited", "unlimited"]),
    ticketLimit: z.string().optional(),
    currencyCode: z.enum(["NGN", "USD"]),
    visibility: z.enum(["public", "private"]),
    matureContent: z.boolean(),
  })
  .superRefine((values, ctx) => {
    const selectedCurrency = DISPLAY_CURRENCIES.find(
      (currency) => currency.value === values.currencyCode
    );
    const price = parseAmount(values.priceInput);

    if (price === null || price <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["priceInput"],
        message: "Enter a valid ticket price",
      });
    } else if (selectedCurrency && price < selectedCurrency.minimum) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["priceInput"],
        message: `Minimum ticket price for ${selectedCurrency.label} is ${selectedCurrency.symbol}${selectedCurrency.minimum.toLocaleString("en-NG")}`,
      });
    }

    if (values.maxTickets === "limited") {
      const parsedLimit = Number(values.ticketLimit || "");
      if (!Number.isFinite(parsedLimit) || parsedLimit < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ticketLimit"],
          message: "Ticket limit must be at least 1",
        });
      }
    }
  });

export default function TicketingStep({ defaultValues = {}, onBack, onNext }) {
  const { token } = useAuth();
  const [currencies, setCurrencies] = useState([]);

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      priceInput: formatAmountDisplay(defaultValues.price ?? 0) || "0",
      maxTickets: defaultValues.maxTickets || "unlimited",
      ticketLimit:
        defaultValues.ticketLimit !== undefined &&
        defaultValues.ticketLimit !== null
          ? String(defaultValues.ticketLimit)
          : "",
      currencyCode: defaultValues.currencyCode === "USD" ? "USD" : "NGN",
      visibility: defaultValues.visibility || "public",
      matureContent: !!defaultValues.matureContent,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const selectedCurrencyCode = watch("currencyCode");
  const maxTickets = watch("maxTickets");
  const visibility = watch("visibility");
  const selectedCurrency = useMemo(
    () =>
      DISPLAY_CURRENCIES.find(
        (currency) => currency.value === selectedCurrencyCode
      ) || DISPLAY_CURRENCIES[0],
    [selectedCurrencyCode]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const res = await api.get("/api/v1/currency", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list = res?.data?.currencies || res?.data?.data || [];
        if (!mounted) return;

        const normalized = Array.isArray(list) ? list : [];
        setCurrencies(normalized);

        if (!defaultValues.currencyCode && defaultValues.currency) {
          const matchedById = normalized.find(
            (currency) => String(currency.id) === String(defaultValues.currency)
          );
          if (matchedById?.code) {
            const code = String(matchedById.code).toUpperCase();
            if (code === "NGN" || code === "USD") {
              setValue("currencyCode", code, { shouldValidate: true });
            }
          }
        }
      } catch {
        showError("Failed to load currencies");
      }
    })();

    return () => {
      mounted = false;
    };
  }, [defaultValues.currency, defaultValues.currencyCode, setValue, token]);

  const onSubmit = (values) => {
    const matchedCurrency = findCurrencyByCode(currencies, values.currencyCode);
    if (!matchedCurrency?.id) {
      showError("Currency setup is not ready yet. Please try again.");
      return;
    }

    onNext({
      price: parseAmount(values.priceInput) ?? 0,
      maxTickets: values.maxTickets,
      ticketLimit:
        values.maxTickets === "limited"
          ? Number(values.ticketLimit || 0)
          : undefined,
      currency: String(matchedCurrency.id),
      currencyCode: values.currencyCode,
      visibility: values.visibility,
      matureContent: values.matureContent,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="tw:rounded-[32px] tw:border tw:border-gray-100 tw:bg-white tw:p-5 tw:shadow-[0_20px_60px_rgba(15,23,42,0.05)] tw:sm:p-7"
    >
      <div className="tw:mb-6 tw:flex tw:flex-col tw:gap-2">
        <span className="tw:text-lg tw:font-semibold tw:text-slate-900 tw:lg:text-2xl">
          Ticketing
        </span>
        <span className="tw:text-sm tw:text-slate-500">
          Set pricing, ticket availability, and attendee visibility controls.
        </span>
      </div>

      <div className="tw:space-y-5">
        <SelectField
          label="Currency"
          value={selectedCurrencyCode}
          onChange={(value) =>
            setValue("currencyCode", value, { shouldValidate: true })
          }
          options={DISPLAY_CURRENCIES}
          error={errors?.currencyCode?.message}
        />

        <div>
          <label className="tw:mb-1 tw:block tw:text-[15px]">Ticket price</label>
          <Controller
            name="priceInput"
            control={control}
            render={({ field }) => (
              <div className="tw:relative">
                <span className="tw:pointer-events-none tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-sm tw:text-slate-500">
                  {selectedCurrency.symbol}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={field.value}
                  onChange={(event) => {
                    const normalized = normalizeAmountInput(event.target.value);
                    field.onChange(normalized ? formatAmountDisplay(normalized) : "");
                  }}
                  className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-9 tw:py-2.5 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
                  placeholder={`Enter ticket price in ${selectedCurrency.label}`}
                />
              </div>
            )}
          />
          {errors.priceInput && (
            <p className="tw:mt-1 tw:text-xs tw:text-red-500">
              {errors.priceInput.message}
            </p>
          )}
        </div>

        <SelectField
          label="Ticket availability"
          value={maxTickets}
          onChange={(value) =>
            setValue("maxTickets", value, { shouldValidate: true })
          }
          options={[
            { value: "unlimited", label: "Unlimited tickets" },
            { value: "limited", label: "Limited tickets" },
          ]}
          error={errors?.maxTickets?.message}
        />

        {maxTickets === "limited" && (
          <div>
            <label className="tw:mb-1 tw:block tw:text-[15px]">
              Total number of tickets
            </label>
            <input
              type="number"
              min="1"
              {...register("ticketLimit")}
              className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2.5 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
            />
            {errors.ticketLimit && (
              <p className="tw:mt-1 tw:text-xs tw:text-red-500">
                {errors.ticketLimit.message}
              </p>
            )}
          </div>
        )}

        <SelectField
          label="Event visibility"
          value={visibility}
          onChange={(value) =>
            setValue("visibility", value, { shouldValidate: true })
          }
          options={VISIBILITY_OPTIONS}
          error={errors?.visibility?.message}
        />

        <div className="tw:flex tw:items-center tw:justify-between tw:rounded-2xl tw:border tw:border-gray-100 tw:bg-[#faf8ff] tw:px-4 tw:py-3">
          <label className="tw:text-[15px]">
            This event contains mature content
          </label>
          <input
            type="checkbox"
            {...register("matureContent")}
            className="tw:h-4 tw:w-4 tw:accent-primary"
          />
        </div>
      </div>

      <div className="tw:mt-6 tw:flex tw:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="tw:rounded-full tw:border tw:border-gray-200 tw:px-4 tw:py-2.5 hover:tw:bg-gray-50"
          style={{ borderRadius: 20 }}
        >
          Back
        </button>
        <button
          type="submit"
          className="tw:rounded-full tw:bg-primary tw:px-5 tw:py-2.5 tw:text-white hover:tw:bg-primarySecond"
          style={{ borderRadius: 20 }}
        >
          Continue to preview
        </button>
      </div>
    </form>
  );
}
