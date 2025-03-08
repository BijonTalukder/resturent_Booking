import React, { useEffect, useState } from "react";
import { Alert, Image, Tag } from "antd";
import { Space, Tooltip, message } from "antd";

import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import ButtonWithModal from "../../../../components/Button/ButtonWithModal";
import { setIsDeleteModalOpen, setIsEditModalOpen } from "../../../../redux/Modal/ModalSlice";
import AddModal from "../../../../components/Modal/AddModal";
import EditModal from "../../../../components/Modal/EditModal";
import DeleteModal from "../../../../components/Modal/DeleteModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useDeleteAttributesMutation, useGetAttributesQuery } from "../../../../redux/Feature/Admin/attribute/attributesApi";
import AddAttributes from "./AddAttributes/AddAttributes";
import EditAttributes from "./EditAttributes/EditAttributes";

const Attribute = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading: attributeIsLoading } = useGetAttributesQuery();
  const { isAddModalOpen, isEditModalOpen, isDeleteModalOpen } = useAppSelector((state) => state.modal);
  const [selectedAttribute, setSelectedAttribute] = useState({});
  const [deleteAttribute, { isLoading: dAIsLoading, isError, isSuccess, data: dAData, error: dAError }] = useDeleteAttributesMutation();



  const attributeData = data?.data?.map((attribute, index) => ({
    key: index,
    id: attribute?.id,
    name: attribute?.name,
    value: attribute?.value,
    createdAt: attribute?.createdAt,
    updatedAt: attribute?.updatedAt
  }));


  const handleEditAttribute = (attributeData) => {
    setSelectedAttribute(attributeData);
    dispatch(setIsEditModalOpen());
  };

  const handleDeleteAttributeRequest = (attributeData) => {
    setSelectedAttribute(attributeData);
    dispatch(setIsDeleteModalOpen());
  };

  const handleDeleteAttribute = () => {
    deleteAttribute(selectedAttribute?.id);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Values",
      dataIndex: "value",
      key: "value",
      render: (value) =>  
        <div className="flex justify-center gap-2">
      {
        value?.map((item) => (
          <div key={item?.id} className="relative">
            <Alert message={item?.name} type="info" />
          </div>
        ))
             
      }
    </div>
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditAttribute(record)}>
            <Tooltip title="Edit" placement="top">
              <AiFillEdit className="text-green-500" size={20} />
            </Tooltip>
          </a>
          <a onClick={() => handleDeleteAttributeRequest(record)}>
            <Tooltip title="Delete" placement="top">
              <AiFillDelete className="text-red-500" size={20} />
            </Tooltip>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div>
        <BreadCrumb />
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-x-2 justify-end my-5">
        <ButtonWithModal title="Add Attribute"></ButtonWithModal>
      </div>

      <DashboardTable columns={columns} data={attributeData} loading={attributeIsLoading} />

      {/* AddModal Component */}
      <AddModal isAddModalOpen={isAddModalOpen} title="Add New Attribute">
        <AddAttributes />
      </AddModal>

      {/* EditModal Component */}
      <EditModal isEditModalOpen={isEditModalOpen} title="Edit Attribute">
        <EditAttributes selectedAttribute={selectedAttribute} />
      </EditModal>

      {/* DeleteModal Component */}
      <DeleteModal
        data={dAData}
        error={dAError}
        isLoading={dAIsLoading}
        isSuccess={isSuccess}
        title="Delete Attribute"
        onDelete={handleDeleteAttribute}
        isDeleteModalOpen={isDeleteModalOpen}
        isError={isError}
        description={"Deleting this attribute will remove all associated data."}
      />
    </>
  );
};

export default Attribute;
