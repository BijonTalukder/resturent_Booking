import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { CiTrash } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook/Hook";
import { useUpdateAttributesMutation } from "../../../../../redux/Feature/Admin/attribute/attributesApi";
import { setIsEditModalOpen } from "../../../../../redux/Modal/ModalSlice";
import ZFormTwo from "../../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../../components/Form/ZInputTwo";
import { v4 as uuidv4 } from "uuid";

const EditAttributes = ({ selectedAttribute }) => {
  const dispatch = useAppDispatch();
  const { isEditModalOpen } = useAppSelector((state) => state.modal);

  const [addonPages, setAddonPages] = useState([]);
  const [deletedIds, setDeletedIds] = useState([]);
  const [updateAttribute, { isLoading, isError, isSuccess, error, data }] = useUpdateAttributesMutation();

  useEffect(() => {
    if (!isEditModalOpen) {
      setAddonPages([{ name: "" }]);  // Reset the addonPages when modal is closed
    }
  }, [isEditModalOpen]);

  useEffect(() => {
    if (selectedAttribute?.value) {
      // Set initial value for addonPages when attribute is selected
      const initialValues = selectedAttribute?.value.map((value) => ({
        id: value.id,
        attribute: value?.attribute,
        name: value.name || ""
      }));
      setAddonPages(initialValues);
    }
  }, [selectedAttribute]);

  console.log(addonPages)

  const handleAddPage = () => {
    setAddonPages([...addonPages, { name: "" }]);
  };

  const handleRemovePage = (index) => {
    const updatedPages = addonPages.filter((_, idx) => idx !== index);
    setAddonPages(updatedPages);
  };

  const handleInputChange = (index, value) => {
    const updatedPages = [...addonPages];
    updatedPages[index].name = value;
    setAddonPages(updatedPages);
  };


  const handleSubmit = async (formData) => {
    const { name } = formData;
    const updatedValues = addonPages.map((page) => ({
      id: page?.id || uuidv4(),
      attribute: name,
      name: page?.name || ""
    }));

    const updatedData = { name, value: updatedValues };

    console.log(updatedData);

    try {
      await updateAttribute({
        id: selectedAttribute?.id,
        data: updatedData
      }).unwrap();
      console.log("Attribute updated successfully!");
    } catch (err) {
      console.error("Error updating attribute:", err);
    }
  };




  const handlePreviousItemDelete = (id) => {
    setDeletedIds([...deletedIds, id]);
    const updatedPages = addonPages.filter((item) => item.id !== id);
    setAddonPages(updatedPages);
  };

  const handleCloseAndOpen = () => {
    dispatch(setIsEditModalOpen());
  };

  return (
    <div>
  

      {/* Form Section */}
      <ZFormTwo
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        submit={handleSubmit}
        closeModal={handleCloseAndOpen}
        formType="edit"
        data={data}
        buttonName="Update Attribute"
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          {/* Attribute Name */}
          <ZInputTwo
            required
            name="name"
            type="text"
            label="Attribute Name"
            placeholder="Enter Attribute Name"
            value={selectedAttribute?.name || ""}
          />

          <div>
            <h4 className="text-lg font-semibold mb-3">Attribute Value</h4>
            <div className="max-h-[400px] overflow-y-scroll thin-scrollbar mb-5">
              {addonPages.map((page, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className="w-[90%]">
                    <ZInputTwo
                      required
                      name={`value.${index}`}
                      type="text"
                      label="Value Name"
                      placeholder="Enter Value Name"
                      value={page?.name}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  </div>
                  <div>
                    {index === 0 ? (
                      <button
                        type="button"
                        onClick={handleAddPage}
                        className="bg-blue-500 text-white py-1 mt-2 px-2 rounded"
                      >
                        <AiOutlinePlus size={15} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRemovePage(index)}
                        className="bg-red-500 text-white rounded px-2 py-1 mt-2"
                      >
                        <AiOutlineMinus size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ZFormTwo>
    </div>
  );
};

export default EditAttributes;
