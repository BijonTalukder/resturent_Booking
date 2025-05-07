import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Dropdown, Menu, Input, Space } from "antd";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import {
  logout,
  useCurrentToken,
  useCurrentUser,
} from "../../redux/Feature/auth/authSlice";
import { IoChevronDownCircleOutline, IoSearch } from "react-icons/io5";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import image from "../../assets/icon.png";
import Adjustment from "../Adjustment/Adjustment";
import { useState } from "react";
import HomeDivision from "../../Pages/Home/Home-Division/HomeDivision";
import Division from "../../Pages/Division/Division";

const Header = ({ onSearch, onFilterChange }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const isNotificationPage = location.pathname === "/notification";
  const isAdminLogin = location.pathname === "/admin-login";
  const isDivision = location?.pathname === "/division";
  const isDetails = location?.pathname?.startsWith("/hotel");
  const isDistrict = location?.pathname?.startsWith("/district");
  const isArea = location?.pathname?.startsWith("/area");
  const [isSearchOverlay, setIsSearchOverlay] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [visibleRight, setVisibleRight] = useState(false);
  const [divisionId, setDivisionId] = useState("");
  const [cityId, setCityId] = useState("");

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You are successfully logged out.");
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleApplyFilters = (division, city) => {
    setDivisionId(division);
    setCityId(city);
    onFilterChange(division, city);
  };

  const getActiveClass = (path) =>
    location.pathname === path
      ? "!text-white !font-bold"
      : "text-[#ecf0f1] hover:text-white transition-all duration-300";

  const userMenu = (
    <Menu>
      <Menu.Item
        key="dashboard"
        className={getActiveClass(
          token && user?.role === "admin" ? "/admin/home" : "/order-history"
        )}
        onClick={() =>
          navigate(
            token && user?.role === "admin" ? "/admin/home" : "/order-history"
          )
        }
      >
        {token && user?.role === "admin" ? "Dashboard" : "Order History"}
      </Menu.Item>

      <Menu.Item
        key="profile"
        className={getActiveClass(
          token && user?.role === "user" ? "/edit-profile" : ""
        )}
        onClick={() =>
          navigate(token && user?.role === "user" ? "/edit-profile" : "")
        }
      >
        {token && user?.role === "user" ? "Edit Profile" : ""}
      </Menu.Item>

      <Menu.Item
        key="logout"
        className="text-red-400 font-bold"
        onClick={handleLogout}
      >
        Sign Out
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <div
        className={`py-3 px-4 lg:px-10 mb-3 bg-[#3498db] shadow-sm border-b border-gray-200 ${
          isNotificationPage || isAdminLogin || isDetails || isDivision || isDistrict || isArea
            ? "hidden"
            : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          {/* Left Side - Logo/User */}
          <div className="flex justify-between items-center gap-x-1">
            <div className="hidden lg:block">
              <Link to={"/"}>
                <img
                  className="w-8 h-8 rounded-full"
                  src={`https://ui-avatars.com/api/?name=${
                    user?.name?.charAt(0) || "A"
                  }`}
                  alt="user photo"
                />
              </Link>
            </div>
            <Link to={"/"}>
              <div className="block lg:hidden ">
                <img src={image} className="w-20 h-20 object-contain" alt="" />
              </div>
            </Link>
            <div>
              <p className="text-[12px] font-bold text-white">
                {user?.name || "Hello Guest"}
              </p>
              <p className="text-[10px] text-white">Where are you going?</p>
            </div>
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 mx-4 hidden md:block">
            <div className="relative w-full max-w-md mx-auto">
              <Input
                placeholder="Search hotels..."
                value={searchQuery}
                // onFocus={() => navigate("/division")}
                onChange={handleSearchChange}
                prefix={<IoSearch className="text-gray-400" />}
                className="rounded-full"
                // suffix={
                //   <button
                //     onClick={() => setVisibleRight(true)}
                //     className="absolute right-2 top-1/2 transform -translate-y-1/2"
                //   >
                //     <HiOutlineAdjustmentsHorizontal className="text-gray-500 text-xl" />
                //   </button>
                // }
              />
            </div>
          </div> 

          {/* Right Side - Auth/Links */}
          <div>
            {token ? (
              <Button
                onClick={handleLogout}
                className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 lg:ml-auto text-red-500 bg-white hover:bg-gray-100 transition-all duration-300 text-[12px] md:text-base"
              >
                Log out
              </Button>
            ) : (
              <div className="text-[#ecf0f1] flex items-center gap-2">
                <div className="flex gap-1 text-[12px] md:text-base">
                  <Link to="/login" className={getActiveClass("/login")}>
                    <span className="">Login</span>
                  </Link>{" "}
                  /
                  <Link to="/register" className={getActiveClass("/register")}>
                    <span className="">Register</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2 md:hidden">
          <div className="relative w-full">
            <Input
              placeholder="Search hotels..."
              // onFocus={() => navigate("/division")}
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchOverlay(true)}
              
              onPressEnter={() => {
                setIsSearchOverlay(false); 
                onSearch(searchQuery);     
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsSearchOverlay(false);
                  onSearch(searchQuery);
                }
              }}
              prefix={<IoSearch className="text-gray-400" />}
              // suffix={
              //   <button onClick={() => setVisibleRight(true)}>
              //     <HiOutlineAdjustmentsHorizontal className="text-gray-500" />
              //   </button>
              // }
              className="rounded-full"
            />
             {isSearchOverlay && (
        <div className="fixed inset-0 z-50 bg-white p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Input
              autoFocus
              placeholder="Search hotels..."
              value={searchQuery}
              onChange={handleSearchChange}
              prefix={<IoSearch className="text-gray-400" />}
              className="w-full rounded-full"
            />
            <button
              onClick={() => setIsSearchOverlay(false)}
              className="ml-2 text-2xl text-gray-600"
            >
              ✖
            </button>
          </div>

        
          {/* <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Hotels</h2>
           
          </div> */}

          {/* Division Suggestions */}
          <div>
        <Division/>
          </div>
        </div>
      )}
          </div>
        </div>

        <Adjustment
          visibleRight={visibleRight}
          setVisibleRight={setVisibleRight}
          selectedDivision={divisionId}
          setSelectedDivision={setDivisionId}
          selectedCity={cityId}
          setSelectedCity={setCityId}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </>
  );
};

export default Header;
