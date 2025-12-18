import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useAuth } from "../../../../../pages/auth/AuthContext";
import { api } from "../../../../../lib/apiClient";
import { showError } from "../../../../../component/ui/toast";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

// ✅ Zod: at least one poster (image or video)
const schema = z
  .object({
    posterImages: z.array(z.instanceof(File)).optional(),
    posterVideos: z.array(z.instanceof(File)).optional(),
    performers: z.array(
      z.object({
        name: z.string().min(2, "Performer name must be at least 2 characters"),
        image: z.any().optional(),
        role: z.string().optional(),
        // extra fields (user_name, userId, avatar) are ignored by zod
      })
    ),
    // .min(1, "At least one performer is required"),
  })
  .refine(
    (v) => (v.posterImages?.length || 0) + (v.posterVideos?.length || 0) > 0,
    {
      message: "At least one poster (image or video) is required",
      path: ["poster"],
    }
  );

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

function percentToPixelCrop(percentCrop, width, height) {
  if (!percentCrop) return null;
  return {
    unit: "px",
    x: Math.round((percentCrop.x / 100) * width),
    y: Math.round((percentCrop.y / 100) * height),
    width: Math.round((percentCrop.width / 100) * width),
    height: Math.round((percentCrop.height / 100) * height),
  };
}

// default crop is 3:1 but user can resize freely after
function centerDefaultBannerCrop(mediaWidth, mediaHeight) {
  const c = centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, 3 / 1, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
  return c;
}

export default function MediaUploadStep({
  posterImages,
  setPosterImages,
  posterVideos,
  setPosterVideos,
  performers,
  setPerformers,
  existingPoster,
  setExistingPoster,
  onBack,
  onNext,
}) {
  const imgInputRef = useRef(null);
  const vidInputRef = useRef(null);
  const [isDraggingImg, setIsDraggingImg] = useState(false);
  const [isDraggingVid, setIsDraggingVid] = useState(false);

  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const pendingCropQueueRef = useRef([]); // for multi-image crop queue

  const { token } = useAuth();

  // mention search state
  const [mentionOptions, setMentionOptions] = useState([]);
  const [mentionLoading, setMentionLoading] = useState(false);
  const mentionDebounceRef = useRef(null);
  const [cropDialog, setCropDialog] = useState({
    open: false,
    file: null,
    url: "",
    index: null,
  });
  const ASPECT = 3 / 1;
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);

  const cropImageRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const previewCacheRef = useRef(new Map());

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

  useEffect(() => {
    if (
      !completedCrop ||
      !previewCanvasRef.current ||
      !cropImageRef.current ||
      !cropDialog.open
    )
      return;

    const image = cropImageRef.current;
    const canvas = previewCanvasRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
  }, [completedCrop, cropDialog.open]);

  useEffect(() => {
    return () => {
      previewCacheRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      previewCacheRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!posterImages?.length) {
      setThumbnailIndex(0);
      return;
    }
    if (thumbnailIndex >= posterImages.length) setThumbnailIndex(0);
  }, [posterImages, thumbnailIndex]);

  // ---- Poster helpers
  const getCroppedBlob = (image, pixelCrop) =>
    new Promise((resolve, reject) => {
      if (!image || !pixelCrop?.width || !pixelCrop?.height) {
        reject(new Error("No crop data"));
        return;
      }

      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = Math.round(pixelCrop.width * scaleX);
      canvas.height = Math.round(pixelCrop.height * scaleY);

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        pixelCrop.x * scaleX,
        pixelCrop.y * scaleY,
        pixelCrop.width * scaleX,
        pixelCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Failed to crop image")),
        "image/jpeg",
        0.92
      );
    });

  const closeCropDialog = () => {
    if (cropDialog.url) {
      URL.revokeObjectURL(cropDialog.url);
    }
    setCropDialog({ open: false, file: null, url: "", index: null });
    setCompletedCrop(null);
  };

  const getPosterPreviewUrl = (file) => {
    if (!file) return "";
    const cache = previewCacheRef.current;
    if (cache.has(file)) {
      return cache.get(file);
    }
    const url = URL.createObjectURL(file);
    cache.set(file, url);
    return url;
  };

  const revokePosterPreview = (file) => {
    if (!file) return;
    const cache = previewCacheRef.current;
    const url = cache.get(file);
    if (url) {
      URL.revokeObjectURL(url);
      cache.delete(file);
    }
  };

  const commitCrop = async () => {
    if (!cropDialog.file || !completedCrop?.width || !completedCrop?.height)
      return;

    try {
      const blob = await getCroppedBlob(cropImageRef.current, completedCrop);
      const fileName = cropDialog.file.name || `poster-${Date.now()}.jpg`;
      const cropped = new File([blob], fileName, {
        type: cropDialog.file.type || "image/jpeg",
      });

      if (cropDialog.index !== null) {
        setPosterImages((prev) =>
          prev.map((item, idx) => {
            if (idx === cropDialog.index) {
              revokePosterPreview(item);
              return cropped;
            }
            return item;
          })
        );
      } else {
        setPosterImages((prev) => {
          const next = [...prev, cropped];

          // default thumbnail = first image uploaded (only set once)
          if (next.length === 1) setThumbnailIndex(0);

          return next;
        });
      }
    } catch (err) {
      console.error(err);
      showError("Failed to crop the image, try again.");
    } finally {
      closeCropDialog();

      // open next queued image automatically
      const nextFile = pendingCropQueueRef.current.shift();
      if (nextFile) startCropSession(nextFile);
    }
  };

  const startCropSession = (file, index = null) => {
    if (!file) return;
    if (!/^image\//.test(file.type) || file.size > 10 * 1024 * 1024) {
      showError("Only images under 10MB are supported.");
      return;
    }

    if (cropDialog.url) URL.revokeObjectURL(cropDialog.url);

    setCropDialog({
      open: true,
      file,
      url: URL.createObjectURL(file),
      index,
    });

    setCrop(undefined);
    setCompletedCrop(null);
  };

  const handlePosterImageFiles = (files) => {
    const images = [...files].filter(
      (f) => /^image\//.test(f.type) && f.size <= 10 * 1024 * 1024
    );
    if (!images.length) return;

    // queue the rest, crop first immediately
    pendingCropQueueRef.current = images.slice(1);
    startCropSession(images[0]);
  };

  const addPosterVideos = (files) => {
    const valid = [...files].filter(
      (f) => /^video\//.test(f.type) && f.size <= 200 * 1024 * 1024
    );
    if (!valid.length) return;
    setPosterVideos((prev) => [...prev, ...valid]);
  };

  const removePosterImageAt = (i) =>
    setPosterImages((prev) => {
      const target = prev[i];
      revokePosterPreview(target);

      const next = prev.filter((_, idx) => idx !== i);

      setThumbnailIndex((cur) => {
        if (!next.length) return 0;
        if (cur === i) return 0; // removed the thumbnail -> fallback
        if (i < cur) return cur - 1; // shift left
        return cur;
      });

      return next;
    });

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

  const onSubmit = (vals) => {
    const totalPosters =
      (vals.posterImages?.length || 0) +
      (vals.posterVideos?.length || 0) +
      (existingPoster?.length || 0);

    if (totalPosters === 0) {
      showError("At least one poster (image or video) is required");
      return;
    }

    onNext({ ...vals, thumbnailIndex });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="tw:bg-white tw:rounded-2xl tw:p-4 tw:sm:p-6 tw:border tw:border-gray-100"
      >
        <span className="tw:block tw:text-lg tw:lg:text-2xl tw:sm:text-lg tw:font-semibold tw:mb-4">
          Event Media
        </span>

        {existingPoster?.length > 0 && (
          <div className="tw:mb-6">
            <span className="tw:text-sm tw:font-medium tw:block tw:mb-2">
              Existing media
            </span>
            <div className="tw:flex tw:flex-wrap tw:gap-3">
              {existingPoster.map((m, idx) => (
                <div
                  key={m.id || idx}
                  className="tw:relative tw:w-28 tw:h-28 tw:rounded-2xl tw:overflow-hidden tw:border tw:border-gray-200 tw:bg-black/5"
                >
                  {m.type === "image" ? (
                    <img
                      src={m.url}
                      className="tw:w-full tw:h-full tw:object-cover"
                    />
                  ) : (
                    <video
                      src={m.url}
                      className="tw:w-full tw:h-full tw:object-cover"
                      controls={false}
                      muted
                    />
                  )}

                  <span className="tw:absolute tw:left-2 tw:top-2 tw:text-[10px] tw:px-2 tw:py-0.5 tw:bg-black/60 tw:text-white tw:rounded-full tw:uppercase">
                    {m.type}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setExistingPoster((prev) =>
                        prev.filter((_, i) => i !== idx)
                      )
                    }
                    className="tw:absolute tw:top-1 tw:right-1 tw:h-7 tw:w-7 tw:rounded-full tw:bg-white tw:flex tw:items-center tw:justify-center tw:border"
                    aria-label="Remove media"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
              handlePosterImageFiles(e.dataTransfer.files);
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
              onChange={(e) => {
                handlePosterImageFiles(e.target.files);
                e.target.value = null;
              }}
            />
          </div>
          {/* Thumbs */}
          {posterImages?.length > 0 && (
            <div className="tw:mt-4 tw:space-y-3">
              {/* Big thumbnail */}
              {posterImages[thumbnailIndex] && (
                <div className="tw:w-full tw:lg:w-[60%] tw:rounded-2xl tw:border tw:border-primary tw:ring-2 tw:ring-primary/15 tw:bg-white tw:shadow-sm tw:overflow-hidden">
                  <div className=" tw:flex tw:items-center tw:justify-between tw:px-3 tw:py-2 tw:border-b tw:border-gray-100">
                    <div className="tw:flex tw:items-center tw:gap-2">
                      <span className="tw:text-[11px] tw:px-2 tw:py-1 tw:bg-primary tw:text-white tw:rounded-full">
                        Thumbnail
                      </span>
                      <span className="tw:text-xs tw:text-gray-600 tw:hidden tw:sm:block">
                        This is the main poster people will see first
                      </span>
                    </div>

                    <div className="tw:flex tw:items-center tw:gap-2">
                      <button
                        style={{
                          borderRadius: 16,
                          fontSize: 12,
                        }}
                        type="button"
                        onClick={() =>
                          startCropSession(
                            posterImages[thumbnailIndex],
                            thumbnailIndex
                          )
                        }
                        className="tw:text-xs tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-gray-200 tw:hover:bg-gray-50"
                      >
                        Recrop
                      </button>

                      <button
                        style={{
                          borderRadius: 16,
                          fontSize: 12,
                        }}
                        type="button"
                        onClick={() => removePosterImageAt(thumbnailIndex)}
                        className="tw:text-xs tw:px-3 tw:py-1.5 tw:rounded-full tw:border tw:border-red-200 tw:text-red-600 tw:hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* big preview */}
                  <button
                    type="button"
                    onClick={() =>
                      startCropSession(
                        posterImages[thumbnailIndex],
                        thumbnailIndex
                      )
                    }
                    className="tw:block tw:w-full tw:bg-black/5"
                    style={{ fontSize: 12 }}
                  >
                    <img
                      src={getPosterPreviewUrl(posterImages[thumbnailIndex])}
                      alt="Thumbnail poster"
                      className="tw:w-full tw:h-40 tw:sm:h-[220px] tw:md:h-[260px] tw:object-cover"
                    />
                  </button>
                </div>
              )}

              {/* Other posters row (responsive wrap) */}
              {posterImages.length > 1 && (
                <div>
                  <div className="tw:flex tw:items-center tw:justify-between tw:mb-2">
                    <span className="tw:text-xs tw:text-gray-600">
                      Other poster images
                    </span>
                  </div>

                  <div className="tw:flex tw:flex-wrap tw:gap-3">
                    {posterImages.map((f, i) => {
                      if (i === thumbnailIndex) return null;

                      return (
                        <div
                          key={`${f.name}-${i}`}
                          className="tw:relative tw:overflow-hidden tw:rounded-xl tw:border tw:border-gray-200 tw:bg-white tw:shadow-sm
                           tw:w-[90px] tw:h-[90px] tw:sm:w-[100px] tw:sm:h-[100px]"
                        >
                          {/* tap to recrop */}
                          <button
                            type="button"
                            onClick={() => startCropSession(f, i)}
                            className="tw:absolute tw:inset-0 tw:bg-transparent tw:p-0 tw:border-0"
                            style={{ fontSize: 12 }}
                          >
                            <img
                              src={getPosterPreviewUrl(f)}
                              alt={f.name || `poster-${i}`}
                              className="tw:w-full tw:h-full tw:object-cover"
                            />
                          </button>

                          {/* set as thumbnail */}
                          <button
                          
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setThumbnailIndex(i);
                            }}
                            className="tw:absolute tw:left-2 tw:bottom-2 tw:z-10 tw:text-[10px] tw:px-2 tw:py-1 tw:bg-black/60 tw:text-white tw:rounded-full"
                            style={{ borderRadius: 9999, fontSize: 8 }}
                          >
                            Set thumbnail
                          </button>

                          {/* remove */}
                          <button
                            type="button"
                            onClick={() => removePosterImageAt(i)}
                            className="tw:absolute tw:top-1 tw:right-1 tw:z-10 tw:h-7 tw:w-7 tw:rounded-full tw:bg-white tw:flex tw:items-center tw:justify-center tw:border"
                            aria-label="Remove"
                            style={{ fontSize: 10 }}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <span className="tw:block tw:text-xs tw:text-gray-500">
                Tip: Upload multiple images. The first becomes the thumbnail by
                default, but you can change it.
              </span>
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
                    ) : p.avatar ? (
                      <img
                        src={p.avatar}
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
      {cropDialog.open && (
        <div className="tw:fixed tw:inset-0 tw:z-50 tw:flex tw:items-center tw:justify-center tw:bg-black/60 tw:p-4 tw:backdrop-blur-sm">
          <div className="tw:w-full tw:max-w-3xl tw:rounded-[34px] tw:bg-white tw:p-6 tw:shadow-2xl tw:border tw:border-gray-100 tw:flex tw:flex-col tw:gap-4 tw:max-h-[80vh] tw:overflow-hidden">
            <div className="tw:flex tw:items-start tw:justify-between tw:gap-3">
              <div>
                <span className="tw:block tw:text-xl tw:font-bold tw:text-gray-900">
                  Crop poster
                </span>
                <span className="tw:text-sm tw:text-gray-500">
                  Adjust the frame and preview how the poster will appear.
                </span>
              </div>
              <button
                type="button"
                className="tw:text-gray-400 tw:hover:text-gray-600"
                onClick={closeCropDialog}
              >
                Cancel
              </button>
            </div>

            <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:lg:grid-cols-[1.2fr_0.8fr] tw:overflow-y-auto tw:pr-1">
              <div className="tw:bg-gray-50 tw:rounded-3xl tw:p-3 tw:border tw:border-dashed tw:border-gray-200">
                <ReactCrop
                  crop={crop}
                  onChange={(_, percentCrop) => {
                    setCrop(percentCrop);

                    const img = cropImageRef.current;
                    if (img)
                      setCompletedCrop(
                        percentToPixelCrop(percentCrop, img.width, img.height)
                      );
                  }}
                  onComplete={(pixelCrop) => setCompletedCrop(pixelCrop)}
                  ruleOfThirds
                  keepSelection
                  className="tw:w-full tw:max-h-[420px]"
                >
                  <img
                    ref={cropImageRef}
                    alt="Crop poster"
                    src={cropDialog.url}
                    className="tw:w-full tw:block tw:max-h-[260px] tw:sm:max-h-[360px] tw:lg:max-h-[520px] tw:object-contain"
                    onLoad={(e) => {
                      const img = e.currentTarget;

                      const defaultCrop = centerDefaultBannerCrop(
                        img.width,
                        img.height
                      );
                      setCrop(defaultCrop);

                      const pixel = percentToPixelCrop(
                        defaultCrop,
                        img.width,
                        img.height
                      );
                      setCompletedCrop(pixel);
                    }}
                  />
                </ReactCrop>
              </div>
              <div className="tw:hidden tw:lg:flex tw:flex-col tw:gap-3 tw:rounded-3xl tw:border tw:border-gray-100 tw:p-4">
                <div className="tw:flex tw:items-center tw:gap-2">
                  <div className="tw:h-2 tw:w-8 tw:rounded-full tw:bg-linear-to-r tw:from-primary tw:to-primarySecond" />
                  <span className="tw:text-sm tw:text-gray-500">Preview</span>
                </div>
                <div className="tw:flex-1 tw:rounded-2xl tw:border tw:border-gray-200 tw:bg-gray-100 tw:p-4 tw:flex tw:items-center tw:justify-center">
                  <canvas
                    ref={previewCanvasRef}
                    className="tw:w-full tw:max-h-[260px]"
                  />
                </div>
                <span className="tw:block tw:text-xs tw:text-gray-500">
                  Once you tap “Save”, the cropped poster will replace the
                  current selection. You can always recrop later.
                </span>
              </div>
            </div>
            {/* Footer actions (always visible) */}
            <div
              className="tw:flex tw:items-center tw:justify-end tw:gap-3 tw:pt-3 tw:border-t tw:border-gray-100
                tw:bg-white tw:sticky tw:bottom-0"
            >
              <button
                type="button"
                onClick={closeCropDialog}
                className="tw:px-4 tw:py-2 tw:rounded-xl tw:border tw:border-gray-200 tw:text-sm tw:text-gray-700 tw:hover:bg-gray-50"
                style={{ borderRadius: 16, fontSize: 12 }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={commitCrop}
                disabled={!completedCrop?.width || !completedCrop?.height}
                className="tw:px-4 tw:py-2 tw:rounded-xl tw:bg-primary tw:text-white tw:text-sm tw:font-semibold tw:hover:bg-primarySecond disabled:tw:opacity-50 disabled:tw:cursor-not-allowed"
                style={{ borderRadius: 16, fontSize: 12 }}
              >
                Save poster
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
