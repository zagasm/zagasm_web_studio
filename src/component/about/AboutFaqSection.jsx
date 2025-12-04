import React from "react";
import { motion } from "framer-motion";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay },
  }),
};

const faqs = [
  {
    q: "Who is Zagasm Studios for?",
    a: "For organisers, studios, and creators who run recurring shows, not one-off lives. If you care about consistency, workflows, and monetization, the platform is built for you.",
  },
  {
    q: "Do I need new hardware to use Zagasm?",
    a: "No. You can start with your existing cameras and encoders. As long as you can send RTMP, you can plug into the studio.",
  },
  {
    q: "Can Zagasm coexist with my current tools?",
    a: "Yes. Zagasm is designed as a control layer on top of YouTube, Twitch, ticketing, and CRMs you already use.",
  },
  {
    q: "Where is Zagasm based?",
    a: "The team is built from Lagos with collaborators in other cities, but the platform is designed for live creators everywhere.",
  },
];

export default function AboutFaqSection() {
  return (
    <section className="tw:space-y-5">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        custom={0}
        variants={fadeUp}
      >
        <span className="tw:block tw:text-[11px] tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">
          FAQ
        </span>
        <span className="tw:font-dela tw:mt-2 tw:block tw:text-xl tw:md:text-2xl tw:font-semibold tw:text-slate-900">
          A few quick answers before you go live.
        </span>
        <span className="tw:mt-1 tw:block tw:text-sm tw:text-slate-600 tw:max-w-xl">
          Still deciding if Zagasm fits your stack? These are the questions most
          teams ask first.
        </span>
      </motion.div>

      <motion.div
        className="tw:rounded-3xl tw:bg-white tw:border tw:border-slate-200/80 tw:p-3 tw:md:p-4 tw:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        custom={0.1}
        variants={fadeUp}
      >
        {faqs.map((item, index) => (
          <Accordion
            key={item.q}
            disableGutters
            square={false}
            sx={{
              backgroundColor: "transparent",
              boxShadow: "none",
              "&::before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon fontSize="small" />}
              sx={{
                "& .MuiAccordionSummary-content": {
                  marginY: 0.5,
                },
              }}
            >
              <span className="tw:text-[13px] tw:md:text-[14px] tw:font-medium tw:text-slate-900">
                {item.q}
              </span>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingTop: 0, paddingBottom: 1.5 }}>
              <span className="tw:block tw:text-[12px] tw:md:text-[13px] tw:text-slate-700">
                {item.a}
              </span>
            </AccordionDetails>

            {index !== faqs.length - 1 && (
              <span className="tw:block tw:h-px tw:bg-slate-100 tw:mx-3" />
            )}
          </Accordion>
        ))}
      </motion.div>
    </section>
  );
}
