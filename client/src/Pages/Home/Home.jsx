import { useEffect, useState } from "react";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";
import AllProduct from "./AllProduct/AllProduct";
import BannerSlider from "./BannerSlider/BannerSlider";
import InfoCardDetails from "./InfoCardDetails/InfoCardDetails";
import NewsSletter from "./NewsSletter/NewsSletter";
import ProductBanner from "./ProductBanner/ProductBanner";
import NewProduct from "./NewProduct/NewProduct";
import TopSaleProduct from "./TopSaleProduct/TopSaleProduct";


const Home = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="">
    <DashboardTitle windowTitle={"Home"}/>
      {/* <div className="grid lg:grid-cols-[2fr_5fr]"> */}
         {/* <HomeLeftSidebar /> */}
        <div className="mt-5">
          <div className="w-full h-full md:h-[80%]">      
            <BannerSlider />
          </div>
          <div className="mt-[3px] md:mt-[3px]">
            <ProductBanner />
          </div>
        </div>
      {/* </div> */}
      <div className="mt-6">
        <InfoCardDetails/>
      </div>
      {/* <Category/> */}
   
       <TopSaleProduct/>
      <NewProduct/>
      <AllProduct/>
      {/* <TopBrands></TopBrands> */}
    
       <NewsSletter/>

    </div>
  );
};

export default Home;
