import React, { useState } from "react";
import {
  Card,
  Image,
  Tag,
  Button,
  Divider,
  Row,
  Col,
  Typography,
  List,
  Space,
  message,
  Tooltip,
} from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format, addDays, isBefore, isAfter, startOfDay } from "date-fns";
import Skeleton from "../../../components/Skeleton/Skeleton";
import { useGetRoomsByHotelIdQuery } from "../../../redux/Feature/Admin/room/roomApi";
import { useGetHotelByIdQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";
import RoomGallery from "./RoomGallery";
import { useCheckRoomAvailabilityBookingMutation } from "../../../redux/Feature/Admin/booking/bookingApi";
import { useAppDispatch } from "../../../redux/Hook/Hook";
import { setBookingDetails } from "../../../redux/Booking/bookingSlice";
import {
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
  ShoppingOutlined,
  SafetyOutlined,
  FireOutlined,
  MedicineBoxOutlined,
  SwitcherOutlined,
  GiftOutlined,
  TeamOutlined,
  LeftCircleFilled,
  EnvironmentOutlined,
} from "@ant-design/icons";
import SliderAminities from "../../../components/SliderAminities";

const amenityIcons = {
  "Free WiFi": <WifiOutlined />,
  "Parking": <CarOutlined />,
  "Restaurant": <CoffeeOutlined />,
  "Shop": <ShoppingOutlined />,
  "24/7 Security": <SafetyOutlined />,
  "Gym": <FireOutlined />,
  "Spa": <MedicineBoxOutlined />,
  "Swimming Pool": <SwitcherOutlined />,
  "Gift Shop": <GiftOutlined />,
  "Meeting Rooms": <TeamOutlined />,
};

const { Title, Text, Paragraph } = Typography;

const HotelDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    data: hotelData,
    isLoading: isHotelLoading,
    error: hotelError,
  } = useGetHotelByIdQuery(id);
  const {
    data: roomsData,
    isLoading: isRoomsLoading,
    error: roomsError,
  } = useGetRoomsByHotelIdQuery(id);
  const [checkRoomAvailabilityBooking] =
    useCheckRoomAvailabilityBookingMutation();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState(startOfDay(new Date()));
  const [checkOutDate, setCheckOutDate] = useState(
    addDays(startOfDay(new Date()), 1)
  );
  const [showMap, setShowMap] = useState(false);

  if (isHotelLoading || isRoomsLoading) {
    return <Skeleton />;
  }

  if (hotelError) {
    return <div>Error loading hotel details.</div>;
  }

  const hotel = hotelData?.data;
  const rooms = roomsData?.data || [];

  const isSelected = (roomId) => selectedRooms.some((r) => r.id === roomId);

  const handleRoomSelect = async (room) => {
    try {
      const toUtcMidnightISOString = (date) => {
        const utcDate = new Date(
          Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
        );
        return utcDate.toISOString();
      };

      const checkInDateFormatted = toUtcMidnightISOString(checkInDate);
      const checkOutDateFormatted = toUtcMidnightISOString(checkOutDate);

      const res = await checkRoomAvailabilityBooking({
        roomId: room.id,
        checkIn: checkInDateFormatted,
        checkOut: checkOutDateFormatted,
      }).unwrap();

      if (res?.data?.available === true) {
        if (isSelected(room.id)) {
          setSelectedRooms((prev) => prev.filter((r) => r.id !== room.id));
          message.info(`Deselected ${room.type} room`);
        } else {
          setSelectedRooms((prev) => [...prev, room]);
          message.success(`Selected ${room.type} room`);
        }
      } else {
        message.error("Room is not available for the selected dates.");
      }
    } catch (error) {
      console.error("Availability check failed", error);
      message.error("Failed to check room availability. Please try again.");
    }
  };

  const handleCheckInChange = (date) => {
    if (date) {
      const newCheckIn = startOfDay(date);
      setCheckInDate(newCheckIn);

      if (isAfter(newCheckIn, checkOutDate)) {
        setCheckOutDate(addDays(newCheckIn, 1));
      }
    }
  };

  const handleCheckOutChange = (date) => {
    if (date) {
      const newCheckOut = startOfDay(date);
      if (isAfter(newCheckOut, checkInDate)) {
        setCheckOutDate(newCheckOut);
      } else {
        message.warning("Check-out date must be after check-in date");
      }
    }
  };

  const nights = Math.max(
    1,
    Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
  );

  const totalPrice = selectedRooms.reduce(
    (sum, room) => sum + room.price * nights,
    0
  );

  const handleProceedToCheckout = () => {
    const toUtcMidnightISOString = (date) => {
      const utcDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      return utcDate.toISOString();
    };

    const checkInDateFormatted = toUtcMidnightISOString(checkInDate);
    const checkOutDateFormatted = toUtcMidnightISOString(checkOutDate);
    dispatch(
      setBookingDetails({
        selectedRooms,
        checkInDate: checkInDateFormatted,
        checkOutDate: checkOutDateFormatted,
        totalPrice,
      })
    );

    navigate("/checkout");
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="py-8">
      <Link to="/">
        <LeftCircleFilled className="ms-2" />
      </Link>

      <div className="mb-8">
        <RoomGallery rooms={rooms} />
      </div>

      <div className="text-center mb-8">
        <Title level={2} className="!mb-2">
          {hotel?.name}
        </Title>
        <Paragraph type="secondary" className="!mb-0">
          {hotel?.location}
          {hotel?.latitude && hotel?.longitude && (
            <Tooltip title={showMap ? "Hide map" : "Show map"}>
              <Button
                type="text"
                icon={<EnvironmentOutlined />}
                onClick={toggleMap}
                className="ml-2"
              />
            </Tooltip>
          )}
        </Paragraph>
      </div>

      <Card className="mb-8 shadow-sm">
        <Title level={4} className="!mb-4">
          Hotel Description
        </Title>
        <Paragraph>{hotel?.description}</Paragraph>
        <Divider />

        <div>
          <Text strong>Amenities: </Text>
          <SliderAminities amenities={hotel?.amenities || []} />
        </div>
      </Card>

      {showMap && hotel?.latitude && hotel?.longitude && (
        <div className="mb-8">
          <Title level={4}>Location Map</Title>
          <iframe
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              hotel.name
            )}+${hotel.latitude},${hotel.longitude}&hl=en&output=embed`}
          ></iframe>
        </div>
      )}

      <Card className="mb-8 shadow-sm">
        <Title level={4} className="!mb-4">
          Select Dates
        </Title>
        <Row gutter={16} align="middle">
          <Col className="mb-5 md:mb-0" xs={24} sm={12} md={8}>
            <Text className="me-2" strong>
              Check-in:
            </Text>
            <DatePicker
              selected={checkInDate}
              onChange={handleCheckInChange}
              minDate={startOfDay(new Date())}
              className="w-full mt-2 p-2 border rounded"
              dateFormat="MMM d, yyyy"
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Text className="me-2" strong>
              Check-out:
            </Text>
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

      <Title level={3} className="!mb-6">
        Available Rooms
      </Title>
      <div className="pb-10">
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
          dataSource={rooms}
          renderItem={(room) => {
            const selected = isSelected(room.id);
            return (
              <List.Item>
                <Card
                  hoverable
                  className={`transition-all ${
                    selected
                      ? "border-2 border-blue-500 bg-blue-50 shadow-md"
                      : "shadow"
                  }`}
                  cover={
                    <Image
                      alt={room.type}
                      src={
                        room.images?.[0] ||
                        "https://via.placeholder.com/300x200"
                      }
                      height={200}
                      style={{ objectFit: "cover" }}
                    />
                  }
                  actions={[
                    <Button
                      className={`${
                        selected
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                      type="primary"
                      onClick={() => handleRoomSelect(room)}
                      disabled={!room.isAvailable}
                    >
                      {room.isAvailable
                        ? selected
                          ? "Deselect"
                          : "Select"
                        : "Unavailable"}
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={room.type}
                    description={
                      <>
                        <div className="mb-2 text-blue-500 font-medium">
                          <Text strong>Price: </Text>
                          {room.price} Tk per night
                        </div>
                        <div className="mb-2">
                          <Text strong>Capacity: </Text>
                          {room.capacity}{" "}
                          {room.capacity > 1 ? "people" : "person"}
                        </div>
                        <div className="">
                          <Text strong>Amenities: </Text>
                          <Space className="mt-1">
                            {room.amenities?.slice(0, 2).map((item, i) => (
                              <Tag key={i} color="green">
                                {item}
                              </Tag>
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
            );
          }}
        />
      </div>

      <div className="flex justify-center lg:justify-end mb-10">
        <Tooltip
          title={
            selectedRooms.length === 0
              ? "Select at least one room to proceed"
              : ""
          }
          placement="top"
        >
          <Button
            disabled={selectedRooms.length === 0}
            className="bg-green-500 text-white hover:bg-green-500 hover:text-white disabled:cursor-not-allowed w-full lg:w-[25%] rounded-none"
            type="primary"
            size="large"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout ({totalPrice} Tk/-)
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default HotelDetails;