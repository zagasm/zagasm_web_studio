import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

export default function AboutHeroSection() {
  return (
    <section className="tw:flex tw:flex-col tw:gap-10 tw:md:flex-row tw:items-start tw:justify-between">
      <motion.div
        className="tw:max-w-3xl"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        custom={0}
        variants={fadeUp}
      >
        <span className="tw:block tw:text-[10px] tw:md:text-[11px] tw:uppercase tw:tracking-[0.18em] tw:text-primary tw:mb-3">
          About Zagasm Studios
        </span>

        <span className="tw:font-dela tw:block tw:text-3xl tw:md:text-4xl tw:lg:text-5xl tw:font-semibold tw:leading-tight tw:mb-4">
          Turning{" "}
          <span className="tw:bg-linear-to-r tw:from-primary tw:to-primarySecond tw:bg-clip-text tw:text-transparent">
            LIVE streams
          </span>{" "}
          into a real business.
        </span>

        <span className="tw:block tw:text-sm tw:md:text-[15px] tw:text-slate-600 tw:max-w-xl">
          Zagasm Studios is building the LIVE infrastructure for creators,
          events, and brands. From RTMP ingest to highlight automation, the
          studio helps you ship shows, not just posts.
        </span>
      </motion.div>

      <motion.div
        className="tw:w-full tw:max-w-sm tw:md:max-w-xs"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        custom={0.15}
        variants={fadeUp}
      >
        <div className="tw:relative tw:rounded-3xl tw:bg-slate-900 tw:text-white tw:p-5 tw:overflow-hidden tw:shadow-[0_18px_60px_rgba(15,23,42,0.45)]">
          <span className="tw:absolute tw:-right-10 tw:-top-10 tw:h-32 tw:w-32 tw:rounded-full tw:bg-primary/40 tw:blur-2xl" />
          <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.18em] tw:text-white/60">
            Live-native
          </span>
          <span className="tw:mt-3 tw:block tw:text-[15px] tw:font-medium">
            Built for teams that treat LIVE content like a product, not a
            one-off broadcast.
          </span>
          <span className="tw:mt-4 tw:block tw:text-[11px] tw:text-white/70">
            Programmable pipelines, reusable assets, and automation across
            platforms. One control room, all your shows.
          </span>
        </div>
      </motion.div>
    </section>
  );
}
