import React from "react";
import { Workflow, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AutomationSection({
  title = "Save 4+ hours every day",
  subtitle = "Let our intelligent automation tools handle repetitive tasks, so you can reclaim your time and focus on strategic initiatives.",
  ctaTo = "/auth/signup",
  ctaLabel = "Get Started for Free",
  mediaSrc,
  mediaAlt = "Automation preview",
  right = false,
}) {
  const isVideo =
    typeof mediaSrc === "string" && /\.(mp4|webm|ogg)$/i.test(mediaSrc || "");

  const textVariants = {
    hidden: { opacity: 0, y: 16 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        type: "spring",
        stiffness: 140,
        damping: 18,
      },
    }),
  };

  return (
    <section className="tw:relative tw:mt-24 tw:md:mt-56">
      {/* Section blur backdrops */}
      <div
        aria-hidden
        className="tw:pointer-events-none tw:absolute tw:inset-0"
      >
        <div className="tw:absolute tw:-left-40 tw:top-10 tw:h-[420px] tw:w-[420px] tw:rounded-full tw:blur-[90px] tw:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(143,7,231,0.22),rgba(193,21,181,0.10)_55%,transparent_70%)]" />
        <div className="tw:absolute tw:-right-28 tw:bottom-0 tw:h-[520px] tw:w-[520px] tw:rounded-full tw:blur-[110px] tw:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(193,21,181,0.18),rgba(143,7,231,0.10)_55%,transparent_70%)]" />
      </div>

      <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-7xl tw:px-5">
        <div
          className={`tw:flex tw:flex-col ${
            right ? "tw:md:flex-row-reverse" : "tw:md:flex-row"
          } tw:justify-between tw:items-center tw:gap-10`}
        >
          {/* LEFT: copy */}
          <motion.div
            className="tw:max-w-xl tw:text-center tw:md:text-left"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              className="tw:mb-4 tw:inline-flex tw:items-center tw:gap-2 tw:text-[#8F07E7] tw:text-[12px] tw:tracking-widest tw:uppercase"
              variants={textVariants}
              custom={0}
            >
              <Workflow size={16} />
              <span>Automate Workflows</span>
            </motion.div>

            <motion.span
              className="tw:block tw:mb-4 tw:text-4xl tw:md:tw:text-5xl tw:lg:tw:text-6xl tw:font-extrabold tw:leading-[0.95] tw:tracking-tight tw:text-gray-900"
              variants={textVariants}
              custom={1}
            >
              {title}
            </motion.span>

            <motion.span
              className="tw:block tw:text-gray-600 tw:text-sm tw:md:tw:text-lg tw:lg:tw:text-xl tw:mb-8 tw:max-w-[52ch]"
              variants={textVariants}
              custom={2}
            >
              {subtitle}
            </motion.span>

            {/* CTA — wrapped only for bounce loop */}
            <motion.div
              variants={textVariants}
              custom={3}
              animate={{ y: -2 }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              <Link
                to={ctaTo}
                className="tw:group tw:inline-flex tw:items-center tw:gap-3 tw:rounded-full tw:bg-white tw:px-5 tw:py-3 tw:border tw:border-[#8F07E7]/30 tw:text-[#8F07E7] tw:font-semibold tw:shadow-lg hover:tw:shadow-xl tw:transition"
              >
                {ctaLabel}
                <span className="tw:inline-flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-full tw:bg-[linear-gradient(135deg,#8F07E7,#C115B5)] tw:text-white">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT: media */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: right ? -1.5 : 1.5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ type: "spring", stiffness: 160, damping: 18 }}
            className="tw:relative"
          >
            {/* floating glow card */}
            <motion.div
              aria-hidden
              className="tw:absolute -tw:inset-3 tw:rounded-3xl tw:bg-linear-to-br tw:from-[#8F07E7]/20 tw:to-[#C115B5]/10 tw:blur-2xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            />
            {/* Card — added continuous bounce */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="tw:relative tw:rounded-2xl tw:overflow-hidden "
              animate={{ y: -2 }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            >
              {isVideo ? (
                <video
                  src={mediaSrc}
                  playsInline
                  muted
                  loop
                  autoPlay
                  className="tw:w-full tw:h-full tw:block"
                  poster=""
                />
              ) : (
                <img
                  src={mediaSrc}
                  alt={mediaAlt}
                  className="tw:w-full tw:h-full tw:block"
                  loading="lazy"
                />
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
