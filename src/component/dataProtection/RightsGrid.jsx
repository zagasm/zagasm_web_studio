import React from "react";

const cards = [
  {
    title: "Right to Access",
    desc: "Request a copy of personal data we process across streams, events, chat, wallet and analytics.",
    tone: "tw:bg-blue-50",
  },
  {
    title: "Right to Rectification",
    desc: "Update inaccurate or incomplete information in your profile or account settings.",
    tone: "tw:bg-purple-50",
  },
  {
    title: "Right to Deletion",
    desc: "Request permanent deletion of your account and associated personal data.",
    tone: "tw:bg-rose-50",
  },
  {
    title: "Right to Portability",
    desc: "Receive your data in a structured, commonly used format (e.g., JSON/CSV).",
    tone: "tw:bg-green-50",
  },
  {
    title: "Right to Object",
    desc: "Object to certain processing like marketing communications or creator analytics.",
    tone: "tw:bg-amber-50",
  },
  {
    title: "Right to Restriction",
    desc: "Ask us to limit processing while a dispute or concern is reviewed.",
    tone: "tw:bg-slate-50",
  },
  {
    title: "Right to Withdraw Consent",
    desc: "Withdraw consent for optional processing (e.g., personalized recommendations or marketing) at any time.",
    tone: "tw:bg-cyan-50",
  },
  {
    title: "Right to Lodge a Complaint",
    desc: "Raise a complaint with Zagasm Studios and/or the relevant data protection authority if you believe your rights are infringed.",
    tone: "tw:bg-indigo-50",
  },
];

export default function RightsGrid() {
  return (
    <div className="tw:max-w-5xl tw:mx-auto">
      <h3 className="tw:text-xl tw:sm:text-2xl tw:font-bold tw:mb-4">
        Your Privacy Rights
      </h3>

      {/* Bootstrap grid handles the columns and gaps */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-3 g-3 g-lg-4 tw:mb-12">
        {cards.map((c) => (
          <div className="col" key={c.title}>
            <div
              className={`tw:rounded-2xl tw:p-5 tw:border tw:border-gray-200 ${c.tone}`}
            >
              <span className="tw:font-semibold tw:text-[15px]">{c.title}</span>
              <span className="tw:text-gray-500 tw:text-xs tw:block tw:mt-2">{c.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
