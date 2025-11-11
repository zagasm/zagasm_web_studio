import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const starVariants = {
  hidden: { scale: 0, rotate: -20, opacity: 0 },
  show: (i) => ({
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 220,
      damping: 12,
      delay: i * 0.05,
    },
  }),
};

export default function RatingBar() {
  return (
    <motion.div
      className="tw:mb-5 tw:flex tw:items-center tw:justify-center tw:gap-3 tw:text-sm tw:text-gray-600"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
    >
      <div className="tw:flex tw:items-center tw:gap-1 tw:text-[#8F07E7]">
        {[...Array(5)].map((_, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={starVariants}
            initial="hidden"
            animate="show"
            whileHover={{ scale: 1.15, rotate: 10 }}
          >
            <Star size={16} />
          </motion.span>
        ))}
      </div>
      <motion.span
        className="tw:opacity-80 tw:text-xs"
        initial={{ opacity: 0, x: -6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.35 }}
      >
        Trusted by 2,500+ creators & teams
      </motion.span>
    </motion.div>
  );
}
