import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../../pages/auth/AuthContext";
import { api } from "../../../../../lib/apiClient";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showError } from "../../../../../component/ui/toast";
import SelectField from "../../../../../component/form/SelectField";

const schema = z
  .object({
    price: z.number().min(0),
    maxTickets: z.enum(["limited", "unlimited"]),
    ticketLimit: z.number().min(1).optional(),
    currency: z.string().min(1, "Please select a currency"),
    hasBackstage: z.boolean().optional(),
    backstagePrice: z.number().min(1).optional(),
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
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/v1/currency", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list = res?.data?.currencies || res?.data?.data || [];
        if (mounted) setCurrencies(Array.isArray(list) ? list : []);
      } catch {
        showError("Failed to load currencies");
      } finally {
        mounted && setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [token]);

  const currencyOptions = useMemo(
    () =>
      currencies.map((c) => ({
        value: String(c.id),
        label: `${c.symbol} - ${c.name} (${c.code})`,
      })),
    [currencies]
  );

  const onSubmit = (vals) => onNext(vals);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="tw:bg-white tw:rounded-2xl tw:p-5 tw:sm:p-7 tw:border tw:border-gray-100"
    >
      <h2 className="tw:text-[18px] tw:sm:text-lg tw:font-semibold tw:mb-5">
        Ticketing & Pricing
      </h2>

      <div className="tw:space-y-5">
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
        </div>

        <SelectField
          label="Currency*"
          value={currencyVal}
          onChange={(v) => setValue("currency", v, { shouldValidate: true })}
          options={currencyOptions}
          placeholder={loading ? "Loading…" : "Select Currency"}
          disabled={loading}
          error={errors?.currency?.message}
        />

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
          style={{
            borderRadius: 20,
          }}
          type="button"
          onClick={onBack}
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-200 hover:tw:bg-gray-50"
        >
          Back
        </button>
        <button
          style={{
            borderRadius: 20,
          }}
          type="submit"
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:bg-primary tw:text-white hover:tw:bg-primarySecond"
        >
          Next
        </button>
      </div>
    </form>
  );
}
