import React from "react";
import { Card, Row, Col, Spin } from "antd"; // Using Ant Design for UI components
import { useGetOrdersQuery } from "../../../../redux/Feature/Admin/order/orderApi";

const DashboardStatistics = () => {
  // Fetch order data
  const { data: orders, error, isLoading: ordersIsLoading } = useGetOrdersQuery();
  console.log(orders);

  // Calculate order status counts
  const getOrderStatusCounts = (orders) => {
    const statusCounts = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    if (orders?.data && orders.data.length > 0) {
      orders.data.forEach((order) => {
        switch (order.orderStatus) {
          case "pending":
            statusCounts.pending += 1;
            break;
          case "processing":
            statusCounts.processing += 1;
            break;
          case "shipped":
            statusCounts.shipped += 1;
            break;
          case "delivered":
            statusCounts.delivered += 1;
            break;
          case "cancelled":
            statusCounts.cancelled += 1;
            break;
          default:
            break;
        }
      });
    }

    return statusCounts;
  };

  const statusCounts = getOrderStatusCounts(orders);

  // Loading state
  if (ordersIsLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (error) {
    return <div>{"Error loading hotels" || error.message}</div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1 className="text-center font-bold text-2xl mb-10">Order Statistics Overview</h1>
      <Row gutter={[16, 16]}>
        {/* Pending Orders Card */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="Pending Orders" bordered={false}>
            <h2 className="text-center font-bold text-xl" style={{ color: "#faad14" }}>{statusCounts.pending}</h2>
          </Card>
        </Col>

        {/* Processing Orders Card */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="Processing Orders" bordered={false}>
            <h2 className="text-center font-bold text-xl" style={{ color: "#1890ff" }}>{statusCounts.processing}</h2>
          </Card>
        </Col>

        {/* Shipped Orders Card */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="Shipped Orders" bordered={false}>
            <h2  className="text-center font-bold text-xl" style={{ color: "#13c2c2" }}>{statusCounts.shipped}</h2>
          </Card>
        </Col>

        {/* Delivered Orders Card */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="Delivered Orders" bordered={false}>
            <h2 className="text-center font-bold text-xl" style={{ color: "#52c41a" }}>{statusCounts.delivered}</h2>
          </Card>
        </Col>

        {/* Cancelled Orders Card */}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card title="Cancelled Orders" bordered={false}>
            <h2 className="text-center font-bold text-xl" style={{ color: "#f5222d" }}>{statusCounts.cancelled}</h2>
          </Card>
        </Col>
      </Row>
      {/* <h1 className="text-center font-bold text-2xl mb-10 mt-10">Product Statistics Overview</h1> */}

    </div>
  );
};

export default DashboardStatistics;