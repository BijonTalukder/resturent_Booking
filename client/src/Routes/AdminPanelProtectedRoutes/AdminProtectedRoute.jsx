/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useContext, useEffect, useState } from "react";
import {
  logout,
  useCurrentToken,
  useCurrentUser,
} from "../../redux/Feature/auth/authSlice";
import { Navigate } from "react-router-dom";
import { useGetUsersQuery } from "../../redux/Feature/auth/authApi";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import LoadingPage from "../../components/LoadingPage";
// import { PermissionContextProvider } from "../../contex/PermissionProvider";

const AdminProtectedRoute = ({ children }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const { data, isLoading, isFetching, refetch } =
  useGetUsersQuery();
  // const { setLoggedInUserPermissions } = useContext(PermissionContextProvider);
  
  useEffect(() => {
    if (user && token) {
      refetch();
      setLoading(false);
    }
  }, [user, token, refetch]);

  // useEffect(() => {
  //   if (Array.isArray(data?.data?.role) && data?.data?.role?.length > 0) {
  //     const arr = data?.data?.role;
  //     const array = [];
  //     for (let index = 0; index < arr.length; index++) {
  //       const element = arr[index];
  //       element.permissions.forEach((item) => array.push(item?.name));
  //     }
  //     setLoggedInUserPermissions([...array]);
  //   }
  // }, [data?.data?.role, data?.data]);

  if (!token || token == null || user == null) {
    return <Navigate to={"/login"}></Navigate>;
  }
  if (isLoading || isFetching || loading) {
    return <LoadingPage></LoadingPage>;
  }
  const loggedInUser = data?.data?.find((u) => u.email === user.email);
//  console.log(loggedInUser)
  // Check if the logged-in user is an admin
  if (!loggedInUser || loggedInUser.role !== "admin") {
    dispatch(logout());
    return <Navigate to={"/login"}></Navigate>;
  }

  return children;
};
export default AdminProtectedRoute;
