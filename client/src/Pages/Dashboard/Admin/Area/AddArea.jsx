import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../../../redux/Hook/Hook";
import { setIsAddModalOpen } from "../../../../redux/Modal/ModalSlice";
import { message } from "antd";
import ZFormTwo from "../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../components/Form/ZInputTwo";
import ZSelect from "../../../../components/Form/ZSelect";
import ZNumber from "../../../../components/Form/ZNumber";
import { useCreateAreaMutation } from "../../../../redux/Feature/Admin/area/areaApi";
import { useGetDistrictsQuery } from "../../../../redux/Feature/User/place/placeApi";

const AddArea = () => {
  const dispatch = useAppDispatch();
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState(null);
  const { data: districtsData, isLoading: districtsLoading } = useGetDistrictsQuery();
  
  const [createArea, { isLoading, isError, error, isSuccess, data }] = useCreateAreaMutation();

  useEffect(() => {
    if (districtsData?.data) {
      const options = districtsData.data.map(district => ({
        label: district.name,
        value: district.serialId,
        name: district.name
      }));
      setDistrictOptions(options);
    }
  }, [districtsData]);

  const handleDistrictChange = (value) => {
    setSelectedDistrictId(value);
  };

  const handleSubmit = async (formData) => {
    try {
      // Find the selected district to get its name
      const selectedDistrict = districtOptions.find(
        district => district.value === parseInt(formData.district_id)
      );

      const payload = {
        name: formData.name,
        bn_name: formData.bn_name || null,
        serialId: parseInt(formData.serialId),
        district_id: parseInt(formData.district_id),
        district_name: selectedDistrict?.name || '',
      };
      // console.log(payload)

      await createArea(payload).unwrap();
  
    } catch (err) {
      console.error("Error creating area:", err);
      message.error(err.data?.message || "Failed to create area");
    }
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsAddModalOpen());
  };

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
        buttonName="Create Area"
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          <ZInputTwo
            name="name"
            type="text"
            label="Area Name (English)"
            placeholder="Enter area name in English"
            required={1}
          />

          <ZInputTwo
            name="bn_name"
            type="text"
            label="Area Name (Bengali)"
            placeholder="Enter area name in Bengali"
          />

          <ZNumber 
            name="serialId"
            label="Serial ID"
            placeholder="Enter serial ID"
            required={1}
          />

          <ZSelect
            name="district_id"
            label="Select District"
            options={districtOptions}
            loading={districtsLoading}
            placeholder="Select a district"
            required={1}
            onChange={handleDistrictChange} // Track district selection
          />
        </div>
      </ZFormTwo>
    </div>
  );
};

export default AddArea;