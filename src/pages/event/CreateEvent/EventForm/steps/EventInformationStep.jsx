import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../../../pages/auth/AuthContext";
import { api } from "../../../../../lib/apiClient";
import { showError } from "../../../../../component/ui/toast";
// import SelectField from "../../../../../component/form/SelectField"; // no longer needed
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

countries.registerLocale(enLocale);

const countryList = Object.entries(
  countries.getNames("en", { select: "official" })
).map(([code, name]) => ({ name, code }));

const GENRES = [
  "Music & Entertainment",
  "Performance & Arts",
  "Education / Training",
  "Faith & Spirituality",
  "Wellness & Lifestyle",
  "Business & Networking",
  "Cultural & Social",
];

const schema = z
  .object({
    title: z.string().min(10, "Event title must be at least 10 characters"),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters"),
    location: z.string().min(1, "Please select a location"),
    organizer: z
      .string()
      .min(3, "Organizer name must be at least 3 characters"),
    genre: z.string().min(1, "Please select a genre"),
    date: z.string().refine(
      (v) => {
        if (!v) return false;
        const now = new Date();
        const todayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const selected = new Date(v);
        return selected.getTime() >= todayStart.getTime();
      },
      {
        message: "Event date cannot be in the past",
      }
    ),
    time: z.string().min(1, "Please select a time"),
    timezone: z.string().min(1, "Please select a timezone"),
  })
  .superRefine((values, ctx) => {
    const { date, time } = values;
    if (!date || !time) return;

    const selected = new Date(`${date}T${time}`);
    if (!Number.isFinite(selected.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["time"],
        message: "Invalid date or time",
      });
      return;
    }

    if (selected.getTime() <= Date.now()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["time"],
        message: "Event time must be in the future",
      });
    }
  });

export default function EventInformationStep({
  defaultValues = {},
  onNext,
  eventTypeId,
}) {
  const { user, token } = useAuth();
  const [timeZones, setTimeZones] = useState([]);
  const [loadingTZ, setLoadingTZ] = useState(true);
  const locationDefault = defaultValues.location || "Online";

  const [eventTypes, setEventTypes] = useState([]);
  const [loadingET, setLoadingET] = useState(true);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      location: locationDefault,
      organizer: user?.name || user?.lastName || "",
      genre: "",
      date: "",
      time: "",
      timezone: "",
      ...defaultValues,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const watchVals = watch();

  useEffect(() => {
    setValue("location", locationDefault, { shouldValidate: true });
  }, [locationDefault, setValue]);

  // Time zones
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingTZ(true);
        const res = await api.get("/api/v1/time-zone", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list = res?.data?.timeZones || res?.data?.data || [];
        if (mounted) setTimeZones(Array.isArray(list) ? list : []);
      } catch {
        showError("Error fetching timezones");
      } finally {
        mounted && setLoadingTZ(false);
      }
    })();
    return () => (mounted = false);
  }, [token]);

  // Build options
  const tzOptions = useMemo(
    () =>
      timeZones.map((tz) => ({
        value: tz.id || tz.value || tz.name,
        label: `${tz.name || tz.label}${
          tz.gmt_offset ? ` (GMT ${tz.gmt_offset})` : ""
        }`,
      })),
    [timeZones]
  );

  useEffect(() => {
    if (!tzOptions.length || watchVals.timezone) return;
    const first = tzOptions[0]?.value;
    if (first) {
      setValue("timezone", first, { shouldValidate: true });
    }
  }, [tzOptions, setValue, watchVals.timezone]);

  const typeOptions = useMemo(
    () => eventTypes.map((t) => ({ value: t.id, label: t.name })),
    [eventTypes]
  );

  const countryOptions = useMemo(
    () => countryList.map((c) => ({ value: c.name, label: c.name })),
    []
  );

  const genreOptions = useMemo(
    () => GENRES.map((g) => ({ value: g, label: g })),
    []
  );

  const onSubmit = (values) => onNext(values);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="tw:bg-white tw:rounded-2xl tw:p-5 tw:sm:p-7 tw:border tw:border-gray-100"
    >
      <span className="tw:block tw:text-lg tw:md:text-2xl tw:sm:text-lg tw:font-semibold tw:mb-5">
        Basic event details
      </span>

      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-5">
        {/* Title */}
        <div className="tw:md:col-span-2">
          <span className="tw:block tw:text-[15px] tw:mb-1">Event Title</span>
          <input
            {...register("title")}
            placeholder="Enter event title"
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
          />
          {errors.title && (
            <span className="tw:block tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.title.message}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="tw:md:col-span-2">
          <span className="tw:block tw:text-[15px] tw:mb-1">Description*</span>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Describe your event in detail"
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
          />
          {errors.description && (
            <span className="tw:block tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.description.message}
            </span>
          )}
        </div>

        {/* Location field intentionally hidden—set to Online by default */}
        <input
          type="hidden"
          value={locationDefault}
          {...register("location")}
        />

        {/* Organizer */}
        <div>
          <span className="tw:block tw:text-[15px] tw:mb-1">
            Organizer’s Name
          </span>
          <input
            {...register("organizer")}
            readOnly
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:bg-gray-50 tw:px-3 tw:py-2 tw:text-[15px]"
          />
          {errors.organizer && (
            <span className="tw:block tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.organizer.message}
            </span>
          )}
        </div>

        {/* Genre as Autocomplete */}
        <div>
          <span className="tw:block tw:text-[15px] tw:mb-1">Genre*</span>
          <Autocomplete
            options={genreOptions}
            getOptionLabel={(option) => option.label || ""}
            value={
              genreOptions.find((opt) => opt.value === watchVals.genre) || null
            }
            onChange={(event, newValue) => {
              setValue("genre", newValue ? newValue.value : "", {
                shouldValidate: true,
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Genre"
                size="small"
                error={!!errors.genre}
                helperText={errors.genre?.message}
              />
            )}
          />
        </div>

        {/* Date */}
        <div>
          <span className="tw:block tw:text-[15px] tw:mb-1">Event Date*</span>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            {...register("date")}
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
          />
          {errors.date && (
            <span className="tw:block tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.date.message}
            </span>
          )}
        </div>

        {/* Time */}
        <div>
          <span className="tw:block tw:text-[15px] tw:mb-1">Event Time*</span>
          <input
            type="time"
            {...register("time")}
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
          />
          {errors.time && (
            <span className="tw:block tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.time.message}
            </span>
          )}
        </div>

        {/* Timezone Autocomplete */}
        <div className="tw:md:col-span-2">
          <span className="tw:block tw:text-[15px] tw:mb-1">Timezone*</span>
          <Autocomplete
            options={tzOptions}
            getOptionLabel={(option) => option.label || ""}
            value={
              tzOptions.find((opt) => opt.value === watchVals.timezone) || null
            }
            onChange={(event, newValue) => {
              setValue("timezone", newValue ? newValue.value : "", {
                shouldValidate: true,
              });
            }}
            disabled
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={loadingTZ ? "Loading…" : "Timezone locked"}
                size="small"
                error={!!errors.timezone}
                helperText={errors.timezone?.message}
              />
            )}
          />
          {tzOptions[0] && (
            <p className="tw:mt-2 tw:text-[11px] tw:text-gray-500">
              Your Timezone is fixed to {tzOptions[0].label}.
            </p>
          )}
        </div>
      </div>

      <div className="tw:flex tw:justify-end tw:mt-6">
        <button
          style={{ borderRadius: 20 }}
          type="submit"
          disabled={!isValid}
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:bg-primary tw:text-white hover:tw:bg-primarySecond"
        >
          Next
        </button>
      </div>
    </form>
  );
}
