import { CiBoxList } from "react-icons/ci";
import { TbMapDollar } from "react-icons/tb";
import { AiOutlineUser } from "react-icons/ai";
import CustomerDashboardStatics from "../Pages/Dashboard/User/Dashboard/CustomerDashboardStatics";
import UserProfile from "../Pages/Dashboard/User/Profile/UserProfile";
import { IoHomeOutline } from "react-icons/io5";
import { IoStarSharp } from "react-icons/io5";
import { BsTicket } from "react-icons/bs";
// import { IoKeyOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import PaymentLog from "../Pages/Dashboard/User/Payment/PaymentLog";
import OrderLog from "../Pages/Dashboard/User/Order/OrderLog";
import ReviewProducts from "../Pages/Dashboard/User/ReviewProducts/ReviewProducts";
import SupportTickets from "../Pages/Dashboard/User/SupportTickets/SupportTickets";
// import ChangePassword from "../Pages/Dashboard/User/ChangePassword/ChangePassword";
import Settings from "../Pages/Dashboard/User/Settings/Settings";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import AddressBooking from "../Pages/Dashboard/User/AddressBooking/AddressBooking";

export const CustomerRoutes = [
  {
    path: "/user",
    label: "Dashboard",
    element: <CustomerDashboardStatics />,
    icon: <IoHomeOutline />,
  },
  {
    path: "/user/user-profile",
    label: "Profile",
    element: <UserProfile />,
    icon: <AiOutlineUser />,
  },
  {
    path: "/user/payment-log",
    label: "Payment Log",
    element: <PaymentLog />,
    icon: <TbMapDollar />,
  },
  {
    path: "/user/order-log",
    label: "Order Log",
    element: <OrderLog />,
    icon: <CiBoxList />,
  },
  {
    path: "/user/review-products",
    label: "Review Products",
    element: <ReviewProducts />,
    icon: <IoStarSharp />,
  },
  {
    path: "/user/support-tickets",
    label: "Support Tickets",
    element: <SupportTickets />,
    icon: <BsTicket />,
  },
  // {
  //   path: "/user/change-password",
  //   label: "Change Password",
  //   element: <ChangePassword />,
  //   icon: <IoKeyOutline />,
  // },
   {
    path: "/user/address-booking",
    label: "Address Booking",
    element: <AddressBooking />,
    icon: <FaLocationDot />,
  },
  {
    path: "/user/settings",
    label: "Account Settings",
    element: <Settings />,
    icon: <IoMdSettings />,
  },
  {
    path: "/user/sign-out",
    label: "Sign Out",
    element: "",
    icon: <AiOutlineLogout />,
  },


];
