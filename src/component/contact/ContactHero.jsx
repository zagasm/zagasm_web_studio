import React from "react";
import { Sparkles, Radio, Waves } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ContactHero() {
  return (
    <motion.section
      className="tw:relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Soft background glow */}
      <div className="tw:pointer-events-none tw:absolute tw:inset-x-0 tw:-top-24 tw:-z-10 tw:flex tw:justify-center">
        <motion.div
          className="tw:h-64 tw:w-64 tw:rounded-full tw:bg-primary/25 tw:blur-3xl tw:opacity-70"
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        />
      </div>

      <div className="tw:flex tw:flex-col tw:gap-10 tw:md:flex-row tw:md:items-center">
        {/* Left: text */}
        <motion.div className="tw:flex-1" variants={itemVariants}>
          <motion.div
            className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-primary/5 tw:px-3 tw:py-1 tw:border tw:border-primary/20 tw:mb-3"
            whileHover={{ y: -1, scale: 1.01 }}
          >
            <Sparkles className="tw:w-3.5 tw:h-3.5 tw:text-primary" />
            <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.22em] tw:text-primary">
              Contact Zagasm Studios
            </span>
          </motion.div>

          <span className="tw:font-dela tw:block tw:text-3xl tw:md:text-4xl tw:lg:text-5xl tw:font-semibold tw:leading-tight tw:mb-3">
            Talk to the team{" "}
            <span className="tw:bg-linear-to-r tw:from-primary tw:to-primarySecond tw:bg-clip-text tw:text-transparent">
              behind the streams.
            </span>
          </span>

          <span className="tw:block tw:text-sm tw:md:text-base tw:text-slate-600 tw:max-w-xl tw:mb-5">
            Whether you’re planning a one-off LIVE event, a recurring show, or
            full studio automation, we’ll help you design a pipeline that fits
            your reality, bandwidth, budget, and audience.
          </span>

          <motion.div
            className="tw:flex tw:flex-wrap tw:gap-3 tw:text-[11px] tw:text-slate-500"
            variants={itemVariants}
          >
            <motion.div
              className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-white tw:px-3 tw:py-1 tw:border tw:border-slate-200/80 tw:shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
              whileHover={{ y: -2, scale: 1.02 }}
            >
              <Radio className="tw:w-3.5 tw:h-3.5 tw:text-primary" />
              <span className="tw:block">
                LIVE events • Streaming studios • Creators
              </span>
            </motion.div>
            <motion.div
              className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:bg-slate-900 tw:px-3 tw:py-1 tw:text-white tw:text-[11px]"
              whileHover={{ y: -2, scale: 1.02 }}
            >
              <Waves className="tw:w-3.5 tw:h-3.5 tw:text-primarySecond" />
              <span className="tw:block">
                RTMP • Multistream • Highlight automation
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right: stat / highlight card */}
        <motion.div
          className="tw:flex-1 tw:max-w-md tw:mx-auto tw:w-full"
          variants={itemVariants}
        >
          <motion.div
            className="tw:rounded-3xl tw:bg-linear-to-br tw:from-slate-900 tw:via-slate-900 tw:to-primary tw:text-white tw:p-5 tw:md:p-6 tw:shadow-[0_28px_80px_rgba(15,23,42,0.6)] tw:relative tw:overflow-hidden"
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          >
            <div className="tw:absolute tw:-right-10 tw:-top-10 tw:h-40 tw:w-40 tw:rounded-full tw:bg-primarySecond/40 tw:blur-2xl" />
            <div className="tw:absolute tw:-left-12 tw:bottom-0 tw:h-40 tw:w-40 tw:rounded-full tw:bg-primary/30 tw:blur-2xl" />

            <div className="tw:relative">
              <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.22em] tw:text-white/60 tw:mb-2">
                Creator pipeline check
              </span>
              <span className="tw:block tw:text-sm tw:md:text-base tw:font-medium tw:mb-4 tw:text-white/95">
                Tell us how you currently go LIVE and we’ll help you design a
                cleaner, automated pipeline, from ingest to highlight clips.
              </span>

              <div className="tw:grid tw:grid-cols-2 tw:gap-3 tw:mb-4">
                <div className="tw:rounded-2xl tw:bg-white/5 tw:border tw:border-white/10 tw:px-3 tw:py-3">
                  <span className="tw:block tw:text-xs tw:text-white/60 tw:mb-1">
                    First response
                  </span>
                  <span className="tw:block tw:text-lg tw:font-semibold">
                    {" "}
                    &lt; 24 hrs
                  </span>
                  <span className="tw:block tw:text-[11px] tw:text-white/55">
                    For most live inquiries.
                  </span>
                </div>
                <div className="tw:rounded-2xl tw:bg-white/5 tw:border tw:border-white/10 tw:px-3 tw:py-3">
                  <span className="tw:block tw:text-xs tw:text-white/60 tw:mb-1">
                    Support
                  </span>
                  <span className="tw:block tw:text-lg tw:font-semibold">
                    7 days
                  </span>
                  <span className="tw:block tw:text-[11px] tw:text-white/55">
                    We’re around when you need us.
                  </span>
                </div>
              </div>

              <div className="tw:flex tw:flex-col tw:gap-1 tw:text-[11px] tw:text-white/70 tw:mt-1">
                <span className="tw:block">
                  Prefer email?{" "}
                  <span className="tw:font-medium tw:text-white">
                    support@zagasm.com
                  </span>
                </span>
                <span className="tw:block">
                  We’ll reply with next steps and a simple intake form.
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
