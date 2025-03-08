import { LiaCarSideSolid } from "react-icons/lia";
import { FaPercent } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import { LuPhone } from "react-icons/lu";

const BusinessSummary = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mt-20 px-5">
      <div className="flex gap-2 w-[300px] h-[40px]">
        <div>
          <LiaCarSideSolid className="w-10 h-10 text-[#24354C]" />
        </div>
        <div>
          <p className="text-[16px]  font-medium">We Deliver nationwide</p>
          <p className="text-[10px] text-[#5E5C5C]">
            Delivery of goods all over the world
          </p>
        </div>
      </div>
      <div className="flex gap-4 lg:px-6 ">
        <div>
          <FaPercent className="w-8 h-8 text-[#24354C]" />
        </div>
        <div>
          <p className="text-[16px] font-medium">Everyday Low Price </p>
          <p className="text-[10px] text-[#5E5C5C]">
            Extensive collection at the lowest price
          </p>
        </div>
      </div>
      <div className="flex  gap-3 lg:px-6 ">
        <div>
          <AiOutlineLike className="w-8 h-8 text-[#24354C]" />
        </div>
        <div>
          <p className="text-[16px] font-medium">Satisfied And refunded</p>
          <p className="text-[10px] text-[#5E5C5C]">Granted product quality</p>
        </div>
      </div>
      <div className="flex  gap-4 lg:px-6 ">
        <div>
          <LuPhone className="w-8 h-8  text-[#24354C]" />
        </div>
        <div>
          <p className="text-[16px] font-medium">Support</p>
          <p className="text-[10px] text-[#5E5C5C]">
            Call us free : ( 00000000000)
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessSummary;
