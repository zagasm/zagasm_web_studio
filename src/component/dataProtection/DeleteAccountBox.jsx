import React from "react";

export default function DeleteAccountBox() {
  return (
    <div className="tw:mb-12 tw:border tw:border-amber-300 tw:bg-amber-50 tw:rounded-2xl tw:p-5">
      <div className="tw:font-semibold tw:text-amber-900 tw:text-lg md:text-2xl">
        Need to Delete Your Account?
      </div>
      <p className="tw:mt-2 tw:text-amber-900/90">
        You may request permanent deletion of your account and personal data.
        This action can’t be undone. We recommend requesting a data export
        before deletion.
      </p>
      <p className="tw:mt-2 tw:text-amber-900/90">
        To proceed, visit your account settings or email{" "}
        <span className="tw:font-medium">privacy@zagasm.com</span>.
      </p>
    </div>
  );
}
