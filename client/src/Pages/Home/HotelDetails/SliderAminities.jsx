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
  FundProjectionScreenOutlined,
  LockOutlined,
  BorderOutlined,
} from '@ant-design/icons';
import { FaSwimmingPool, FaWineGlassAlt } from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";

const amenityIcons = {
  'Free WiFi': <WifiOutlined className="text-primary" />,
  'Parking': <CarOutlined className="text-primary" />,
  'Restaurant': <CoffeeOutlined className="text-primary" />,
  'TV': <FundProjectionScreenOutlined className="text-primary" />,
  'Security': <SafetyOutlined className="text-primary" />,
  'Gym': <FireOutlined className="text-primary" />,
  'Spa': <MedicineBoxOutlined className="text-primary" />,
  'Swimming Pool': <FaSwimmingPool className="text-primary text-[22px] lg:text-3xl" />,
  'AC': <TbAirConditioning className="text-primary" />,
  'Air Conditioning': <TbAirConditioning className="text-primary" />,
  'Mini Bar': <FaWineGlassAlt className="text-primary" />,
  'Safe': <LockOutlined className="text-primary" />,
  'Balcony': <BorderOutlined className="text-primary" />
};

const SliderAminities = ({ amenities = [], hideText = false }) => {
  return (
    <div className={`neu-card p-4 grid grid-cols-5 lg:grid-cols-6 gap-4
    ${hideText ? '!grid-cols-6' : ''}`}>
      {amenities.map((amenity, index) => (
        <div key={index} className="flex flex-col items-center gap-1 p-2 justify-center">
          <div className="text-sm lg:text-2xl">
            {amenityIcons[amenity] || <span className="text-primary">•</span>}
          </div>
          {!hideText && (
            <div className="text-[8px] lg:text-sm text-[#6b7588] whitespace-nowrap font-medium">
              {amenity}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SliderAminities;
