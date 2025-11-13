import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Nav() {
  return (
    <div className="tw:relative tw:z-10 tw:mx-auto tw:max-w-7xl tw:px-5 tw:py-6">
      <motion.div
        className="tw:flex tw:items-center tw:justify-between"
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <Link to="/" className="tw:inline-flex tw:items-center tw:gap-2">
          <motion.img
            src="/images/logo.png"
            alt="Zagasm Studios"
            className="tw:w-52 tw:rounded-sm"
            initial={{ rotate: -6, scale: 0.9, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 14,
              delay: 0.05,
            }}
            whileHover={{ rotate: 2, scale: 1.02 }}
          />
        </Link>
        <Link
          to={"/auth/signin"}
          className="tw:bg-linear-to-br text-white tw:px-6 tw:py-3 tw:rounded-3xl tw:from-primary tw:to-primarySecond "
        >
          Sign in
        </Link>
      </motion.div>
    </div>
  );
}
