import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { 
  WifiOutlined, 
  CarOutlined, 
  CoffeeOutlined,
  SafetyOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  FundProjectionScreenOutlined
} from '@ant-design/icons';
import { FaSwimmingPool } from "react-icons/fa";

// Amenity icons mapping
const amenityIcons = {
  'Free WiFi': <WifiOutlined className="text-blue-500" />,
  'Parking': <CarOutlined className="text-blue-500" />,
  'Restaurant': <CoffeeOutlined className="text-blue-500" />,
  'TV': <FundProjectionScreenOutlined className="text-blue-500" />,
  'Security': <SafetyOutlined className="text-blue-500" />,
  'Gym': <FireOutlined className="text-blue-500" />,
  'Spa': <MedicineBoxOutlined className="text-blue-500" />,
  'Swimming Pool': <FaSwimmingPool  className="text-blue-500 text-4xl" />,
  'AC': <span className="text-blue-500">AC</span> // For amenities without icons
};

const SliderAminities = ({ amenities = [] }) => {
  return (
    <div className="amenities-slider-container">
      <Swiper
        slidesPerView={'auto'}
        spaceBetween={30}
        initialSlide={0}
        className="amenities-swiper"
      >
        {amenities.map((amenity, index) => (
          <SwiperSlide key={index} className="amenity-slide">
            <div className="flex flex-col items-center gap-1 p-2">
              <div className="text-3xl">
                {amenityIcons[amenity] || <span className="text-blue-500">•</span>}
              </div>
              <div className="text-sm text-gray-600 whitespace-nowrap">
                {amenity}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SliderAminities;
