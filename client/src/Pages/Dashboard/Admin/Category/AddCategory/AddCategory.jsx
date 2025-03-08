
import React from "react";
import { useAddCategoryMutation } from "../../../../../redux/Feature/Admin/category/categoryApi";
import ZFormTwo from "../../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../../components/Form/ZInputTwo";
import { useAppDispatch } from "../../../../../redux/Hook/Hook";
import { setIsAddModalOpen } from "../../../../../redux/Modal/ModalSlice";
import ZSelect from "../../../../../components/Form/ZSelect";
import ZImageInput from "../../../../../components/Form/ZImageInput";
import axios from "axios";
import { message } from "antd";



const AddCategory = () => {
   const dispatch = useAppDispatch()
  const [creatCategory,{ isLoading: CIsloading, isError: CIsError,
    error : CError,
    isSuccess: CIsSuccess, data}] = useAddCategoryMutation();

    const handleSubmit = async (data) => {
      try {
          let imageUrl = '';
  
          // Check if image is provided
          if (data?.imageUrl) {
              const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
              const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;
              
              const imageFile = new FormData();
              imageFile.append('image', data.imageUrl);
              
              const res = await axios.post(image_hosting_api, imageFile, {
                  headers: {
                      'content-type': 'multipart/form-data'
                  }
              });
  
              if (res?.data?.success) {
                  imageUrl = res.data.data.display_url;
              } else {
                  throw new Error('Image upload failed');
              }
          }
  
          const formData = {
              categoryName: data?.categoryName,
              imageUrl: imageUrl || '',  // Use the uploaded URL or an empty string
              status: data?.status,
              createdById: "64b8c4c8d4a7f3d9e0e6e1d4"
          };
  
          creatCategory(formData);
          
      } catch (error) {
          console.error('Error handling form submission:', error);
          message.error('Error handling form submission. Please try again.');
      }
  };
  
  
  const handleCloseAndOpen = () => {
    dispatch(setIsAddModalOpen())
  }


  return (
    <div className="">
      <ZFormTwo
        isLoading={CIsloading}
        isSuccess={CIsSuccess}
        isError={CIsError}
        error={CError}
        submit={handleSubmit}
        closeModal={handleCloseAndOpen}  
        formType="create"  
        data = {data}
        buttonName="Create">
        <div className="grid grid-cols-1  gap-3 mt-10">
  
          <ZInputTwo
            name="categoryName"
            type="text"
            label="Category Name"
            defaultKey={""}
            placeholder={"Enter your category"}
            required={1}
            reset

          />
           
          <ZImageInput
            name="imageUrl"
            label="Category Image"
           
          />

         <ZSelect
            name="status"
            label="Status"
            options={[
              { label: "Active", value: true },
              { label: "Inactive", value: false },
            ]}
            placeholder="Select status"
            required={1}
            
          />
      
  
        </div>
      </ZFormTwo>
    </div>
  );
};

export default AddCategory;
