import { MdContacts, MdNotificationImportant, MdOutlineShoppingCartCheckout } from "react-icons/md";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { TfiLayoutSlider } from "react-icons/tfi";
import DashboardStatistics from "../Pages/Dashboard/Admin/DashboardStatistics/DashboardStatistics";
import { AiFillBoxPlot } from "react-icons/ai";
import { BiSolidPurchaseTag } from "react-icons/bi";
import Sliders from "../Pages/Dashboard/Admin/Slider/Sliders";
import { CiShop } from "react-icons/ci";
import { FaUser, FaUsers } from "react-icons/fa";
import Subscription from "../Pages/Dashboard/Admin/Subscription/Subscription";
import Contact from "../Pages/Dashboard/Admin/Contact/Contact";
import Users from "../Pages/Dashboard/Admin/Customers/Users";
import AddUser from "../Pages/Dashboard/Admin/Customers/AddUser/AddUser";
import EditAdminProfile from "../Pages/Dashboard/Admin/Profile/EditAdminProfile";
import Hotel from "../Pages/Dashboard/Admin/Hotel/Hotel";
import AddHotel from "../Pages/Dashboard/Admin/Hotel/AddHotel";
import EditHotel from "../Pages/Dashboard/Admin/Hotel/EditHotel";
import ViewHotel from "../Pages/Dashboard/Admin/Hotel/ViewHotel";
import EditRoom from "../Pages/Dashboard/Admin/Room/EditRoom";
import Bookings from "../Pages/Dashboard/Admin/Bookings/Bookings";
import AddNotification from "../Pages/Dashboard/Admin/AddNotification/AddNotification";
import Area from "../Pages/Dashboard/Admin/Area/Area";


export const adminRoutes = [
  {
    path: "home",
    label: "Dashboard",
    element: <DashboardStatistics />,
    icon: <MdOutlineDashboardCustomize size={20}></MdOutlineDashboardCustomize>,
    permissionName: "view dashboard",
  },
  {
    path: "/admin/profile",
    element: <EditAdminProfile/>,
  },
  {
    label: "Hotel Management",
    icon: <AiFillBoxPlot size={20} />,
    children: [
      // {
      //   path: "categories",
      //   label: "Category",
      //   element: <Category></Category>,
      //   permissionName: "view category",
      // },
      // {
      //   path: "brands",
      //   label: "Brands",
      //   element: <Brand></Brand>,
      //   permissionName: "view brand",
      // },
      // {
      //   path: "attributes",
      //   label: "Attribute",
      //   element: <Attribute></Attribute>,
      //   permissionName: "view attribute",
      // },
      {
        path: "areas",
        label: "Areas",
        element: <Area/>,
        permissionName: "view area",
      },
      {
        path: "hotels",
        label: "Hotels",
        element: <Hotel></Hotel>,
        permissionName: "view hotel",
      },
    ],
  },
  {
    path: "bookings",
    label: "Bookings",
    element: <Bookings/>,
    icon: <CiShop size={20}/>,
  },
  {
    path: "users",
    label: "Users",
    element: <Users />,
    icon: <FaUsers size={20}/>,
  },
  {
    path: "add-hotel",
    element: <AddHotel></AddHotel>,
  },
  {
    path: "edit-hotel/:id",
    element: <EditHotel></EditHotel>,
  },
  {
    path: "view-hotel-details/:id",
    element: <ViewHotel></ViewHotel>,
  },
  {
    path: "edit-room/:id",
    element: <EditRoom></EditRoom>,
  },

  {
    path: "sliders",
    label: "Sliders",
    element: <Sliders></Sliders>,
    icon: <TfiLayoutSlider size={20}></TfiLayoutSlider>,
    permissionName: "view slider",
  },
  {
    path: "notification",
    label: "Notification",
    element: <AddNotification/>,
    icon: <MdNotificationImportant  size={20}/>,
    permissionName: "view notification",
  },
  {
    path: "users/add-user",
    element: <AddUser/>,
  
  },
  // {
  //   path: "contacts",
  //   label: "Contacts",
  //   element: <Contact/>,
  //   icon: <MdContacts  size={20}/>,
  //   permissionName: "view contact",
  // },
];
