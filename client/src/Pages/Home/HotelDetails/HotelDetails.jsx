import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  List,
  Button,
  message,
  Tag,
  Badge,
  Drawer,
  Space,
  Divider,
  Collapse,
} from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format, addDays, startOfDay, isAfter } from "date-fns";
import Skeleton from "../../../components/Skeleton/Skeleton";
import { useGetRoomsByHotelIdQuery } from "../../../redux/Feature/Admin/room/roomApi";
import { useGetHotelByIdQuery } from "../../../redux/Feature/Admin/hotel/hotelApi";
import RoomGallery from "./RoomGallery";
import SliderAminities from "./SliderAminities";
import { useCheckRoomAvailabilityBookingMutation } from "../../../redux/Feature/Admin/booking/bookingApi";
import { useAppDispatch } from "../../../redux/Hook/Hook";
import { setBookingDetails } from "../../../redux/Booking/bookingSlice";
import {
  LeftCircleFilled,
  EnvironmentOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  UserOutlined,
  HomeOutlined,
  DownOutlined,
  BellOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const HotelDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    data: hotelData,
    isLoading: hotelLoading,
    error: hotelError,
  } = useGetHotelByIdQuery(id);
  const { data: roomsData, isLoading: roomsLoading } =
    useGetRoomsByHotelIdQuery(id);
  const [checkRoomAvailability] = useCheckRoomAvailabilityBookingMutation();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState(startOfDay(new Date()));
  const [checkOutDate, setCheckOutDate] = useState(
    addDays(startOfDay(new Date()), 1)
  );
  const [showMap, setShowMap] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [roomDetailsVisible, setRoomDetailsVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomQuantities, setRoomQuantities] = useState({});
  const [adultCounts, setAdultCounts] = useState({});
  const [childCounts, setChildCounts] = useState({});

  const hotel = hotelData?.data;
  const rooms = roomsData?.data || [];
  const nights = Math.max(
    1,
    Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
  );

  const isSelected = (roomId) =>
    selectedRooms.some((room) => room.id === roomId);


  useEffect(() => {
    if (rooms.length > 0) {
      const initialQuantities = {};
      const initialAdultCounts = {};
      const initialChildCounts = {};

      rooms.forEach((room) => {
        initialQuantities[room.id] = 1;
        initialAdultCounts[room.id] = 1;
        initialChildCounts[room.id] = 0;
      });

      setRoomQuantities(initialQuantities);
      setAdultCounts(initialAdultCounts);
      setChildCounts(initialChildCounts);
    }
  }, [rooms]);

    const formatToUTC = (date) =>
    new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    ).toISOString();

 const handleRoomToggle = async (room) => {
  try {
    const res = await checkRoomAvailability({
      roomId: room.id,
      checkIn: formatToUTC(checkInDate),
      checkOut: formatToUTC(checkOutDate),
      quantity: roomQuantities[room.id] || 1
    }).unwrap();

    if (res?.data?.available) {
      if (isSelected(room.id)) {
        setSelectedRooms((prev) => prev.filter((r) => r.id !== room.id));
        message.info(`${room.type} room deselected.`);
      } else {
        const selectedRoomWithDetails = {
          ...room,
          quantity: roomQuantities[room.id] || 1,
          adults: adultCounts[room.id] || 1,
          children: childCounts[room.id] || 0
        };
        setSelectedRooms((prev) => [...prev, selectedRoomWithDetails]);
        message.success(`${room.type} room selected.`);
      }
    } else {
      message.warning("Room not available for selected dates.");
    }
  } catch (err) {
    message.error("Error checking availability. Please try again.");
  }
};

  const handleDateChange = (date, isCheckIn = true) => {
    const newDate = startOfDay(date);
    if (isCheckIn) {
      setCheckInDate(newDate);
      if (isAfter(newDate, checkOutDate)) {
        setCheckOutDate(addDays(newDate, 1));
      }
    } else {
      if (isAfter(newDate, checkInDate)) {
        setCheckOutDate(newDate);
      } else {
        message.warning("Check-out must be after check-in.");
      }
    }
  };

  const handleQuantityChange = (roomId, value) => {
    setRoomQuantities((prev) => ({
      ...prev,
      [roomId]: Math.max(1, value),
    }));
  };

const handleAdultCountChange = (roomId, value) => {
  const room = rooms.find(r => r.id === roomId);
  const currentAdults = adultCounts[roomId] || 1;
  const currentChildren = childCounts[roomId] || 0;
  const currentQuantity = roomQuantities[roomId] || 1;
  
  // Calculate if we need to increase quantity
  const totalGuests = value + currentChildren;
  const maxGuestsPerRoom = room.capacity + room.child;
  const neededQuantity = Math.ceil(totalGuests / maxGuestsPerRoom);
  
  setAdultCounts(prev => ({
    ...prev,
    [roomId]: Math.max(1, value)
  }));

  if (neededQuantity > currentQuantity) {
    setRoomQuantities(prev => ({
      ...prev,
      [roomId]: neededQuantity
    }));
  }
};

const handleChildCountChange = (roomId, value) => {
  const room = rooms.find(r => r.id === roomId);
  const currentAdults = adultCounts[roomId] || 1;
  const currentChildren = childCounts[roomId] || 0;
  const currentQuantity = roomQuantities[roomId] || 1;
  
  // Calculate if we need to increase quantity
  const totalGuests = currentAdults + value;
  const maxGuestsPerRoom = room.capacity + room.child;
  const neededQuantity = Math.ceil(totalGuests / maxGuestsPerRoom);
  
  setChildCounts(prev => ({
    ...prev,
    [roomId]: Math.max(0, value)
  }));

  if (neededQuantity > currentQuantity) {
    setRoomQuantities(prev => ({
      ...prev,
      [roomId]: neededQuantity
    }));
  }
};


  const totalPrice = selectedRooms.reduce(
    (sum, room) => sum + room.price * nights * (room.quantity || 1),
    0
  );

  const handleCheckout = () => {
    dispatch(
      setBookingDetails({
        selectedRooms,
        checkInDate: formatToUTC(checkInDate),
        checkOutDate: formatToUTC(checkOutDate),
        totalPrice,
      })
    );
    navigate("/checkout");
  };

  const openRoomDetails = (room) => {
    setCurrentRoom(room);
    setRoomDetailsVisible(true);
  };

  const formatDate = (date) => format(date, "EEE, MMM d, yyyy");

  if (hotelLoading || roomsLoading) return <Skeleton />;
  if (hotelError) return <div>Error loading hotel details.</div>;

  console.log(selectedRooms)

  return (
    <div className="pb-24">
      {/* Back Button */}
      <div className="sticky top-0 z-10 bg-white p-4 shadow-sm">
        <Link to="/">
          <Button
            type="text"
            icon={<LeftCircleFilled />}
            style={{ fontSize: "16px" }}
          >
            Back
          </Button>
        </Link>
      </div>

      {/* Main Gallery */}
      <RoomGallery rooms={rooms} />

      {/* Hotel Name & Location */}
      <div className="px-4 py-3">
        <Title level={3} style={{ margin: "0 0 4px 0" }}>
          {hotel?.name}
        </Title>
        <div className="flex items-center text-gray-600 mt-5 mb-5">
          <EnvironmentOutlined />
          <Text className="ml-1">{hotel?.location}</Text>
        </div>
      </div>

      {/* Date Selection */}
      <Card className="mx-4 mb-4 shadow-sm">
        <div
          className="flex  justify-between items-center"
          onClick={() => setDatePickerVisible(true)}
        >
          <div>
            <div className="flex items-center mb-1">
              <CalendarOutlined className="mr-2 text-blue-600" />
              <Text strong>Your Stay</Text>
            </div>
            <Text>
              {formatDate(checkInDate)} - {formatDate(checkOutDate)}
            </Text>
            <div className="mt-1">
              <Tag color="blue">
                {nights} {nights === 1 ? "night" : "nights"}
              </Tag>
            </div>
          </div>
          <Button type="default" shape="round" size="small">
            Change
          </Button>
        </div>
      </Card>

      {/* Amenities */}
      <div className="px-4 mb-4">
        <Title level={4} style={{ marginBottom: "12px" }}>
          Amenities
        </Title>
        <SliderAminities amenities={hotel?.amenities || []} />
      </div>

      {/* Description */}
      <Collapse
        bordered={false}
        className="mx-4 mb-4 shadow-sm"
        expandIcon={({ isActive }) => (
          <DownOutlined rotate={isActive ? 180 : 0} />
        )}
      >
        <Panel
          header={<span className="font-medium">Hotel Description</span>}
          key="1"
        >
          <Paragraph>{hotel?.description}</Paragraph>
        </Panel>
      </Collapse>

      {/* Map Button */}
      {hotel?.latitude && hotel?.longitude && (
        <div className="mx-4 mb-4">
          <Button
            onClick={() => setShowMap(!showMap)}
            icon={<EnvironmentOutlined />}
            block
            style={{ height: "40px" }}
          >
            {showMap ? "Hide Map" : "View on Map"}
          </Button>
        </div>
      )}

      {/* Map */}
      {showMap && hotel?.latitude && hotel?.longitude && (
        <Card className="mx-4 mb-4 shadow-sm">
          <iframe
            width="100%"
            height="200"
            frameBorder="0"
            src={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&hl=en&output=embed`}
            allowFullScreen
          />
        </Card>
      )}

      {/* Room List */}
      <div className="px-4 mb-4">
        <Title level={4}>Available Rooms</Title>
        <List
          itemLayout="horizontal"
          dataSource={rooms}
          renderItem={(room) => (
            <List.Item className="p-0 mb-4">
              <Card
                className={`w-full ${
                  isSelected(room.id)
                    ? "border-2 border-blue-500"
                    : "border border-gray-200"
                }`}
                bodyStyle={{ padding: "12px" }}
                hoverable
              >
                <div className="flex flex-col">
                  {/* Room Image & Basic Info */}
                  <div className="relative mb-2">
                    <img
                      alt={room.type}
                      src={
                        room.images?.[0] ||
                        "https://via.placeholder.com/300x200"
                      }
                      className="w-full h-40 object-cover rounded"
                    />
                    {isSelected(room.id) && (
                      <Badge
                        count="Selected"
                        style={{ backgroundColor: "#1890ff" }}
                        className="absolute top-2 right-2"
                      />
                    )}
                  </div>

                  {/* Room Info */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Title level={5} style={{ margin: 0 }}>
                        {room.type}
                      </Title>
                      <Text strong className="text-lg">
                        {room.price} Tk
                      </Text>
                    </div>

                    <div className="flex justify-between mb-3">
                      <Text type="secondary">
                        <UserOutlined className="mr-1" />
                        {room.capacity} adults, {room.child} children
                      </Text>
                      <div>
                        <span className="text-xs font-bold">Room Available: </span>
                        {room?.roomQty}
                      </div>

                    </div>

                  </div>
                </div>
                <div className="flex items-center flex-wrap mt-3 gap-4 mb-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center">
                    <Text strong className="text-xs mr-1 whitespace-nowrap">
                      Qty:
                    </Text>
                    <div className="flex items-center border rounded">
                      <Button
                        type="text"
                        size="small"
                        className="!px-2 !h-6 !min-w-0"
                        onClick={() =>
                          handleQuantityChange(
                            room.id,
                            (roomQuantities[room.id] || 1) - 1
                          )
                        }
                        disabled={(roomQuantities[room.id] || 1) <= 1}
                      >
                        -
                      </Button>
                      <span className="text-xs w-6 text-center">
                        {roomQuantities[room.id] || 1}
                      </span>
                      <Button
                        type="text"
                        size="small"
                        className="!px-2 !h-6 !min-w-0"
                        onClick={() =>
                          handleQuantityChange(
                            room.id,
                            (roomQuantities[room.id] || 1) + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Adults Selector */}
                  <div className="flex items-center">
                    <Text strong className="text-xs mr-1 whitespace-nowrap">
                      Adults:
                    </Text>
                    <div className="flex items-center border rounded">
                      <Button
                        type="text"
                        size="small"
                        className="!px-2 !h-6 !min-w-0"
                        onClick={() =>
                          handleAdultCountChange(
                            room.id,
                            (adultCounts[room.id] || 1) - 1
                          )
                        }
                        disabled={(adultCounts[room.id] || 1) <= 1}
                      >
                        -
                      </Button>
                      <span className="text-xs w-6 text-center">
                        {adultCounts[room.id] || 1}
                      </span>
                      <Button
                        type="text"
                        size="small"
                        className="!px-2 !h-6 !min-w-0"
                        onClick={() =>
                          handleAdultCountChange(
                            room.id,
                            (adultCounts[room.id] || 1) + 1
                          )
                        }
                        // disabled={(adultCounts[room.id] || 1) >= room.capacity}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Children Selector */}
                  <div className="flex items-center">
                    <Text strong className="text-xs mr-1 whitespace-nowrap">
                      Children:
                    </Text>
                    <div className="flex items-center border rounded">
                      <Button
                        type="text"
                        size="small"
                        className="!px-2 !h-6 !min-w-0"
                        onClick={() =>
                          handleChildCountChange(
                            room.id,
                            (childCounts[room.id] || 0) - 1
                          )
                        }
                        disabled={(childCounts[room.id] || 0) <= 0}
                      >
                        -
                      </Button>
                      <span className="text-xs w-6 text-center">
                        {childCounts[room.id] || 0}
                      </span>
                      <Button
                        type="text"
                        size="small"
                        className="!px-2 !h-6 !min-w-0"
                        onClick={() =>
                          handleChildCountChange(
                            room.id,
                            (childCounts[room.id] || 0) + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                                    {/* Action Buttons */}
                    <div className="flex justify-between">
                      <Button 
                        onClick={() => openRoomDetails(room)}
                        type="default"
                        icon={<InfoCircleOutlined />}
                      >
                        Details
                      </Button>
                      <Button
                        type={isSelected(room.id) ? "default" : "link"}
                        onClick={() => handleRoomToggle(room)}
                        disabled={!room.isAvailable}
                      >
                        {room.isAvailable 
                          ? (isSelected(room.id) ? "Deselect" : "Select Room") 
                          : "Unavailable"}
                      </Button>
                    </div>
              </Card>
            </List.Item>
          )}
        />
      </div>

      {/* Fixed Bottom Checkout Bar */}
      {selectedRooms.length > 0 && (
        //<Affix offsetBottom={0}>
        <div className="flex justify-center">
          <div className="flex justify-between items-center">
            {/* <div>
                <Text strong className="block">{selectedRooms.length} {selectedRooms.length === 1 ? 'room' : 'rooms'}</Text>
            </div> */}
            <Button
              // type="primary"
              size="large"
              onClick={handleCheckout}
              disabled={selectedRooms.length === 0}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Proceed to Checkout ({totalPrice} Tk)
            </Button>
          </div>
        </div>
        // </Affix>
      )}

      {/* Date Picker Drawer */}
      <Drawer
        title="Select Stay Dates"
        placement="bottom"
        height={380}
        onClose={() => setDatePickerVisible(false)}
        open={datePickerVisible}
      >
        <div className="px-2">
          <Space direction="vertical" size="large" className="w-full">
            <div>
              <Text strong className="block mb-2">
                Check-in:
              </Text>
              <DatePicker
                selected={checkInDate}
                onChange={(date) => handleDateChange(date, true)}
                minDate={startOfDay(new Date())}
                dateFormat="MMM d, yyyy"
                className="w-full p-3 border rounded"
                placeholderText="Select check-in date"
              />
            </div>
            <div>
              <Text strong className="block mb-2">
                Check-out:
              </Text>
              <DatePicker
                selected={checkOutDate}
                onChange={(date) => handleDateChange(date, false)}
                minDate={addDays(checkInDate, 1)}
                dateFormat="MMM d, yyyy"
                className="w-full p-3 border rounded"
                placeholderText="Select check-out date"
              />
            </div>
            <div className="text-center">
              <Text>
                <BellOutlined className="mr-1" />
                {nights} {nights === 1 ? "night" : "nights"} stay
              </Text>
            </div>
            <Button
              type="primary"
              block
              size="large"
              onClick={() => setDatePickerVisible(false)}
            >
              Confirm Dates
            </Button>
          </Space>
        </div>
      </Drawer>

      {/* Room Details Drawer */}
      <Drawer
        title={currentRoom?.type || "Room Details"}
        placement="bottom"
        height="70%"
        onClose={() => setRoomDetailsVisible(false)}
        open={roomDetailsVisible && currentRoom}
        className=""
      >
        {currentRoom && (
          <div>
            <img
              src={
                currentRoom.images?.[0] || "https://via.placeholder.com/300x200"
              }
              alt={currentRoom.type}
              className="w-full h-48 object-cover rounded mb-4"
            />

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <Text strong>Price per night:</Text>
                <Text>{currentRoom.price} Tk</Text>
              </div>
              <div className="flex justify-between mb-2">
                <Text strong>Capacity:</Text>
                <Text>
                  {currentRoom.capacity} adults, {currentRoom.child} children
                </Text>
              </div>
            </div>

            <Divider />

            {currentRoom.amenities && currentRoom.amenities.length > 0 && (
              <>
                <Title level={5}>Room Amenities</Title>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentRoom.amenities.map((amenity, index) => (
                    <Tag key={index} color="blue">
                      {amenity}
                    </Tag>
                  ))}
                </div>
              </>
            )}

            {currentRoom.description && (
              <>
                <Title level={5}>Description</Title>
                <Paragraph>{currentRoom.description}</Paragraph>
              </>
            )}

            <div className="mt-4">
              <Button
                type={isSelected(currentRoom.id) ? "default" : "primary"}
                onClick={() => {
                  handleRoomToggle(currentRoom);
                  setRoomDetailsVisible(false);
                }}
                block
                size="large"
                disabled={!currentRoom.isAvailable}
              >
                {currentRoom.isAvailable
                  ? isSelected(currentRoom.id)
                    ? "Deselect Room"
                    : "Select Room"
                  : "Room Unavailable"}
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default HotelDetails;
