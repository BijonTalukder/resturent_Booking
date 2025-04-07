import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { setIsAddModalOpen } from "../../../../redux/Modal/ModalSlice";
import axios from "axios";
import { message } from "antd";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import ZSelect from "../../../../components/Form/ZSelect";
import ZImageInput from "../../../../components/Form/ZImageInput";
import { useCreateHotelMutation } from "../../../../redux/Feature/Admin/hotel/hotelApi";
import { useCurrentUser } from "../../../../redux/Feature/auth/authSlice";

const AddHotel = () => {
  const dispatch = useAppDispatch();
  const [createHotel, { isLoading, isError, error, isSuccess, data }] = useCreateHotelMutation();
  const [divisions, setDivisions] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState("");
  const user = useAppSelector(useCurrentUser);  
  

  // Fetch divisions on component mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axios.get("https://bdapi.vercel.app/api/v.1/division");
        setDivisions(response.data.data.map(div => ({
          label: div.name,
          value: div.id
        })));
      } catch (error) {
        console.error("Error fetching divisions:", error);
        message.error("Failed to load divisions");
      }
    };
    fetchDivisions();
  }, []);

  // Fetch cities when division is selected
  useEffect(() => {
    if (selectedDivision) {
      const fetchCities = async () => {
        try {
          const response = await axios.get(`https://bdapi.vercel.app/api/v.1/district/${selectedDivision}`);
          setCities(response.data.data.map(city => ({
            label: city.name,
            value: city.id
          })));
        } catch (error) {
          console.error("Error fetching cities:", error);
          message.error("Failed to load cities");
        }
      };
      fetchCities();
    }
  }, [selectedDivision]);

  const handleSubmit = async (formData) => {
    try {
      let imageUrl = '';

      // Handle image upload if provided
      if (formData?.image) {
        const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
        const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

        const imageFile = new FormData();
        imageFile.append('image', formData.image);

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

      const hotelData = {
        name: formData?.name,
        description: formData?.description,
        location: formData?.location,
        latitude: parseFloat(formData?.latitude),
        longitude: parseFloat(formData?.longitude),
        image: imageUrl || "https://example.com/hotel-image.jpg",
        divisionId: formData?.divisionId,
        cityId: formData?.cityId,
        amenities: formData?.amenities || [],
        ownerId: user?.id,
        isActive: formData?.isActive || true
      };

      createHotel(hotelData);

    } catch (error) {
      console.error('Error handling form submission:', error);
      message.error('Error handling form submission. Please try again.');
    }
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsAddModalOpen());
  };

  const amenitiesOptions = [
    { label: "Free WiFi", value: "Free WiFi" },
    { label: "Swimming Pool", value: "Swimming Pool" },
    { label: "Spa", value: "Spa" },
    { label: "Gym", value: "Gym" },
    { label: "Restaurant", value: "Restaurant" },
  ];

  return (
    <div className="">
      <ZFormTwo
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        submit={handleSubmit}
        closeModal={handleCloseAndOpen}
        formType="create"
        data={data}
        buttonName="Create Hotel"
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          <ZInputTwo
            name="name"
            type="text"
            label="Hotel Name"
            placeholder="Enter hotel name"
            required={1}
            reset
          />

          <ZInputTwo
            name="description"
            type="text"
            label="Description"
            placeholder="Enter hotel description"
            required={1}
            reset
          />

          <ZInputTwo
            name="location"
            type="text"
            label="Location"
            placeholder="Enter hotel location"
            required={1}
            reset
          />

          <div className="grid grid-cols-2 gap-4">
            <ZInputTwo
              name="latitude"
              type="number"
              label="Latitude"
              placeholder="Enter latitude coordinates"
              required={1}
              reset
            />

            <ZInputTwo
              name="longitude"
              type="number"
              label="Longitude"
              placeholder="Enter longitude coordinates"
              required={1}
              reset
            />
          </div>

          <ZImageInput
            name="image"
            label="Hotel Image"
          />

          <ZSelect
            name="divisionId"
            label="Division"
            options={divisions}
            placeholder="Select division"
            required={1}
            onChange={(value) => setSelectedDivision(value)}
          />

          <ZSelect
            name="cityId"
            label="City"
            options={cities}
            placeholder="Select city"
            required={1}
            disabled={!selectedDivision}
            onChange={(value) => setSelectedDivision(value)} 
          />

          <ZSelect
            name="amenities"
            label="Amenities"
            options={amenitiesOptions}
            placeholder="Select amenities"
            mode="multiple"
            required={1}
          />

          <ZSelect
            name="isActive"
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

export default AddHotel;