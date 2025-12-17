// pages/event/create/EventForm.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, authHeaders } from "../../../../lib/apiClient";
import { useAuth } from "../../../auth/AuthContext";
import {
  showPromise,
  showError,
  showSuccess,
} from "../../../../component/ui/toast";

import ProgressSteps from "./steps/ProgressSteps";
import EventInformationStep from "./steps/EventInformationStep";
import MediaUploadStep from "./steps/MediaUploadStep";
import TicketingStep from "./steps/TicketingStep";
import AccessStep from "./steps/AccessStep";
import ReviewStep from "./steps/ReviewStep";
import EventCreationSuccessModal from "../../../../component/Events/EventCreationSuccessModal";

/**
 * Helper: map backend event -> defaultValues for each step
 * Adjust field names to match your API exactly.
 */
function mapEventToDefaults(event) {
  if (!event) {
    return {
      info: {},
      ticketing: {},
      streaming: {},
      access: {},
      media: {
        posterImages: [],
        posterVideos: [],
        performers: [],
      },
    };
  }

  // These are guesses, tweak to your real response keys
  const startDate =
    event.currentEvent.start_date || event.currentEvent.eventDateISO || "";
  const startTime = event.currentEvent.start_time || "";
  const timezone =
    event.currentEvent.timezone || event.currentEvent.timezone_id || "";

  const maxTickets = event.currentEvent.max_tickets ? "limited" : "unlimited";

  const eventTypeId = event.currentEvent.eventType.id

  return {
    info: {
      title: event.currentEvent.title || "",
      description: event.currentEvent.description || "",
      location: event.currentEvent.location || event.currentEvent.country || "",
      organizer:
        event.currentEvent.organizer?.name ||
        event.currentEvent.hostName ||
        event.currentEvent.user?.name ||
        "",
      genre: event.currentEvent.genre || "",
      date: startDate ? startDate.slice(0, 10) : "",
      time: startTime,
      timezone: String(timezone || ""),
    },

    ticketing: {
      price: Number(event.currentEvent.price || 0),
      maxTickets,
      ticketLimit:
        maxTickets === "limited"
          ? Number(event.currentEvent.max_tickets || 0)
          : undefined,
      currency: String(event.currentEvent.currency.currencyId || ""),
      hasBackstage: !!event.currentEvent.backstage_price,
      backstagePrice: event.currentEvent.backstage_price
        ? Number(event.currentEvent.backstage_price)
        : undefined,
    },

    streaming: {
      streamingOption: event.currentEvent.streaming_option || "in_app",
      enableReplay:
        typeof event.currentEvent.enable_replay === "boolean"
          ? event.currentEvent.enable_replay
          : true,
      streamingDuration: String(event.currentEvent.streaming_duration || 24),
    },

    access: {
      visibility: event.currentEvent.visibility || "public",
      matureContent: !!event.currentEvent.mature_content,
    },

    // For edit you have existing poster items coming from backend.
    // Wizard uses posterImages/posterVideos as File[], so we keep existing
    // ones aside and only send new ones as Files.
    media: {
      posterImages: [],
      posterVideos: [],
      performers:
        (event.currentEvent.performers || []).map((p) => ({
          id: p.id,
          name: p.name,
          role: p.role || "speaker",
          image: null, // they will only re-upload if they want to change
          user_name: p.user_name || "",
          userId: p.user_id || null,
          avatar: p.avatar || p.image_url || null,
        })) || [],
      existingPoster: (event.currentEvent.poster || []).map((m, idx) => ({
        id: m.id || idx,
        type: m.type,
        url: m.url,
      })), // [{id,type,url,...}]
    },
  };
}

export default function EventCreationWizard({
  eventTypeId, // used on create and edit
  mode = "create", // "create" | "edit"
  eventId, // used on edit
  initialEvent, // full event object from API
}) {
  const isEdit = mode === "edit" && !!eventId;
  const { token } = useAuth();
  const navigate = useNavigate();

  const mapped = useMemo(
    () => mapEventToDefaults(initialEvent),
    [initialEvent]
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [collected, setCollected] = useState({});
  const [posterImages, setPosterImages] = useState(
    mapped.media.posterImages || []
  );
  const [posterVideos, setPosterVideos] = useState(
    mapped.media.posterVideos || []
  );
  const [performers, setPerformers] = useState(mapped.media.performers || []);
  const [existingPoster, setExistingPoster] = useState(
    mapped.media.existingPoster || []
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [timezoneLabel, setTimezoneLabel] = useState("");
  const [successModal, setSuccessModal] = useState({
    open: false,
    eventId: null,
    variant: "created",
  });

  // Helpers
  const markStepDone = (n) => {
    setCompletedSteps((prev) => (prev.includes(n) ? prev : [...prev, n]));
  };

  const mergeCollected = (stepKey, data) => {
    setCollected((prev) => ({
      ...prev,
      [stepKey]: { ...(prev[stepKey] || {}), ...data },
    }));
  };

  // Step handlers
  const handleInfoNext = (values) => {
    mergeCollected("step_1", values);
    setTimezoneLabel(values.timezone_label || ""); // if you add this from EventInformationStep
    markStepDone(1);
    setCurrentStep(2);
  };

  const handleMediaNext = (values) => {
    mergeCollected("step_2", {
      ...values,
      // we already track posterImages/posterVideos in top level state
    });
    markStepDone(2);
    setCurrentStep(3);
  };

  const handleTicketingNext = (values) => {
    mergeCollected("step_3", values);
    markStepDone(3);
    setCurrentStep(4);
  };

  const handleAccessNext = (values) => {
    mergeCollected("step_5", values);
    markStepDone(4);
    setCurrentStep(5);
  };

  const goToStep = (n) => {
    setCurrentStep(n);
  };

  const closeSuccessModal = () => {
    setSuccessModal((prev) => ({ ...prev, open: false }));
  };

  // Final submit (create or update)
  const handlePublish = async () => {
    try {
      setIsSubmitting(true);
      setFormErrors({});

      // Build payload
      const payload = new FormData();

      // Step 1
      const s1 = collected.step_1 || mapped.info;
      payload.append("title", s1.title || "");
      payload.append("description", s1.description || "");
      payload.append("location", s1.location || "");
      payload.append("organizer", s1.organizer || "");
      payload.append("genre", s1.genre || "");
      payload.append("event_date", s1.date || "");
      payload.append("start_time", s1.time || "");
      payload.append("time_zone_id", s1.timezone || "");

      if (!isEdit && eventTypeId) {
        payload.append("event_type_id", eventTypeId);
      }
      if (isEdit && eventTypeId) {
        payload.append("event_type_id", eventTypeId);
      }

      // Step 2 – media
      posterImages.forEach((file, i) => {
        payload.append(
          `poster_images[${i}]`,
          file,
          file.name || `poster_image_${i}`
        );
      });
      posterVideos.forEach((file, i) => {
        payload.append(
          `poster_videos[${i}]`,
          file,
          file.name || `poster_video_${i}`
        );
      });
      performers.forEach((p, i) => {
        if (p.name) payload.append(`performers[${i}][name]`, p.name);
        if (p.role) payload.append(`performers[${i}][role]`, p.role);
        if (p.user_name)
          payload.append(`performers[${i}][user_name]`, p.user_name);
        if (p.image) {
          payload.append(`performers[${i}][image]`, p.image);
        }
      });

      // If edit: send IDs of existing posters you want to keep
      if (isEdit && Array.isArray(existingPoster)) {
        existingPoster.forEach((m, i) => {
          payload.append(`keep_poster_ids[${i}]`, m.id);
        });
      }

      // Step 3 – ticketing
      const s3 = collected.step_3 || {};
      payload.append("price", s3.price ?? 0);
      payload.append("currency_id", s3.currency || "");
      payload.append("ticket_limit", s3.maxTickets || "unlimited");
      if (s3.maxTickets === "limited") {
        payload.append("ticket_limit_number", s3.ticketLimit || 0);
      }
      payload.append("has_backstage", s3.hasBackstage ? "1" : "0");
      if (s3.hasBackstage && s3.backstagePrice) {
        payload.append("backstage_price", s3.backstagePrice);
      }

      // Step 4 – streaming
      const s4 = collected.step_4 || mapped.streaming || {};
      payload.append("streaming_option", s4.streamingOption || "in_app");
      payload.append("enable_replay", s4.enableReplay ? "1" : "0");
      if (s4.enableReplay) {
        payload.append("replay_time", s4.streamingDuration || "24");
      }

      // Step 5 – access
      const s5 = collected.step_5 || {};
      payload.append("visibility", s5.visibility || "public");
      payload.append("post_mature_content", s5.matureContent ? "1" : "0");

      const url = isEdit
        ? `/api/v1/event/${eventId}/edit`
        : "/api/v1/event/store";
      const method = isEdit ? "post" : "post";
      // if your backend uses PUT/PATCH, change this to api.put/patch.

      const req = api[method](url, payload, {
        ...authHeaders(token),
        headers: {
          ...authHeaders(token).headers,
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log(payload);

      const res = await showPromise(req, {
        loading: isEdit ? "Updating event…" : "Creating event…",
        success: isEdit ? "Event updated" : "Event created",
        error: "Could not save event",
      });

      const created = res?.data?.data || res?.data || {};
      const createdId = created?.id || eventId;
      setSuccessModal({
        open: true,
        eventId: createdId,
        variant: isEdit ? "updated" : "created",
      });

      // const created = res?.data?.data || res?.data;
      // const redirectId = created?.id || eventId;

      // navigate(`/creator/channel/new?eventId=${redirectId}`);
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors) {
        setFormErrors(data.errors);
      }
      showError(data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mergedForReview = useMemo(() => {
    return {
      ...(collected.step_1 || mapped.info),
      ...(collected.step_3 || mapped.ticketing),
      ...(collected.step_4 || mapped.streaming),
      ...(collected.step_5 || mapped.access),
    };
  }, [collected, mapped]);

  if (isEdit && !initialEvent) {
    // safety: you should normally not render wizard until event is loaded
    return null;
  }

  return (
    <div className="tw:max-w-5xl tw:mx-auto tw:px-1 tw:pt-10 tw:md:pt-0 tw:pb-20">
      <ProgressSteps
        currentStep={currentStep}
        completedSteps={completedSteps}
        onBack={() => {
          if (currentStep === 1) {
            navigate(-1);
          } else {
            setCurrentStep((s) => Math.max(1, s - 1));
          }
        }}
      />

      {currentStep === 1 && (
        <EventInformationStep
          defaultValues={mapped.info}
          onNext={handleInfoNext}
          eventTypeId={eventTypeId}
        />
      )}

      {currentStep === 2 && (
        <MediaUploadStep
          posterImages={posterImages}
          setPosterImages={setPosterImages}
          posterVideos={posterVideos}
          setPosterVideos={setPosterVideos}
          performers={performers}
          setPerformers={setPerformers}
          existingPoster={existingPoster}
          setExistingPoster={setExistingPoster}
          onBack={() => setCurrentStep(1)}
          onNext={handleMediaNext}
        />
      )}

      {currentStep === 3 && (
        <TicketingStep
          defaultValues={mapped.ticketing}
          onBack={() => setCurrentStep(2)}
          onNext={handleTicketingNext}
        />
      )}

      {/* 
      {currentStep === 4 && (
        <StreamingStep
          defaultValues={mapped.streaming}
          onBack={() => setCurrentStep(3)}
          onNext={handleStreamingNext}
        />
      )}
      */}

      {currentStep === 4 && (
        <AccessStep
          defaultValues={mapped.access}
          onBack={() => setCurrentStep(3)}
          onNext={handleAccessNext}
        />
      )}

      {currentStep === 5 && (
        <ReviewStep
          collected={mergedForReview}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onBack={() => setCurrentStep(4)}
          onPublish={handlePublish}
          timezoneLabel={timezoneLabel}
          performers={performers}
          onGoToStep={goToStep}
          posterImages={posterImages}
          posterVideos={posterVideos}
        />
      )}

      <EventCreationSuccessModal
        open={successModal.open}
        onClose={closeSuccessModal}
        eventId={successModal.eventId}
        variant={successModal.variant}
      />
    </div>
  );
}
