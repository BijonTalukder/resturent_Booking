import React, { useEffect, useState } from "react";
import { Image, Tag } from "antd";
import { Space, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import ButtonWithModal from "../../../../components/Button/ButtonWithModal";
import { setIsDeleteModalOpen, setIsEditModalOpen } from "../../../../redux/Modal/ModalSlice";
import AddModal from "../../../../components/Modal/AddModal";
import EditModal from "../../../../components/Modal/EditModal";
import DeleteModal from "../../../../components/Modal/DeleteModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { useDeleteBrandMutation, useGetBrandQuery } from "../../../../redux/Feature/Admin/brand/brandApi";
import AddBrand from "./AddBrand/AddBrand";
import EditBrand from "./EditBrand/EditBrand";

const Brand = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading: brandIsLoading } = useGetBrandQuery();
  const { isAddModalOpen, isEditModalOpen, isDeleteModalOpen } = useAppSelector((state) => state.modal);
  const [selectedBrand, setSelectedBrand] = useState({});
  const [deleteBrand, { isLoading: dBIsloading, isError, isSuccess, data: dBData, error: dBError }] = useDeleteBrandMutation();

  const brandData = data?.data?.map((brand, index) => ({
    key: index,
    id: brand?.id,
    name: brand?.brandName,
    image: brand?.imageUrl,
    status: brand?.status,
  }));

  const handleEditBrand = (brandData) => {
    setSelectedBrand(brandData);
    dispatch(setIsEditModalOpen());
  };

  const handleDeleteModal = (brandData) => {
    setSelectedBrand(brandData);
    dispatch(setIsDeleteModalOpen());
  };

  const handleDeleteBrand = () => {
    deleteBrand(selectedBrand?.id);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <Image alt="" height={50} width={50} src={record.image} />
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === true ? 'green' : 'red'}>
          {status === true ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditBrand(record)}>
            <Tooltip title="Edit" placement="top">
              <AiFillEdit className="text-green-500" size={20} />
            </Tooltip>
          </a>
          <a onClick={() => handleDeleteModal(record)}>
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
        <ButtonWithModal title="Add Brand"></ButtonWithModal>
      </div>

      <DashboardTable columns={columns} data={brandData} loading={brandIsLoading} />
      
      {/* AddModal Component */}
      <AddModal isAddModalOpen={isAddModalOpen} title="Add New Brand">
        <AddBrand />
      </AddModal>

      {/* EditModal Component */}
      <EditModal isEditModalOpen={isEditModalOpen} title="Edit Brand">
        <EditBrand selectedBrand={selectedBrand} />
      </EditModal>

      {/* DeleteModal Component */}
      <DeleteModal
        data={dBData}
        error={dBError}
        isLoading={dBIsloading}
        isSuccess={isSuccess}
        title="Delete Brand"
        onDelete={handleDeleteBrand}
        isDeleteModalOpen={isDeleteModalOpen}
        isError={isError}
        description={"Deleting this brand will remove all associated data."}
      />
    </>
  );
};

export default Brand;
