import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Dropdown, Menu } from "antd";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import { logout, useCurrentToken, useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import BottomHeader from "./BottomHeader";

const Header = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get current path
  const user = useAppSelector(useCurrentUser);  
  const token = useAppSelector(useCurrentToken);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You are successfully logged out.");
    navigate("/login");
  };

  const getActiveClass = (path) => (location.pathname === path ? "!text-blue-500 !font-bold" : "text-white");

  const userMenu = (
    <Menu>
      <Menu.Item
        key="dashboard"
        className={getActiveClass(token && user?.role === "admin" ? "/admin/home" : "/order-history")}
        onClick={() =>
          navigate(token && user?.role === "admin" ? "/admin/home" : "/order-history")
        }
      >
        {token && user?.role === "admin" ? "Dashboard" : "Order History"}
      </Menu.Item>
      
      <Menu.Item
        key="profile"
        className={getActiveClass(token && user?.role === "user" ? "/edit-profile" : "")}
        onClick={() =>
          navigate(token && user?.role === "user" ? "/edit-profile" : "")
        }
      >
        {token && user?.role === "user" ? "Edit Profile" : ""}
      </Menu.Item>
  
      <Menu.Item key="logout" className="text-red-400 font-bold" onClick={handleLogout}>
        Sign Out
      </Menu.Item>
    </Menu>
  );
  

  return (
    <>
      <div className="bg-secondary py-2 px-4 lg:px-10 mb-3">
        <div className="text-white max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[12px] md:text-base text-center">
              All Wearing & Promotional Products, Fast & Free Shipping, and All-Inclusive Pricing
            </span>
          </div>

          {token ? (
            <Dropdown overlay={userMenu} trigger={["click"]}>
              <Button className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 lg:ml-auto text-white">
                {user?.name}
                <IoChevronDownCircleOutline className="h-4 w-4 transition-transform" />
              </Button>
            </Dropdown>
          ) : (
            <div className="text-white flex justify-start items-center gap-2">
              <div className="flex gap-1 text-[12px] md:text-base">
                <Link to="/login" className={getActiveClass("/login")}>
                  Login
                </Link>{" "}
                /
                <Link to="/register" className={getActiveClass("/register")}>
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-[95%] lg:px-7 lg:max-w-[1400px] mx-auto">
        <BottomHeader />
      </div>
      <hr className="border-[1px] mt-3" />
    </>
  );
};

export default Header;
