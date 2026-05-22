import React from "react";
import { Card, Row, Col, Spin } from "antd";
import { useGetBookingsQuery } from "../../../../redux/Feature/Admin/booking/bookingApi";

const DashboardStatistics = () => {
  const { data: bookings, error, isLoading: bookingsIsLoading } = useGetBookingsQuery();

  const getBookingStatusCounts = (bookings) => {
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
    };

    if (bookings?.data && bookings.data.length > 0) {
      bookings.data.forEach((booking) => {
        switch (booking.status) {
          case "pending":
            statusCounts.pending += 1;
            break;
          case "confirmed":
            statusCounts.confirmed += 1;
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

  const statusCounts = getBookingStatusCounts(bookings);

  if (bookingsIsLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading bookings</div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1 className="text-center font-bold text-2xl mb-10 text-[#373b43]">Booking Statistics Overview</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8} lg={8}>
          <Card title="Pending Bookings" className="!shadow-neu-sm">
            <h2 className="text-center font-bold text-xl" style={{ color: "#faad14" }}>{statusCounts.pending}</h2>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={8}>
          <Card title="Confirmed Bookings" className="!shadow-neu-sm">
            <h2 className="text-center font-bold text-xl" style={{ color: "#52c41a" }}>{statusCounts.confirmed}</h2>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8} lg={8}>
          <Card title="Cancelled Bookings" className="!shadow-neu-sm">
            <h2 className="text-center font-bold text-xl" style={{ color: "#f5222d" }}>{statusCounts.cancelled}</h2>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStatistics;
