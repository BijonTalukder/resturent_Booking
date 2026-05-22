import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Success = () => {
  return (
    <div className="min-h-screen bg-[#eef0f4] flex items-center justify-center p-4">
      <div className="neu-card max-w-2xl w-full p-8 lg:p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          style={{
            boxShadow: "inset 3px 3px 6px rgba(163,177,198,0.3), inset -3px -3px 6px rgba(255,255,255,0.5)"
          }}
        >
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-[#373b43] mb-4">
          Thank you for your booking!
        </h1>
        <p className="text-[#6b7588] text-lg mb-2">
          Your booking is being processed and will be assessed within 1-2 hours.
        </p>
        <p className="text-[#6b7588] mb-8">
          Please check your booking confirmation in your given email.
        </p>

        <Link
          to="/"
          className="neu-btn-primary inline-block px-8 py-3 text-sm font-medium"
        >
          Continue Booking
        </Link>
      </div>
    </div>
  )
}

export default Success;
