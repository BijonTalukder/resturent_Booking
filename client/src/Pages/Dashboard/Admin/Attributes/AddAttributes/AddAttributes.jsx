import React, { useEffect, useState } from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hook/Hook";
import { useAddAttributesMutation } from "../../../../../redux/Feature/Admin/attribute/attributesApi";
import { setIsAddModalOpen } from "../../../../../redux/Modal/ModalSlice";
import ZFormTwo from "../../../../../components/Form/ZFormTwo";
import ZInputTwo from "../../../../../components/Form/ZInputTwo";
import { v4 as uuidv4 } from 'uuid';

const AddAttributes = () => {
  const dispatch = useAppDispatch();
  const [addonPages, setAddonPages] = useState([{ name: "" }]);
  const { isAddModalOpen } = useAppSelector((state) => state.modal);
console.log(addonPages)
  const [createAttribute, { isLoading, isError, isSuccess, error, data }] = useAddAttributesMutation();

  useEffect(() => {
    if (!isAddModalOpen) {
      setAddonPages([{ name: "" }]);
    }
  }, [isAddModalOpen]);

  const handleAddPage = () => {
    setAddonPages([...addonPages, { name: "" }]);
  };

  const handleRemovePage = (itemValue) => {
    const filterData = addonPages.filter((item) => item !== itemValue);
    setAddonPages([...filterData]);
  };

  const handleInputChange = (index, value) => {
    const updatedPages = [...addonPages];
    updatedPages[index].name = value;
    setAddonPages(updatedPages);
  };

  const handleSubmit = async (formData) => {
    const { name } = formData;
    const value = addonPages.map((page) => ({
      id: uuidv4(),
      attribute: name,
      name: page.name || ""
    }));

    const attributeData = { name, value };
    console.log(attributeData)

    createAttribute(attributeData);
  };



  const handleCloseAndOpen = () => {
    dispatch(setIsAddModalOpen());
  };

  return (
    <div>
      <ZFormTwo
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        submit={handleSubmit}
        closeModal={handleCloseAndOpen}
        formType="create"
        data={data}
        buttonName={`Create`}
      >
        <div className="grid grid-cols-1 gap-3 mt-10">
          <ZInputTwo
            required
            name="name"
            type="text"
            label="Attribute Name"
            placeholder="Enter Attribute Name"
          />
          <div>
            <h4 className="text-lg font-semibold mb-3">Attribute Value</h4>
            <div className="max-h-[400px] overflow-y-scroll thin-scrollbar mb-5">
              {addonPages.map((page, index) => (
                <div key={page} className="flex gap-4 items-center">
                  <div className="w-[90%]">
                    <ZInputTwo
                      required
                      name={`value.${index}`}
                      type="text"
                      label={`Attribute Value ${index + 1}`}
                      placeholder="Enter Value Name"
                      value={page.name}
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
                        onClick={() => handleRemovePage(page)}
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

export default AddAttributes;
