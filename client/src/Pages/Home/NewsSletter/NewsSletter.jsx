
import { useState } from "react";
import img1 from "../../../assets/map/map-2.png";
import { useAddSubscriptionMutation } from "../../../redux/Feature/Admin/subscribe/subscribeApi";
import { toast } from "sonner";

const NewsSletter = () => {
  const [email, setEmail] = useState("");
  const [addSubscription, { isLoading, isError, isSuccess }] = useAddSubscriptionMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter a valid email!");
      return;
    }

    try {
      await addSubscription({ email }).unwrap();
      toast.success("Subscribed successfully!", { id: 1 });
      setEmail(""); // Clear input field after success
    } catch (error) {
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <section className="text-white mx-auto py-16 relative mb-10 h-[500px] w-[90%] lg:max-w-4xl lg:px-10">
      <div className="container mx-auto text-center">
        <div className="p-5 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-xl font-bold text-black md:text-2xl uppercase">
              Join our mailing list to receive future exclusive offers
            </h2>
          </div>

          <div className="mx-auto mt-10 max-w-xl">
            <form onSubmit={handleSubmit} className="lg:flex sm:gap-4">
              <div className="sm:flex-1 flex border border-[#FD3D57]">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded bg-white p-3 text-[14px] text-gray-700 shadow-sm transition focus:border-[#45F806] outline-none"
                />
                <div className="hidden lg:block">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="border group flex w-full items-center justify-center gap-2 px-6 py-3 text-black transition bg-[#FD3D57] sm:mt-0 sm:w-auto"
                  >
                    <span className="text-[16px] font-semibold text-white">
                      {isLoading ? "Subscribing..." : "Subscribe"}
                    </span>
                  </button>
                </div>
              </div>
              <div className="block lg:hidden mt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="border group flex w-[50%] mx-auto items-center justify-center gap-2 rounded-lg px-6 py-3 text-black transition bg-[#FD3D57] sm:mt-0 sm:w-auto"
                >
                  <span className="text-[16px] font-semibold text-white">
                    {isLoading ? "Subscribing..." : "Subscribe"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-0 bg-cover bg-center -z-40 opacity-20"
        style={{ backgroundImage: `url(${img1})` }}
      ></div>
    </section>
  );
};

export default NewsSletter;
