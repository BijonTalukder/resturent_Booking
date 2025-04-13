import React, { useState } from "react";
import { Card, Image, Tag, Button, Divider, Row, Col, Typography, List, Space, message,  } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useParams } from "react-router-dom";
import { format, addDays, isBefore, isAfter, startOfDay } from 'date-fns';
import Skeleton from "../../../components/Skeleton/Skeleton";
import { useGetRoomsByHotelIdQuery } from "../../../redux/Feature/Admin/room/roomApi";
import { useGetHotelByIdQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";
import RoomGallery from "./RoomGallery";

const { Title, Text, Paragraph } = Typography;

const HotelDetails = () => {
  const { id } = useParams();
  const { data: hotelData, isLoading: isHotelLoading, error: hotelError } = useGetHotelByIdQuery(id);
  const { data: roomsData, isLoading: isRoomsLoading, error: roomsError } = useGetRoomsByHotelIdQuery(id);

  const [selectedRoom, setSelectedRoom] = useState([]);
  const [checkInDate, setCheckInDate] = useState(startOfDay(new Date()));
  const [checkOutDate, setCheckOutDate] = useState(addDays(startOfDay(new Date()), 1));

  console.log(checkInDate, checkOutDate);

  if (isHotelLoading || isRoomsLoading) {
    return <Skeleton />;
  }

  if (hotelError) {
    return <div>Error loading hotel details.</div>;
  }

  const hotel = hotelData?.data;
  const rooms = roomsData?.data || [];

  const handleRoomSelect = (room) => {
    if (!room.isAvailable) {
      message.error('Room is not available for the selected dates');
      return;
    }
    setSelectedRoom(room);
    message.success(`Selected ${room.type} room for booking`);
  };

  const handleCheckInChange = (date) => {
    if (date) {
      const newCheckIn = startOfDay(date);
      setCheckInDate(newCheckIn);
      
      // If new check-in is after current check-out, update check-out to be next day
      if (isAfter(newCheckIn, checkOutDate)) {
        setCheckOutDate(addDays(newCheckIn, 1));
      }
    }
  };

  const handleCheckOutChange = (date) => {
    if (date) {
      const newCheckOut = startOfDay(date);
      // Only update if date is after check-in
      if (isAfter(newCheckOut, checkInDate)) {
        setCheckOutDate(newCheckOut);
      } else {
        message.warning('Check-out date must be after check-in date');
      }
    }
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/">
        <Button type="primary" className="mb-6 text-base-100 bg-blue-500 hover:bg-blue-600">
          Back to home
        </Button>
      </Link>

      {/* Hotel Header Section */}
      <div className="text-center mb-8">
        <Title level={2} className="!mb-2">{hotel?.name}</Title>
        <Paragraph type="secondary" className="!mb-0">
          {hotel?.location}
        </Paragraph>
      </div>



      {/* Hotel Main Image */}
      <div className="mb-8">
        <RoomGallery rooms={rooms} />
      </div>

      {/* Hotel Details Section */}
      <Card className="mb-8 shadow-sm">
        <Title level={4} className="!mb-4">Hotel Details</Title>
        <Paragraph>{hotel?.description}</Paragraph>

        <Divider />

        <div>
          <Text strong>Amenities: </Text>
          <Space size={[0, 8]} wrap className="mt-2">
            {hotel?.amenities?.map((amenity, index) => (
              <Tag key={index} color="blue">
                {amenity}
              </Tag>
            ))}
          </Space>
        </div>
      </Card>

            {/* Date Selection */}
            <Card className="mb-8 shadow-sm">
        <Title level={4} className="!mb-4">Select Dates</Title>
        <Row gutter={16} align="middle">
          <Col className="mb-5 lg:mb-0" xs={24} sm={12} md={8}>
            <Text className="me-2" strong>Check-in:</Text>
            <DatePicker
              selected={checkInDate}
              onChange={handleCheckInChange}
              minDate={startOfDay(new Date())}
              className="w-full mt-2 p-2 border rounded"
              dateFormat="MMM d, yyyy"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text className="me-2" strong>Check-out:</Text>
            <DatePicker
              selected={checkOutDate}
              onChange={handleCheckOutChange}
              minDate={addDays(checkInDate, 1)}
              className="w-full mt-2 p-2 border rounded"
              dateFormat="MMM d, yyyy"
            />
          </Col>
        </Row>
      </Card>

      {/* Rooms Section */}
      <Title level={3} className="!mb-6">Available Rooms</Title>
      <div className="pb-10">
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item>
              <Card
                hoverable
                cover={
                  <Image
                    alt={room.type}
                    src={room.images?.[0] || "https://via.placeholder.com/300x200"}
                    height={200}
                    style={{ objectFit: 'cover' }}
                  />
                }
                actions={[
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    type="primary"
                    onClick={() => handleRoomSelect(room)}
                    disabled={!room.isAvailable}
                  >
                    {room.isAvailable === true ? 'Select' : 'Unavailable'}
                  </Button>
                ]}
              >
                <Card.Meta
                  title={room.type}
                  description={
                    <>
                      <div className="mb-2 text-blue-500 font-medium">
                        <Text strong>Price: </Text>${room.price} per night
                      </div>
                      <div className="mb-2">
                        <Text strong>Capacity: </Text>{room.capacity} {room.capacity > 1 ? 'people' : 'person'}
                      </div>
                      <div>
                        <Text strong>Amenities: </Text>
                        <Space wrap className="mt-1">
                          {room.amenities?.slice(0, 2).map((item, i) => (
                            <Tag key={i} color="green">{item}</Tag>
                          ))}
                          {room.amenities?.length > 3 && (
                            <Tag>+{room.amenities.length - 3} more</Tag>
                          )}
                        </Space>
                      </div>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>

     <div className="flex justify-center lg:justify-end mb-10">
     <Button
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  type="primary"
                  size="large"
                >
                  Proceed to Checkout
                </Button>
     </div>
    </div>
  );
};

export default HotelDetails;