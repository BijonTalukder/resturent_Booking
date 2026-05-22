"use client";
import React, { useEffect, useState } from "react";
import ZFormTwo from "../../components/Form/ZFormTwo";
import ZInputTwo from "../../components/Form/ZInputTwo";
import ZEmail from "../../components/Form/ZEmail";
import ZPhone from "../../components/Form/ZPhone";
import { useAppDispatch, useAppSelector } from "../../redux/Hook/Hook";
import { useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { toast } from "sonner";
import { useCreateBookingMutation } from "../../redux/Feature/Admin/booking/bookingApi";
import { clearBooking } from "../../redux/Booking/bookingSlice";
import { Image } from "antd";
import moment from "moment";
import axios from "axios";
import { CameraOutlined, UploadOutlined, CloseOutlined } from "@ant-design/icons";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);
  const [nidImageFile, setNidImageFile] = useState(null);
  const [nidPreview, setNidPreview] = useState(null);
  const [nidUploading, setNidUploading] = useState(false);

  const {
    selectedRooms,
    checkInDate,
    checkOutDate,
    totalPrice,
    nights
  } = useAppSelector((state) => state.booking);

  const [createBooking, { isLoading, isSuccess, isError, error, data }] =
    useCreateBookingMutation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNidFileChange = (file) => {
    setNidImageFile(file);
    setNidPreview(URL.createObjectURL(file));
  };

  const removeNidImage = () => {
    setNidImageFile(null);
    setNidPreview(null);
  };

  const handleSubmit = async (formData) => {
    if (!selectedRooms?.length) {
      toast.error("Please select rooms before checking out.");
      return;
    }

    if (!nidImageFile) {
      toast.error("Please upload your NID image.");
      return;
    }

    setNidUploading(true);
    let nidImageUrl = "";

    try {
      const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
      const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
      const imageFormData = new FormData();
      imageFormData.append("image", nidImageFile);

      const res = await axios.post(image_hosting_api, imageFormData, {
        headers: { "content-type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        nidImageUrl = res.data.data.display_url;
      } else {
        throw new Error("NID image upload failed");
      }
    } catch (err) {
      toast.error("Failed to upload NID image. Please try again.");
      setNidUploading(false);
      return;
    }

    const getEffectivePrice = (room) => {
      if (!room.discount) return room.price;
      if (room.discountType === "flat") {
        return Math.max(0, room.price - room.discount);
      }
      return Math.round(room.price - (room.price * room.discount) / 100);
    };

    const bookingItems = selectedRooms.map((room) => ({
      roomNumber: room?.roomNumber,
      roomId: room.id,
      roomType: room.type,
      quantity: room?.quantity,
      adults: room.adults,
      children: room.children,
      price: getEffectivePrice(room),
      amenities: room.amenities || []
    }));

    const bookingPayload = {
      roomIds: selectedRooms.map((room) => room.id),
      userId: user?.id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice,
      email: formData?.email || "",
      phone: formData?.phone,
      name: formData?.name,
      nidImage: nidImageUrl,
      status: "pending",
      bookingItem: bookingItems,
    };

    try {
      const res = await createBooking(bookingPayload).unwrap();
      if (res?.data?.payment_url) {
        toast.success("Booking successful!");
        dispatch(clearBooking());
        window.location.href = res.data.payment_url;
      } else {
        toast.error("Booking created, but payment URL not received!");
      }
    } catch (err) {
      toast.error("Failed to book, please try again.");
      console.error(err);
    } finally {
      setNidUploading(false);
    }
  };

  return (
    <>
      <div className="neu-card mx-4 my-6 p-8 text-center">
        <h1 className="text-3xl font-extrabold text-[#373b43] sm:text-5xl">
          You've made
          <span className="sm:block text-primary"> an excellent choice </span>
        </h1>
        <h1 className="text-[#6b7588] text-3xl font-extrabold sm:text-3xl mt-5">
          Checkout here!
        </h1>
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
        <div className="bg-[#eef0f4] py-10">
          <div className="flex flex-col lg:flex-row max-w-6xl mx-auto mb-10 gap-5 px-4">
            {/* Guest Info Form */}
            <div className="neu-card p-6 w-full lg:w-[60%] space-y-5">
              <p className="text-sm lg:text-xl font-semibold text-[#373b43]">Our Default Payment Method</p>

              <div className="neu-inset-sm p-3 flex items-center space-x-3">
                <input
                  type="radio"
                  id="sslcommerz"
                  name="paymentMethod"
                  value="sslcommerz"
                  defaultChecked
                  className="accent-primary w-4 h-4"
                />
                <label htmlFor="sslcommerz" className="text-sm font-medium text-[#484f5c]">
                  SSL Commerz
                </label>
              </div>

              <div className="neu-divider"></div>

              <p className="text-xl font-semibold text-[#373b43]">Guest Information</p>
              <ZInputTwo
                name="name"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                required
              />
              <ZEmail name="email" label="Email Address(Optional)" />
              <ZPhone name="phone" label="Phone Number" type="text" required />

              {/* NID Image Upload */}
              <div>
                <p className="text-sm font-semibold text-[#373b43] mb-2">NID Image <span className="text-red-500">*</span></p>
                {nidPreview ? (
                  <div className="neu-sm p-1 rounded-xl relative">
                    <img
                      src={nidPreview}
                      alt="NID preview"
                      className="w-full h-40 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeNidImage}
                      className="absolute top-2 right-2 neu-btn w-7 h-7 flex items-center justify-center rounded-full text-red-500"
                    >
                      <CloseOutlined />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <label className="neu-btn flex-1 flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer text-[#6b7588] text-sm">
                      <UploadOutlined />
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleNidFileChange(file);
                        }}
                      />
                    </label>
                    <label className="neu-btn flex-1 flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer text-[#6b7588] text-sm">
                      <CameraOutlined />
                      Camera
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleNidFileChange(file);
                        }}
                      />
                    </label>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || nidUploading}
                className="neu-btn-primary w-full text-sm py-3 rounded-xl text-white lg:text-lg"
              >
                {isLoading || nidUploading ? "Processing..." : "Confirm & Pay"}
              </button>
            </div>

            {/* Summary Card */}
            {selectedRooms.length > 0 ? (
              <div className="neu-card p-6 w-full lg:w-[40%] space-y-4">
                <div className="neu-sm p-1 rounded-xl overflow-hidden">
                  <Image
                    src={selectedRooms[0]?.images?.[0]}
                    alt="Selected Room"
                    className="rounded-lg"
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px' }}
                  />
                </div>
                <h2 className="text-lg font-semibold text-[#373b43]">Your Trip Summary</h2>
                <div className="neu-inset-sm p-3 text-sm space-y-2">
                  <p className="text-[#484f5c]"><span className="font-bold">Check-in :</span> {moment(checkInDate).format("Do MMM YYYY ,  h:mm a")}</p>
                  <p className="text-[#484f5c]"><span className="font-bold">Check-out :</span> {moment(checkOutDate).format("Do MMM YYYY ,  h:mm a")}</p>
                  <p className="text-[#484f5c]"><span className="font-bold">Nights :</span> {nights}</p>
                </div>

                <div className="neu-card p-4 space-y-2 text-sm">
                  <p className="font-bold text-base text-[#373b43]">Rooms:</p>
                  <div className="text-[#484f5c]">
                    {selectedRooms.map((room, index) => {
                      const effectivePrice = room.discount
                        ? room.discountType === "flat"
                          ? Math.max(0, room.price - room.discount)
                          : Math.round(room.price - (room.price * room.discount) / 100)
                        : room.price;
                      return (
                        <div key={index}>
                          <p>
                            {room.type}
                            {room.discount && (
                              <span className="text-xs text-red-500 ml-1">
                                {room.discountType === "flat" ? `(-${room.discount}Tk)` : `(-${room.discount}%)`}
                              </span>
                            )}
                            {' '}- {effectivePrice} Tk (x {room.quantity}) : {effectivePrice * room.quantity} Tk
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="neu-divider"></div>
                  <div className="flex justify-between font-bold text-base">
                    <span className="text-[#373b43]">Total Price:</span>
                    <span className="text-primary">{totalPrice?.toFixed(2)} tk/-</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="neu-card p-8 w-full lg:w-[40%] flex flex-col justify-center items-center text-center">
                <h2 className="text-xl font-semibold text-primary">No Rooms Selected</h2>
                <p className="text-sm text-[#6b7588] mt-2">
                  Please go back and select at least one room to proceed with your booking.
                </p>
              </div>
            )}
          </div>
        </div>
      </ZFormTwo>
    </>
  );
};

export default Checkout;
