import { Outlet, useLocation } from "react-router-dom";
import Header from "../../common/Header/Header";
import BottomHeader from "../../common/Header/BottomHeader";


const MainLayout = () => {
   const location= useLocation()
  return (
    <div>
      <Header />
      <div className={`w-[95%] lg:max-w-[1400px] mx-auto ${location.pathname === "/cancel" || location.pathname === "/success" || location.pathname === "/checkout"  ? "w-full" : ""}`}>
      <Outlet/>
      </div>
     <BottomHeader />
    </div>
  );
};

export default MainLayout;
