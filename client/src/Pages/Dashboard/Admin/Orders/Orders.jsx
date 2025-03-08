import React, { useState } from "react";
import { Table, Tag, Space, Tooltip, Radio } from "antd"; // Added Radio component
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import ButtonWithModal from "../../../../components/Button/ButtonWithModal";
import { setIsDeleteModalOpen, setIsEditModalOpen, setIsViewModalOpen } from "../../../../redux/Modal/ModalSlice";
import EditModal from "../../../../components/Modal/EditModal";
import DeleteModal from "../../../../components/Modal/DeleteModal";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { AiFillDelete, AiFillEdit, AiFillEye } from "react-icons/ai";
import { useDeleteOrderMutation, useGetOrdersQuery } from "../../../../redux/Feature/Admin/order/orderApi";
import ViewModal from "../../../../components/Modal/ViewModal";
import EditOrders from "./EditOrders";
import ViewOrders from "./ViewOrders";
import moment from "moment";

const Orders = () => {
  const dispatch = useAppDispatch();
  const { data, error, isLoading: ordersIsLoading } = useGetOrdersQuery();
  const { isEditModalOpen, isViewModalOpen, isDeleteModalOpen } = useAppSelector((state) => state.modal);
  const [selectedOrder, setSelectedOrder] = useState({});
  const [deleteOrder, { isLoading: dOIsLoading, isError, isSuccess, data: dOData, error: dOError }] = useDeleteOrderMutation();

  // State for radio button filter
  const [filterStatus, setFilterStatus] = useState("all"); // Default: show all orders

  // Transform data for the table
  const ordersData = data?.data?.map((order, index) => ({
    key: index + 1,
    id: order?.id,
    createdAt: moment(order?.createdAt).format('Do MMMM YYYY, h:mm:ss a'),
    name: order?.name,
    email: order?.email,
    phone: order?.phone,
    orderTotal: order?.orderTotal,
    paymentStatus: order?.paymentStatus,
    orderStatus: order?.orderStatus,
    transactionId: order?.transactionId,
    shippingAddress: order?.shippingAddress,
    billingAddress: order?.billingAddress,
    orderItems: order?.orderItems,
    deliveryFee: order?.deliveryFee,
    taxAmount: order?.taxAmount
  }));

  // Filter orders based on selected radio button
  const filteredOrders = filterStatus === "all"
    ? ordersData // Show all orders
    : ordersData?.filter((order) => order.orderStatus === filterStatus); // Filter by status

  const handleEditOrder = (orderData) => {
    setSelectedOrder(orderData);
    dispatch(setIsEditModalOpen());
  };

  const handleViewOrder = (orderData) => {
    setSelectedOrder(orderData);
    dispatch(setIsViewModalOpen());
  };

  const handleDeleteOrderPrompt = (orderData) => {
    setSelectedOrder(orderData);
    dispatch(setIsDeleteModalOpen());
  };

  const handleDeleteOrder = () => {
    deleteOrder(selectedOrder?.id);
  };

  const columns = [
    {
      title: "Serial",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Purchase Date",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Order Total",
      dataIndex: "orderTotal",
      key: "orderTotal",
      render: (orderTotal) => (
        <Tag color="cyan">${orderTotal}</Tag>
      )
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={status === "paid" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => (
        <Tag 
          color={
            status === "pending" ? "blue" :
            status === "processing" ? "orange" :
            status === "shipped" ? "purple" :
            status === "delivered" ? "green" :
            status === "cancelled" ? "red" :
            "default"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleViewOrder(record)}>
            <Tooltip title="View" placement="top">
              <AiFillEye className="text-blue-500" size={20} />
            </Tooltip>
          </a>
          <a onClick={() => handleEditOrder(record)}>
            <Tooltip title="Edit" placement="top">
              <AiFillEdit className="text-green-500" size={20} />
            </Tooltip>
          </a>
          <a onClick={() => handleDeleteOrderPrompt(record)}>
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

      {/* Radio Button Filters */}
      <div className="flex justify-center my-10" >
        <Radio.Group
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="pending">Pending</Radio.Button>
          <Radio.Button value="processing">Processing</Radio.Button>
          <Radio.Button value="shipped">Shipped</Radio.Button>
          <Radio.Button value="delivered">Delivered</Radio.Button>
          <Radio.Button value="cancelled">Cancelled</Radio.Button>
        </Radio.Group>
      </div>

      {/* Table */}
      <DashboardTable columns={columns} data={filteredOrders} loading={ordersIsLoading} />

      {/* Modals */}
      <EditModal isEditModalOpen={isEditModalOpen} title="Edit Order">
        <EditOrders selectedOrder={selectedOrder} />
      </EditModal>
      
      <ViewModal width={600} isViewModalOpen={isViewModalOpen} title="View Order">
        <ViewOrders selectedOrder={selectedOrder} />
      </ViewModal>
      
      <DeleteModal
        data={dOData}
        error={dOError}
        isLoading={dOIsLoading}
        isSuccess={isSuccess}
        title="Delete Order"
        onDelete={handleDeleteOrder}
        isDeleteModalOpen={isDeleteModalOpen}
        isError={isError}
        description="Deleting this order will remove all associated details permanently."
      ></DeleteModal>
    </>
  );
};

export default Orders;