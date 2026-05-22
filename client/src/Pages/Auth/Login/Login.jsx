import React, { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaGreaterThan, FaHome } from 'react-icons/fa';
import ZFormTwo from '../../../components/Form/ZFormTwo';
import ZEmail from '../../../components/Form/ZEmail';
import Cookies from "js-cookie";
import { useLoginMutation } from '../../../redux/Feature/auth/authApi';
import ZInputTwo from '../../../components/Form/ZInputTwo';
import { useAppDispatch, useAppSelector } from '../../../redux/Hook/Hook';
import { setUser, useCurrentToken, useCurrentUser } from '../../../redux/Feature/auth/authSlice';
import ZPhone from '../../../components/Form/ZPhone';

     
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
 const dispatch = useAppDispatch();
 const user = useAppSelector(useCurrentUser);
 const token = useAppSelector(useCurrentToken);

  const [
    login,
    {
      isLoading: lIsloading,
      error,
      isError: lIsError,
      isSuccess: lIsSuccess,
      data: loginData,
    },
  ] = useLoginMutation();

  useEffect(() => {
    if (token && user?.role === "admin") {
      navigate("/admin/home")
    }
    else if (token && user?.role === "user"){
      navigate("/")
    }
  }, []);

  
  const handleSubmit = async (data) => {
    const { data: loginData } = await login(data);

    if (loginData?.success) {
      dispatch(setUser({ token: loginData.token, user: loginData.user }));
      if (loginData?.user?.role && loginData?.user?.role === "user" && loginData?.user?.role !== "admin") {
        navigate(location?.state?.from || "/");
      }
    }
  };
  return (
    <>
    <section className="relative flex flex-wrap flex-row-reverse lg:items-center min-h-screen bg-[#eef0f4]">
      <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-lg">
          <div className="neu-card p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[#373b43]">Get started today!</h1>
              <p className="mt-2 text-[#6b7588]">Sign in to your account</p>
            </div>

            <ZFormTwo
              isLoading={lIsloading}
              error={error}
              isError={lIsError}
              isSuccess={lIsSuccess}
              submit={handleSubmit}
              data={loginData}
              buttonName={"Log in"}
            >
              <div className="py-4 text-base leading-6 space-y-5 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <ZPhone label={"Phone"} name={"phone"} />
                </div>
                <div className="relative">
                  <ZInputTwo
                    required={1}
                    name="password"
                    type="password"
                    label={"Password"}
                    placeholder={"Enter your password"}
                  />
                </div>
              </div>
            </ZFormTwo>
            <div className="flex items-center justify-center mt-6">
              <p className="text-sm text-[#6b7588]">
                Don't have an account?
                <Link to={"/register"}>
                  <span className="text-primary font-semibold ml-1 hover:underline">Sign up</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 w-full sm:h-96 hidden lg:block lg:h-full lg:w-1/2 mt-16 mb-16">
        <div className="neu-card overflow-hidden h-[580px] m-4">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1630450202872-e0829c9d6172?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
    </>
  )
}

export default Login;
