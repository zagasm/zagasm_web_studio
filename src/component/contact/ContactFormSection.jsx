import React, { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { showSuccess } from "../ui/toast";

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

export default function ContactFormSection() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      showSuccess("Message sent. We’ll get back to you soon.");
    }, 900);
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={sectionVariants}
    >
      <div className="tw:grid tw:grid-cols-1 tw:gap-6 tw:md:grid-cols-[minmax(0,1.8fr)_minmax(0,1.3fr)]">
        {/* Form card */}
        <motion.div
          className="tw:rounded-3xl tw:bg-white tw:border tw:border-slate-200/80 tw:shadow-[0_20px_60px_rgba(15,23,42,0.08)] tw:p-5 tw:md:p-7"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="tw:mb-5">
            <span className="tw:block tw:text-lg tw:md:text-xl tw:font-semibold tw:text-slate-900">
              Share a bit about your live setup
            </span>
            <span className="tw:block tw:mt-1 tw:text-xs tw:md:text-[13px] tw:text-slate-500">
              Give us context and we’ll respond with a tailored next step — not
              a generic pitch.
            </span>
          </div>

          <form className="tw:space-y-4" onSubmit={handleSubmit}>
            <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-3">
              <div>
                <span className="tw:block tw:text-[11px] tw:font-medium tw:uppercase tw:tracking-[0.16em] tw:text-slate-500 tw:mb-1.5">
                  Full name
                </span>
                <input
                  type="text"
                  required
                  placeholder="What should we call you?"
                  className="tw:w-full tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50/60 tw:px-3 tw:py-2.5 tw:text-sm tw:outline-none focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20"
                />
              </div>
              <div>
                <span className="tw:block tw:text-[11px] tw:font-medium tw:uppercase tw:tracking-[0.16em] tw:text-slate-500 tw:mb-1.5">
                  Work email
                </span>
                <input
                  type="email"
                  required
                  placeholder="you@brand.com"
                  className="tw:w-full tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50/60 tw:px-3 tw:py-2.5 tw:text-sm tw:outline-none focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20"
                />
              </div>
            </div>

            <div className="tw:grid tw:grid-cols-1 tw:md:grid-cols-2 tw:gap-3">
              <div>
                <span className="tw:block tw:text-[11px] tw:font-medium tw:uppercase tw:tracking-[0.16em] tw:text-slate-500 tw:mb-1.5">
                  What are you?
                </span>
                <select
                  className="tw:w-full tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50/60 tw:px-3 tw:py-2.5 tw:text-sm tw:outline-none focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Choose one
                  </option>
                  <option value="creator">Creator / Host</option>
                  <option value="agency">Agency / Studio</option>
                  <option value="brand">Brand / Organisation</option>
                  <option value="event">Event organiser</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <span className="tw:block tw:text-[11px] tw:font-medium tw:uppercase tw:tracking-[0.16em] tw:text-slate-500 tw:mb-1.5">
                  Typical live frequency
                </span>
                <select
                  className="tw:w-full tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50/60 tw:px-3 tw:py-2.5 tw:text-sm tw:outline-none focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  <option value="once">One-off / occasional</option>
                  <option value="monthly">1–3 times per month</option>
                  <option value="weekly">Weekly</option>
                  <option value="often">Multiple times per week</option>
                </select>
              </div>
            </div>

            <div>
              <span className="tw:block tw:text-[11px] tw:font-medium tw:uppercase tw:tracking-[0.16em] tw:text-slate-500 tw:mb-1.5">
                How are you currently going live?
              </span>
              <textarea
                rows={4}
                required
                placeholder="E.g. We use OBS into YouTube + Instagram Live on a phone, then manually cut clips for TikTok over the weekend…"
                className="tw:w-full tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50/60 tw:px-3 tw:py-2.5 tw:text-sm tw:resize-none tw:outline-none focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20"
              />
            </div>

            <div>
              <span className="tw:block tw:text-[11px] tw:font-medium tw:uppercase tw:tracking-[0.16em] tw:text-slate-500 tw:mb-1.5">
                Anything else we should know?
              </span>
              <textarea
                rows={3}
                placeholder="Timeline, budget range, upcoming event dates, tools you already use…"
                className="tw:w-full tw:rounded-2xl tw:border tw:border-slate-200 tw:bg-slate-50/60 tw:px-3 tw:py-2.5 tw:text-sm tw:resize-none tw:outline-none focus:tw:border-primary focus:tw:ring-2 focus:tw:ring-primary/20"
              />
            </div>

            <div className="tw:flex tw:flex-col tw:items-start tw:gap-2 tw:pt-2 tw:border-t tw:border-slate-100">
              <motion.button
                style={{
                  borderRadius: 16,
                }}
                type="submit"
                disabled={submitting}
                className="tw:inline-flex tw:items-center tw:justify-center tw:rounded-2xl tw:bg-linear-to-r tw:from-primary tw:to-primarySecond tw:px-5 tw:py-2.5 tw:text-sm tw:font-medium tw:text-white tw:shadow-[0_16px_50px_rgba(143,7,231,0.45)] tw:hover:opacity-95 tw:transition tw:disabled:opacity-60 tw:disabled:cursor-not-allowed"
                whileHover={{
                  scale: submitting ? 1 : 1.02,
                  y: submitting ? 0 : -1,
                }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
              >
                <span className="tw:block">
                  {submitting ? "Sending…" : "Send message"}
                </span>
                <ArrowRight className="tw:ml-1.5 tw:w-4 tw:h-4" />
              </motion.button>
              <span className="tw:block tw:text-[11px] tw:text-slate-500">
                We’ll never share your details. No newsletter spam — just a
                reply to this message.
              </span>
            </div>
          </form>
        </motion.div>

        {/* Info / locations card */}
        <motion.div
          className="tw:space-y-4"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
        >
          <div className="tw:rounded-3xl tw:bg-slate-900 tw:text-white tw:p-5 tw:md:p-6 tw:shadow-[0_24px_60px_rgba(15,23,42,0.9)] tw:relative tw:overflow-hidden">
            <div className="tw:absolute tw:inset-0 tw:bg-[radial-gradient(circle_at_top,rgba(193,21,181,0.5),transparent_55%),radial-gradient(circle_at_bottom,rgba(143,7,231,0.6),transparent_55%)] tw:opacity-80" />
            <div className="tw:relative">
              <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.2em] tw:text-white/70">
                Studio contact
              </span>
              <span className="tw:block tw:mt-2 tw:text-sm tw:md:text-base tw:font-medium tw:text-white/95">
                If your show date is already fixed, mention it in the message.
                We prioritise conversations with clear timelines.
              </span>

              <div className="tw:mt-4 tw:space-y-2.5 tw:text-[13px]">
                <div className="tw:flex tw:items-start tw:gap-2.5">
                  <Mail className="tw:w-4 tw:h-4 tw:mt-0.5 tw:text-primarySecond" />
                  <div>
                    <span className="tw:block tw:text-white/60">Email</span>
                    <span className="tw:block tw:text-white tw:font-medium">
                      support@zagasm.com
                    </span>
                  </div>
                </div>
                <div className="tw:flex tw:items-start tw:gap-2.5">
                  <Phone className="tw:w-4 tw:h-4 tw:mt-0.5 tw:text-primarySecond" />
                  <div>
                    <span className="tw:block tw:text-white/60">
                      Studio line
                    </span>
                    <span className="tw:block tw:text-white tw:font-medium">
                      +234 (0) 802 379 7265
                    </span>
                    <span className="tw:block tw:text-[11px] tw:text-white/55">
                      Mon–Sat, 10:00 – 17:00 WAT
                    </span>
                  </div>
                </div>
                <div className="tw:flex tw:items-start tw:gap-2.5">
                  <MapPin className="tw:w-4 tw:h-4 tw:mt-0.5 tw:text-primarySecond" />
                  <div>
                    <span className="tw:block tw:text-white/60">Base</span>
                    <span className="tw:block tw:text-white tw:font-medium">
                      Lagos, Nigeria
                    </span>
                    <span className="tw:block tw:text-[11px] tw:text-white/55">
                      Available remotely for global productions.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Small note card */}
          <div className="tw:rounded-3xl tw:bg-white tw:border tw:border-slate-200/80 tw:p-4 tw:text-[12px] tw:text-slate-600 tw:shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
            <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.18em] tw:text-slate-500 tw:mb-1">
              Already using Zagasm Studios?
            </span>
            <span className="tw:block">
              For billing, support, or urgent show-day issues, use the in-app
              help section or your account manager channel. This form is best
              for new projects and collaborations.
            </span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
