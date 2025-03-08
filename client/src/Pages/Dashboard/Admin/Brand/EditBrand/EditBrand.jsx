import React, { useState } from "react";
import { useUpdateBrandMutation } from "../../../../../redux/Feature/Admin/brand/brandApi";
import ZFormTwo from "../../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../../components/Form/ZInputTwo";
import { useAppDispatch } from "../../../../../redux/Hook/Hook";
import { setIsEditModalOpen } from "../../../../../redux/Modal/ModalSlice";
import ZSelect from "../../../../../components/Form/ZSelect";
import ZImageInput from "../../../../../components/Form/ZImageInput";
import axios from "axios"; // Ensure axios is imported
import { toast } from "sonner";

const EditBrand = ({ selectedBrand }) => {
  const dispatch = useAppDispatch();
  const [editBrand, { isLoading: BIsLoading, isError: BIsError, error: BError, isSuccess: BIsSuccess, data }] = useUpdateBrandMutation();
  
  const [isImageRemoved, setIsImageRemoved] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      let imageUrl = selectedBrand?.image;

      if (formData.imageUrl && !isImageRemoved) {
        const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
        const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
        
        const imageFile = new FormData();
        imageFile.append('image', formData.imageUrl);
        
        const res = await axios.post(image_hosting_api, imageFile);

        if (res?.data?.success) {
          imageUrl = res.data.data.display_url;
        }
      }

      if (isImageRemoved) {
        imageUrl = ""; // Set imageUrl to null if the image was removed
      }

      const brandData = {
        brandName: formData?.brandName,
        imageUrl: imageUrl,
        status: formData?.status,
        createdById: "64b8c4c8d4a7f3d9e0e6e1d4"
      };

      editBrand({ id: selectedBrand.id, data: brandData });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error updating brand. Please try again.');
    }
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsEditModalOpen());
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
        formType="edit"  
        data={data}
        buttonName="Update"
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          <ZInputTwo
            value={selectedBrand?.name}
            name="brandName"
            type="text"
            label="Brand Name"
            placeholder={"Enter your brand"}
            required
          />
         
          <ZImageInput
            name="imageUrl"
            label="Brand Image"
            onRemove={() => setIsImageRemoved(true)} // Set image removal state
            defaultValue={selectedBrand?.image ? [
              {
                uid: '-1',
                name: 'Current Image',
                status: 'done',
                url: selectedBrand?.image,
              },
            ] : []}
          />

          <ZSelect
            name="status"
            label="Status"
            options={[
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
            placeholder="Select status"
            value={selectedBrand?.status}
          />
        </div>
      </ZFormTwo>
    </div>
  );
};

export default EditBrand;
