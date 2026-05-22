import React from "react";
import Dropdown from "./Dropdown";
import { IoIosArrowDroprightCircle } from "react-icons/io";

const Navbar = ({
  setIsSidebarOpen,
  isSidebarOpen,
}) => {
  return (
    <>
      <div className="px-4 lg:px-6 py-1" style={{ background: "#121c34", boxShadow: "3px 3px 6px rgba(0,0,0,0.3), -3px -3px 6px rgba(255,255,255,0.03)" }}>
        <div className="flex justify-between items-center lg:order-2 sticky z-40 top-0">
          <div>
            {isSidebarOpen === false && (
              <button
                className="lg:hidden"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
              >
                <IoIosArrowDroprightCircle size={25} className="text-white" />
              </button>
            )}

            <p className="text-[#E0E0E0] hidden lg:block font-medium">Hotel Universe</p>
          </div>
          {/* profile */}
          <div>
            <Dropdown/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
