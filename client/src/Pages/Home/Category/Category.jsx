import { FaChild, FaHandSparkles } from "react-icons/fa";
import { LuSmartphone, LuGamepad } from "react-icons/lu";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { BsSmartwatch } from "react-icons/bs";
import { CiCamera, CiHeadphones } from "react-icons/ci";
import { GiShirt, GiLipstick } from "react-icons/gi";
import { PiDress, PiSneakerLight } from "react-icons/pi";

const categories = [
  { name: "Phones", icon: <LuSmartphone />, quantity: 100 },
  { name: "Computers", icon: <HiOutlineComputerDesktop />, quantity: 75 },
  { name: "SmartWatch", icon: <BsSmartwatch />, quantity: 50 },
  { name: "Camera", icon: <CiCamera />, quantity: 30 },
  { name: "HeadPhones", icon: <CiHeadphones />, quantity: 120 },
  { name: "Gaming", icon: <LuGamepad />, quantity: 80 },
  { name: "Men Fashion", icon: <GiShirt />, quantity: 150 },
  { name: "Women Fashion", icon: <PiDress />, quantity: 140 },
  { name: "Kids Fashion", icon: <FaChild />, quantity: 60 },
  { name: "Shoes", icon: <PiSneakerLight />, quantity: 200 },
  { name: "Cosmetics", icon: <GiLipstick />, quantity: 110 },
  { name: "Skin Care", icon: <FaHandSparkles />, quantity: 90 },
];

const Categories = () => {
  return (
    <div className=" mx-auto my-10">
      <h2 className="text-3xl font-semibold text-center mb-6">
        TOP CATEGORIES
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`flex flex-col items-center justify-center px-3 py-6 border  rounded bg-[#f1f4f6] hover:bg-[#cf4146] transition duration-300  hover:text-white cursor-pointer`}
          >
            <div className="text-5xl mb-3">{category.icon}</div>
            <span className="text-sm md:text-base font-semibold mb-1">
              {category.name}
            </span>
            <p className="text-[10px] md:text-[12px]">
              {category.quantity} <span> Items available </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
