import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCity,
  FaSwimmingPool,
  FaWifi,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle/SectionTitle";
import { useGetProductsQuery } from "../../../redux/Feature/Admin/product/productApi";
import ProductsSkeleton from "../../../components/Skeleton/ProductsSkeleton";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook/Hook";
import ViewProduct from "../../../components/ViewProduct";
import { setIsProductViewModalOpen } from "../../../redux/Modal/ModalSlice";
import { Modal } from "antd";
import { IoLocationOutline, IoSearch } from "react-icons/io5";
import Image1 from "../../../../public/image.png";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import Cart from "../../../common/Cart/Cart";
import Adjustment from "../../../common/Adjustment/Adjustment";

const hotels = [
  {
    id: 1,
    name: "Hotel Golden Palace, Puri",
    location: "VIP Rd, City, Puri, Odisha 752001",
    rating: 4.5,
    reviews: 23,
    distanceFromCenter: 34.32,
    price: {
      original: 34440.87,
      discounted: 31440.87,
    },
    amenities: ["Free Wifi", "Swimming Pool", "City View"],
    imageUrl: Image1,
    nights: 3,
    capacity: {
      adults: 2,
      children: 2,
    },
    tags: ["Best", "Cheapest"],
  },
  {
    id: 2,
    name: "Hotel Golden Palace, Puri",
    location: "VIP Rd, City, Puri, Odisha 752001",
    rating: 4.5,
    reviews: 23,
    distanceFromCenter: 34.32,
    price: {
      original: 34440.87,
      discounted: 31440.87,
    },
    amenities: ["Free Wifi", "Swimming Pool", "City View"],
    imageUrl: Image1,
    nights: 3,
    capacity: {
      adults: 2,
      children: 2,
    },
    tags: ["Best", "Cheapest"],
  },
];

const AllHotel = () => {
  const { data, error, isLoading } = useGetProductsQuery();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
    const [visibleRight, setVisibleRight] = useState(false);
  

  // useEffect(() => {
  //   if (!isLoading) {
  //     const timer = setTimeout(() => {
  //       setShowSkeleton(false);
  //     }, 500);

  //     return () => clearTimeout(timer);
  //   }
  // }, [isLoading]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // if (isLoading || showSkeleton) {
  //   return <ProductsSkeleton />;
  // }

  return (
    <div className="">
      <div className="relative w-[100%] md:w-[75%] lg:w-[50%] mx-auto mb-5 items-center flex py-[8px] gap-2">
        <div className="w-full">
          <label htmlFor="Search" className="sr-only">
            Search
          </label>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              id="Search"
              name="search"
              placeholder="Search By Hotels..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full text-[15px] ps-10 md:ps-12 outline-none py-[4px] md:py-2 border-gray-300 rounded-full border-[0.5px] pe-10 shadow-sm sm:text-sm"
            />
          </form>
          <div className="absolute px-2 md:px-4 top-[5px] md:top-[8px] bottom-0 flex justify-center items-center h-[40px] md:h-[37px]">
            <IoSearch className="cursor-pointer text-[20px] text-gray-200" />
          </div>
        </div>
      <button onClick={() => setVisibleRight(true)} >
      <HiOutlineAdjustmentsHorizontal className="text-gray-400 text-[28px] bg-gray-100 md:text-[35px] px-[4px] md:py-2 rounded-full" />
      </button>
      <Adjustment visibleRight={visibleRight} setVisibleRight={setVisibleRight}/>
      
       
      </div>

      <div className="lg:max-w-[98%] grid grid-cols-2 gap-4 md:flex md:flex-col mx-auto">
        {hotels.map((hotel, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white mb-4"
          >
            <div className="relative h-[110px] md:w-[400px] md:h-[300px]">
              <img
                src={hotel.imageUrl}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-2 right-2 text-white bg-[#9E9E9E59] rounded-full p-2">
                <CiHeart className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 px-2 py-1 md:px-4 md:py-4">
              <div className="flex flex-col lg:flex-row lg:gap-8">
                <div className="flex-1 md:space-y-4 md:border-b-2 lg:border-b-0 lg:border-r-2 border-gray-400 border-dashed lg:px-3 py-2 md:py-5 lg:py-0">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-2">
                    <h2 className="text-[10px] md:text-2xl font-semibold text-[#1A1A1A]">
                      {hotel.name}
                    </h2>
                    <div className="hidden md:flex gap-1  text-[#F99F1D] text-xl">
                      {"★".repeat(Math.floor(hotel.rating))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#666666] md:mb-4">
                    <IoLocationOutline className="text-lg text-blue-500 block lg:hidden" />
                    <span className="text-[8px]">{hotel.location}</span>
                  </div>

                  <div className="hidden md:flex flex-col items-start lg:flex-row lg:items-center gap-5 ">
                    <div className="flex items-center gap-1 text-[#5054D9] cursor-pointer ">
                      <span className="text-sm">View property in map</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#666666]">
                        📍 34.32 KM from center
                      </span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-3 lg:gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <FaWifi className="text-[#666666] text-xl" />
                      <span className="text-[#666666]">Free WiFi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaSwimmingPool className="text-[#666666] text-xl" />
                      <span className="text-[#666666]">Pool</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCity className="text-[#666666] text-xl" />
                      <span className="text-[#666666]">City View</span>
                    </div>
                  </div>

                  <div className="hidden md:flex gap-2">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#5054D9]"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#1A1A1A] font-medium">
                        {hotel.rating}
                      </span>
                      <span className="text-[#666666]">
                        ({hotel.reviews} Reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:min-w-[300px] md:space-y-5 text-start lg:text-right">
                  <div className="md:flex hidden gap-2 justify-end">
                    {hotel.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-sm hidden lg:block ${
                          tag === "Best"
                            ? "bg-[#B8BBFF40] text-[#5054D9]"
                            : "bg-[#FFD18140] text-[#F99F1D]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="hidden md:flex items-center gap-2 justify-end">
                    <div className="text-[#666666] line-through ">
                      Rs{hotel.price.original.toLocaleString()}
                    </div>
                    <div className="text-2xl font-bold text-[#5054D9]">
                      Rs{hotel.price.discounted.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-[#666666] hidden lg:block text-sm">
                    Includes Taxes & Charges
                  </div>
                  <div className="text-[#666666] hidden lg:block text-sm">
                    {hotel.nights} nights
                  </div>
                  <div className="text-[#666666] text-sm hidden lg:block">
                    {hotel.capacity.adults} Adults, {hotel.capacity.children}{" "}
                    Children
                  </div>
                  <button className="lg:w-full hidden lg:block text-[#5054D9] py-3 rounded-lg border border-[#5054D9] transition font-medium px-4">
                    Choose Room
                  </button>

                  <div className="lg:hidden">
                    <div className="text-[#5054D9] font-bold text-[9px] md:hidden mb-2">
                      <span className="">
                        {" "}
                        {hotel.price.discounted.toLocaleString()} BDT
                      </span>
                    </div>
                    <button className="text-[#5054D9] text-xs py-1 w-full rounded-lg border border-[#5054D9] transition font-medium px-1 mb-4">
                      Choose Room
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllHotel;
