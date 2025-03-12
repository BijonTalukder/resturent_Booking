import { useEffect, useState } from "react";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import AllProduct from "./AllHotel/AllHotel";
import BannerSlider from "./BannerSlider/BannerSlider";
import InfoCardDetails from "./InfoCardDetails/InfoCardDetails";
import NewsSletter from "./NewsSletter/NewsSletter";
import ProductBanner from "./ProductBanner/ProductBanner";
import NewProduct from "./NewProduct/NewProduct";
import TopSaleProduct from "./TopSaleProduct/TopSaleProduct";
import AllHotel from "./AllHotel/AllHotel";


const Home = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="">
    {/* <DashboardTitle windowTitle={"Home"}/> */}

        {/* <div className="mt-5">
          <div className="w-full h-full md:h-[80%]">      
            <BannerSlider />
          </div>
          <div className="mt-[3px] md:mt-[3px]">
            <ProductBanner />
          </div>
        </div> */}
   
      {/* <div className="mt-6">
        <InfoCardDetails/>
      </div> */}

   
       {/* <TopSaleProduct/>
            <NewProduct/> 
       */}
       <AllHotel/>
       {/* <NewsSletter/> */}

    </div>
  );
};

export default Home;
