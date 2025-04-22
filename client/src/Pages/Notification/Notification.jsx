import React, { useState, useEffect } from "react";
import { Badge, Dropdown, List, Avatar, Button, message } from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import {
  useGetUserNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from "../../redux/Feature/Admin/notification/notificationApi";
import { useCurrentUser } from "../../redux/Feature/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { useAppSelector } from "../../redux/Hook/Hook";

const Notification = () => {
  const navigate = useNavigate();
  const user = useAppSelector(useCurrentUser);

  const {
    data: notifications,
    refetch,
    isFetching,
  } = useGetUserNotificationsQuery(user?.id, {
    pollingInterval: 30000,
  });

  const [markAsRead] = useMarkNotificationAsReadMutation();

  const handleNotificationClick = async (item) => {
    try {
      // Mark as read first
      await markAsRead(item.id).unwrap();
      
      // Then navigate to the link if it exists
      if (item.link) {
        navigate(item.link);
      } 
      else {
 
        switch(item.type) {
          case "BOOKING_CONFIRMATION":
            navigate(`/bookings/${item.bookingId}`);
          break;
          case "REVIEW_REMINDER":
          break  
          case "BOOKING_CANCELLATION":
          break;
          case "PROMOTION":
          default:
            navigate('/notifications');
        }
      }
      
      refetch();
    } catch (err) {
      message.error("Failed to process notification");
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "BOOKING_CONFIRMATION": return "✅";
      case "BOOKING_CANCELLATION": return "❌";
      case "PROMOTION": return "🎁";
      case "REVIEW_REMINDER": return "⭐";
      case "GENERAL": return "ℹ️";
      default: return "🔔";
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="py-4 border-b border-gray-200 flex justify-between items-center fixed top-0 left-0 right-0 bg-white z-40">
        <h3 className="font-semibold text-lg ms-3">Notifications</h3>
      </div>

      <List
        className="max-h-96 lg:max-h-full lg:mb-10 pt-10 lg:pb-5 mt-6 overflow-y-scroll"
        loading={isFetching}
        dataSource={notifications?.data || []}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={`w-full !p-3 lg:!px-5 hover:bg-gray-50 cursor-pointer ${
              !item.isRead ? "bg-blue-50" : ""
            }`}
            onClick={() => handleNotificationClick(item)}
          >
            <div className="flex items-start gap-3">
              <Avatar
                size="large"
                className="mt-1"
                style={{ backgroundColor: item.isRead ? "#f0f0f0" : "#1890ff" }}
              >
                {getNotificationIcon(item.type)}
              </Avatar>

              <div className="flex-1">
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-gray-600">
                  {item.message?.length > 20 ? `${item.message.slice(0, 20)}...` : item.message}
                </p>
                <div className="block text-xs text-gray-400">
                  {moment(item.createdAt).fromNow()}
                </div>
                {item?.bookingId && (
                  <span className="inline-block bg-gray-100 px-2 py-1 rounded text-xs mt-1">
                    Booking #{item?.bookingId}
                  </span>
                )}
              </div>
            </div>

            <Button
              className={`text-xs ${
                item.isRead ? "bg-gray-200" : "bg-blue-500 text-white"
              }`}
              type="text"
              icon={item.isRead ? <CheckOutlined /> : <BellOutlined />}
              size="small"
              disabled={item.isRead}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNotificationClick(item);
              }}
            />
          </List.Item>
        )}
        locale={{ emptyText: "No notifications yet" }}
      />
    </div>
  );
};

export default Notification;