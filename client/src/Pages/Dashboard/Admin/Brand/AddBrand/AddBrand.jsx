
import React from "react";
import ZImageInput from "../../../../../components/Form/ZImageInput";
import { useAppDispatch } from "../../../../../redux/Hook/Hook";
import ZFormTwo from "../../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../../components/Form/ZInputTwo";
import ZSelect from "../../../../../components/Form/ZSelect";
import { setIsAddModalOpen } from "../../../../../redux/Modal/ModalSlice";
import { useAddBrandMutation } from "../../../../../redux/Feature/Admin/brand/brandApi";
import axios from "axios";
import { message } from "antd";

const AddBrand = () => {
  const dispatch = useAppDispatch();
  const [
    createBrand,
    {
      isLoading: BIsLoading,
      isError: BIsError,
      error: BError,
      isSuccess: BIsSuccess,
      data,
    },
  ] = useAddBrandMutation();

  const handleSubmit = async (data) => {
    try {
      let imageUrl = "";

      // Check if image is provided
      if (data?.imageUrl) {
        const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
        const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

        const imageFile = new FormData();
        imageFile.append("image", data.imageUrl);

        const res = await axios.post(image_hosting_api, imageFile, {
          headers: {
            "content-type": "multipart/form-data",
          },
        });

        if (res?.data?.success) {
          imageUrl = res.data.data.display_url;
        } else {
          throw new Error("Image upload failed");
        }
      }

      const formData = {
        brandName: data?.brandName,
        imageUrl: imageUrl || "", // Use the uploaded URL or an empty string
        status: data?.status,
        createdById: "64b8c4c8d4a7f3d9e0e6e1d4",
      };

      createBrand(formData);
    } catch (error) {
      console.error("Error handling form submission:", error);
      message.error("Error handling form submission. Please try again.");
    }
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsAddModalOpen());
  };

  return (
    <div className="">
      <ZFormTwo
        isLoading={BIsLoading}
        isSuccess={BIsSuccess}
        isError={BIsError}
        error={BError}
        submit={handleSubmit}
        closeModal={handleCloseAndOpen}
        formType="create"
        data={data}
        buttonName="Create"
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          {/* Brand Name */}
          <ZInputTwo
            name="brandName"
            type="text"
            label="Brand Name"
            defaultKey={""}
            placeholder="Enter your brand name"
          />

          {/* Brand Logo */}
          <ZImageInput name="imageUrl" label="Brand Logo" />

          {/* Status */}
          <ZSelect
            name="status"
            label="Status"
            options={[
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
            placeholder="Select status"
          />
        </div>
      </ZFormTwo>
    </div>
  );
};

export default AddBrand;
