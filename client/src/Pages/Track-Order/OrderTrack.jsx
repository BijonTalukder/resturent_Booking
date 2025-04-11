import React, { useState, useEffect } from "react";
import { Timeline } from "primereact/timeline";
import { Card } from "primereact/card";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import { Button, Skeleton, Table, Tag, Typography } from "antd";
// import { useTraceOrderQuery } from "../../redux/Feature/Admin/order/orderApi";
import { toast } from "sonner";
import moment from "moment";
import Image from "../../assets/complete.png";
import DashboardTitle from "../../components/DashboardTitle/DashboardTitle";

const { Title, Text } = Typography;

export default function OrderTrack() {
  const [orderId, setOrderId] = useState("");
  const [queryOrderId, setQueryOrderId] = useState("");

  const { data,isLoading, isFetching } = useTraceOrderQuery(queryOrderId, { skip: !queryOrderId });

  const [orderStatus, setOrderStatus] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);

  useEffect(() => {
    if (data?.data) {
      setOrderStatus(data.data.orderStatus);
      setUpdatedAt(data.data.updatedAt);
    }
  }, [data]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Attributes",
      dataIndex: "selectedAttributes",
      key: "selectedAttributes",
      render: (attributes) =>
        attributes
          ? Object.entries(attributes)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")
          : "No attributes selected",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total",
      key: "total",
      render: (_, record) => `$${parseFloat(record.price) * record.quantity}`,
    },
  ];

  // Table data for ordered items
  const orderData = data?.data?.orderItems.map((item, index) => ({
    key: index,
    ...item,
  }));

  const handleTrackOrder = () => {
    if (!orderId) {
      toast.error("Please enter a valid Order Transaction ID");
    }
    setQueryOrderId(orderId);
  };

  const statusColors = {
    pending: "#FFA500", // Orange
    processing: "#3498DB", // Blue
    shipped: "#8E44AD", // Purple
    delivered: "#27AE60", // Green
    cancelled: "#E74C3C", // Red
  };

  const events = [
    { status: "pending", icon: Image },
    { status: "processing", icon: Image },
    { status: "shipped", icon: Image },
    { status: "delivered", icon: Image },
    { status: "cancelled", icon: Image },
  ].map((event) => ({
    ...event,
    color: statusColors[event.status] || "#000",
    isActive: event.status === orderStatus,
  }));

  if(isLoading || isFetching){
    return <div className="py-5"><Skeleton/></div>
  }

  const customizedMarker = (item) => (
    <span
      className="flex w-[2rem] h-[2rem] items-center justify-center text-white border-circle z-1 shadow-1"
      style={{  opacity: item.isActive ? 1 : 0.3 }}
    >
      <img className={`${item.isActive ? "" : "cursor-not-allowed"} `} src={item.icon} alt="" />
    </span>
  );

  const customizedContent = (item) => (
    <Card className={`mb-10  lg:mb-0 ${item.isActive ? "" : "cursor-not-allowed"}`}>
    <h1 className={`uppercase mb-5 font-bold lg:text-2xl`} style={{ color: item.color , opacity: item.isActive ? 1 : 0.3 }}>{item?.status}</h1>
      {item.isActive ? (
        <p className="">
          Your order has been{" "}
          <span className={`font-bold`} style={{ color: item.color }}>
            {item.status.toLowerCase()}
          </span>
          .
          <br />
          <small>Last updated: {moment(updatedAt).format("Do MMMM YYYY, h:mm:ss a")}</small>
        </p>
      ) : null}
    </Card>
  );

  return (
    <div className="card py-5">
    <DashboardTitle windowTitle={"Track"}/>
   
    
      <h1 className="text-center lg:text-2xl underline font-bold mb-5">Track Your Order Status Here</h1>
      <div className="w-full lg:w-[70%] mx-auto">
        <div className="">
          <label htmlFor="orderId">Order Transaction ID <span className="text-red-500">*</span></label>
          <div>
            <input
              id="orderId"
              type="text"
              className="py-2 px-2 w-full mt-5 rounded-md border outline-none border-blue-500 bg-white text-sm text-gray-700 shadow-xs"
              placeholder="Enter your Order Transaction ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
         <div className="flex justify-center">
         <Button
          className="mb-10 mt-5 bg-[#3498DB] text-white"
          onClick={handleTrackOrder}
          disabled={isFetching}
        >
          {isFetching ? "Tracking..." : "Track Order"}
        </Button>
         </div>
        </div>
       
      </div>

      <div className="mb-10">
      {  data?.data &&
       <>
       <h1 className="font-bold mb-5 ms-2 text-center">Ordered Items:</h1>
       <Table
          columns={columns}
          dataSource={orderData}
          pagination={false}
          bordered
          scroll={{ x: 500, y: 300 }} // Scroll horizontally and set fixed vertical height
          responsive={true} // Ensures the table is responsive

          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={4} align="right">
                <Text strong>Subtotal</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell>
                <Text strong>
                  $
                  {data?.data?.orderItems?.reduce(
                    (total, item) => total + parseFloat(item.price) * item.quantity,
                    0
                  )}
                </Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </>
      }
      </div>
      {!data?.data && queryOrderId ? (
        <div className="text-red-500 font-bold text-center">
          Invalid Order Transaction ID number, provide correct one
        </div>
      ) : (
        
        data?.data && (
      <div>
      <h1 className="font-bold mb-5 ms-2 text-center">Order Status:</h1>
      <Timeline
            value={events}
            align="alternate"
            className="customized-timeline"
            marker={customizedMarker}
            content={customizedContent}
          />
      </div>
        )
      )}
    </div>
  );
}
