// src/pages/about/AboutEcosystemSection.jsx
import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay },
  }),
};

export default function AboutEcosystemSection() {
  return (
    <section className="tw:space-y-8">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        custom={0}
        variants={fadeUp}
      >
        <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
          Ecosystem
        </span>

        <span className="tw:font-dela tw:mt-2 tw:block tw:text-xl tw:md:text-2xl tw:font-semibold tw:text-slate-900">
          A live studio built around real organisers, performers, and audiences.
        </span>

        <span className="tw:mt-2 tw:block tw:text-sm tw:md:text-[15px] tw:text-slate-600 tw:max-w-2xl">
          Zagasm Studios grew from running small shows in Lagos to powering
          recurring events, creator series, and community broadcasts. The stack
          is tuned for the realities of unstable networks, team workflows, and
          monetization in emerging markets.
        </span>
      </motion.div>

      <motion.div
        className="tw:grid tw:grid-cols-1 tw:md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] tw:gap-8 tw:items-start"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <motion.div
          className="tw:space-y-4 tw:text-sm tw:md:text-[15px] tw:text-slate-700"
          variants={fadeUp}
          custom={0.1}
        >
          <span className="tw:block">
            Zagasm treats every organiser like a studio, not a single page. That
            means multi-show calendars, performer tagging, ticketing, and payout
            flows that respect both sides of the relationship.
          </span>

          <span className="tw:block">
            Under the hood, each event generates a trail of data: who watched,
            when they dropped, what segments landed, and which offers converted.
            The platform turns those signals into simple decisions organisers
            can act on before the next show.
          </span>

          <span className="tw:block">
            The goal is simple. A creator in Lagos, London, or anywhere else
            should be able to run a broadcast studio from a single browser tab
            and still feel in control of brand, community, and revenue.
          </span>
        </motion.div>

        <motion.div
          className="tw:grid tw:grid-cols-2 tw:gap-4"
          variants={fadeUp}
          custom={0.18}
        >
          <div className="tw:rounded-2xl tw:bg-slate-900 tw:text-white tw:p-4 tw:flex tw:flex-col tw:justify-between tw:min-h-[130px]">
            <span className="tw:text-[11px] tw:uppercase tw:tracking-[0.18em] tw:text-white/60">
              Reliability
            </span>
            <span className="tw:mt-3 tw:block tw:text-[24px] tw:font-semibold">
              24 / 7
            </span>
            <span className="tw:mt-1 tw:block tw:text-[11px] tw:text-white/70">
              Streams monitored with alerting, not guesswork.
            </span>
          </div>

          <div className="tw:rounded-2xl tw:bg-white tw:border tw:border-slate-200/80 tw:p-4 tw:min-h-[130px] tw:shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <span className="tw:text-[11px] tw:uppercase tw:tracking-[0.18em] tw:text-slate-500">
              Workflow-first
            </span>
            <span className="tw:mt-3 tw:block tw:text-[14px] tw:font-medium tw:text-slate-900">
              Roles for producers, talent, and partners.
            </span>
            <span className="tw:mt-1 tw:block tw:text-[11px] tw:text-slate-700">
              Access control that matches how real teams work.
            </span>
          </div>

          <div className="tw:col-span-2 tw:rounded-2xl tw:bg-linear-to-r tw:from-primary tw:to-primarySecond tw:text-white tw:p-4 tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-4">
            <span className="tw:block tw:text-[13px] tw:font-medium tw:max-w-xs">
              Built from Lagos, tuned for global creators.
            </span>
            <span className="tw:block tw:text-[11px] tw:text-white/80 tw:max-w-sm">
              From first house party streams to multi-city shows, Zagasm is
              designed to scale with the ambition of the organisers using it.
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
