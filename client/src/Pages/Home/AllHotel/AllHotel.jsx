import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";
import ProductsSkeleton from "../../../components/Skeleton/ProductsSkeleton";
import { IoLocationOutline } from "react-icons/io5";
import { FaList, FaTh } from "react-icons/fa";
import Image1 from "../../../../public/image.png";
import { useGetHotelsBySearchQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";

const AllHotel = () => {
  const { searchQuery, divisionId, cityId } = useOutletContext();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const { data, error, isLoading, isFetching } = useGetHotelsBySearchQuery({
    name: searchQuery,
    divisionId,
    cityId
  });

  useEffect(() => {
    if (isFetching || isLoading) {
      setShowSkeleton(true);
    } else {
      setShowSkeleton(false);
    }
  }, [isFetching, isLoading]);

  const noHotelsFound = !isLoading && !showSkeleton && data?.data?.length === 0 &&
    (searchQuery.trim() !== "" || cityId || divisionId);

  return (
    <div className="pb-[80px] px-4">
      <SectionTitle title="Check our all hotels" />
      
      {/* View Mode Toggle */}
      <div className="hidden md:flex justify-end mb-6 mr-4">
        <div className="neu-sm flex p-1.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              viewMode === 'grid'
                ? 'shadow-neu-inset-sm bg-[#eef0f4] text-primary'
                : 'text-[#6b7588] hover:text-[#373b43]'
            }`}
          >
            <FaTh className="text-sm" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              viewMode === 'list'
                ? 'shadow-neu-inset-sm bg-[#eef0f4] text-primary'
                : 'text-[#6b7588] hover:text-[#373b43]'
            }`}
          >
            <FaList className="text-sm" />
          </button>
        </div>
      </div>

      {/* Show Skeleton While Loading */}
      {(isLoading || showSkeleton) && <ProductsSkeleton hotelData={data?.data} viewMode={viewMode} />}

      {/* Show "No hotels found" message */}
      {noHotelsFound && (
        <div className="neu-sm max-w-md mx-auto p-6 text-center">
          <p className="text-[13px] md:text-xl font-bold text-primary">
            No hotel found for the given criteria.
          </p>
        </div>
      )}
      
      {/* Hotels Container */}
      <div className={`${
        viewMode === 'grid'
          ? 'lg:max-w-[98%] grid grid-cols-2 lg:grid-cols-3 gap-4 mx-auto'
          : 'mx-auto space-y-4'
      }`}>
        {!isLoading && !showSkeleton && data?.data?.map((hotel, index) => (
          <Link
            to={`/hotel-details/${hotel?.id}`}
            key={index}
            className={`block ${
              viewMode === 'list'
                ? 'flex flex-row h-48'
                : 'flex flex-col'
            } neu-card overflow-hidden`}
          >
            {/* Image */}
            <div className={`${
              viewMode === 'list'
                ? 'w-1/3 h-full'
                : 'h-[110px] md:h-[300px]'
            } relative`}>
              <img
                src={hotel?.image || Image1}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className={`${
              viewMode === 'list'
                ? 'w-2/3 p-4 flex flex-col justify-between'
                : 'flex-1 px-2 py-1 md:px-4 md:py-4'
            }`}>
              <div className={`${
                viewMode === 'list'
                  ? 'flex flex-col h-full justify-between'
                  : 'flex flex-col lg:gap-8'
              }`}>
                {/* Hotel Info */}
                <div className={`${
                  viewMode === 'list'
                    ? 'space-y-2'
                    : 'md:space-y-4 lg:px-3 py-2 md:py-5 lg:py-0'
                }`}>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
                    <h2 className={`font-semibold text-[#1A1A1A] ${
                      viewMode === 'list'
                        ? 'text-lg md:text-xl'
                        : 'text-[10px] md:text-2xl'
                    }`}>
                      {hotel.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-1 text-[#666666] md:mb-4">
                    <IoLocationOutline className="text-lg text-primary" />
                    <span className={`${
                      viewMode === 'list'
                        ? 'text-sm'
                        : 'text-[8px] md:text-[14px]'
                    }`}>
                      {hotel.location}
                    </span>
                  </div>

                  {/* Amenities - Show more in list view */}
                  {viewMode === 'list' && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {hotel.amenities.slice(0, 4).map((amenity, i) => (
                        <span
                          key={i}
                          className="neu-xs px-3 py-1 text-xs text-[#6b7588]"
                        >
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="neu-xs px-3 py-1 text-xs text-[#6b7588]">
                          +{hotel.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Section */}
                <div className={`${
                  viewMode === 'list'
                    ? 'flex items-center justify-between mt-auto'
                    : 'md:min-w-[300px] md:space-y-5'
                }`}>
                  {/* Amenities - Grid view only */}
                  {viewMode === 'grid' && (
                    <div className="md:flex hidden gap-2">
                      {hotel.amenities.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 rounded-xl text-sm hidden lg:block shadow-neu-xs ${
                            tag === "Best"
                              ? "text-[#5054D9]"
                              : "text-[#F99F1D]"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="px-3 py-1 rounded-xl text-sm hidden lg:block shadow-neu-xs text-[#F99F1D]">
                        + more..
                      </span>
                    </div>
                  )}

                  {/* Price and Button */}
                  {viewMode === 'list' && hotel.rooms && hotel.rooms.length > 0 && (
                    <div className="text-lg font-bold text-primary">
                      {hotel.rooms[0]?.discount ? (
                        <span>
                          <span className="line-through text-sm text-[#6b7588] mr-1">
                            {hotel.rooms[0].price} Tk
                          </span>
                          {(() => {
                            const r = hotel.rooms[0];
                            const effective = r.discountType === "flat"
                              ? Math.max(0, r.price - r.discount)
                              : Math.round(r.price - (r.price * r.discount) / 100);
                            return `${effective} Tk/night`;
                          })()}
                          <span className="text-xs text-red-500 ml-1">
                            {hotel.rooms[0].discountType === "flat" ? `-${hotel.rooms[0].discount}Tk` : `-${hotel.rooms[0].discount}%`}
                          </span>
                        </span>
                      ) : (
                        `${hotel.rooms[0]?.price} Tk/night`
                      )}
                    </div>
                  )}
                  
                  <div className={`${viewMode === 'list' ? 'w-auto' : 'w-full'}`}>
                    <button className={`font-medium transition-all duration-200 neumorphic-btn ${
                      viewMode === 'list'
                        ? 'px-4 py-2 rounded-xl text-primary neu-sm hover:shadow-neu-inset-sm'
                        : 'text-xs lg:text-base py-1 lg:py-3 w-full rounded-xl px-1 mb-4 text-primary neu-sm hover:shadow-neu-inset-sm'
                    }`}>
                      {viewMode === 'list' ? 'View Details' : 'Choose Room'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllHotel;
