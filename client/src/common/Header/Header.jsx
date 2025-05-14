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
import { IoArrowBack } from "react-icons/io5";
import image from "../../assets/icon.png";
import Adjustment from "../Adjustment/Adjustment";
import { useState, useEffect } from "react";
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
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleRight, setVisibleRight] = useState(false);
  const [divisionId, setDivisionId] = useState("");
  const [cityId, setCityId] = useState("");

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Save searches to localStorage
  const saveSearch = (query) => {
    if (!query.trim()) return;

    const updatedSearches = [
      query,
      ...recentSearches.filter((s) => s !== query),
    ].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You are successfully logged out.");
    navigate("/login");
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      saveSearch(searchQuery);
      onSearch(searchQuery);
      setIsSearchOverlay(false);
    }
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
          isNotificationPage ||
          isAdminLogin ||
          isDetails ||
          isDivision ||
          isDistrict ||
          isArea
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
                onChange={handleSearchChange}
                prefix={<IoSearch className="text-gray-400" />}
                className="rounded-full"
                suffix={
                  <button
                    onClick={() => setVisibleRight(true)}
                    className="text-gray-500"
                  >
                    <HiOutlineAdjustmentsHorizontal className="text-xl" />
                  </button>
                }
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
              value={searchQuery}
              onFocus={() => setIsSearchOverlay(true)}
              prefix={<IoSearch className="text-gray-400" />}
              className="rounded-full"
              readOnly
            />
          </div>
        </div>

        {/* Mobile Filter Panel */}
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

      {/* Improved Mobile Search Overlay */}
      {isSearchOverlay && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col h-full">
          {/* Search Header */}
          <div className="sticky top-0 bg-white p-4 border-b shadow-sm z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOverlay(false)}
                className="text-gray-600"
              >
                <IoArrowBack size={24} />
              </button>
              <Input
                autoFocus
                placeholder="Search hotels..."
                value={searchQuery}
                onChange={handleSearchChange}
                onPressEnter={handleSearchSubmit}
                prefix={<IoSearch className="text-gray-400" />}
                className="rounded-full w-full"
                suffix={
                  searchQuery ? (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        onSearch("");
                      }}
                      className="text-gray-400"
                    >
                      ✖
                    </button>
                  ) : null
                }
              />
              <button
                onClick={() => setVisibleRight(true)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <HiOutlineAdjustmentsHorizontal
                  className="text-gray-600"
                  size={20}
                />
              </button>
            </div>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Recent Searches
                 </h3>
                 

                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() => {
                        setSearchQuery(search);
                        onSearch(search);
                        setIsSearchOverlay(false);
                      }}
                    >
                      <IoSearch className="text-gray-400 mr-2" />
                      <span>{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Divisions */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Browse by Division
              </h3>
              <Division />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
