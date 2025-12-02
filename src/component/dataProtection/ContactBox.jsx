import React from "react";

export default function ContactBox() {
  return (
    <div className="tw:mb-12 tw:border tw:border-gray-200 tw:rounded-2xl tw:p-5">
      <div className="tw:font-semibold tw:text-lg tw:md:text-2xl">Questions or Concerns?</div>
      <p className="tw:mt-2 tw:text-gray-700">
        Our Data Protection team is here to help with data rights, processing
        practices and security questions.
      </p>

      <div className="tw:mt-4 tw:grid tw:grid-cols-1 tw:sm:grid-cols-3 tw:gap-3">
        <div className="tw:bg-gray-50 tw:rounded-xl tw:p-4">
          <div className="tw:text-sm tw:text-gray-500">
            Data Protection Officer
          </div>
          <div className="tw:font-medium">privacy@zagasm.com</div>
        </div>
        <div className="tw:bg-gray-50 tw:rounded-xl tw:p-4">
          <div className="tw:text-sm tw:text-gray-500">Support Team</div>
          <div className="tw:font-medium">support@zagasm.com</div>
        </div>
        <div className="tw:bg-gray-50 tw:rounded-xl tw:p-4">
          <div className="tw:text-sm tw:text-gray-500">Response Time</div>
          <div className="tw:font-medium">24–48 hours</div>
        </div>
      </div>
    </div>
  );
}
