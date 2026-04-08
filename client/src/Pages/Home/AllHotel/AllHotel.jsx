import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import ProductsSkeleton from "../../../components/Skeleton/ProductsSkeleton";
import { IoLocationOutline, IoStarSharp } from "react-icons/io5";
import { FaList, FaTh, FaWifi, FaParking, FaSwimmingPool, FaDumbbell } from "react-icons/fa";
import { MdOutlineBreakfastDining } from "react-icons/md";
import Image1 from "../../../../public/image.png";
import { useGetHotelsBySearchQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";

const AMENITY_ICONS = {
  "WiFi": <FaWifi size={12} />,
  "Parking": <FaParking size={12} />,
  "Pool": <FaSwimmingPool size={12} />,
  "Gym": <FaDumbbell size={12} />,
  "Breakfast": <MdOutlineBreakfastDining size={12} />,
};

const StarRating = ({ rating = 4 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <IoStarSharp
        key={s}
        size={11}
        className={s <= rating ? "text-amber-400" : "text-gray-200"}
      />
    ))}
  </div>
);

// ─── Grid Card ───────────────────────────────────────────────────────────────
const GridCard = ({ hotel }) => (
  <Link
    to={`/hotel-details/${hotel?.id}`}
    className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    {/* Image */}
    <div className="relative h-[110px] md:h-[220px] overflow-hidden">
      <img
        src={hotel?.image || Image1}
        alt={hotel.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {/* Badge */}
      {hotel.amenities?.includes("Best") && (
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-semibold rounded-full">
          Top Rated
        </span>
      )}
      {/* Price overlay on mobile */}
      <div className="md:hidden absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
        <span className="text-blue-600 font-bold text-xs">
          {hotel.rooms?.[0]?.price ? `৳${hotel.rooms[0].price}` : "See prices"}
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 p-2.5 md:p-4">
      {/* Stars */}
      <div className="hidden md:block mb-1">
        <StarRating rating={hotel.starRating || 4} />
      </div>

      {/* Name */}
      <h2 className="font-bold text-gray-900 text-[11px] md:text-[16px] leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
        {hotel.name}
      </h2>

      {/* Location */}
      <div className="flex items-center gap-1 text-gray-500 mt-0.5 md:mt-1">
        <IoLocationOutline className="text-blue-500 shrink-0" size={12} />
        <span className="text-[9px] md:text-[13px] truncate">{hotel.location}</span>
      </div>

      {/* Amenity chips - desktop only */}
      {hotel.amenities?.length > 0 && (
        <div className="hidden md:flex flex-wrap gap-1.5 mt-3">
          {hotel.amenities.slice(0, 3).map((a, i) => (
            <span
              key={i}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-500 text-[11px]"
            >
              {AMENITY_ICONS[a] || null}
              {a}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="px-2 py-0.5 rounded-full bg-gray-50 border border-gray-100 text-gray-400 text-[11px]">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom row */}
      <div className="hidden md:flex items-end justify-between mt-4 pt-3 border-t border-gray-100">
        <div>
          {hotel.rooms?.[0]?.price ? (
            <>
              <p className="text-[11px] text-gray-400 mb-0.5">Starting from</p>
              <p className="text-xl font-extrabold text-blue-600">
                ৳{hotel.rooms[0].price}
                <span className="text-xs font-normal text-gray-400 ml-1">/night</span>
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">Price on request</p>
          )}
        </div>
        <span className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors group-hover:scale-105 transition-transform duration-200">
          View Rooms
        </span>
      </div>

      {/* Mobile CTA */}
      <button className="md:hidden mt-2 w-full py-1.5 rounded-lg border border-blue-500 text-blue-600 text-[10px] font-semibold">
        Choose Room
      </button>
    </div>
  </Link>
);

// ─── List Card ────────────────────────────────────────────────────────────────
const ListCard = ({ hotel }) => (
  <Link
    to={`/hotel-details/${hotel?.id}`}
    className="group flex flex-row rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 h-48 md:h-52"
  >
    {/* Image */}
    <div className="relative w-1/3 md:w-64 shrink-0 overflow-hidden">
      <img
        src={hotel?.image || Image1}
        alt={hotel.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {hotel.amenities?.includes("Best") && (
        <span className="absolute top-3 left-3 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-semibold rounded-full">
          Top Rated
        </span>
      )}
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 p-4 md:p-5 justify-between min-w-0">
      <div>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h2 className="font-bold text-gray-900 text-base md:text-xl group-hover:text-blue-600 transition-colors line-clamp-1">
            {hotel.name}
          </h2>
          <StarRating rating={hotel.starRating || 4} />
        </div>

        <div className="flex items-center gap-1 text-gray-500 mb-3">
          <IoLocationOutline className="text-blue-500 shrink-0" size={14} />
          <span className="text-xs md:text-sm truncate">{hotel.location}</span>
        </div>

        {/* Amenities */}
        {hotel.amenities?.length > 0 && (
          <div className="hidden md:flex flex-wrap gap-1.5">
            {hotel.amenities.slice(0, 5).map((a, i) => (
              <span
                key={i}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-500 text-xs"
              >
                {AMENITY_ICONS[a] || null}
                {a}
              </span>
            ))}
            {hotel.amenities.length > 5 && (
              <span className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-gray-400 text-xs">
                +{hotel.amenities.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div>
          {hotel.rooms?.[0]?.price ? (
            <>
              <p className="text-[10px] text-gray-400">Starting from</p>
              <p className="text-lg md:text-2xl font-extrabold text-blue-600">
                ৳{hotel.rooms[0].price}
                <span className="text-xs font-normal text-gray-400 ml-1">/night</span>
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-400 italic">Price on request</p>
          )}
        </div>
        <span className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
          View Details →
        </span>
      </div>
    </div>
  </Link>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const AllHotel = () => {
  const { searchQuery, divisionId, cityId } = useOutletContext();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const { data, error, isLoading, isFetching } = useGetHotelsBySearchQuery({
    name: searchQuery,
    divisionId,
    cityId,
  });

  useEffect(() => {
    setShowSkeleton(isFetching || isLoading);
  }, [isFetching, isLoading]);

  const noHotelsFound =
    !isLoading &&
    !showSkeleton &&
    data?.data?.length === 0 &&
    (searchQuery.trim() !== "" || cityId || divisionId);

  const hotels = data?.data || [];

  return (
    <div className="pb-20 md:pb-10">
      {/* ── Section header ── */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900">All Hotels</h2>
          {!isLoading && !showSkeleton && (
            <p className="text-sm text-gray-400 mt-0.5">
              {hotels.length} {hotels.length === 1 ? "property" : "properties"} found
            </p>
          )}
        </div>
        {/* View toggle */}
        <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === "grid"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <FaTh size={12} /> Grid
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === "list"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <FaList size={12} /> List
          </button>
        </div>
      </div>

      {/* Mobile section title */}
      <div className="md:hidden">
        <SectionTitle title="All Hotels" />
      </div>

      {/* Loading */}
      {(isLoading || showSkeleton) && (
        <ProductsSkeleton hotelData={data?.data} viewMode={viewMode} />
      )}

      {/* Empty state */}
      {noHotelsFound && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No hotels found</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            We couldn't find any properties matching your search. Try a different location or clear your filters.
          </p>
        </div>
      )}

      {/* Hotel cards */}
      {!isLoading && !showSkeleton && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5"
              : "space-y-4"
          }
        >
          {hotels.map((hotel, index) =>
            viewMode === "grid" ? (
              <GridCard key={hotel?.id || index} hotel={hotel} />
            ) : (
              <ListCard key={hotel?.id || index} hotel={hotel} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AllHotel;