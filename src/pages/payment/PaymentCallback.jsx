import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SEO from "../../component/SEO";
import { ToastHost } from "../../component/ui/toast";
export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const reference = searchParams.get("reference");
  const trxref = searchParams.get("trxref");

  const paymentReference = reference || trxref;

  const handleReturnHome = () => {
    navigate(-1);
  };

  return (
    <>
      <SEO
        title="Payment Success"
        description="Your event ticket is confirmed!"
      />
      <div className="tw:flex tw:flex-col tw:items-center tw:justify-center tw:min-h-screen tw:bg-gray-50 tw:text-black tw:p-4">
        <div className="tw:bg-white tw:p-8 tw:rounded-xl tw:shadow-lg tw:max-w-md tw:w-full tw:text-center">
          {paymentReference ? (
            <>
              <div className="tw:text-green-600 tw:mb-6 tw:flex tw:flex-col tw:items-center">
                <img
                  className="tw:w-32 tw:mb-4"
                  src="/images/success.png"
                  alt=""
                />
                <h1 className="tw:text-3xl tw:font-extrabold tw:mt-3 tw:text-gray-900">
                  Payment Successful!
                </h1>
              </div>
              <p className="tw:text-gray-700 tw:mb-4 tw:px-4">
                Thank you for your payment. Your ticket is being processed.
              </p>
            </>
          ) : (
            <div className="tw:text-red-600 tw:mb-6 tw:flex tw:flex-col tw:items-center">
              <span className="tw:text-7xl">😂</span>
              <h1 className="tw:text-3xl tw:font-bold tw:mt-3 tw:text-gray-900">
                Go Back!
              </h1>
            </div>
          )}

          {/* Display Reference */}
          {paymentReference ? (
            <div className="tw:bg-gray-100 tw:p-3 tw:rounded-lg tw:mb-8 tw:wrap-break-word">
              <span className="tw:text-sm tw:font-medium tw:text-gray-500 tw:block tw:mb-1">
                Transaction Reference:
              </span>
              <code className="tw:text-base tw:font-semibold tw:text-gray-800">
                {paymentReference}
              </code>
            </div>
          ) : (
            <span className="tw:block tw:text-primary tw:text-sm tw:mb-8">
              No payment reference found in the URL.
            </span>
          )}

          <button
            onClick={handleReturnHome}
            style={{
              borderRadius: 20,
            }}
            className="tw:w-full tw:py-3 tw:px-4 tw:bg-linear-to-br tw:from-primary tw:to-primarySecond tw:text-white tw:rounded-lg tw:font-semibold tw:transition tw:duration-200 tw:hover:bg-primarySecond"
          >
            Proceed
          </button>
        </div>
      </div>
    </>
  );
}
