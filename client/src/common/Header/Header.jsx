import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Dropdown, Menu, Input, Badge, AutoComplete } from "antd";
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
import { useGetUserNotificationsQuery } from "../../redux/Feature/Admin/notification/notificationApi";
import { BellIcon } from "@heroicons/react/24/outline";

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
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const { data: notifications } = useGetUserNotificationsQuery(user?.id);

  useEffect(() => {
    if (notifications) {
      setUnreadCount(notifications?.data?.filter((n) => !n.isRead).length);
    }
  }, [notifications]);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleSearchChange = (value) => {
    onSearch(value);
    setSearchQuery(value);
  };

  const handleMobileSearchChange = (e) => {
    const value = e.target.value;
    onSearch(value);
    setSearchQuery(value);
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
      ? "text-white font-semibold"
      : "text-blue-100 hover:text-white transition-colors duration-200";

  const autoCompleteOptions = recentSearches.map((search) => ({
    value: search,
    label: (
      <div className="flex items-center gap-2 py-0.5">
        <IoSearch className="text-gray-400" size={13} />
        <span className="text-sm text-gray-700">{search}</span>
      </div>
    ),
  }));

  const hiddenPaths = [
    "/cancel", "/success", "/checkout",
    "/login", "/register",
  ];
  const shouldHide =
    isNotificationPage ||
    isAdminLogin ||
    isDetails ||
    isDivision ||
    isDistrict ||
    isArea ||
    hiddenPaths.includes(location.pathname);

  const userMenu = (
    <Menu className="!rounded-xl !shadow-xl !border-0 !overflow-hidden !min-w-[180px] !mt-2">
      {token && user?.role === "user" && (
        <>
          <Menu.Item
            key="booking-history"
            className="!px-4 !py-2.5 !text-sm hover:!bg-blue-50"
            onClick={() => navigate("/user/user-booking")}
          >
            <span className="flex items-center gap-2">
              <span>🗓</span> Booking History
            </span>
          </Menu.Item>
          <Menu.Item
            key="profile"
            className="!px-4 !py-2.5 !text-sm hover:!bg-blue-50"
            onClick={() => navigate("/user/user-profile")}
          >
            <span className="flex items-center gap-2">
              <span>👤</span> Edit Profile
            </span>
          </Menu.Item>
          <div className="mx-3 my-1 border-t border-gray-100" />
        </>
      )}
      <Menu.Item
        key="logout"
        className="!px-4 !py-2.5 !text-sm !text-red-500 hover:!bg-red-50"
        onClick={handleLogout}
      >
        <span className="flex items-center gap-2 font-medium">
          <span>→</span> Sign Out
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${shouldHide ? "hidden" : ""
          } ${scrolled
            ? "bg-[#2980b9] shadow-lg shadow-blue-900/20"
            : "bg-[#3498db]"
          }`}
      >
        {/* ─── Desktop Header ─── */}
        <div className="hidden lg:block border-b border-white/10">
          <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between gap-6">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img src={image} className="w-10 h-10 object-contain" alt="logo" />
              <div className="leading-tight">
                <p className="text-white font-bold text-base tracking-tight">StayBD</p>
                <p className="text-blue-200 text-[10px] tracking-wide uppercase">Find your stay</p>
              </div>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-xl">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-1.5 focus-within:bg-white/20 focus-within:border-white/40 transition-all duration-200">
                <IoSearch className="text-blue-200 shrink-0" size={16} />
                <AutoComplete
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onSelect={(value) => {
                    setSearchQuery(value);
                    onSearch(value);
                  }}
                  options={autoCompleteOptions}
                  filterOption={(inputValue, option) =>
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  className="flex-1 hotel-search-autocomplete"
                  allowClear
                  style={{ width: "100%" }}
                >
                  <input
                    placeholder="Search hotels, cities, divisions…"
                    className="w-full bg-transparent text-white placeholder-blue-200 text-sm outline-none"
                    onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  />
                </AutoComplete>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Filter button */}
              <button
                onClick={() => setVisibleRight(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all duration-200"
              >
                <HiOutlineAdjustmentsHorizontal size={16} />
                <span>Filter</span>
              </button>

              {/* Notification */}
              <Link to="/notification">
                <div className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200 cursor-pointer">
                  <BellIcon className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* Divider */}
              <div className="w-px h-6 bg-white/20" />

              {/* Auth */}
              {token ? (
                <Dropdown overlay={userMenu} trigger={["click"]} placement="bottomRight">
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white text-blue-600 hover:bg-blue-50 font-semibold text-sm transition-all duration-200 shadow-sm">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span>{user?.name?.split(" ")[0]}</span>
                    <IoChevronDownCircleOutline size={15} />
                  </button>
                </Dropdown>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    to="/login"
                    className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 rounded-lg bg-white text-blue-600 hover:bg-blue-50 font-semibold transition-all duration-200 shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Mobile Header ─── */}
        <div className="lg:hidden px-4 py-2.5">
          <div className="flex items-center justify-between mb-2.5">
            <Link to="/" className="flex items-center gap-2">
              <img src={image} className="w-10 h-10 object-contain" alt="logo" />
              <div>
                <p className="text-white text-xs font-bold leading-none">
                  {user?.name || "Hello, Guest"}
                </p>
                <p className="text-blue-200 text-[10px] mt-0.5">Where are you going?</p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <Link to="/notification">
                <div className="relative p-1.5 rounded-lg bg-white/10">
                  <BellIcon className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
              </Link>

              {token ? (
                <Button
                  onClick={handleLogout}
                  size="small"
                  className="!text-red-500 !bg-white !border-0 !rounded-lg !text-xs !font-semibold"
                >
                  Log out
                </Button>
              ) : (
                <div className="flex gap-1.5 text-xs">
                  <Link
                    to="/login"
                    className="px-3 py-1 rounded-lg bg-white/10 text-white border border-white/20"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 rounded-lg bg-white text-blue-600 font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile search bar */}
          <div
            className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm cursor-text"
            onClick={() => setIsSearchOverlay(true)}
          >
            <IoSearch className="text-gray-400 shrink-0" size={16} />
            <span className="text-gray-400 text-sm flex-1 select-none">
              {searchQuery || "Search hotels…"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setVisibleRight(true);
              }}
              className="p-1 rounded-md bg-blue-50"
            >
              <HiOutlineAdjustmentsHorizontal className="text-blue-500" size={16} />
            </button>
          </div>
        </div>

        {/* Filter Drawer */}
        <Adjustment
          visibleRight={visibleRight}
          setVisibleRight={setVisibleRight}
          selectedDivision={divisionId}
          setSelectedDivision={setDivisionId}
          selectedCity={cityId}
          setSelectedCity={setCityId}
          onApplyFilters={handleApplyFilters}
        />
      </header>

      {/* ─── Mobile Search Overlay ─── */}
      {isSearchOverlay && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col lg:hidden">
          <div className="sticky top-0 bg-white p-4 border-b shadow-sm z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOverlay(false)}
                className="p-2 rounded-full bg-gray-100 text-gray-600"
              >
                <IoArrowBack size={20} />
              </button>
              <Input
                autoFocus
                placeholder="Search hotels…"
                value={searchQuery}
                onChange={handleMobileSearchChange}
                onPressEnter={handleSearchSubmit}
                prefix={<IoSearch className="text-gray-400" />}
                className="rounded-xl w-full"
                suffix={
                  searchQuery ? (
                    <button
                      onClick={() => { setSearchQuery(""); onSearch(""); }}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ✕
                    </button>
                  ) : null
                }
              />
              <button
                onClick={() => setVisibleRight(true)}
                className="p-2 bg-blue-50 rounded-xl shrink-0"
              >
                <HiOutlineAdjustmentsHorizontal className="text-blue-500" size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {recentSearches.length > 0 && (
              <div className="p-4 border-b">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Recent Searches
                </h3>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2.5 hover:bg-gray-50 rounded-xl cursor-pointer"
                      onClick={() => {
                        setSearchQuery(search);
                        onSearch(search);
                        setIsSearchOverlay(false);
                      }}
                    >
                      <IoSearch className="text-gray-400 mr-3" size={14} />
                      <span className="text-sm text-gray-700">{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Browse by Division
              </h3>
              <Division onDivisionClick={() => setIsSearchOverlay(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Inline styles for AutoComplete override */}
      <style>{`
        .hotel-search-autocomplete .ant-select-selector {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .hotel-search-autocomplete input {
          color: white !important;
        }
        .hotel-search-autocomplete input::placeholder {
          color: rgba(219, 234, 254, 0.8) !important;
        }
        .hotel-search-autocomplete .ant-select-clear {
          color: rgba(255,255,255,0.6) !important;
          background: transparent !important;
        }
      `}</style>
    </>
  );
};

export default Header;