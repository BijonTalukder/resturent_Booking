import { TfiWorld } from "react-icons/tfi";
// import { FaPhoneAlt } from "react-icons/fa";
import { GrSecure } from "react-icons/gr";
import { PiArrowUDownLeftFill } from "react-icons/pi";
import { MdOutlineLocalPhone } from "react-icons/md";
const InfoCardDetails = () => {
    const infoDetailsData = [
        {
            "name": "Free Worldwide Shipping",
            "icon": <TfiWorld />,
            "description": "Enjoy free shipping to any location around the globe."
        },
       
        {
            "name": "24/7 Customer Support",
            "icon": <MdOutlineLocalPhone />,
            "description": "Our support team is available around the clock to assist you."
        },
        {
            "name": "Secure Online Payment",
            "icon": <GrSecure />,
            "description": "Your payment information is protected with top-notch security."
        },
        {
            "name": "Return Policy",
            "icon": <PiArrowUDownLeftFill />,
            "description": "Easily return products within our specified return period."
        },
       
    ]
    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr_1fr] gap-4 mt-10 mb-16">
            {
                infoDetailsData.map((info,idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_4fr] place-items-center py-2 px-4 gap-2 rounded-md bg-[#edeeef]">
                        <span className="text-2xl md:text-4xl text-[#707070]">{info.icon}</span>
                        <div>
                            <h1 className="text-[12px] md:text-sm font-medium text-[#232323]">{info.name}</h1>
                            <p className=" text-[10px] md:text-[12px]  text-[#777777]">{info.description}</p>
                        </div>
                    </div>
                ))
            }

        </div>
    );
};

export default InfoCardDetails;