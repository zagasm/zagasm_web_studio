import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  eventImage: z
    .instanceof(File, { message: "Event poster is required" })
    .refine((f) => f.size <= 5 * 1024 * 1024, {
      message: "Image must be ≤ 5MB",
    }),
  performers: z
    .array(
      z.object({
        name: z.string().min(2, "Performer name must be at least 2 characters"),
        image: z
          .instanceof(File, { message: "Performer image is required" })
          .refine((f) => f.size <= 5 * 1024 * 1024, {
            message: "Image must be ≤ 5MB",
          }),
      })
    )
    .min(1, "At least one performer is required"),
});

export default function MediaUploadStep({
  eventImage,
  setEventImage,
  performers,
  setPerformers,
  onBack,
  onNext,
}) {
  const eventInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { performers, eventImage },
  });

  useEffect(() => {
    setValue("performers", performers);
    if (eventImage) setValue("eventImage", eventImage);
  }, [performers, eventImage, setValue]);

  const addPerformer = () => {
    setPerformers((p) => [...p, { id: Date.now(), name: "", image: null }]);
  };

  const updatePerformerName = (id, name) => {
    setPerformers((list) =>
      list.map((p) => (p.id === id ? { ...p, name } : p))
    );
  };

  const setPerformerImage = (id, file) => {
    if (!file) return;
    if (!/^image\//.test(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    setPerformers((list) =>
      list.map((p) => (p.id === id ? { ...p, image: file } : p))
    );
  };

  const removePerformer = (id) =>
    setPerformers((list) => list.filter((p) => p.id !== id));

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (!f) return;
    if (!/^image\//.test(f.type)) return;
    if (f.size > 5 * 1024 * 1024) return;
    setEventImage(f);
  };

  const onSubmit = (vals) => onNext(vals);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="tw:bg-white tw:rounded-2xl tw:p-4 sm:tw:p-6 tw:border tw:border-gray-100"
    >
      <h2 className="tw:text-lg tw:font-semibold tw:mb-4">Event Media</h2>

      {/* Poster */}
      <div className="tw:mb-6">
        <span className="tw:text-sm tw:font-medium tw:block tw:mb-2">
          Poster upload* (Max 5MB)
        </span>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => eventInputRef.current?.click()}
          className={`tw:border tw:border-dashed tw:rounded-2xl tw:p-5 tw:text-center tw:cursor-pointer tw:transition
            ${
              isDragging
                ? "tw:border-primary tw:bg-lightPurple"
                : "tw:border-gray-300 hover:tw:border-primary"
            }`}
        >
          {eventImage ? (
            <div className="tw:relative tw:inline-block">
              <img
                src={URL.createObjectURL(eventImage)}
                alt="Poster preview"
                className="tw:max-h-56 tw:rounded-xl tw:object-cover tw:shadow-sm"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setEventImage(null);
                }}
                className="tw:absolute tw:top-2 tw:right-2 tw:h-8 tw:w-8 tw:rounded-full tw:bg-white tw:flex tw:items-center tw:justify-center tw:shadow tw:border tw:border-gray-200"
              >
                ✕
              </button>
            </div>
          ) : (
            <div>
              <div className="tw:text-3xl">☁️</div>
              <p className="tw:text-primary tw:font-medium">
                Drag & drop your image here
              </p>
              <p className="tw:text-gray-500 tw:text-sm">
                or click to browse — JPG, PNG, JPEG, WEBP (≤5MB)
              </p>
              <div className="tw:inline-flex tw:items-center tw:justify-center tw:mt-3 tw:h-8 tw:w-8 tw:rounded-full tw:bg-primary tw:text-white">
                +
              </div>
            </div>
          )}
          <input
            ref={eventInputRef}
            type="file"
            accept="image/*"
            className="tw:hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (!/^image\//.test(f.type)) return;
              if (f.size > 5 * 1024 * 1024) return;
              setEventImage(f);
            }}
          />
        </div>
        {errors.eventImage && (
          <p className="tw:text-red-500 tw:text-xs tw:mt-1">
            {errors.eventImage.message}
          </p>
        )}
      </div>

      {/* Performers */}
      <div className="tw:mb-4">
        <span className="tw:text-sm tw:font-medium tw:block tw:mb-2">
          Performer(s) / Speaker(s)*
        </span>

        {performers.length === 0 && (
          <div className="tw:py-8 tw:text-center tw:border tw:border-dashed tw:rounded-2xl tw:text-gray-500">
            No performers added yet
          </div>
        )}

        <div className="tw:grid tw:grid-cols-1 sm:tw:grid-cols-2 md:tw:grid-cols-3 tw:gap-4 tw:mt-4">
          {performers.map((p) => (
            <div
              key={p.id}
              className="tw:border tw:border-gray-200 tw:rounded-2xl tw:p-3"
            >
              <input
                defaultValue={p.name}
                onBlur={(e) => updatePerformerName(p.id, e.target.value)}
                placeholder="Performer name"
                className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:mb-3 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
              />
              <div className="tw:flex tw:items-end tw:justify-between tw:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) =>
                      setPerformerImage(p.id, e.target.files?.[0]);
                    input.click();
                  }}
                  className="tw:h-[74px] tw:w-[74px] tw:rounded-full tw:bg-lightPurple tw:border-2 tw:border-dashed tw:border-lightPurple tw:flex tw:items-center tw:justify-center tw:overflow-hidden"
                >
                  {p.image ? (
                    <img
                      src={URL.createObjectURL(p.image)}
                      className="tw:h-full tw:w-full tw:object-cover"
                    />
                  ) : (
                    <span className="tw:text-primary tw:text-xl">+</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => removePerformer(p.id)}
                  className="tw:text-red-500 tw:text-sm"
                >
                  Remove
                </button>
              </div>
              {p.image && (
                <p className="tw:text-xs tw:text-gray-500 tw:mt-2 tw:truncate">
                  {p.image.name}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="tw:flex tw:justify-end tw:mt-4">
          <button
            type="button"
            onClick={addPerformer}
            className="tw:px-3 tw:py-2 tw:rounded-xl tw:border tw:border-primary tw:text-primary hover:tw:bg-lightPurple"
          >
            Add Guest Artiste +
          </button>
        </div>

        {errors.performers && (
          <p className="tw:text-red-500 tw:text-xs tw:mt-2">
            {errors.performers.message}
          </p>
        )}
      </div>

      {/* Nav */}
      <div className="tw:flex tw:justify-between tw:mt-6">
        <button
        style={{
            borderRadius: 20
        }}
          type="button"
          onClick={onBack}
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-200 hover:tw:bg-gray-50"
        >
          Back
        </button>
        <button
        style={{
            borderRadius: 20
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
