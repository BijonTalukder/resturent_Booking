import React, { useEffect, useState } from "react";
import {  Image, Tag } from "antd";
import { Space, Tooltip, message } from "antd";
import { useDeleteCategoryMutation, useGetCategoryQuery } from "../../../../redux/Feature/Admin/category/categoryApi";
import AddCategory from "./AddCategory/AddCategory";
import EditCategory from "./EditCategory/EditCategory";
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import ButtonWithModal from "../../../../components/Button/ButtonWithModal";
import { setIsDeleteModalOpen, setIsEditModalOpen } from "../../../../redux/Modal/ModalSlice";
import AddModal from "../../../../components/Modal/AddModal";
import EditModal from "../../../../components/Modal/EditModal";
import DeleteModal from "../../../../components/Modal/DeleteModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";


const Category = () => {
const dispatch = useAppDispatch();
const { data, error, isLoading: categoryIsLoading } = useGetCategoryQuery();
const { isAddModalOpen, isEditModalOpen , isDeleteModalOpen } = useAppSelector((state) => state.modal);
const [selectedCategory, setSelectedCategory] = useState({});
const [deleteCategory ,  { isLoading: dCIsloading, isError, isSuccess, data: dCData, error:dError } ] = useDeleteCategoryMutation();

  const categoryData = data?.data?.map((category, index) => ({
    key: index,
    id: category?.id,
    name: category?.categoryName,
    image: category?.imageUrl,
    status: category?.status
  }));

  
  const handleEditCategory = (categoryData) => {
    setSelectedCategory(categoryData);
    dispatch(setIsEditModalOpen());
  };

  const handledl = (categoryData) => {
    setSelectedCategory(categoryData);
    dispatch(setIsDeleteModalOpen());
  };


  const handleDeleteCategory = () => {
       deleteCategory(selectedCategory?.id)
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
          {status === true ? "Active" : "Inactive"}</Tag> // Display status with color
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEditCategory(record)}>
            <Tooltip title="Edit" placement="top">
              <AiFillEdit className="text-green-500" size={20} />
            </Tooltip>
          </a>
          <a onClick={() => handledl(record)}>
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
        <BreadCrumb/>
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-x-2 justify-end my-5">
        <ButtonWithModal title="Add Category"></ButtonWithModal>
      </div>

      <DashboardTable columns={columns} data={categoryData} loading={categoryIsLoading}/>
      
      {/* AddModal Component */}
      <AddModal isAddModalOpen={isAddModalOpen} title="Add New Category">
        <AddCategory/>
      </AddModal>

      {/* EditModal Component */}
      <EditModal isEditModalOpen={isEditModalOpen} title="Edit Category">
        <EditCategory selectedCategory= {selectedCategory}/>
      </EditModal>

{/* delete category */}
<DeleteModal
        data={dCData}
        error={dError}
        isLoading={dCIsloading}
        isSuccess={isSuccess}
        title="Delete Category"
        onDelete={handleDeleteCategory}
        isDeleteModalOpen={isDeleteModalOpen}
        isError={isError}
        description={"Under the category corresponding data will be removed "}
      ></DeleteModal>


    </>
  );
};

export default Category;
