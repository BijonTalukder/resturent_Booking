import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../../redux/Feature/auth/authApi";

const Verify = () => {
  const { token } = useParams();
  const [verifyEmail, { isLoading, isError, isSuccess, data, error }] = useVerifyEmailMutation();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef0f4]">
        <div className="neu-card p-8 text-center max-w-md">
          <div className="neu-circle w-16 h-16 mx-auto flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
          <p className="mt-4 text-[#6b7588]">Verifying your email... Please wait.</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef0f4]">
        <div className="neu-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-primary mb-4">Email Verification Failed</h2>
          <p className="text-[#6b7588] mb-6">
            {error?.data?.message || "There was an issue verifying your email. Please try again or contact support."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="neu-btn-primary px-6 py-2 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess && data?.success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#eef0f4]">
        <div className="neu-card p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
            style={{
              boxShadow: "inset 3px 3px 6px rgba(163,177,198,0.3), inset -3px -3px 6px rgba(255,255,255,0.5)"
            }}
          >
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-7">Email Verified Successfully!</h2>
          <a
            href="/login"
            className="neu-btn-primary px-6 py-2 text-sm font-medium inline-block"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#eef0f4]">
      <div className="neu-card p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold text-yellow-600 mb-4">Invalid Verification Link</h2>
        <p className="text-[#6b7588] mb-6">
          No verification token found. Please check your email for the correct link.
        </p>
        <a
          href="/"
          className="neu-btn-primary px-6 py-2 text-sm font-medium inline-block"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default Verify;
