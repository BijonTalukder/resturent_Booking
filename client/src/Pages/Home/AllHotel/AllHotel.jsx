import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { CiHeart, CiShoppingCart } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle/SectionTitle";
import { useGetProductsQuery } from "../../../redux/Feature/Admin/product/productApi";
import ProductsSkeleton from "../../../components/Skeleton/ProductsSkeleton";
import { useAppDispatch, useAppSelector } from "../../../redux/Hook/Hook";
import ViewProduct from "../../../components/ViewProduct";
import { setIsProductViewModalOpen } from "../../../redux/Modal/ModalSlice";
import { Modal } from "antd";
import { IoSearch } from "react-icons/io5";

const AllHotel = () => {

  const { data, error, isLoading } = useGetProductsQuery();
  const [showSkeleton, setShowSkeleton] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
  

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
    <div className="mt-16 mb-16">
      {/* <SectionTitle
        title="Recommended For you"
        subTitle="Empowering everyone to express themselves through clothes."
      /> */}
            {/* Search Bar */}
            <div className="relative w-[100%] md:w-[50%] mx-auto mb-10 flex py-[6px]">
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
                    className="w-full ps-10 md:ps-12 outline-none py-[10px] md:py-2 border-gray-300 rounded-full border-[0.5px] pe-10 shadow-sm sm:text-sm"
                  />
                </form>
      
                <div className="absolute  px-2 md:px-4 top-[7px] bottom-0 flex justify-center items-center  h-[40px] md:h-[37px]">
                  <IoSearch className="cursor-pointer text-[25px] text-gray-200" />
                </div>
              </div>
            </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.data?.slice(0, 8).map((item, index) => (
          <div className="border border-gray-200 rounded-lg" key={index}>
            <div className="group h-[250px] relative block bg-black">
              <img
                alt={item?.name}
                src={item?.imageUrl || "https://placehold.co/300x250"}
                className="absolute inset-0 h-[250px] w-full object-cover transition-opacity group-hover:opacity-50"
              />

              <div className="relative">
                <div className="flex justify-between p-4 sm:p-6 lg:p-2">
                  <div>
                    {item?.topSale === true && (
                      <p className="text-sm font-medium uppercase rounded-md px-3 py-1 inline-block bg-primary text-white">
                        {item?.topSale && "Top Sale"}
                      </p>
                    )}
                    {item?.newArrival === true && (
                      <p className="text-sm font-medium uppercase rounded-md px-3 py-1 inline-block bg-primary text-white">
                        {item?.newArrival && "Newest"}
                      </p>
                    )}
                  </div>
                  <button  >
           
                        <div
                         className="bg-green-300 text-white rounded-full p-1 cursor-pointer">
                          <MdOutlineRemoveRedEye size={28} />
                        </div>
                        </button>
                </div>
              </div>
            </div>
            <div className="p-2">
              <div className="mt-5 sm:mt-8 lg:mt-5 text-base font-medium">
                <h2>{item?.name}</h2>
              </div>
              <div className="mt-5 px-2 sm:mt-8 lg:mt-5 text-sm font-medium">
                    <h2>#{item?.referenceId}</h2>
                  </div>
                  <div className="mt-2 px-2 text-base font-medium text-primary">
                    <h2>Pricing starts from ${item.variants[0]?.price || 0}</h2>
                  </div>
             
            </div>
            <Link to={`/product/${item?.id}`}>
              <div className="flex justify-center mt-10 mb-5">
                <button className="bg-primary w-full font-Poppins font-medium py-2 px-1 rounded-t-none rounded-b-lg -mb-5 text-white">
                  View Details
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* <Link to={`/shop`}>
        <div className="flex justify-center mx-auto w-[200px] mt-10 mb-5">
          <Button className="bg-[#3498DB] w-full font-Poppins font-medium py-2 px-1">
            See More
          </Button>
        </div>
      </Link> */}

    
    </div>
  );
};

export default AllHotel;