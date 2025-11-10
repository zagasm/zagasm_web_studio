import React from "react";

export default function ProcessSteps() {
  const steps = [
    {
      title: "Request Received",
      body: "We verify your email and confirm ownership of the account to protect your data.",
    },
    {
      title: "Data Compilation",
      body: "We collect your information from Zagasm modules (streams, events, wallet, chat, analytics) into a single archive.",
    },
    {
      title: "Secure Delivery",
      body: "You’ll receive a time-limited download link to retrieve your archive in JSON/CSV.",
    },
  ];

  return (
    <div className="tw:mb-12">
      <h3 className="tw:text-xl sm:tw:text-2xl tw:font-semibold tw:mb-4">
        How We Process Your Request
      </h3>

      {/* Bootstrap grid for layout, Tailwind for style */}
      <ol className="list-unstyled row row-cols-1 row-cols-md-2 g-3 g-lg-4">
        {steps.map((s, i) => (
          <li key={s.title} className="col">
            <div className="tw:h-full tw:flex tw:items-start tw:gap-4 tw:border tw:border-gray-200 tw:rounded-2xl tw:p-5">
              <div className="tw:w-8 tw:h-8 tw:flex tw:items-center tw:justify-center tw:rounded-full tw:bg-primary tw:text-white tw:shrink-0">
                {i + 1}
              </div>
              <div>
                <div className="tw:font-semibold">{s.title}</div>
                <p className="tw:text-gray-700 tw:mt-1">{s.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
