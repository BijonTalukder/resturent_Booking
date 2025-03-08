import React, { useState } from "react";
import { Table, Tag, Space, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb/BreadCrumb";
import DashboardTable from "../../../../components/Table/DashboardTable";
import { setIsViewModalOpen } from "../../../../redux/Modal/ModalSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/Hook/Hook";
import { AiFillEye } from "react-icons/ai";
import ViewModal from "../../../../components/Modal/ViewModal";
import { useGetSingleOrderQuery } from "../../../../redux/Feature/Admin/order/orderApi";
import ViewOrder from "./ViewOrder";
import { useCurrentUser } from "../../../../redux/Feature/auth/authSlice";
import moment from "moment";
import { FaGreaterThan, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";


const OrderHistory = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(useCurrentUser);
  const { data, error, isLoading } = useGetSingleOrderQuery(user?.id);
  const { isViewModalOpen } = useAppSelector((state) => state.modal);
  const [selectedOrder, setSelectedOrder] = useState({});

  const ordersData = data?.data?.map((order, index) => ({
    key: index + 1,
    id: order?.id,
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
    taxAmount: order?.taxAmount,
    createdAt: moment(order?.createdAt).format('Do MMMM YYYY, h:mm:ss a')
  }));

  const handleViewOrder = (orderData) => {
    setSelectedOrder(orderData);
    dispatch(setIsViewModalOpen());
  };

  const columns = [
    {
      title: "Serial",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Order id",
      dataIndex: "id",
      key: "id",
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
      render: (orderTotal) => <Tag color="cyan">${orderTotal}</Tag>,
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
            status === "pending"
              ? "blue"
              : status === "processing"
              ? "orange"
              : status === "shipped"
              ? "purple"
              : status === "delivered"
              ? "green"
              : status === "cancelled"
              ? "red"
              : "default"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "View",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleViewOrder(record)}>
            <Tooltip title="View All Details" placement="top">
              <AiFillEye className="text-blue-500" size={20} />
            </Tooltip>
          </a>
        </Space>
      ),
    },
  ];

  return (
    <>

    <div>
    <nav className="flex justify-start space-x-3 py-8 px-5">
          <Link
            to="/"
            className="text-lg font-medium hover:text-gray-300 transition-all duration-200"
          >
            <FaHome className="text-blue-500" size={20} />
          </Link>
          <span className="text-lg text-gray-300 mt-1">
            <FaGreaterThan size={15} />
          </span>
          <Link
            to="/edit-profile"
            className="text-base font-medium hover:text-gray-300 transition-all duration-200 text-blue-500"
          >
            My Account
          </Link>
          <span className="text-lg text-gray-300 mt-1">
            <FaGreaterThan size={15} />
          </span>
          <Link className="text-base font-medium hover:text-gray-300 transition-all duration-200">
            Order History
          </Link>
        </nav>
    </div>


<div className="py-5">
<DashboardTable columns={columns} data={ordersData} loading={isLoading} />

<ViewModal width={800} isViewModalOpen={isViewModalOpen}>
  <ViewOrder selectedOrder={selectedOrder} />
</ViewModal>
</div>
    </>
  );
};

export default OrderHistory;
