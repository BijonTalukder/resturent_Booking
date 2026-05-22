import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ZInputTwo from "../../../components/Form/ZInputTwo";
import ZFormTwo from "../../../components/Form/ZFormTwo";
import ZEmail from "../../../components/Form/ZEmail";
import ZPhone from "../../../components/Form/ZPhone";
import { FaGreaterThan, FaHome } from "react-icons/fa";
import { useAppSelector } from "../../../redux/Hook/Hook";
import { useCurrentToken, useCurrentUser } from "../../../redux/Feature/auth/authSlice";
import { Modal } from "antd";
import { useRegisterMutation } from "../../../redux/Feature/auth/authApi";

const Register = () => {
  const navigate = useNavigate();
  const user = useAppSelector(useCurrentUser);
  const token = useAppSelector(useCurrentToken);
  const [showModal, setShowModal] = useState(false);

  const [
    register,
    {
      isLoading: lIsloading,
      error,
      isError: lIsError,
      isSuccess: lIsSuccess,
      data: rData,
    },
  ] = useRegisterMutation();

  useEffect(() => {
    if (token && user?.role === "admin") {
      navigate("/admin/home");
    } else if (token && user?.role === "user") {
      navigate("/");
    }
  }, [token, user, navigate]);

  const handleSubmit = (data) => {
    register({ ...data, role: "user" });
  };

  useEffect(() => {
    if (lIsSuccess) {
      setShowModal(true);
    }
  }, [lIsSuccess]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="min-h-screen bg-[#eef0f4] pb-6 flex flex-col justify-center sm:py-12 mb-10">
        <div className="relative py-3 sm:w-[40%] sm:mx-auto">
          <div className="neu-card px-4 py-8 sm:rounded-3xl">
            <div className="max-w-md mx-auto text-center">
              <ZFormTwo
                isLoading={lIsloading}
                error={error}
                isError={lIsError}
                isSuccess={lIsSuccess}
                submit={handleSubmit}
                data={rData}
                formType={"create"}
                buttonName={"Register"}
              >
                <div>
                  <h1 className="text-2xl mt-2 text-center font-bold text-[#373b43]">
                    Create an account
                  </h1>
                </div>
                <div className="py-8 text-base leading-6 space-y-5 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <ZInputTwo
                      name="name"
                      type="text"
                      label="Full name"
                      required
                      defaultKey={""}
                      placeholder={"Enter your Full Name"}
                    />
                  </div>
                  <div className="relative">
                    <ZEmail label={"Email"} name={"email"} />
                  </div>
                  <div className="relative">
                    <ZPhone label={"Phone"} name={"phone"} />
                  </div>
                  <div className="relative">
                    <ZInputTwo
                      required
                      name="password"
                      type="password"
                      label="password"
                      defaultKey={""}
                      placeholder={"Enter your password"}
                    />
                  </div>
                </div>
              </ZFormTwo>
            </div>

            <div className="flex items-center justify-center mt-4">
              <p className="text-sm text-[#6b7588]">
                Already have an account?
                <Link to={"/login"}>
                  <span className="text-primary font-semibold ml-1 hover:underline">Sign in</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        centered
        open={showModal}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        okButtonProps={{
          style: {
            backgroundColor: "#FD3D57",
            borderColor: "#FD3D57",
            color: "#fff",
            borderRadius: "12px",
          },
        }}
        cancelButtonProps={{ style: { display: "none" } }}
        className="!rounded-2xl"
      >
        <h1 className="mt-10 text-primary text-xl text-center font-bold mb-5">Registration Successful!</h1>
        <p style={{ 
          fontSize: "16px", 
          color: "#6b7588", 
          textAlign: "center", 
          marginBottom: "30px" 
        }}>
          A verification link has been sent to your email. Please check your email to verify your account and login.
        </p>
      </Modal>
    </>
  );
};

export default Register;
