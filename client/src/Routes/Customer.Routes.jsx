import { CiBoxList } from "react-icons/ci";
import { TbMapDollar } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import { IoStarSharp } from "react-icons/io5";
import { BsTicket } from "react-icons/bs";
// import { IoKeyOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import EditProfile from "../Pages/Dashboard/User/EditProfile/EditProfile";

export const CustomerRoutes = [
  {
    path: "/user/user-profile",
    label: "Profile",
    element: <EditProfile />,
    icon: <AiOutlineUser />,
  },
 
];
