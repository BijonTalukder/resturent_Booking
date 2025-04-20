import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Contact from "../Pages/Contact/Contact";
import ErrorPageDashboard from "../Pages/Error/ErrorPageDashboard";
import { routesGenerator } from "../utils/routesGenerator";
import { adminRoutes } from "./Admin.Routes";
import ErrorPage from "../common/ErrorPage/ErrorPage";
import DashboardLayout from "../Layouts/Dashboard/DashboardLayout";
import MainLayout from "../Layouts/Home/MainLayout";
import Login from "../Pages/Auth/Login/Login";
import Register from "../Pages/Auth/Register/Register";
import AdminProtectedRoute from "./AdminPanelProtectedRoutes/AdminProtectedRoute";
import Checkout from "../Pages/Checkout/Checkout";
import ProtectedRoutes from "./UserProtectedRoutes/ProtectedRoutes";
import Success from "../Pages/Success/Success";
import PaymentError from "../Pages/Error/PaymentError";
import OrderHistory from "../Pages/Dashboard/User/OrderHistory/OrderHistory";
import EditProfile from "../Pages/Dashboard/User/EditProfile/EditProfile";
import Verify from "../Pages/Verify/Verify";
import OrderTrack from "../Pages/Track-Order/OrderTrack";
import HotelDetails from "../Pages/Home/HotelDetails/HotelDetails";
import { CustomerRoutes } from "./Customer.Routes";
import CustomerDashboardLayout from "../Layouts/Dashboard/CustomerDashboardLayout";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      
      // {
      //   path: "/order-history",
      //   element:  
      //   <ProtectedRoutes role={"user"}>
      //   <OrderHistory/>
      // </ProtectedRoutes>,
      // },
      // {
      //   path: "/edit-profile",
      //   element:  
      //   <ProtectedRoutes role={"user"}>
      //   <EditProfile/>
      // </ProtectedRoutes>,
      // },
      {
        path: "/checkout",
        element: 
      <ProtectedRoutes role={"user"}>
        <Checkout/>
      </ProtectedRoutes>
      },
      {
        path: "/success",
        element: 
      <ProtectedRoutes role={"user"}>
        <Success/>
      </ProtectedRoutes>
      },
      {
        path: "/cancel",
        element: 
      // <ProtectedRoutes role={"user"}>
        <PaymentError/>
      // </ProtectedRoutes>
      },
      {
        path: "/hotel/:id",
        element: <HotelDetails/>,
        // loader: ({ params }) =>
        //   fetch(`${import.meta.env.VITE_BACKEND_URL}/hotel/${params.id}`)
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/login",
        element: <Login/>,
      },
      {
        path: "/register",
        element: <Register/>,
      },
      {
        path: "/verify/:token",
        element: <Verify/>,
      },
      {
        path: "/order-track",
        element: <OrderTrack/>,
      }
    ],
  },
  {
    path: "/admin",
    element: (
     <AdminProtectedRoute>
        <DashboardLayout />
     </AdminProtectedRoute>
 
    ),
    errorElement: <ErrorPageDashboard />,
    children: routesGenerator(adminRoutes),
  },
  {
    path: "/user",
    children: routesGenerator(CustomerRoutes),
    element: (
      <ProtectedRoutes role="user">
        <CustomerDashboardLayout />
      </ProtectedRoutes>
    ),
  },
]);
