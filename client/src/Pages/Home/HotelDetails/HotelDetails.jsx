import React from "react";
import { Card, Image, Tag, Button, Divider, Row, Col, Typography, List, Space, Rate, message } from "antd";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import Skeleton from "../../../components/Skeleton/Skeleton";
import { useGetRoomsByHotelIdQuery } from "../../../redux/Feature/Admin/room/roomApi";
import { useGetHotelByIdQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";
import RoomGallery from "./RoomGallery";

const { Title, Text, Paragraph } = Typography;

const HotelDetails = () => {
  const { id } = useParams();
  const { data: hotelData, isLoading: isHotelLoading, error: hotelError } = useGetHotelByIdQuery(id);
  const { data: roomsData, isLoading: isRoomsLoading, error: roomsError } = useGetRoomsByHotelIdQuery(id);
  const [selectedRoom, setSelectedRoom] = React.useState(null);

  if (isHotelLoading || isRoomsLoading) {
    return <Skeleton />;
  }

  if (hotelError) {
    return <div>Error loading hotel details.</div>;
  }

  const hotel = hotelData?.data;
  const rooms = roomsData?.data || [];


  const handleBookNow = (room) => {
    setSelectedRoom(room);
    message.success(`Selected ${room.type} room for booking`);
    // Add your booking logic here
  };



  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/">
        <Button
        
         type="primary" className="mb-6 text-base-100 bg-blue-500 hover:bg-blue-600">
          Back to home
        </Button>
      </Link>

      {/* Hotel Header Section */}
      <div className="text-center mb-8">
        <Title level={2} className="!mb-2">{hotel?.name}</Title>
        {/* <Rate disabled defaultValue={4.5} className="mb-4" /> */}
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
        
        {/* <Divider /> */}

        {/* <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Text strong>Status: </Text>
            <Tag color={hotel?.isActive ? "green" : "red"}>
              {hotel?.isActive ? "Active" : "Inactive"}
            </Tag>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text strong>Coordinates: </Text>
            {hotel?.latitude && hotel?.longitude ? (
              `${hotel.latitude}, ${hotel.longitude}`
            ) : "N/A"}
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text strong>Created At: </Text>
            {moment(hotel?.createdAt).format('MMMM Do YYYY')}
          </Col>
        </Row> */}

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

      {/* Rooms Section */}
      <Title level={3} className="!mb-6">Available Rooms</Title>
      {/* {rooms?.length === 0 && (
       <>
         <div className="container mx-auto px-4 py-8">
        <Title level={3} className="!mb-6">No Rooms Available</Title>
        <Paragraph type="secondary">Currently, there are no rooms available for booking at this hotel.</Paragraph>
      </div>
       </>
      )
      } */}
      
   <div className="pb-10">
   <List
         grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
         dataSource={rooms}
        renderItem={(room) => (
          <List.Item>
            <Card
            className=""
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
                  onClick={() => handleBookNow(room)}
                  disabled={!room.isAvailable}
                >
                  {room.isAvailable ? 'Book Now' : 'Unavailable'}
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
                      <Space  wrap className="mt-1">
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

      {/* Booking Summary (appears when room is selected) */}
      {selectedRoom && (
        <Card className="mt-8 shadow-md" style={{ position: 'sticky', bottom: 20, zIndex: 1 }}>
          <Title level={4} className="!mb-4">Your Selection</Title>
<div className="py-5">
<Row gutter={16} align="middle">
            <Col xs={24} sm={8}>
              <Image
                src={selectedRoom.images?.[0]}
                width={150}
                height={100}
                style={{ objectFit: 'cover', borderRadius: 8 }}
              />
            </Col>
            <Col xs={24} sm={16}>
              <Title level={5}>{selectedRoom.type}</Title>
              <Paragraph>
                <Text strong>Price: </Text>${selectedRoom.price} per night<br />
                <Text strong>Capacity: </Text>{selectedRoom.capacity} {selectedRoom.capacity > 1 ? 'people' : 'person'}
              </Paragraph>
              <Button 
                className="bg-blue-500 text-white hover:bg-blue-600"
                // onClick={() => handleBookNow(selectedRoom)}
               type="primary" size="large">
                Proceed to Booking
              </Button>
            </Col>
          </Row>
</div>
        </Card>
      )}
    </div>
  );
};

export default HotelDetails;