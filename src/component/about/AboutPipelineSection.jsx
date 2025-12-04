// src/pages/about/AboutPipelineSection.jsx
import React from "react";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function AboutPipelineSection() {
  return (
    <section className="tw:space-y-7">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={item}
      >
        <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.2em] tw:text-primarySecond">
          Pipeline
        </span>

        <span className="tw:font-dela tw:mt-2 tw:block tw:text-xl tw:md:text-2xl tw:font-semibold tw:text-slate-900">
          From first frame to final highlight, on autopilot.
        </span>

        <span className="tw:mt-2 tw:block tw:text-sm tw:md:text-[15px] tw:text-slate-600 tw:max-w-2xl">
          Zagasm plugs into your existing cameras and encoders, then pushes each
          session into a workflow that handles streaming, clipping, and
          follow-up without extra tabs.
        </span>
      </motion.div>

      <motion.div
        className="tw:grid tw:grid-cols-1 tw:md:grid-cols-3 tw:gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={container}
      >
        {/* Step 1 */}
        <motion.div
          variants={item}
          className="tw:relative tw:rounded-2xl tw:bg-slate-900 tw:text-white tw:p-5 tw:overflow-hidden tw:min-h-[170px]"
        >
          <span className="tw:absolute tw:-left-10 tw:-top-10 tw:h-24 tw:w-24 tw:rounded-full tw:bg-primary/40 tw:blur-2xl" />
          <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.16em] tw:text-white/60">
            01 · Ingest
          </span>
          <span className="tw:mt-3 tw:block tw:text-[15px] tw:font-medium">
            Low-latency RTMP entry point.
          </span>
          <span className="tw:mt-2 tw:block tw:text-[12px] tw:text-white/70">
            Connect OBS, Ecamm, or hardware encoders. Route to YouTube, Twitch,
            or a private stage in a few clicks.
          </span>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          variants={item}
          className="tw:relative tw:rounded-2xl tw:bg-linear-to-b tw:from-primary/10 tw:to-primarySecond/10 tw:border tw:border-primary/20 tw:p-5 tw:min-h-[170px]"
        >
          <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.16em] tw:text-primary">
            02 · Automation
          </span>
          <span className="tw:mt-3 tw:block tw:text-[15px] tw:font-medium tw:text-slate-900">
            Clips, segments, and highlights.
          </span>
          <span className="tw:mt-2 tw:block tw:text-[12px] tw:text-slate-700">
            Segment long shows into moments, generate vertical cuts, and push
            highlight cards straight into your content calendar.
          </span>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          variants={item}
          className="tw:relative tw:rounded-2xl tw:bg-white tw:border tw:border-slate-200/80 tw:p-5 tw:min-h-[170px] tw:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
        >
          <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.16em] tw:text-slate-500">
            03 · After-live
          </span>
          <span className="tw:mt-3 tw:block tw:text-[15px] tw:font-medium tw:text-slate-900">
            CRM and monetization in the loop.
          </span>
          <span className="tw:mt-2 tw:block tw:text-[12px] tw:text-slate-700">
            Tag attendees, sync to your CRM, and spin up replays, offers, and
            paid follow-up sessions from the same studio.
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
