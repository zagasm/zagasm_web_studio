import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
} from "lucide-react";

/** Helper */
const col = (title, items) => ({ title, items });

export default function Footer() {
  const columns = useMemo(
    () => [
      col("Documents", ["Terms & Conditions", "Privacy Policy", "Data Protection "]),
      col("About Company", ["About Zagasm", "Contact us"]),
    ],
    []
  );

  return (
    <footer className="tw:relative tw:bg-white tw:border-t tw:border-gray-100">
      {/* Top content */}
      <div className="tw:mx-auto tw:max-w-7xl tw:px-5 tw:pt-12 tw:pb-24">
        {/* Brand + grid */}
        <div className="tw:flex tw:flex-col tw:gap-10">
          <div className="tw:flex tw:flex-col md:tw:flex-row tw:items-start md:tw:items-center tw:justify-between tw:gap-6">
            <Link to="/" className="tw:inline-flex tw:items-center tw:gap-3">
              <img
                src="/images/logo.png"
                alt="Zagasm Studios"
                className="tw:w-64 tw:rounded-sm tw:-ml-12"
              />
            </Link>

            {/* Contact + socials */}
            <div className="tw:flex tw:flex-col md:tw:flex-row tw:items-start md:tw:items-center tw:gap-6">
              <div className="tw:space-y-1 tw:text-sm">
                <div className="tw:flex tw:items-center tw:gap-2 text-dark">
                  <Phone size={16} className="tw:text-[#8F07E7]" />
                  <span>+356 620 33 03 55</span>
                </div>
                <div className="tw:flex tw:items-center tw:gap-2 text-dark">
                  <Mail size={16} className="tw:text-[#8F07E7]" />
                  <span>hello@zagasm.com</span>
                </div>
                <address className="tw:not-italic tw:text-gray-500 tw:mt-2">
                  Portomaso Business Centre, Portomaso PTM<br />
                  01, St Julian’s STJ 4011, Malta
                </address>
              </div>

              <div className="tw:flex tw:items-center tw:gap-3">
                {[
                  { Icon: Facebook, href: "#" },
                  { Icon: Twitter, href: "#" },
                  { Icon: Instagram, href: "#" },
                  { Icon: Linkedin, href: "#" },
                ].map(({ Icon, href }, i) => (
                  <motion.a
                    key={i}
                    href={href}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    className="tw:inline-flex tw:h-9 tw:w-9 tw:items-center tw:justify-center tw:rounded-full tw:ring-1 tw:ring-gray-200 hover:tw:ring-[#8F07E7]/40 tw:transition"
                    aria-label="social link"
                  >
                    <Icon size={18} className="text-dark" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Links grid */}
          <div className="tw:grid tw:grid-cols-2 sm:tw:grid-cols-3 lg:tw:grid-cols-5 tw:gap-8">
            {/* Disclaimer column (like the screenshot) */}
            {columns.map((c, idx) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: 0.05 * (idx + 1) }}
                className="tw:col-span-1"
              >
                <h6 className="tw:text-lg tw:font-semibold text-dark">{c.title}</h6>
                <ul className="tw:mt-3 tw:space-y-2 tw:-ml-8">
                  {c.items.map((it) => (
                    <li key={it}>
                      <a
                        href="#"
                        className="tw:text-sm text-dark tw:hover:text-[#8F07E7] tw:transition"
                      >
                        {it}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Back to top + divider */}
          <div className="tw:flex tw:items-center tw:justify-between tw:pt-4">
            <div className="tw:h-px tw:flex-1 tw:bg-gray-200" />
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="tw:ml-4 tw:text-xs tw:font-medium text-dark hover:tw:text-[#8F07E7] tw:transition"
            >
              Back to the top ↑
            </button>
          </div>
        </div>
      </div>

      <BottomCTA />
    </footer>
  );
}

/** Bottom full-bleed CTA bar */
function BottomCTA() {
  return (
    <div className="tw:relative tw:pb-0">
      {/* Full-bleed wrapper */}
      <div className="tw:absolute tw:left-1/2 tw:right-1/2 tw:bottom-0 tw:-translate-x-1/2 tw:w-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ type: "spring", stiffness: 140, damping: 18 }}
          className="tw:relative"
        >
          {/* Rounded top bar with gradient */}
          <Link
            to="/auth/signup"
            className="tw:block tw:w-full tw:rounded-t-[28px] tw:bg-linear-to-r tw:from-[#8F07E7] tw:to-[#C115B5] tw:px-6 tw:py-6 sm:tw:py-7 md:tw:py-8 tw:text-center"
          >
            <div className="tw:relative tw:mx-auto tw:max-w-7xl tw:px-5">
              <motion.span
                className="tw:inline-flex tw:items-center tw:gap-3 tw:text-white tw:font-extrabold tw:text-lg sm:tw:text-xl md:tw:text-2xl"
                animate={{ gap: [3, 8, 3] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                Get Started Now
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight size={22} />
                </motion.span>
              </motion.span>

              {/* Animated sheen */}
              <motion.span
                aria-hidden
                className="tw:pointer-events-none tw:absolute tw:inset-0 tw:rounded-t-[28px]"
                initial={{ x: "-120%" }}
                animate={{ x: ["-120%", "120%"] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                style={{
                  background:
                    "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.25) 45%, transparent 60%)",
                  mixBlendMode: "screen",
                }}
              />
            </div>
          </Link>
        </motion.div>
      </div>

    </div>
  );
}
