import { useEffect, useState, useRef } from "react"; // Add useRef
import { Button } from "@material-tailwind/react";
import KeenSlider from "keen-slider";
import "keen-slider/keen-slider.min.css";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import SectionTitle from "../SectionTitle/SectionTitle";
import SliderSkeleton from "../../../components/Skeleton/SliderSkeleton";
import { Link, useLocation } from "react-router-dom";
import { useGetRelatedProductsQuery } from "../../../redux/Feature/Admin/product/productApi";

const RelatedProduct = ({id}) => {
  const { data, error, isLoading } = useGetRelatedProductsQuery(id);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const sliderRef3 = useRef(null);


  const products = data;

//   useEffect(() => {
//     if (isLoading || !products || products.length === 0) return;

//     if (sliderRef3.current) {
//       sliderRef3.current.destroy();
//       sliderRef3.current = null;
//     }

//     const sliderElement = document.getElementById("keen-slider-related");
//     if (!sliderElement) return;

//     sliderRef3.current = new KeenSlider(sliderElement, {
//       loop: true,
//       slides: {
//         origin: "center",
//         perView: 1,
//         spacing: 16,
//       },
//       breakpoints: {
//         "(min-width: 1024px)": {
//           slides: {
//             origin: "auto",
//             perView: 4,
//             spacing: 20,
//           },
//         },
//         "(max-width: 600px)": {
//           slides: {
//             origin: "center",
//             perView: 1,
//             spacing: 0,
//           },
//         },
//       },
//     });

//     const keenSliderPrevious = document.getElementById("keen-slider-related-previous");
//     const keenSliderNext = document.getElementById("keen-slider-related-next");

//     keenSliderPrevious?.addEventListener("click", () =>
//       sliderRef3.current.prev()
//     );
//     keenSliderNext?.addEventListener("click", () => sliderRef3.current.next());

//     // const autoplayInterval = setInterval(() => {
//     //   sliderRef3.current.next();
//     // }, 3000);

//     return () => {
//       // clearInterval(autoplayInterval);
//       if (sliderRef3.current) {
//         sliderRef3.current.destroy();
//         sliderRef3.current = null;
//       }
//     };
//   }, [products, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 3000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  if (isLoading || showSkeleton) {
    return <SliderSkeleton />;
  }

  // if(){
  //    { products?.length === 0 && (
  //         <p className="text-center font-bold text-2xl">
  //            No newest product arrived yet.Stay tuned with us
  //         </p>
  //       )
  //       }
  // }

  return (
    <div className="mt-16 mb-16">
      <SectionTitle
        title={"Related Products"}
        subTitle="Discover the Latest Trends & Freshest Picks!"
      />
      {products?.length === 0 ? (
        <p className="text-center font-bold text-2xl text-primary">
          No related product arrived yet. <br />
          Stay tuned with us
        </p>
      ) : (
        <>
          {/* <div className="mt-8 flex gap-4 lg:mt-5 justify-end">
            <button
              aria-label="Previous slide"
              id="keen-slider-related-previous"
              className="rounded-full border p-3 text-black transition hover:bg-[#FD3D57] hover:text-white"
            >
              <FaAngleLeft></FaAngleLeft>
            </button>

            <button
              aria-label="Next slide"
              id="keen-slider-related-next"
              className="rounded-full border p-3 text-black transition hover:bg-[#FD3D57] hover:text-white"
            >
              <FaAngleRight></FaAngleRight>
            </button>
          </div> */}

          <div 
        //   id="keen-slider-related" 
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products?.map((item, index) => (
              <div
                className="border border-gray-200 rounded-lg"
                key={index}
              >
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
                      <div className="bg-green-300 text-white rounded-full p-1 cursor-pointer">
                        <MdOutlineRemoveRedEye size={28} />
                      </div>
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
                  <div className="mt-5 px-2 sm:mt-8 lg:mt-5 text-sm font-medium  flex justify-between">
                    <h2 className="text-blue-500">{item?.category?.categoryName}</h2>
                    <h2 className="text-green-500 font-bold">{item?.brand?.brandName}</h2>
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
          <Link to={`/shop`}>
            <div className="flex justify-center mx-auto w-[200px] mt-10 mb-5">
              <Button className="bg-[#3498DB] w-full font-Poppins font-medium py-2 px-1">
                See More
              </Button>
            </div>
          </Link>
        </>
      )}
    </div>
  );
};

export default RelatedProduct;
