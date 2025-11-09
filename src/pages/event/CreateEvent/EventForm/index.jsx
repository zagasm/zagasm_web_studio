import React, { useState } from "react";
import {
  ToastHost,
  showError,
  showPromise,
} from "../../../../component/ui/toast";
import { api } from "../../../../lib/apiClient";
import ProgressSteps from "./steps/ProgressSteps";
import EventInformationStep from "./steps/EventInformationStep";
import MediaUploadStep from "./steps/MediaUploadStep";
import TicketingStep from "./steps/TicketingStep";
import StreamingStep from "./steps/StreamingStep";
import AccessStep from "./steps/AccessStep";
import ReviewStep from "./steps/ReviewStep";
import StepLoader from "../../../../component/ui/StepLoader";
import { useAuth } from "../../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  firstErrorStepNumber,
  flattenLaravelErrors,
} from "../../../../utils/helpers";

export default function EventCreationWizard() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);

  const [eventImage, setEventImage] = useState(null);
  const [performers, setPerformers] = useState([]);

  const [formData, setFormData] = useState({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const nextStep = (payload) => {
    setFormData((prev) => ({ ...prev, [`step${currentStep}`]: payload }));
    setCompletedSteps((prev) =>
      prev.includes(currentStep) ? prev : [...prev, currentStep]
    );

    if (currentStep < 6) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep((s) => s + 1);
        setIsLoading(false);
      }, 220);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentStep((s) => s - 1);
        setIsLoading(false);
      }, 180);
    }
  };

  const goToStep = (n) => {
    // clamp 1..6 just in case
    const s = Math.max(1, Math.min(6, Number(n) || 1));
    setCurrentStep(s);
    // optional: scroll to top for good UX
    requestAnimationFrame(() =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  };

  const handlePublish = async () => {
    // Guard: poster must exist (backend requires it in step_3)
    if (!eventImage) {
      showError("Please add a poster before publishing.");
      setCurrentStep(2);
      return;
    }
    // Guard: event_type_id must exist (backend requires it in step_1)
    const eventTypeId = formData?.step1?.event_type_id;
    if (!eventTypeId) {
      showError("Please select an event type.");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    try {
      const review = {
        ...formData.step1,
        ...formData.step2,
        ...formData.step3,
        ...formData.step4,
        ...formData.step5,
      };

      const fd = new FormData();
      // REQUIRED
      fd.append("event_type_id", String(review.event_type_id));
      fd.append("time_zone_id", String(review.timezone || ""));
      fd.append("title", review.title || "");
      fd.append("description", review.description || "");
      fd.append("location", review.location || "");
      fd.append("genre", review.genre || "");
      fd.append("event_date", review.date || "");
      fd.append("start_time", review.time || "");

      // ticketing
      fd.append("price", review.price ? String(review.price) : "0");
      fd.append(
        "ticket_limit",
        review.maxTickets === "limited" ? "limited" : "unlimited"
      );
      if (review.maxTickets === "limited") {
        fd.append(
          "ticket_limit_number",
          review.ticketLimit ? String(review.ticketLimit) : "0"
        );
      }
      fd.append("currency_id", review.currency || "");

      // streaming
      fd.append("streaming_option", review.streamingOption || "");
      fd.append("enable_replay", review.enableReplay ? "1" : "0");
      if (review.enableReplay)
        fd.append("replay_time", review.streamingDuration || "24");

      // access
      fd.append("visibility", review.visibility || "public");
      fd.append("post_mature_content", review.matureContent ? "1" : "0");

      // media
      performers.forEach((p, i) => {
        fd.append(`performers[${i}][name]`, p.name || "");
        if (p.image) fd.append(`performers[${i}][image]`, p.image);
      });
      fd.append("poster", eventImage); // guaranteed to exist by guard
      //   fd.append("poster[]", safeFile, safeFile.name || "poster.jpg");
      console.log(eventImage);

      const req = api.post("/api/v1/event/store", fd, {
        headers: {
          //   "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      await showPromise(req, {
        loading: "Creating your event…",
        success: "Event created successfully!",
        error: "Failed to create event.",
      });

      navigate("/feed");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 422) {
        const srv = err.response.data?.errors || {};
        setFormErrors(srv);

        const step = firstErrorStepNumber(srv);
        if (step) setCurrentStep(step);

        const flat = flattenLaravelErrors(srv);
        if (flat.length) showError(flat[0].messages[0]); // first message
        else showError(err.response.data?.message || "Validation failed.");
        return;
      } else {
        showError(
          err?.response?.data?.message ||
            err?.message ||
            "Something went wrong."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tw:mx-auto tw:max-w-5xl tw:pb-24 tw:px-3 sm:tw:px-6">
      <ToastHost />

      <ProgressSteps
        currentStep={currentStep}
        completedSteps={completedSteps}
        onBack={prevStep}
      />

      <div className="tw:relative">
        {isLoading && <StepLoader />}

        {currentStep === 1 && (
          <EventInformationStep
            defaultValues={formData.step1}
            onNext={nextStep}
          />
        )}
        {currentStep === 2 && (
          <MediaUploadStep
            eventImage={eventImage}
            setEventImage={setEventImage}
            performers={performers}
            setPerformers={setPerformers}
            onBack={prevStep}
            onNext={nextStep}
          />
        )}
        {currentStep === 3 && (
          <TicketingStep
            defaultValues={formData.step3}
            onBack={prevStep}
            onNext={nextStep}
          />
        )}
        {currentStep === 4 && (
          <StreamingStep
            defaultValues={formData.step4}
            onBack={prevStep}
            onNext={nextStep}
          />
        )}
        {currentStep === 5 && (
          <AccessStep
            defaultValues={formData.step5}
            onBack={prevStep}
            onNext={nextStep}
          />
        )}
        {currentStep === 6 && (
          <ReviewStep
            isSubmitting={isSubmitting}
            onBack={prevStep}
            onPublish={handlePublish}
            timezoneLabel={timezone}
            eventImage={eventImage}
            performers={performers}
            collected={{
              ...formData.step1,
              ...formData.step2,
              ...formData.step3,
              ...formData.step4,
              ...formData.step5,
            }}
            formErrors={formErrors}
            onGoToStep={goToStep}
          />
        )}
      </div>
    </div>
  );
}
