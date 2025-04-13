import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Dropdown, Menu } from "antd";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import { logout, useCurrentToken, useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import image from "../../assets/icon.png";


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

  const getActiveClass = (path) => (location.pathname === path ? "!text-blue-500 !font-bold" : "text-black");

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
      <div className="py-2 px-4 lg:px-10 mb-3 shadow-sm border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex justify-between  items-center gap-x-1">
            <div className="hidden lg:block">
             <Link to={"/"}>
             <img
              className="w-8 h-8 rounded-full"
              src={`https://ui-avatars.com/api/?name=${user?.name?.charAt(0) || "A"}`}
              alt="user photo"
            />
             </Link>
            </div>
            <Link to={"/"}>
            <div className="block lg:hidden">
            <img src={image} className="w-12 h-12 object-contain" alt="" />
          </div>
          </Link>

            <div>
              <p className="text-[12px] font-bold">{user?.name || "Hello Guest"}</p>
              <p className="text-[10px]">Where are you going?</p>
            </div>
          </div>
          <Link to={"/"}>

          <div className="hidden lg:flex items-center gap-2">
            <img src={image} className="h-[65px]" alt="" />
          </div>
          </Link>

          <div>
          {token ? (
        
        <Button onClick={handleLogout} className="flex items-center gap-1 rounded-full py-2 pr-2 pl-2 lg:ml-auto text-black">
          Log out
          {/* <IoChevronDownCircleOutline className="h-4 w-4 transition-transform" /> */}
        </Button>

    ) : (
      <div className="text-black flex items-center gap-2">
        <div className="flex   gap-1 text-[12px] md:text-base">
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
      </div>

    </>
  );
};

export default Header;
