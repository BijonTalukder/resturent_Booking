import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useGetSlidersQuery } from "../../../redux/Feature/Admin/slider/sliderApi";
import { Spin } from "antd";
import Skeleton from "../../../components/Skeleton/Skeleton";
import SectionTitle from "../../../components/SectionTitle/SectionTitle";


const BannerSlider = () => {
  const { data, error, isLoading: sliderIsLoading , isFetching } = useGetSlidersQuery();
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    if (isFetching || sliderIsLoading) {
      setShowSkeleton(true);
    } else {
        setShowSkeleton(false);
    }
  }, [isFetching , sliderIsLoading]);
  

  if (error) {
    return <div>Error loading sliders: {error.message}</div>;
  }

  const sliders = data?.data.filter((item) => item?.isActive === true) || [];

  const galleryImages = sliders.map((slider) => ({
    original: slider.imageUrl,
    thumbnail: slider.imageUrl,
    originalAlt: slider.title || "Banner",
    thumbnailAlt: slider.title || "Banner Thumbnail",
  }));

  return (
    <div className="mb-[30px] px-4">
      <SectionTitle title="Offer available on hotels" />
      {
        sliderIsLoading || showSkeleton ? 
          <Skeleton />
        :
          <div className="neu-card overflow-hidden p-2">
            <ImageGallery
              items={galleryImages}
              autoPlay={true}
              slideInterval={8000}
              showThumbnails={false} 
              showFullscreenButton={false} 
              showPlayButton={false} 
              showNav={true} 
              infinite={true} 
              lazyLoad={true} 
            />
          </div>
      }
    </div>
  );
};

export default BannerSlider;
