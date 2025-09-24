import { useEffect, useState } from "react";
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
  Affix,
  Tabs,
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
  UserOutlined,
  BellOutlined,
  HeartOutlined,
  ShareAltOutlined,
  PlusOutlined,
  MinusOutlined,
  CheckCircleFilled,
  WhatsAppOutlined,
  MessageOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

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
  const [checkRoomAvailability ] = useCheckRoomAvailabilityBookingMutation();
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [checkInDate, setCheckInDate] = useState(startOfDay(new Date()));
  const [checkOutDate, setCheckOutDate] = useState(
    addDays(startOfDay(new Date()), 1)
  );
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [roomDetailsVisible, setRoomDetailsVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [roomQuantities, setRoomQuantities] = useState({});
  const [adultCounts, setAdultCounts] = useState({});
  const [childCounts, setChildCounts] = useState({});
  const [activeTab, setActiveTab] = useState("rooms");

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
        initialAdultCounts[room.id] = 0;
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
        quantity: roomQuantities[room.id] || 1,
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
            children: childCounts[room.id] || 0,
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

  const recalculateRoomCapacity = (roomId, customAdults, customChildren) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    console.log(room)
    const currentAdults = customAdults ?? adultCounts[roomId] ?? 0;
    const currentChildren = customChildren ?? childCounts[roomId] ?? 0;
    const currentQuantity = roomQuantities[roomId] ?? 1;

    const totalGuests = currentAdults + currentChildren;
    const maxGuestsPerRoom = room.capacity + room.child;

    const neededQuantity = Math.ceil(totalGuests / maxGuestsPerRoom);

     if (neededQuantity !== currentQuantity) {
    setRoomQuantities((prev) => ({
      ...prev,
      [roomId]: neededQuantity,
    }));
  }
  };

  const handleQuantityChange = (roomId, value) => {
    setRoomQuantities((prev) => ({
      ...prev,
      [roomId]: Math.max(1, value),
    }));
  };

  const handleAdultCountChange = (roomId, value) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    const newAdultCount = Math.max(0, value);

    setAdultCounts((prev) => ({
      ...prev,
      [roomId]: newAdultCount,
    }));

    const currentChildren = childCounts[roomId] ?? 0;
    recalculateRoomCapacity(roomId, newAdultCount, currentChildren);
  };

  const handleChildCountChange = (roomId, value) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    const newChildCount = Math.max(0, value);
    const currentAdults = adultCounts[roomId] ?? 0;

    setChildCounts((prev) => ({
      ...prev,
      [roomId]: newChildCount,
    }));

    recalculateRoomCapacity(roomId, currentAdults, newChildCount);
  };

  const totalPrice = selectedRooms.reduce(
    (sum, room) => sum + room.price * nights * room.quantity,
    0
  );

  const handleCheckout = () => {
    dispatch(
      setBookingDetails({
        selectedRooms,
        checkInDate: formatToUTC(checkInDate),
        checkOutDate: formatToUTC(checkOutDate),
        totalPrice,
        nights,
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

  return (
    <>
    <div className="pb-24">
      {/* Top Bar - Fixed */}
      <div className="sticky top-0 z-20 bg-white p-4 shadow-sm flex justify-between items-center">
        <Link to="/">
          <Button
            type="text"
            icon={<LeftCircleFilled />}
            className="flex items-center"
          >
            <span className="ml-1">Back</span>
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button type="text" icon={<HeartOutlined />} />
          <Button type="text" icon={<ShareAltOutlined />} />
        </div>
      </div>

      {/* Main Gallery */}
      <RoomGallery rooms={rooms} />

      {/* Hotel Name & Location */}
      <div className="px-4 py-3">
        <Title level={3} style={{ margin: "0 0 4px 0" }}>
          {hotel?.name}
        </Title>
        <div className="flex items-center text-gray-600 mt-2">
          <EnvironmentOutlined />
          <Text className="ml-1">{hotel?.location}</Text>
        </div>

        {/* Amenities Button */}
        {/* <Button 
          type="default" 
          className="mt-3" 
          onClick={() => setShowAmenities(true)}
        >
          View Amenities
        </Button> */}
      </div>

      {/* Amenities Drawer */}

      <SliderAminities amenities={hotel?.amenities || []} />

      <div className="mt-4">
        <Title level={5}>Need Help?</Title>
        <div className="flex gap-3 mb-4">
          <a
            href="https://wa.me/123456789"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              type="primary"
              icon={<WhatsAppOutlined />}
              className="bg-green-500 hover:bg-green-600"
              block
            >
              WhatsApp
            </Button>
          </a>
          <a
            href="http://m.me/hotelname"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              type="primary"
              icon={<MessageOutlined />}
              className="bg-blue-500 hover:bg-blue-600"
              block
            >
              Messenger
            </Button>
          </a>
        </div>
      </div>

      {/* Date Selection */}
      <Card
        className="mx-4 mb-4 shadow-sm"
        onClick={() => setDatePickerVisible(true)}
      >
        <div className="flex justify-between items-center">
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
          <Button
            className="text-white"
            type="primary"
            shape="round"
            size="small"
          >
            Change
          </Button>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-10 bg-white">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          centered
          size="large"
          className="px-2"
        >
          <TabPane tab="Rooms" key="rooms" />
          <TabPane tab="Map" key="map" />
        </Tabs>
      </div>

      {/* Content based on active tab */}
      <div className="mt-5 flex flex-col lg:flex-row items-center gap-4">
      <div className="lg:w-[70%] w-full">
          {activeTab === "rooms" && (
          <div className="">
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              dataSource={rooms}
              renderItem={(room) => (
                <List.Item className="!h-full">
                  <Card
                    className={`w-full h-full ${
                      isSelected(room.id)
                        ? "border-2 border-blue-500"
                        : "border border-gray-200"
                    }`}
                    bodyStyle={{
                      padding: "12px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                    hoverable
                  >
                    <div className="flex flex-col flex-1">
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
                            count={
                              <CheckCircleFilled
                                style={{
                                  fontSize: "22px",
                                  color: "#1890ff",
                                }}
                              />
                            }
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

                        <div className="flex justify-between mb-2">
                          <Text type="secondary">
                            <UserOutlined className="mr-1" />
                            {room.capacity} adults, {room.child} children
                          </Text>
                          <div>
                            <span className="text-xs font-medium">
                              Available:{" "}
                            </span>
                            <span className="text-xs font-bold">
                              {room?.roomQty}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center flex-wrap lg:flex-nowrap gap-y-2 mb-3">
                          {room.amenities?.slice(0, 2).map((amenity, index) => (
                            <Tag key={index} color="cyan" className="text-xs">
                              {amenity}
                            </Tag>
                          ))}
                          {room.amenities?.length > 3 && (
                            <Tag color="default" className="text-xs">
                              +{room.amenities.length - 3} more
                            </Tag>
                          )}
                        </div>
                      </div>

                      {/* Counter Controls */}
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {/* Quantity */}
                        <div className="flex flex-col">
                          <Text strong className="text-xs mb-1">
                            Rooms
                          </Text>
                          <div className="flex items-center justify-between border rounded p-1">
                            <Button
                              type="text"
                              size="small"
                              icon={<MinusOutlined />}
                              className="flex items-center justify-center !h-7 !min-w-0"
                              onClick={() =>
                                handleQuantityChange(
                                  room.id,
                                  (roomQuantities[room.id] || 1) - 1
                                )
                              }
                              disabled={(roomQuantities[room.id] || 1) <= 1 || isSelected(room.id)}
                            />
                            <span className="text-xs font-medium">
                              {roomQuantities[room.id] || 1}
                            </span>
                            <Button
                              type="text"
                              size="small"
                              icon={<PlusOutlined />}
                              className="flex items-center justify-center !h-7 !min-w-0"
                              onClick={() =>
                                handleQuantityChange(
                                  room.id,
                                  (roomQuantities[room.id] || 1) + 1
                                )
                              }
                              disabled={(roomQuantities[room.id] || 1) >= room?.roomQty || isSelected(room.id)}
                            />
                          </div>
                        </div>

                        {/* Adults */}
                        <div className="flex flex-col">
                          <Text strong className="text-xs mb-1">
                            Adults
                          </Text>
                          <div className="flex items-center justify-between border rounded p-1">
                            <Button
                              type="text"
                              size="small"
                              icon={<MinusOutlined />}
                              className="flex items-center justify-center !h-7 !min-w-0"
                              onClick={() => {
                                const current = adultCounts[room.id] ?? 0;
                                handleAdultCountChange(room.id, current - 1);
                              }}
                              disabled={(adultCounts[room.id] ?? 0) <= 0 || isSelected(room.id)}
                            />

                            <span className="text-xs font-medium">
                              {adultCounts[room.id] ?? 0}
                            </span>

                            <Button
                              type="text"
                              size="small"
                              icon={<PlusOutlined />}
                              className="flex items-center justify-center !h-7 !min-w-0"
                              onClick={() => {
                                const current = adultCounts[room.id] ?? 0;
                                handleAdultCountChange(room.id, current + 1);
                              }}
                              disabled={(room?.capacity + room?.child) * room?.roomQty <= (adultCounts[room.id] + childCounts[room.id] )  || isSelected(room.id)}
                            />
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex flex-col">
                          <Text strong className="text-xs mb-1">
                            Children
                          </Text>
                          <div className="flex items-center justify-between border rounded p-1">
                            <Button
                              type="text"
                              size="small"
                              icon={<MinusOutlined />}
                              className="flex items-center justify-center !h-7 !min-w-0"
                              onClick={() => {
                                const current = childCounts[room.id] ?? 0;
                                handleChildCountChange(room.id, current - 1);
                              }}
                              disabled={(childCounts[room.id] ?? 0) <= 0 || isSelected(room.id)}
                            />
                            <span className="text-xs font-medium">
                              {childCounts[room.id] ?? 0}
                            </span>
                            <Button
                              type="text"
                              size="small"
                              icon={<PlusOutlined />}
                              className="flex items-center justify-center !h-7 !min-w-0"
                              onClick={() => {
                                const current = childCounts[room.id] ?? 0;
                                handleChildCountChange(room.id, current + 1);
                              }}
                             disabled={(room?.capacity + room?.child) * room?.roomQty <= (adultCounts[room.id] + childCounts[room.id] )   || isSelected(room.id)}

                        

                            />
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-between gap-2">
                        <Button
                          onClick={() => openRoomDetails(room)}
                          type="default"
                          className="flex-1"
                        >
                          Details
                        </Button>
                        <Button
                          // type={isSelected(room.id) ? "default" : "primary"}
                          onClick={() => handleRoomToggle(room)}
                          disabled={!room.isAvailable}
                          className="flex-1 text-black"
                        >
                          {isSelected(room.id) ? "Deselect" : "Select"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </div>
        )}

        {activeTab === "map" && (
          <div className="mb-4">
            <Title level={4} style={{ marginBottom: "12px" }}>
              Location
            </Title>
            {hotel?.latitude && hotel?.longitude ? (
              <Card className="mb-4 shadow-sm">
                <iframe
                  title="Hotel Location"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  style={{ borderRadius: "8px" }}
                  src={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&hl=en&output=embed`}
                  allowFullScreen
                />
                <div className="mt-3">
                  <Text strong>Address:</Text>
                  <Paragraph className="mb-0 mt-1">{hotel.location}</Paragraph>
                </div>
              </Card>
            ) : (
              <Text>Location information not available</Text>
            )}
          </div>
        )}
      </div>

      <div className="lg:w-[30%] w-full">
    
      {selectedRooms.length > 0 ? (
        <Affix >
<div className="bg-gradient-to-br from-white to-blue-50 shadow-lg border border-gray-100 p-6 rounded-xl w-full">
  <div className="text-center mb-6">
    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Booking Summary
    </h1>
    <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2 rounded-full"></div>
  </div>

  <div className="space-y-4 mb-6">
    {/* Total Price */}
    <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
      <span className="text-gray-600 font-medium">Total Amount</span>
      <span className="text-2xl font-bold text-blue-600">{totalPrice} Tk/-</span>
    </div>

    {/* Stay Duration */}
    <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
      <CalendarOutlined className="text-blue-500" />
      <span className="text-gray-700 font-medium">
        {nights} {nights === 1 ? "Night" : "Nights"} Stay
      </span>
    </div>

    {/* Room Breakdown */}
    <div className="bg-white rounded-lg border border-gray-100 p-4">
      <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <HomeOutlined className="text-green-500" />
        Selected Rooms
      </h3>
      <div className="space-y-2">
        {selectedRooms.map((room) => (
          <div key={room.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-b-0">
            <div>
              <span className="font-medium text-gray-800">{room.type}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({room.adults} adults, {room.children} children)
              </span>
            </div>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-semibold">
              {room.quantity} {room.quantity === 1 ? "room" : "rooms"}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Checkout Button */}
  <Button
    type="primary"
    size="large"
    onClick={handleCheckout}
    className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-none shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
    icon={<ShoppingCartOutlined />}
  >
    <span className="text-white font-semibold text-lg">Proceed to Checkout</span>
  </Button>

  {/* Additional Info */}
  <div className="mt-4 text-center">
    <Text type="secondary" className="text-xs flex items-center justify-center gap-1">
      <SafetyCertificateOutlined className="text-green-500" />
      Secure booking • Free cancellation • Best price guaranteed
    </Text>
  </div>
</div>
        </Affix>
      ) : (
        <div className="bg-white shadow-md border-t p-3 flex flex-col justify-center items-center w-full gap-2 rounded-lg">
          <Text className="text-gray-500 font-bold text-lg">No rooms selected</Text>
        </div>
      )
      }
      </div>

      </div>



      {/* Date Picker Drawer */}
      <Drawer
        title="Select Stay Dates"
        placement="bottom"
        height={400}
        onClose={() => setDatePickerVisible(false)}
        open={datePickerVisible}
        bodyStyle={{ padding: "16px" }}
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
                className="w-full p-3 border rounded-lg"
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
                className="w-full p-3 border rounded-lg"
                placeholderText="Select check-out date"
              />
            </div>
            <div className="text-center mt-2">
              <Tag color="blue" style={{ padding: "4px 8px" }}>
                <BellOutlined className="mr-1" />
                {nights} {nights === 1 ? "night" : "nights"} stay
              </Tag>
            </div>
            <Button
              type="primary"
              block
              size="large"
              onClick={() => setDatePickerVisible(false)}
              className="h-12 mt-2"
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
        height="80%"
        onClose={() => setRoomDetailsVisible(false)}
        open={roomDetailsVisible && currentRoom}
        bodyStyle={{ padding: "16px" }}
      >
        {currentRoom && (
          <div>
            <img
              src={
                currentRoom.images?.[0] || "https://via.placeholder.com/300x200"
              }
              alt={currentRoom.type}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <div className="flex justify-between items-center mb-4">
              <Title level={4} style={{ margin: 0 }}>
                Price Details
              </Title>
              <Text strong className="text-xl">
                {currentRoom.price} Tk
              </Text>
            </div>

            <div className="mb-4">
              <Card className="mb-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Text type="secondary">Room Type</Text>
                    <div className="font-medium">{currentRoom.type}</div>
                  </div>
                  <div>
                    <Text type="secondary">Capacity</Text>
                    <div className="font-medium">
                      {currentRoom.capacity} Adults, {currentRoom.child}{" "}
                      Children
                    </div>
                  </div>
                </div>
              </Card>

              {/* Contact Options */}
              <Title level={5}>Need Help?</Title>
              <div className="flex gap-3 mb-4">
                <a
                  href="https://wa.me/123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    type="primary"
                    icon={<WhatsAppOutlined />}
                    className="bg-green-500 hover:bg-green-600"
                    block
                  >
                    WhatsApp
                  </Button>
                </a>
                <a
                  href="http://m.me/hotelname"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button
                    type="primary"
                    icon={<MessageOutlined />}
                    className="bg-blue-500 hover:bg-blue-600"
                    block
                  >
                    Messenger
                  </Button>
                </a>
              </div>

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

              <div className="mt-6">
                <Button
                  type={isSelected(currentRoom.id) ? "default" : "primary"}
                  onClick={() => {
                    handleRoomToggle(currentRoom);
                    setRoomDetailsVisible(false);
                  }}
                  block
                  size="large"
                  className="h-12 !bg-white"
                  disabled={!currentRoom.isAvailable}
                >
                  {isSelected(currentRoom.id)
                    ? "Deselect Room"
                    : "Select This Room"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
    
    </>

  );
};

export default HotelDetails;
