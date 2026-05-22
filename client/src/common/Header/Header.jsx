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
import { useState, useEffect, useRef } from "react";
import Division from "../../Pages/Division/Division";
import { useGetUserNotificationsQuery } from "../../redux/Feature/Admin/notification/notificationApi";
import {
  BellIcon,
} from "@heroicons/react/24/outline";

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
  const {
    data: notifications
  } = useGetUserNotificationsQuery(user?.id);

  useEffect(() => {
    if (notifications) {
      setUnreadCount(notifications?.data?.filter((n) => !n.isRead).length);
    }
  }, [notifications]);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
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
      setIsSearchOverlay(false)
    }
  };

  const handleApplyFilters = (division, city) => {
    setDivisionId(division);
    setCityId(city);
    onFilterChange(division, city);
  };

  const userMenu = (
    <Menu
      className="!rounded-2xl !p-2 !shadow-neu-sm"
      style={{ background: "#eef0f4" }}
    >
      <Menu.Item
        key="booking-history"
        onClick={() =>
          navigate(token && user?.role === "user" ? "/user/user-booking" : "")
        }
        className="!rounded-xl !m-1 hover:!bg-white/80"
      >
        {token && user?.role === "user" ? "Booking History" : ""}
      </Menu.Item>

      <Menu.Item
        key="profile"
        onClick={() =>
          navigate(token && user?.role === "user" ? "/user/user-profile" : "")
        }
        className="!rounded-xl !m-1 hover:!bg-white/80"
      >
        {token && user?.role === "user" ? "Edit Profile" : ""}
      </Menu.Item>

      <Menu.Item
        key="logout"
        className="!rounded-xl !m-1 !text-red-500 !font-bold hover:!bg-white/80"
        onClick={handleLogout}
      >
        Sign Out
      </Menu.Item>
    </Menu>
  );

  const autoCompleteOptions = recentSearches.map(search => ({
    value: search,
    label: (
      <div key={search} className="flex items-center">
        <IoSearch className="text-gray-400 mr-2" size={14} />
        <span>{search}</span>
      </div>
    )
  }));

  return (
    <>
      <div
        className={`py-3 lg:py-1 px-4 lg:px-5 mb-3 bg-[#eef0f4] shadow-neu-sm ${
          isNotificationPage ||
          isAdminLogin ||
          isDetails ||
          isDivision ||
          isDistrict ||
          isArea ||
          location?.pathname === "/login" ||
          location?.pathname === "/register"
            ? "hidden"
            : ""
        }`}
      >
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex justify-between items-center gap-x-1">
            <Link to={"/"}>
              <div className="neu-circle w-20 h-20 flex items-center justify-center">
                <img src={image} className="w-16 h-16 object-contain" alt="" />
              </div>
            </Link>
            <div className="lg:hidden ml-2">
              <p className="text-[12px] font-bold text-[#373b43]">
                {user?.name || "Hello Guest"}
              </p>
              <p className="text-[10px] text-[#6b7588]">Where are you going?</p>
            </div>
          </div>

          <div className="flex-1 mx-4 hidden lg:block">
            <div className="relative w-full max-w-md mx-auto flex items-center gap-2">
              <div className="w-full neu-inset-sm !rounded-full overflow-hidden">
                <AutoComplete
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onSelect={(value) => {
                    setSearchQuery(value);
                    onSearch(value);
                  }}
                  options={autoCompleteOptions}
                  placeholder="Search hotels..."
                  className="w-full"
                  style={{ background: "transparent" }}
                  filterOption={(inputValue, option) =>
                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                  allowClear
                  prefix={<IoSearch className="text-[#6b7588]" />}
                />
              </div>
              <button
                onClick={() => setVisibleRight(true)}
                className="neu-btn w-10 h-10 flex items-center justify-center"
              >
                <HiOutlineAdjustmentsHorizontal
                  className="text-[#6b7588]"
                  size={18}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
             <Link to={"/notification"}>
               <Badge
                count={unreadCount}
                overflowCount={9}
                className="cursor-pointer"
              >
                <div className="neu-circle w-10 h-10 flex items-center justify-center">
                  <BellIcon className="w-5 h-5 text-[#6b7588]" />
                </div>
              </Badge>
             </Link>
            </div>
            {token ? (
              <div className="flex items-center gap-2">
                <div className="items-center gap-2 hidden lg:flex">
                  <Dropdown overlay={userMenu} trigger={["click"]}>
                    <Button className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 lg:ml-auto !border-0 !shadow-neu-sm !bg-[#eef0f4] !text-[#373b43]">
                      {user?.name}
                      <IoChevronDownCircleOutline className="h-4 w-4 transition-transform" />
                    </Button>
                  </Dropdown>
                </div>
                <Button
                  onClick={handleLogout}
                  className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 lg:ml-auto !border-0 !shadow-neu-sm !bg-[#eef0f4] !text-red-500 transition-all duration-300 text-[12px] md:text-base lg:hidden"
                >
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="neu-btn-primary px-4 py-2 text-sm font-medium hover:opacity-90"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="neu-btn px-4 py-2 text-sm font-medium !text-[#373b43]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-2 lg:hidden">
          <div className="relative w-full">
            <div className="neu-inset-sm !rounded-full overflow-hidden">
              <Input
                placeholder="Search hotels..."
                value={searchQuery}
                onFocus={() => setIsSearchOverlay(true)}
                prefix={<IoSearch className="text-[#6b7588]" />}
                className="!border-0 !bg-transparent"
              />
            </div>
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

      {isSearchOverlay && (
        <div className="fixed inset-0 z-50 flex flex-col h-full lg:hidden bg-[#eef0f4]">
          <div className="sticky top-0 bg-[#eef0f4] p-4 shadow-neu-sm z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSearchOverlay(false)}
                className="neu-btn w-10 h-10 flex items-center justify-center"
              >
                <IoArrowBack size={20} className="text-[#6b7588]" />
              </button>
              <div className="flex-1 neu-inset-sm !rounded-full overflow-hidden">
                <Input
                  autoFocus
                  placeholder="Search hotels..."
                  value={searchQuery}
                  onChange={handleMobileSearchChange}
                  onPressEnter={handleSearchSubmit}
                  prefix={<IoSearch className="text-[#6b7588]" />}
                  className="!border-0 !bg-transparent"
                  suffix={
                    searchQuery ? (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          onSearch("");
                        }}
                        className="text-[#6b7588]"
                      >
                        ✖
                      </button>
                    ) : null
                  }
                />
              </div>
              <button
                onClick={() => setVisibleRight(true)}
                className="neu-btn w-10 h-10 flex items-center justify-center"
              >
                <HiOutlineAdjustmentsHorizontal
                  className="text-[#6b7588]"
                  size={20}
                />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-[#6b7588]">
                    Recent Searches
                  </h3>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="neu-sm flex items-center p-3 cursor-pointer"
                      onClick={() => {
                        setSearchQuery(search);
                        onSearch(search);
                        setIsSearchOverlay(false);
                      }}
                    >
                      <IoSearch className="text-[#6b7588] mr-2" />
                      <span className="text-[#484f5c]">{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-[#6b7588] mb-2">
                Browse by Division
              </h3>
              <Division onDivisionClick={() => setIsSearchOverlay(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
