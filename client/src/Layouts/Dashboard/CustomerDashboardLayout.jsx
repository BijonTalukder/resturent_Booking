import { Outlet, useLocation } from "react-router-dom";

import CustomerDashboardSidebar from "./CustomerDashboardSidebar";
import { FiMenu, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import Header from "../../common/Header/Header";
import BottomHeader from "../../common/Header/BottomHeader";
import UserNavbar from "./UserNavbar";

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
    <>
      <UserNavbar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="bg-[#eef0f4] p-7 min-h-screen overflow-y-auto grid xl:grid-cols-[1fr_3fr] gap-2">
        <div className={`transform transition-transform duration-500 ${
          isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } xl:transform-none xl:opacity-100 z-40 xl:relative fixed top-16 lg:top-0 left-0 h-full w-full xl:w-auto xl:h-auto`}>
          <CustomerDashboardSidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div>
          <Outlet></Outlet>
        </div>
      </div>
      <BottomHeader />
    </>
  );
};

export default CustomerDashboardLayout;
