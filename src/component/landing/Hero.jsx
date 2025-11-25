import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RatingBar from "./RatingBar";
import CTAButton from "./CTAButton";

/* ---- Word-level variants (unchanged) ---- */
const word = {
  hidden: { y: 18, opacity: 0, filter: "blur(2px)" },
  show: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 140, damping: 18 },
  },
};

/* Headline that takes dynamic text per slide */
function FlowHeadline({
  line1Words,
  line2Words,
  highlightWord,
  initialDelay = 0.25,
  stagger = 0.08,
}) {
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
    <div className="tw:relative tw:mb-4 tw:font-dela">
      {/* Continuous sheen across the whole headline */}
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

      {/* subtle breathing */}
      <motion.div
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Line 1 */}
        <motion.span
          variants={localSentence}
          initial="hidden"
          animate="show"
          className="tw:block tw:text-center tw:font-extrabold tw:leading-[0.95] tw:tracking-tight tw:text-3xl tw:md:text-[40px] tw:lg:text-5xl tw:text-gray-900"
        >
          {line1Words.map((w, i) => (
            <motion.span
              key={i}
              variants={word}
              className="tw:inline-block tw:mr-[0.35ch]"
            >
              <span
                className={
                  highlightWord && w === highlightWord
                    ? "tw:text-[#8F07E7]"
                    : ""
                }
              >
                {w}
              </span>
            </motion.span>
          ))}
        </motion.span>

        {/* <br className="tw:hidden tw:md:block" /> */}

        {/* Line 2 */}
        <motion.span
          variants={localSentence}
          initial="hidden"
          animate="show"
          className="tw:block tw:text-center tw:font-extrabold tw:leading-[0.95] tw:tracking-tight tw:text-3xl tw:md:text-[40px] tw:lg:text-5xl tw:text-gray-900"
        >
          {line2Words.map((w, i) => (
            <motion.span
              key={i}
              variants={word}
              className="tw:inline-block tw:mr-[0.35ch]"
            >
              {w}
            </motion.span>
          ))}
        </motion.span>
      </motion.div>
    </div>
  );
}

/* Slide-level variants for the whole block */
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.55,
      ease: [0.23, 0.9, 0.25, 1], // smooth bezier
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.45,
      ease: [0.23, 0.9, 0.25, 1],
    },
  }),
};

const slides = [
  {
    id: 0,
    line1: ["Live", "streaming", "made", "simple"],
    line2: ["and", "seriously", "fast"],
    highlightWord: "simple",
    subText:
      "Zagasm plugs into your workflow; RTMP in, multi-platform out. Ditch the boring setup and focus on your show, music, podcasts, and events.",
    ctaLabel: "Get Started",
    ctaTo: "/auth/signin",
  },
  {
    id: 1,
    line1: ["Launch", "events", "your", "audience", "remembers"],
    line2: ["tickets,", "streams,", "replays", "built-in"],
    highlightWord: "Launch",
    subText:
      "From ticketing to live chat, Zagasm handles the plumbing so you can obsess over content, not configs and spreadsheets.",
    ctaLabel: "Host an Event",
    ctaTo: "/auth/signin",
  },
  {
    id: 2,
    line1: ["Creators", "first.", "Infrastructure", "handled."],
    line2: ["Monetize", "without", "touching", "OBS"],
    highlightWord: "Creators",
    subText:
      "Go live, clip highlights, and ship content to the platforms that matter in one go. No extra cables, no messy dashboards.",
    ctaLabel: "Join Creators",
    ctaTo: "/auth/signin",
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setIndex((prev) => (prev + 1) % slides.length);
    }, 9000); // 9s per slide
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (targetIndex) => {
    if (targetIndex === index) return;
    setDirection(targetIndex > index ? 1 : -1);
    setIndex(targetIndex);
  };

  const currentSlide = slides[index];

  return (
    <section className="tw:mx-auto tw:max-w-5xl tw:px-5 tw:pt-8 tw:pb-20">
      <RatingBar />

      <div className="tw:relative tw:mt-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="tw:flex tw:flex-col tw:items-center tw:space-y-5"
          >
            {/* Headline (per-slide text) */}
            <FlowHeadline
              line1Words={currentSlide.line1}
              line2Words={currentSlide.line2}
              highlightWord={currentSlide.highlightWord}
            />

            {/* Sub text with shimmer – also per slide */}
            <motion.span
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              className="tw:relative tw:block tw:mx-auto tw:max-w-3xl tw:text-center tw:text-sm tw:text-gray-500 tw:mb-4"
            >
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
                {currentSlide.subText}
              </motion.span>
            </motion.span>

            {/* CTA */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 18 }}
              className="tw:flex tw:flex-col tw:sm:flex-row tw:items-center tw:justify-center tw:gap-4"
            >
              <CTAButton to={currentSlide.ctaTo} label={currentSlide.ctaLabel} />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slider dots */}
        <div className="tw:mt-6 tw:flex tw:items-center tw:justify-center tw:gap-3">
          {slides.map((slide, i) => {
            const isActive = i === index;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleDotClick(i)}
                className="tw:relative tw:h-2.5 tw:rounded-full tw:overflow-hidden tw:bg-gray-200 tw:transition-[width] tw:duration-300"
                style={{ width: isActive ? "32px" : "10px" }}
              >
                {isActive && (
                  <motion.span
                    layoutId="hero-slider-dot"
                    className="tw:absolute tw:inset-0 tw:rounded-full"
                    style={{ background: "linear-gradient(90deg,#8F07E7,#C115B5)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
