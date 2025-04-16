import React, { useEffect } from "react";
import ZFormTwo from "../../components/Form/ZFormTwo";
import ZInputTwo from "../../components/Form/ZInputTwo";
import ZEmail from "../../components/Form/ZEmail";
// import { useCreateOrderMutation } from "../../redux/Feature/Admin/order/orderApi";
import { useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import { toast } from "sonner";
import ZPhone from "../../components/Form/ZPhone";
import { calculatePrice } from "../../utils/priceUtils";

const Checkout = () => {
  const cartItems = useAppSelector((state) => state.cart?.items || []);
  const user = useAppSelector(useCurrentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [
    addOrder,
    { isLoading, isError, error, isSuccess, data },
  ] = useCreateOrderMutation();

  const handleSubmit = async (formData) => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
  
    // Calculate total price with price tiers
    const subtotal = cartItems.reduce((sum, item) => {
      const basePrice = parseFloat(item.price); // Base price of the item
      const priceTiers = item.priceTiers || []; // Price tiers (if available)
      const quantity = item.quantity; // Selected quantity
  
      // Calculate the price for this item
      const itemPrice = calculatePrice(quantity, basePrice, priceTiers);
  
      return sum + itemPrice * quantity;
    }, 0);
  
    const deliveryFee = 10.0;
    const taxAmount = 20.0;
    const orderTotal = (subtotal + deliveryFee + taxAmount).toFixed(2);
  
    // Order payload
    const orderData = {
      userId: user?.id,
      orderTotal: Number(orderTotal), // Convert to number before sending
      paymentStatus: "pending",
      shippingAddress: formData.shippingAddress,
      name: formData?.name,
      email: formData?.email,
      phone: formData?.phone,
      billingAddress: formData.billingAddress,
      orderStatus: "pending",
      deliveryFee,
      taxAmount,
      orderItems: cartItems.map((item) => {
        const basePrice = parseFloat(item.price); // Base price of the item
        const priceTiers = item.priceTiers || []; // Price tiers (if available)
        const quantity = item.quantity; // Selected quantity
  
        // Calculate the price for this item
        const itemPrice = calculatePrice(quantity, basePrice, priceTiers);
  
        return {
          productId: item.id,
          variantId: item.variantId,
          quantity: item.quantity,
          price: itemPrice, // Send the calculated price
          name: item?.name,
          selectedAttributes: item?.selectedAttributes,
        };
      }),
    };
  
    try {
      const result = await addOrder(orderData).unwrap();
  
      if (result?.data?.checkoutUrl) {
        // dispatch(clearCart()); 
        window.location.href = result.data.checkoutUrl;
      } else {
        toast.error("Order created, but payment URL not received!");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  // Function to render selected attributes
  const renderSelectedAttributes = (selectedAttributes) => {
    return Object.entries(selectedAttributes).map(([key, value]) => (
      <div key={key} className="text-xs text-gray-600">
        <span className="capitalize">{key}:</span> {value}
      </div>
    ));
  };

  return (
    <>
      <div className="bg-gray-900 text-white py-16">
        <div className="text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            You've made
            <span className="sm:block"> an excellent choice </span>
          </h1>
          <h1 className="text-white text-3xl font-extrabold sm:text-3xl mt-5 animate-bounce">
            Checkout here!
          </h1>
        </div>
      </div>

      <ZFormTwo
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        submit={handleSubmit}
        formType="create"
        data={data}
      >
        <div className="bg-gray-100 py-10">
          <div className="flex flex-col lg:flex-row max-w-6xl mx-auto mb-10">
            {/* Form Section */}
            <div className="bg-white py-8 px-5 shadow-lg gap-3 w-[90%] mx-auto lg:w-[60%] lg:h-[570px] mt-5 border-r">
              <p className="text-center lg:text-start text-sm lg:text-xl mb-5 font-semibold">
                Submit your billing details here
              </p>

              <ZInputTwo name="name" type="text" label="Name" placeholder="Enter your name" required />
              <ZEmail label="Email Address" name="email" />
              <ZInputTwo name="shippingAddress" type="text" label="Shipping Address" placeholder="Enter shipping address" required />
              <ZInputTwo name="billingAddress" type="text" label="Billing Address" placeholder="Enter billing address" required />
              <ZPhone name="phone" type="number" label="Mobile Number" placeholder="Enter your mobile number" required />

              <button
                disabled={isLoading}
                type="submit"
                className="bg-primary w-full disabled:bg-[#4f5a67] disabled:cursor-not-allowed text-center text-white rounded-md py-2 text-lg"
              >
                {isLoading ? "Processing..." : "Proceed to Pay"}
              </button>
            </div>

            {/* Order Summary */}
            <div className="flex flex-col p-6 bg-white shadow-lg space-y-4 sm:w-96 w-[90%] mx-auto sm:p-10 lg:h-[570px] lg:mt-5 lg:w-[40%]">
              <h2 className="text-lg font-semibold">Your Order Summary</h2>

              <div className="pt-4 space-y-2 max-h-[300px] overflow-y-scroll scrollbar-0 mb-5">
                {cartItems.map((item, index) => {
                  const basePrice = parseFloat(item.price); // Base price of the item
                  const priceTiers = item.priceTiers || []; // Price tiers (if available)
                  const quantity = item.quantity; // Selected quantity

                  // Calculate the price for this item
                  const itemPrice = calculatePrice(quantity, basePrice, priceTiers);
                  const totalItemPrice = (itemPrice * quantity).toFixed(2);

                  return (
                    <div key={index} className="flex justify-between">
                      <div>
                        <h3 className="font-bold text-sm lg:text-base">{item.name} (x{item.quantity})</h3>
                        {item.selectedAttributes && (
                          <div className="mt-1">
                            {renderSelectedAttributes(item.selectedAttributes)}
                          </div>
                        )}
                       
                      </div>
                      <span className="text-sm lg:text-base me-5">${totalItemPrice}</span>
                    </div>
                  );
                })}
              </div>
              {cartItems.length === 0 ? <div className="text-sm text-center text-red-500 font-bold">No Item Found</div>
                : null}

              <div className="pt-4 space-y-2">
                <div className="flex justify-between border-t border-dashed py-2">
                  <span>Subtotal</span>
                  <span>
                    ${cartItems.reduce((sum, item) => {
                      const basePrice = parseFloat(item.price); // Base price of the item
                      const priceTiers = item.priceTiers || []; // Price tiers (if available)
                      const quantity = item.quantity; // Selected quantity

                      // Calculate the price for this item
                      const itemPrice = calculatePrice(quantity, basePrice, priceTiers);

                      return sum + itemPrice * quantity;
                    }, 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${10}</span>
                </div>
                <div className="flex justify-between border-b border-dashed py-2">
                  <span>Tax</span>
                  <span>${20}</span>
                </div>
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>
                    ${(cartItems.reduce((sum, item) => {
                      const basePrice = parseFloat(item.price); // Base price of the item
                      const priceTiers = item.priceTiers || []; // Price tiers (if available)
                      const quantity = item.quantity; // Selected quantity

                      // Calculate the price for this item
                      const itemPrice = calculatePrice(quantity, basePrice, priceTiers);

                      return sum + itemPrice * quantity;
                    }, 0) + 30).toFixed(2)}
                  </span>
                </div>
              </div>

              <h2 className="text-lg font-semibold mt-10">Items in Cart ({cartItems.length} items)</h2>
            </div>
          </div>
        </div>
      </ZFormTwo>
    </>
  );
};

export default Checkout;