import { Descriptions, Tag } from 'antd';
import React from 'react'

const ViewOrders = ({selectedOrder}) => {
  const renderSelectedAttributes = (selectedAttributes) => {
    return Object.entries(selectedAttributes).map(([key, value]) => (
      <div key={key} className="text-xs text-gray-600">
        <span className="capitalize">{key}:</span> {value}
      </div>
    ));
  };


  return (
    <div><Descriptions bordered column={1}>
    <Descriptions.Item label="Order ID">{selectedOrder?.id}</Descriptions.Item>
    <Descriptions.Item label="Order Date">{selectedOrder?.createdAt}</Descriptions.Item>
    <Descriptions.Item label="Customer Name">{selectedOrder?.name}</Descriptions.Item>
    <Descriptions.Item label="Email">{selectedOrder?.email}</Descriptions.Item>
    <Descriptions.Item label="Phone">{selectedOrder?.phone}</Descriptions.Item>
    <Descriptions.Item label="Order Total">${selectedOrder?.orderTotal}</Descriptions.Item>
    <Descriptions.Item label="Payment Status">
      <Tag color={selectedOrder?.paymentStatus === "paid" ? "green" : "red"}>
        {selectedOrder?.paymentStatus}
      </Tag>
    </Descriptions.Item>
    <Descriptions.Item label="Order Status">
      <Tag  color={
          selectedOrder?.orderStatus === "pending" ? "blue" :
          selectedOrder?.orderStatus === "processing" ? "orange" :
          selectedOrder?.orderStatus === "shipped" ? "purple" :
          selectedOrder?.orderStatus === "delivered" ? "green" :
          selectedOrder?.orderStatus === "cancelled" ? "red" :
          "default"
        }>
        {selectedOrder?.orderStatus}
      </Tag>
    </Descriptions.Item>
    <Descriptions.Item label="Shipping Address">{selectedOrder?.shippingAddress}</Descriptions.Item>
    <Descriptions.Item label="Billing Address">{selectedOrder?.billingAddress}</Descriptions.Item>
    <Descriptions.Item label="Transaction ID">{selectedOrder?.transactionId}</Descriptions.Item>
    <Descriptions.Item label="Delivery Fee">${selectedOrder?.deliveryFee}</Descriptions.Item>
    <Descriptions.Item label="Tax Amount">${selectedOrder?.taxAmount}</Descriptions.Item>
    <Descriptions.Item label="Order Items">
      {selectedOrder?.orderItems?.map((item, index) => (
        <div key={index} className="mb-2">
          <strong>{item.name}</strong> (x{item.quantity}) - ${item.price} <br />
          <span>{renderSelectedAttributes(item?.selectedAttributes)}</span>
        </div>
      ))}
    </Descriptions.Item>
  </Descriptions></div>
  )
}

export default ViewOrders;