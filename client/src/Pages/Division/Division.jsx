import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetDivisionsQuery } from "../../redux/Feature/User/place/placeApi";
import { IoMapOutline, IoChevronForward } from "react-icons/io5";

// Bangladesh division emoji/icon map for visual flair
const DIVISION_META = {
  Dhaka: { emoji: "🏙️", desc: "Capital & largest city" },
  Chittagong: { emoji: "⚓", desc: "Port city & hills" },
  Sylhet: { emoji: "🍃", desc: "Tea gardens & haors" },
  Rajshahi: { emoji: "🥭", desc: "Silk & mangoes" },
  Khulna: { emoji: "🌿", desc: "Sundarbans gateway" },
  Barisal: { emoji: "🚤", desc: "Venice of Bengal" },
  Rangpur: { emoji: "🌾", desc: "Northern plains" },
  Mymensingh: { emoji: "🎓", desc: "Education & culture" },
};

const SkeletonCard = () => (
  <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="h-28 bg-gradient-to-br from-gray-100 to-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-2/3" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  </div>
);

const Division = ({ onDivisionClick }) => {
  const [divisions, setDivisions] = useState([]);
  const { data: divisionsData, isLoading, isError } = useGetDivisionsQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (divisionsData) setDivisions(divisionsData.data);
  }, [divisionsData]);

  const handleClick = (division) => {
    navigate(`/district/${division?.serialId}`);
    onDivisionClick?.();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#2980b9] via-[#3498db] to-[#5dade2] px-6 py-12 md:py-16 text-white relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-16 -right-4 w-24 h-24 rounded-full bg-white/5" />
        <div className="absolute -bottom-8 left-1/3 w-36 h-36 rounded-full bg-white/5" />

        <div className="max-w-[1400px] mx-auto relative">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <IoMapOutline size={16} />
            <span>Explore Bangladesh</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
            Choose a Division
          </h1>
          <p className="text-blue-200 text-sm md:text-base max-w-lg">
            Bangladesh is divided into 8 administrative divisions. Pick one to explore districts and find your perfect stay.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-12">
        {isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-500 font-semibold">Failed to load divisions</p>
            <p className="text-gray-400 text-sm mt-1">Please try refreshing the page.</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : divisions.map((division, idx) => {
              const meta = DIVISION_META[division.name] || { emoji: "📍", desc: "Explore this division" };
              return (
                <button
                  key={division.id || idx}
                  onClick={() => handleClick(division)}
                  className="group text-left rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  {/* Card top — gradient bar */}
                  <div className="h-2 bg-gradient-to-r from-[#3498db] to-[#5dade2] group-hover:from-[#2980b9] group-hover:to-[#3498db] transition-all duration-300" />

                  <div className="p-4 md:p-5">
                    {/* Emoji */}
                    <div className="w-11 h-11 md:w-14 md:h-14 rounded-xl bg-blue-50 flex items-center justify-center text-2xl md:text-3xl mb-3 group-hover:bg-blue-100 transition-colors duration-200">
                      {meta.emoji}
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-gray-900 text-sm md:text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
                      {division.name}
                    </h3>

                    {/* Desc */}
                    <p className="text-[11px] md:text-xs text-gray-400 mt-1 leading-snug hidden sm:block">
                      {meta.desc}
                    </p>

                    {/* CTA row */}
                    <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 border-t border-gray-100">
                      <span className="text-[10px] md:text-xs font-semibold text-blue-500 uppercase tracking-wider">
                        View Districts
                      </span>
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200">
                        <IoChevronForward
                          size={12}
                          className="text-blue-400 group-hover:text-white transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Division;