import { Descriptions, Tag } from 'antd';
import React from 'react';
import moment from 'moment';

const ViewBooking = ({ selectedBooking }) => {
  console.log(selectedBooking)
  return (
    <div>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Booking ID">
          {selectedBooking?.id}
        </Descriptions.Item>
        <Descriptions.Item label="Booked At">
          {selectedBooking?.createdAt}
        </Descriptions.Item>
        <Descriptions.Item label="Guest Name">
          {selectedBooking?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          {selectedBooking?.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {selectedBooking?.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Room ID">
          {selectedBooking?.roomId}
        </Descriptions.Item>
        <Descriptions.Item label="User ID">
          {selectedBooking?.userId}
        </Descriptions.Item>
        <Descriptions.Item label="Check-In">
          {selectedBooking?.checkIn}
        </Descriptions.Item>
        <Descriptions.Item label="Check-Out">
          {selectedBooking?.checkOut}
        </Descriptions.Item>
        <Descriptions.Item label="Total Price">
          ${selectedBooking?.totalPrice}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Status">
          <Tag
            color={selectedBooking?.paymentStatus === "paid" ? "green" : "volcano"}
          >
            {selectedBooking?.paymentStatus}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Booking Status">
          <Tag
            color={
              selectedBooking?.status === "pending"
                ? "blue"
                : selectedBooking?.status === "confirmed"
                ? "green"
                : selectedBooking?.status === "cancelled"
                ? "red"
                : "default"
            }
          >
            {selectedBooking?.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Transaction ID">
          {selectedBooking?.transactionId}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default ViewBooking;
