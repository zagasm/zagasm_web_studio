import React from "react";
import { Link } from "react-router-dom";
import { CircleArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTAButton({ to = "/auth/signup", label = "Get Started" }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <Link
        to={to}
        className="tw:group tw:relative tw:inline-flex tw:items-center tw:gap-3 tw:rounded-full tw:bg-linear-to-r tw:from-[#8F07E7] tw:to-[#C115B5] tw:px-6 tw:py-3 text-white tw:font-semibold tw:shadow-2xl tw:shadow-[#8F07E7]/30 tw:transition tw:will-change-transform"
      >
        {label}
        <span className="tw:inline-flex tw:h-8 tw:w-8 tw:items-center tw:justify-center tw:rounded-full tw:bg-white/15 tw:backdrop-blur">
          <CircleArrowRight size={18} />
        </span>
        <span className="shine" />
      </Link>
    </motion.div>
  );
}
