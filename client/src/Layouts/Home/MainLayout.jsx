import { Outlet, useLocation } from "react-router-dom";
import Header from "../../common/Header/Header";
import Footer from "../../common/Footer/Footer";

const MainLayout = () => {
   const location= useLocation()
  return (
    <div>
      {/* <Header /> */}
      <div className={`w-[95%] lg:max-w-[1400px] mx-auto ${location.pathname === "/cancel" || location.pathname === "/success" || location.pathname === "/checkout"  ? "w-full" : ""}`}>
      <Outlet/>
      </div>
      {/* <Footer/> */}
    </div>
  );
};

export default MainLayout;
