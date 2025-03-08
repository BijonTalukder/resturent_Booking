import {
  Navbar,
  Typography,
  IconButton,
  Collapse,
  MobileNav,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { IoMdCart } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { Button } from 'primereact/button';
import Cart from "../Cart/Cart";
import { useAppSelector } from "../../redux/Hook/Hook";


const BottomHeader = () => {

  const [openNav, setOpenNav] = React.useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const cartItems = useAppSelector(state => state.cart?.items);
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-4">
      <Typography
        as="li"
        color="blue-gray"
        className={`p-1 text-sm underline lg:no-underline`}
      >
        <NavLink
          style={({ isActive, isTransitioning }) => {
            return {
              fontWeight: isActive ? "bold" : "",
              color: isActive ? "red" : "black",
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
          to="/"
          className="flex items-center text-[#150B2BB3]"
        >
          Home
        </NavLink>
      </Typography>
      <Typography
        as="li"
   
        color="blue-gray"
        className={`px-2 text-sm underline lg:no-underline`}
      >
        <NavLink
          style={({ isActive, isTransitioning }) => {
            return {
              fontWeight: isActive ? "bold" : "",
              color: isActive ? "red" : "black",
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
          to="/shop"
          className="flex items-center text-[#150B2BB3]"
        >
          Shop
        </NavLink>
      </Typography>

   
      <Typography
       
        as="li"
        color="blue-gray"
        className={`px-2 text-sm underline lg:no-underline`}
      >
        <NavLink
          style={({ isActive, isTransitioning }) => {
            return {
              fontWeight: isActive ? "bold" : "",
              color: isActive ? "red" : "black",
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
          to="/contact"
          className="flex items-center text-[#150B2BB3]"
        >
          Contact
        </NavLink>
      </Typography>
      <Typography
       
        as="li"
        color="blue-gray"
        className={`px-2 text-sm underline lg:no-underline`}
      >
        <NavLink
          style={({ isActive, isTransitioning }) => {
            return {
              fontWeight: isActive ? "bold" : "",
              color: isActive ? "red" : "black",
              viewTransitionName: isTransitioning ? "slide" : "",
            };
          }}
          to="/order-track"
          className="flex items-center text-[#150B2BB3]"
        >
          Track Order
        </NavLink>
      </Typography>


    </ul>
  );





  return (
    <div className="max-h-[768px]">
      <Navbar
        className="sticky top-0 py-1 shadow-none rounded-none
      bg-white-[0px] border-none px-0"
     
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 mb-5  lg:hidden">
            <IconButton
          
              variant="text"
              className=" h-6 w-6 text-black hover:bg-transparent focus:bg-transparent active:bg-transparent"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </IconButton>
      
          </div>
          <div className="flex items-center justify-center">
            <div className="hidden lg:block">{navList}</div>
          </div>
          <div className="lg:w-[350px] mx-auto">
         <a href="/">
         <h2 className="font-bold text-lg md:text-4xl text-black">
            <span className="text-[#17340c]">INK</span>SPIRE.
          </h2>
         </a>
        </div>
    {/* card icon */}
         <div className="flex gap-x-4 justify-center items-center mr-1">
    
           {/* cart */}
           <div className="border-[#092635] relative p-1 border-[1px] rounded-full bg-[#0926351f]">
             <div className="absolute text-[10px] md:text-[12px] px-[5px] top-[-6px] left-[17px] md:left-6 bg-red-400 text-white flex justify-center items-center rounded-full">
               <span>{cartItems?.length}</span>
             </div>
             <Button  onClick={() => setVisibleRight(true)} >
             <IoMdCart className="md:w-6 md:h-6 text-[#092635]" />
             </Button>        
           </div>
           <Cart visibleRight={visibleRight} setVisibleRight={setVisibleRight}/>
         </div>

     
        </div>
        <Collapse open={openNav} className={`flex justify-start ms-3`}>
          {navList}
        </Collapse>
      </Navbar>
    </div>
  );
};

export default BottomHeader;
