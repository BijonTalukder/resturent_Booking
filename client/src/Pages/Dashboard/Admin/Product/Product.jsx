import React, { useEffect, useState } from "react";
import { Alert, Button, Image, Modal, Tag } from "antd";
import { Space, Tooltip, message } from "antd";
import { CiEdit } from "react-icons/ci";
import { AiFillDelete, AiFillEdit, AiFillEye, AiOutlineDelete } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { useDeleteProductMutation, useGetProductsQuery } from "../../../../redux/Feature/Admin/product/productApi";
import { setIsDeleteModalOpen } from "../../../../redux/Modal/ModalSlice";
import EditModal from "../../../../components/Modal/EditModal";
// import EditProduct from "./EditProduct/EditProduct";
import ButtonWithModal from "../../../../components/Button/ButtonWithModal";
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import { useNavigate } from "react-router-dom";
import DashboardTable from "../../../../components/Table/DashboardTable";
import DeleteModal from "../../../../components/Modal/DeleteModal";

const Product = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading } = useGetProductsQuery();
  const { isAddModalOpen, isEditModalOpen, isDeleteModalOpen } = useAppSelector(
    (state) => state.modal
  );
  const [selectedProduct, setSelectedProduct] = useState({});
  const [deleteProduct, { isLoading: dCIsloading, isError, isSuccess, data: dCData, error: dError }] = useDeleteProductMutation();
  const navigate = useNavigate();
 

  const productData = data?.data?.map((product, index) => ({
      key: index,
      id: product?.id,
      category: product?.category?.categoryName,
      name: product?.name,
      subtitle: product?.productSubtitle,
      description: product?.description,
      sku: product?.sku,
      brand: product?.brand?.brandName,
      status: product?.status,
      variants: product?.variants
  }));


  const handledl = (productData) => {
    setSelectedProduct(productData);
    dispatch(setIsDeleteModalOpen());
  };

  const handleDeleteProduct = () => {
    deleteProduct(selectedProduct?.id);
  };

  const handleEditProduct = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleViewProduct = (id) => {
    navigate(`/admin/view-product-details/${id}`);
  };



  // Define table columns
  const columns = [
    
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Subtitle",
      dataIndex: "subtitle",
      key: "subtitle",
    },
    // {
    //   title: "Type",
    //   render: (values, record) => (
    //     <div className="flex justify-center">
    //       <Alert message={`${record.type === "0" ? "Variant Product" : "Single Product"}`} type="info" />
    //     </div>
    //   ),
    // },
    // {
    //   title: "SKU",
    //   render: (values, record) => (
    //     <div className="flex gap-2 flex-col items-center">
    //       {record.variant?.length > 0 ? (
    //         record?.variant?.map((item, index) => (
    //           <Alert 
    //             key={index} 
    //             message={`${item?.sku || 'N/A'}`} 
    //             type="info" 
    //           />
    //         ))
    //       ) : (
    //         <Alert 
    //           message={` ${record.sku || 'N/A'}`} 
    //           type="info" 
    //         />
    //       )}
    //     </div>
    //   ),
    // },
    {
      title: "Variant",
      dataIndex: "variants",
      render: (values) => (
        <div className="flex justify-center">
          <Alert message={`Total Variant : ${values?.length || 0}`} type="info" />
        </div>
      ),
    },
    
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
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
    },,
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
           <a onClick={() => handleViewProduct(record.id)}>
          <Tooltip title="Click here to view product details" placement="top">
          
          <AiFillEye size={25}/>
                  </Tooltip>
          </a>
          <a onClick={() => handleEditProduct(record.id)}>
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

 


 if (error) return <p className="text-center text-red-500">Error loading products</p>;



  return (
    <>
      <div>
        <BreadCrumb />
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-x-2 justify-end my-5">
        <ButtonWithModal title="Add Product" path={"/admin/add-product"} />
      </div>

      {/* EditModal Component */}
      {/* <EditModal isEditModalOpen={isEditModalOpen} title="Edit Product">
        <EditProduct selectedProduct={selectedProduct} />
      </EditModal> */}

      {/* Product Table */}
      <DashboardTable columns={columns} data={productData} loading={isLoading} />

      {/* Delete Modal */}
      <DeleteModal
        data={dCData}
        error={dError}
        isLoading={dCIsloading}
        isSuccess={isSuccess}
        title="Delete Product"
        onDelete={handleDeleteProduct}
        isDeleteModalOpen={isDeleteModalOpen}
        isError={isError}
        description={"Deleting this product will remove all corresponding data."}
      />
    </>
  );
};

export default Product;
