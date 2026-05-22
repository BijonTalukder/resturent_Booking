/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { adminRoutes } from "../../Routes/Admin.Routes";
import { sidebarGenerator } from "../../utils/sidebarGenerator";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { IoIosArrowDropleftCircle } from "react-icons/io";

const DashboardSidebarTwo = ({ className, setIsSidebarOpen }) => {
  const [open, setOpen] = useState("");

  const handleOpen = (value) => {
    setOpen(open === value ? "" : value);
  };

  const sidebarData = sidebarGenerator(adminRoutes);

  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("dropDown")) {
      const dropDown = JSON.parse(localStorage.getItem("dropDown"));
      if (dropDown.collapse) {
        setOpen(dropDown.collapse);
      }
    }
  }, []);

  return (
    <div
      className={`w-[250px] z-10 duration-300 ${className} h-screen thin-scrollbar overflow-y-scroll text-[13px]`}
      style={{
        background: "#121c34",
        boxShadow: "5px 0 10px rgba(0,0,0,0.3), -2px 0 5px rgba(255,255,255,0.02)",
      }}
    >
      <div className="pt-12">
        <div className="flex justify-end">
          {setIsSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              className="lg:hidden mb-3 text-white"
            >
              <IoIosArrowDropleftCircle size={35} />
            </button>
          )}
        </div>
        {sidebarData.map((item) => {
          if (item.children) {
            return (
              <div key={item.key}>
                {/* dropdown header */}
                <div
                  onClick={() => handleOpen(item.key)}
                  className="px-4 cursor-pointer py-3 flex items-center justify-between mr-4 mb-1 text-[#E0E0E0] hover:text-white transition-colors"
                >
                  {/* text */}
                  <div className="flex items-center gap-x-2">
                    <span>{item.icon}</span>
                    <p>{item.label}</p>
                  </div>
                  {/* icon */}
                  <p>
                    {open === item.key ? (
                      <MdOutlineKeyboardArrowDown size={20} />
                    ) : (
                      <MdOutlineKeyboardArrowRight size={20} />
                    )}
                  </p>
                </div>
                {/* dropDown menu */}
                <div
                  className={`overflow-hidden transition-max-height ${
                    open === item.key
                      ? "max-h-96 opacity-100 opening"
                      : "max-h-0 opacity-0 closing"
                  }`}
                >
                  {item.children.map((subItem) => (
                    <Link key={subItem.key} to={subItem.key}>
                      <div
                        onClick={() => {
                          localStorage.setItem(
                            "dropDown",
                            JSON.stringify({
                              location: location.pathname,
                              collapse: item.key,
                            })
                          );
                        }}
                        className={`pl-7 py-2 mr-4 mb-1 text-[#c0c4cc] hover:text-white duration-300 ${
                          location.pathname === `/admin/${subItem.key}`
                            ? "text-white font-medium"
                            : ""
                        }`}
                      >
                        <p>- {subItem.label}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          } else {
            return (
              <Link to={item.key} key={item.key}>
                <div
                  onClick={() => {
                    setOpen("");
                    localStorage.removeItem("dropDown");
                  }}
                  className={`px-4 py-3 mr-4 mb-1 text-[#E0E0E0] hover:text-white transition-colors ${
                    location.pathname === `/admin/${item.key}`
                      ? "text-white font-medium"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-x-2">
                    <span>{item.icon}</span>
                    <p>{item.label}</p>
                  </div>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
};

export default DashboardSidebarTwo;
