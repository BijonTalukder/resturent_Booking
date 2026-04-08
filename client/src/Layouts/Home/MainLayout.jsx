import { Outlet, useLocation } from "react-router-dom";
import Header from "../../common/Header/Header";
import BottomHeader from "../../common/Header/BottomHeader";
import Footer from "../../common/Footer/Footer";
import { useState } from "react";

const MainLayout = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [cityId, setCityId] = useState("");

  const isFullWidth = ["/cancel", "/success", "/checkout"].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        onSearch={setSearchQuery}
        onFilterChange={(division, city) => {
          setDivisionId(division);
          setCityId(city);
        }}
      />

      {/* Page content */}
      <main className={`flex-1 ${isFullWidth ? "w-full" : "w-[95%] lg:max-w-[1400px] mx-auto py-4 lg:py-8"}`}>
        <Outlet context={{ searchQuery, divisionId, cityId }} />
      </main>

      {/* Desktop footer */}
      <Footer />

      {/* Mobile bottom nav */}
      <BottomHeader />
    </div>
  );
};

export default MainLayout;