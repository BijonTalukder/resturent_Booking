import { Outlet, useLocation } from "react-router-dom";

import CustomerDashboardSidebar from "./CustomerDashboardSidebar";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

const CustomerDashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location]);

  return (
    <div className="bg-[#f0f5fc] p-7 min-h-screen overflow-y-auto grid xl:grid-cols-[1fr_3fr] gap-2">
      <button
        className="xl:hidden mb-4 lg:mb-0"
        onClick={toggleSidebar}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button >
      <div className={`transform transition-transform duration-500 ${isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } xl:transform-none xl:opacity-100 xl:relative fixed top-16 lg:top-0 left-0 h-full w-full  xl:w-auto xl:h-auto`}
        aria-hidden={!isSidebarOpen}
      ><CustomerDashboardSidebar /></div>
      <div className="">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;
