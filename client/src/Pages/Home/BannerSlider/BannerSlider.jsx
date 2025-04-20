import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useGetSlidersQuery } from "../../../redux/Feature/Admin/slider/sliderApi";
import { Spin } from "antd";
import ProductsSkeleton from "../../../components/Skeleton/ProductsSkeleton";
import Skeleton from "../../../components/Skeleton/Skeleton";


const BannerSlider = () => {
  const { data, error, isLoading: sliderIsLoading , isFetching } = useGetSlidersQuery();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (isFetching || sliderIsLoading) {
      setShowSkeleton(true);
    } else {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isFetching , sliderIsLoading]);
  


  if (error) {
    return <div>Error loading sliders: {error.message}</div>;
  }

  // Ensure data?.data is an array before mapping
  const sliders = data?.data.filter((item) => item?.isActive === true) || [];

  // Format the sliders data for react-image-gallery
  const galleryImages = sliders.map((slider) => ({
    original: slider.imageUrl,
    thumbnail: slider.imageUrl, // Optional: Add thumbnails if needed
    originalAlt: slider.title || "Banner",
    thumbnailAlt: slider.title || "Banner Thumbnail",
  }));

  return (
    <div className="mb-[80px]">
    <h1 className="font-bold md:text-xl mb-5">More for You</h1>
          {
            sliderIsLoading || showSkeleton ? 
          <Skeleton />
          :
          <>
      <ImageGallery
        items={galleryImages}
        autoPlay={true}
        slideInterval={8000}
        showThumbnails={false} 
        showFullscreenButton={true} 
        showPlayButton={false} 
        showNav={true} 
        infinite={true} 
        lazyLoad={true} 

      />
        </>
      }
    </div>
  );
};

export default BannerSlider;