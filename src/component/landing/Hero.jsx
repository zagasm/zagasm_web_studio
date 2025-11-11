import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import RatingBar from "./RatingBar";
import CTAButton from "./CTAButton";

/* ---- Your original variants (kept) ---- */
const sentence = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const word = {
  hidden: { y: 18, opacity: 0, filter: "blur(2px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 140, damping: 18 },
  },
};

/* Headline split into words. You can tweak text & highlights inline. */
function FlowHeadline({ replayKey, initialDelay = 0.28, stagger = 0.10 }) {
  const line1 = useMemo(() => ["Live", "streaming", "made", "simple"], []);
  const line2 = useMemo(() => ["and", "seriously", "fast"], []);

  // Local sentence variant with a *bit more delay* (doesn't touch your global)
  const localSentence = useMemo(
    () => ({
      hidden: {},
      show: {
        transition: { staggerChildren: stagger, delayChildren: initialDelay },
      },
    }),
    [initialDelay, stagger]
  );

  return (
    <div className="tw:relative tw:mb-4">
      {/* Continuous, mature sheen (keeps animating after reveal) */}
      <motion.span
        aria-hidden
        className="tw:pointer-events-none tw:absolute tw:inset-0 tw:rounded-lg"
        initial={{ x: "-120%" }}
        animate={{ x: ["-120%", "120%"] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)",
          mixBlendMode: "screen",
        }}
      />

      {/* gentle breathing of the whole headline */}
      <motion.div
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Wrap animated lines in a keyed container to *replay* every 14s */}
        <motion.div key={replayKey}>
          {/* Line 1 */}
          <motion.span
            variants={localSentence}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="tw:block tw:text-center tw:font-extrabold tw:leading-[0.95] tw:tracking-tight tw:text-4xl tw:md:text-[56px] tw:lg:text-6xl tw:text-gray-900"
          >
            {line1.map((w, i) => (
              <motion.span key={i} variants={word} className="tw:inline-block tw:mr-[0.35ch]">
                <span className={w === "simple" ? "tw:text-[#8F07E7]" : ""}>{w}</span>
              </motion.span>
            ))}
          </motion.span>

          {/* Line break on md+ like your original */}
          <br className="tw:hidden tw:md:block" />

          {/* Line 2 */}
          <motion.span
            variants={localSentence}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="tw:block tw:text-center tw:font-extrabold tw:leading-[0.95] tw:tracking-tight tw:text-4xl tw:md:text-[56px] tw:lg:text-6xl tw:text-gray-900"
          >
            {line2.map((w, i) => (
              <motion.span key={i} variants={word} className="tw:inline-block tw:mr-[0.35ch]">
                {w}
              </motion.span>
            ))}
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const [replayKey, setReplayKey] = useState(0);

  // Replay every 14s
  useEffect(() => {
    const id = setInterval(() => setReplayKey((k) => k + 1), 14000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="tw:mx-auto tw:max-w-5xl tw:px-5 tw:pt-8 tw:pb-20">
      <RatingBar />

      {/* Headline with flowing words + continuous sheen */}
      <FlowHeadline replayKey={replayKey} />

      {/* Sub text (reveals, then soft idle shimmer) */}
      <motion.p
        initial={{ y: 12, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.2 }}
        className="tw:relative tw:block tw:mx-auto tw:max-w-3xl tw:text-center tw:text-sm tw:text-gray-500 tw:mb-8"
      >
        {/* subtle gradient text shimmer */}
        <motion.span
          animate={{ backgroundPositionX: ["0%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(90deg, #6B7280 0%, #111827 50%, #6B7280 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            backgroundSize: "200% 100%",
          }}
        >
          Zagasm plugs into your workflow; RTMP in, multi-platform out. Ditch the
          boring setup and focus on your show, music, podcasts, and events.
        </motion.span>
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.25 }}
        className="tw:flex tw:flex-col tw:sm:flex-row tw:items-center tw:justify-center tw:gap-4"
      >
        <CTAButton to="/auth/signin" label="Get Started" />
      </motion.div>
    </section>
  );
}
