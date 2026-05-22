import { Outlet, useLocation } from "react-router-dom";
import Header from "../../common/Header/Header";
import BottomHeader from "../../common/Header/BottomHeader";
import Footer from "../../common/Footer/Footer";
import { useState } from "react";

const MainLayout = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionId, setDivisionId] = useState('');
  const [cityId, setCityId] = useState('');

  const isCheckoutFlow = ["/cancel", "/success", "/checkout"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#eef0f4]">
      <Header
        onSearch={setSearchQuery}
        onFilterChange={(division, city) => {
          setDivisionId(division);
          setCityId(city);
        }}
      />

      <div className={`${isCheckoutFlow ? "w-full" : "w-[95%] lg:max-w-[1480px] mx-auto"}`}>
        <Outlet context={{ searchQuery, divisionId, cityId }} />
      </div>

      <BottomHeader />
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
