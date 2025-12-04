import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../../../../pages/auth/AuthContext";
import { api } from "../../../../../lib/apiClient";
import { showError } from "../../../../../component/ui/toast";

// ✅ Zod: at least one poster (image or video)
const schema = z
  .object({
    posterImages: z.array(z.instanceof(File)).optional(),
    posterVideos: z.array(z.instanceof(File)).optional(),
    performers: z
      .array(
        z.object({
          name: z
            .string()
            .min(2, "Performer name must be at least 2 characters"),
          image: z
            .instanceof(File, { message: "Performer image is required" })
            .refine((f) => f.size <= 5 * 1024 * 1024, {
              message: "Image must be ≤ 5MB",
            }),
          role: z.string().optional(),
          // extra fields (user_name, userId, avatar) are ignored by zod
        })
      )
      .min(1, "At least one performer is required"),
  })
  .refine(
    (v) => (v.posterImages?.length || 0) + (v.posterVideos?.length || 0) > 0,
    {
      message: "At least one poster (image or video) is required",
      path: ["poster"],
    }
  );

export default function MediaUploadStep({
  posterImages,
  setPosterImages,
  posterVideos,
  setPosterVideos,
  performers,
  setPerformers,
  onBack,
  onNext,
}) {
  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);
  const [isDraggingImg, setIsDraggingImg] = useState(false);
  const [isDraggingVid, setIsDraggingVid] = useState(false);

  const { token } = useAuth();

  // mention search state
  const [mentionOptions, setMentionOptions] = useState([]);
  const [mentionLoading, setMentionLoading] = useState(false);
  const mentionDebounceRef = useRef(null);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { posterImages, posterVideos, performers },
  });

  useEffect(() => {
    setValue("posterImages", posterImages);
    setValue("posterVideos", posterVideos);
    setValue("performers", performers);
  }, [posterImages, posterVideos, performers, setValue]);

  useEffect(
    () => () => {
      if (mentionDebounceRef.current) {
        clearTimeout(mentionDebounceRef.current);
      }
    },
    []
  );

  // ---- Poster helpers
  const addPosterImages = (files) => {
    const valid = [...files].filter(
      (f) => /^image\//.test(f.type) && f.size <= 10 * 1024 * 1024
    );
    if (!valid.length) return;
    setPosterImages((prev) => [...prev, ...valid]);
  };

  const addPosterVideos = (files) => {
    const valid = [...files].filter(
      (f) => /^video\//.test(f.type) && f.size <= 200 * 1024 * 1024
    );
    if (!valid.length) return;
    setPosterVideos((prev) => [...prev, ...valid]);
  };

  const removePosterImageAt = (i) =>
    setPosterImages((prev) => prev.filter((_, idx) => idx !== i));
  const removePosterVideoAt = (i) =>
    setPosterVideos((prev) => prev.filter((_, idx) => idx !== i));

  // ---- Performer helpers
  const addPerformer = () => {
    setPerformers((p) => [
      ...p,
      {
        id: Date.now(),
        name: "",
        image: null,
        role: "speaker",
        user_name: "",
        userId: null,
        avatar: null,
      },
    ]);
  };

  const updatePerformerName = (id, name) =>
    setPerformers((list) =>
      list.map((p) => (p.id === id ? { ...p, name } : p))
    );

  const updatePerformerRole = (id, role) =>
    setPerformers((list) =>
      list.map((p) => (p.id === id ? { ...p, role } : p))
    );

  const updatePerformerTag = (id, patch) =>
    setPerformers((list) =>
      list.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );

  const setPerformerImage = (id, file) => {
    if (!file || !/^image\//.test(file.type) || file.size > 5 * 1024 * 1024)
      return;
    setPerformers((list) =>
      list.map((p) => (p.id === id ? { ...p, image: file } : p))
    );
  };

  const removePerformer = (id) =>
    setPerformers((list) => list.filter((p) => p.id !== id));

  // ---- Mention search (debounced)
  const searchTaggedUsers = (raw) => {
    const value = raw || "";
    const atIndex = value.indexOf("@");

    if (atIndex === -1) {
      setMentionOptions([]);
      return;
    }

    const query = value.slice(atIndex + 1).trim();
    if (query.length < 2) {
      setMentionOptions([]);
      return;
    }

    if (mentionDebounceRef.current) {
      clearTimeout(mentionDebounceRef.current);
    }

    mentionDebounceRef.current = setTimeout(async () => {
      try {
        setMentionLoading(true);
        const res = await api.get("/api/v1/tag", {
          params: { q: query }, // backend example: /api/v1/tag?q=Ebi
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const list = res?.data?.data || res?.data || [];
        setMentionOptions(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error(e);
        showError("Failed to fetch performer suggestions");
      } finally {
        setMentionLoading(false);
      }
    }, 400);
  };

  const onSubmit = (vals) => onNext(vals);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="tw:bg-white tw:rounded-2xl tw:p-4 tw:sm:p-6 tw:border tw:border-gray-100"
    >
      <span className="tw:block tw:text-lg tw:lg:text-2xl tw:sm:text-lg tw:font-semibold tw:mb-4">Event Media</span>

      {/* Poster IMAGES */}
      <div className="tw:mb-6">
        <span className="tw:text-sm tw:font-medium tw:block tw:mb-2">
          Poster images (JPG/PNG/WEBP)
        </span>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingImg(true);
          }}
          onDragLeave={() => setIsDraggingImg(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingImg(false);
            addPosterImages(e.dataTransfer.files);
          }}
          onClick={() => imgInputRef.current?.click()}
          className={`tw:border tw:border-dashed tw:rounded-2xl tw:p-5 tw:text-center tw:cursor-pointer tw:transition
            ${
              isDraggingImg
                ? "tw:border-primary tw:bg-lightPurple"
                : "tw:border-gray-300 tw:hover:border-primary"
            }`}
        >
          <div className="tw:text-primary tw:font-medium">
            Drag & drop image(s) or click to choose
          </div>
          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            multiple
            className="tw:hidden"
            onChange={(e) => addPosterImages(e.target.files)}
          />
        </div>
        {/* Thumbs */}
        {posterImages?.length > 0 && (
          <div className="tw:flex tw:flex-wrap tw:gap-3 tw:mt-3">
            {posterImages.map((f, i) => (
              <div
                key={`${f.name}-${i}`}
                className="tw:relative tw:w-24 tw:h-24 tw:rounded-xl tw:overflow-hidden tw:border tw:border-gray-200"
              >
                <img
                  src={URL.createObjectURL(f)}
                  className="tw:w-full tw:h-full tw:object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePosterImageAt(i)}
                  className="tw:absolute tw:top-1 tw:right-1 tw:h-7 tw:w-7 tw:rounded-full tw:bg-white tw:flex tw:items-center tw:justify-center tw:border"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Poster VIDEOS */}
      <div className="tw:mb-6">
        <span className="tw:text-sm tw:font-medium tw:block tw:mb-2">
          Poster videos (MP4/MOV)
        </span>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingVid(true);
          }}
          onDragLeave={() => setIsDraggingVid(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingVid(false);
            addPosterVideos(e.dataTransfer.files);
          }}
          onClick={() => vidInputRef.current?.click()}
          className={`tw:border tw:border-dashed tw:rounded-2xl tw:p-5 tw:text-center tw:cursor-pointer tw:transition
            ${
              isDraggingVid
                ? "tw:border-primary tw:bg-lightPurple"
                : "tw:border-gray-300 tw:hover:border-primary"
            }`}
        >
          <div className="tw:text-primary tw:font-medium">
            Drag & drop video(s) or click to choose
          </div>
          <input
            ref={vidInputRef}
            type="file"
            accept="video/*"
            multiple
            className="tw:hidden"
            onChange={(e) => addPosterVideos(e.target.files)}
          />
        </div>
        {/* File list */}
        {posterVideos?.length > 0 && (
          <ul className="tw:mt-3 tw:space-y-2">
            {posterVideos.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="tw:flex tw:items-center tw:justify-between tw:text-sm tw:bg-gray-50 tw:px-3 tw:py-2 tw:rounded-xl"
              >
                <span className="tw:truncate tw:max-w-[70%]">{f.name}</span>
                <button
                  type="button"
                  onClick={() => removePosterVideoAt(i)}
                  className="tw:text-red-500"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Poster overall validation (from schema refine) */}
      {errors.poster && (
        <p className="tw:text-red-500 tw:text-xs tw:mt-1">
          {errors.poster.message}
        </p>
      )}

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

        <div className="tw:grid tw:grid-cols-1 tw:sm:grid-cols-2 tw:md:grid-cols-3 tw:gap-4 tw:mt-4">
          {performers.map((p) => (
            <div
              key={p.id}
              className="tw:border tw:border-gray-200 tw:rounded-2xl tw:p-3"
            >
              {/* Tag by username */}
              <div className="tw:mb-2">
                <Autocomplete
                  options={mentionOptions}
                  loading={mentionLoading}
                  getOptionLabel={(option) =>
                    option.user_name || option.name || ""
                  }
                  value={
                    p.user_name
                      ? {
                          user_name: p.user_name,
                          name: p.name,
                          avatar: p.avatar,
                        }
                      : null
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.user_name === value.user_name
                  }
                  onChange={(event, newValue) => {
                    if (newValue) {
                      updatePerformerTag(p.id, {
                        user_name: newValue.user_name,
                        userId: newValue.id,
                        avatar: newValue.avatar,
                        // auto-fill name if empty
                        name: p.name || newValue.name || newValue.user_name,
                      });
                    } else {
                      updatePerformerTag(p.id, {
                        user_name: "",
                        userId: null,
                        avatar: null,
                      });
                    }
                  }}
                  onInputChange={(event, newInput) => {
                    searchTaggedUsers(newInput);
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <div className="tw:flex tw:items-center tw:gap-2">
                        <img
                          src={option.avatar}
                          alt={option.user_name}
                          className="tw:h-7 tw:w-7 tw:rounded-full tw:object-cover"
                        />
                        <div>
                          <div className="tw:text-sm">
                            {option.user_name || ""}
                          </div>
                          <div className="tw:text-[11px] tw:text-gray-500">
                            {option.name || ""}
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tag by @username"
                      placeholder="@username"
                      size="small"
                    />
                  )}
                />
              </div>

              {/* Display name */}
              <input
                defaultValue={p.name}
                onBlur={(e) => updatePerformerName(p.id, e.target.value)}
                placeholder="Performer name"
                className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:mb-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
              />

              {/* Role */}
              <input
                defaultValue={p.role || "speaker"}
                onBlur={(e) => updatePerformerRole(p.id, e.target.value)}
                placeholder="Role (e.g. speaker, artist)"
                className="tw:w-full tw:rounded-xl tw:border tw:border-gray-200 tw:px-3 tw:py-2 tw:mb-2 focus:tw:outline-none focus:tw:ring-2 focus:tw:ring-primary"
              />

              {p.user_name && (
                <p className="tw:text-[11px] tw:text-gray-500 tw:mb-2 tw:truncate">
                  Tagged: {p.user_name}
                </p>
              )}

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
                  className="tw:h-[74px] tw:w-[74px] tw:rounded-full tw:bg-lightPurple tw:border-2 tw:border-dashed tw:flex tw:items-center tw:justify-center tw:overflow-hidden"
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
            className="tw:px-3 tw:py-2 tw:rounded-xl tw:border tw:border-primary tw:text-primary tw:hover:bg-lightPurple"
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
          type="button"
          onClick={onBack}
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-200 tw:hover:bg-gray-50"
          style={{ borderRadius: 20 }}
        >
          Back
        </button>
        <button
          type="submit"
          className="tw:px-4 tw:py-2 tw:rounded-xl tw:bg-primary tw:text-white tw:hover:bg-primarySecond"
          style={{ borderRadius: 20 }}
        >
          Next
        </button>
      </div>
    </form>
  );
}
