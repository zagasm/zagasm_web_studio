import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../../../pages/auth/AuthContext";
import { api } from "../../../../../lib/apiClient";
import { showError } from "../../../../../component/ui/toast";
import SelectField from "../../../../../component/form/SelectField";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
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

const schema = z.object({
  // event_type_id: z.string().min(1, "Please select an event type"),
  title: z.string().min(10, "Event title must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(1, "Please select a location"),
  organizer: z.string().min(3, "Organizer name must be at least 3 characters"),
  genre: z.string().min(1, "Please select a genre"),
  date: z.string().refine((v) => new Date(v) > new Date(), {
    message: "Event date must be in the future",
  }),
  time: z.string().min(1, "Please select a time"),
  timezone: z.string().min(1, "Please select a timezone"),
});

export default function EventInformationStep({
  defaultValues = {},
  onNext,
  eventTypeId,
}) {
  const { user, token } = useAuth();
  const [timeZones, setTimeZones] = useState([]);
  const [loadingTZ, setLoadingTZ] = useState(true);

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
      // event_type_id: "",
      title: "",
      description: "",
      location: "",
      organizer: user?.name || user?.lastName || "",
      genre: "",
      date: "",
      time: "",
      timezone: "",
      ...defaultValues,
    },
  });

  const watchVals = watch();

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

  // Event types
  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     try {
  //       setLoadingET(true);
  //       const res = await api.get("/api/v1/event/type/view", {
  //         headers: token ? { Authorization: `Bearer ${token}` } : {},
  //       });
  //       const list = res?.data?.events || [];
  //       if (mounted) setEventTypes(list);
  //     } catch {
  //       showError("Error fetching event types");
  //     } finally {
  //       mounted && setLoadingET(false);
  //     }
  //   })();
  //   return () => (mounted = false);
  // }, [token]);

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
      <h2 className="tw:text-[18px] tw:sm:text-lg tw:font-semibold tw:mb-5">
        Basic event details
      </h2>

      <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-5">
        {/* <SelectField
          label="Event Type*"
          value={watchVals.event_type_id}
          onChange={(v) =>
            setValue("event_type_id", v, { shouldValidate: true })
          }
          options={typeOptions}
          placeholder={loadingET ? "Loading…" : "Select an event type"}
          disabled={loadingET}
          error={errors?.event_type_id?.message}
        /> */}

        <div>
          <label className="tw:block tw:text-[15px] tw:mb-1">Event Title</label>
          <input
            {...register("title")}
            placeholder="Enter event title"
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
          />
          {errors.title && (
            <p className="tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="tw:md:col-span-2">
          <label className="tw:block tw:text-[15px] tw:mb-1">
            Description*
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Describe your event in detail"
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
          />
          {errors.description && (
            <p className="tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <SelectField
          label="Location*"
          value={watchVals.location}
          onChange={(v) => setValue("location", v, { shouldValidate: true })}
          options={countryOptions}
          placeholder="Select Country"
          error={errors?.location?.message}
        />

        <div>
          <label className="tw:block tw:text-[15px] tw:mb-1">
            Organizer’s Name
          </label>
          <input
            {...register("organizer")}
            readOnly
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:bg-gray-50 tw:px-3 tw:py-2 tw:text-[15px]"
          />
          {errors.organizer && (
            <p className="tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.organizer.message}
            </p>
          )}
        </div>

        <SelectField
          label="Genre*"
          value={watchVals.genre}
          onChange={(v) => setValue("genre", v, { shouldValidate: true })}
          options={genreOptions}
          placeholder="Select Genre"
          error={errors?.genre?.message}
        />

        <div>
          <label className="tw:block tw:text-[15px] tw:mb-1">Event Date*</label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            {...register("date")}
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
          />
          {errors.date && (
            <p className="tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <label className="tw:block tw:text-[15px] tw:mb-1">Event Time*</label>
          <input
            type="time"
            {...register("time")}
            className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:text-[15px] focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
          />
          {errors.time && (
            <p className="tw:text-red-500 tw:text-xs tw:mt-1">
              {errors.time.message}
            </p>
          )}
        </div>

        <SelectField
          label="Timezone*"
          value={watchVals.timezone}
          onChange={(v) => setValue("timezone", v, { shouldValidate: true })}
          options={tzOptions}
          placeholder={loadingTZ ? "Loading…" : "Select Timezone"}
          disabled={loadingTZ}
          error={errors?.timezone?.message}
          className="tw:md:col-span-2"
        />
      </div>

      <div className="tw:flex tw:justify-end tw:mt-6">
        <button
          style={{
            borderRadius: 20,
          }}
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
