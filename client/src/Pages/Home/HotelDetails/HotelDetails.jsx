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
  EyeOutlined,
  CloseOutlined,
  CheckOutlined,
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
  const [checkRoomAvailability] = useCheckRoomAvailabilityBookingMutation();
  const [checkingAvailability, setCheckingAvailability] = useState({});
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
      // Set loading state for this specific room
      setCheckingAvailability((prev) => ({ ...prev, [room.id]: true }));

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
    } finally {
      // Clear loading state for this room
      setCheckingAvailability((prev) => ({ ...prev, [room.id]: false }));
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

  const getEffectivePrice = (room) => {
    if (!room.discount) return room.price;
    if (room.discountType === "flat") {
      return Math.max(0, room.price - room.discount);
    }
    return Math.round(room.price - (room.price * room.discount) / 100);
  };

  const totalPrice = selectedRooms.reduce(
    (sum, room) => sum + getEffectivePrice(room) * nights * room.quantity,
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
      <div className="pb-24 bg-[#eef0f4]">
        {/* Top Bar - Fixed */}
        <div className="sticky top-0 z-20 bg-[#eef0f4] p-4 shadow-neu-sm flex justify-between items-center">
          <Link to="/">
            <Button
              type="text"
              icon={<LeftCircleFilled />}
              className="flex items-center !text-[#6b7588]"
            >
              <span className="ml-1">Back</span>
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button type="text" icon={<HeartOutlined />} className="!text-[#6b7588]" />
            <Button type="text" icon={<ShareAltOutlined />} className="!text-[#6b7588]" />
          </div>
        </div>

        {/* Main Gallery */}
        <RoomGallery rooms={rooms} />

        {/* Hotel Name & Location */}
        <div className="px-4 py-3">
          <div className="neu-card p-4">
            <Title level={3} style={{ margin: "0 0 4px 0", color: "#373b43" }}>
              {hotel?.name}
            </Title>
            <div className="flex items-center text-[#6b7588] mt-2">
              <EnvironmentOutlined className="text-primary" />
              <Text className="ml-1 text-[#6b7588]">{hotel?.location}</Text>
            </div>
          </div>
        </div>

        <div className="px-4 mb-4">
          <div className="neu-card p-4">
            <Title level={4} style={{ margin: 0, color: "#373b43" }}>
              Hotel Description
            </Title>
            <Text className="text-base text-[#6b7588] mt-2 block">
              {hotel?.description}
            </Text>
          </div>
        </div>

        {/* Amenities Drawer */}
        <div className="px-4">
          <SliderAminities amenities={hotel?.amenities || []} />
        </div>

        <div className="px-4 mt-4">
          <div className="neu-card p-4">
            <Title level={5} className="!text-[#373b43]">Need Help?</Title>
            <div className="flex gap-3">
              <a
                href="https://wa.me/123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button
                  type="primary"
                  icon={<WhatsAppOutlined />}
                  className="!bg-[#25D366] !border-0 !shadow-neu-sm !rounded-xl"
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
                  className="!bg-[#0084FF] !border-0 !shadow-neu-sm !rounded-xl"
                  block
                >
                  Messenger
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="px-4 mt-4">
          <div
            className="neu-card p-4 cursor-pointer"
            onClick={() => setDatePickerVisible(true)}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center mb-1">
                  <CalendarOutlined className="mr-2 text-primary" />
                  <Text strong className="!text-[#373b43]">Your Stay</Text>
                </div>
                <Text className="!text-[#6b7588]">
                  {formatDate(checkInDate)} - {formatDate(checkOutDate)}
                </Text>
                <div className="mt-1">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-xl bg-[#FD3D57] text-white">
                    {nights} {nights === 1 ? "night" : "nights"}
                  </span>
                </div>
              </div>
              <button className="neu-btn-primary px-4 py-1.5 text-sm rounded-xl">
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-16 z-10 bg-[#eef0f4] shadow-neu-xs mx-4 my-4 rounded-xl">
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
        <div className="mt-5 flex flex-col lg:flex-row gap-4 px-4">
          <div className="w-full lg:w-[65%]">
            {activeTab === "rooms" && (
              <div className="">
                <List
                  grid={{
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 1,
                    xl: 1,
                    xxl: 1,
                  }}
                  dataSource={rooms}
                  renderItem={(room) => (
                    <List.Item className="!h-full !border-0">
                      <div
                        className={`w-full h-full transition-all duration-300 neu-card p-5 ${isSelected(room.id)
                          ? "ring-2 ring-primary shadow-neu-colored"
                          : ""
                          }`}
                      >
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Room Image */}
                          <div className="flex-shrink-0 relative w-full lg:w-64">
                            <div className="neu-sm p-1 rounded-xl">
                              <img
                                alt={room.type}
                                src={
                                  room.images?.[0] ||
                                  "https://via.placeholder.com/300x200"
                                }
                                className="w-full h-48 lg:h-[240px] object-cover rounded-[10px]"
                              />
                            </div>
                            {isSelected(room.id) && (
                              <div className="absolute top-3 right-3">
                                <Badge
                                  count={
                                    <CheckCircleFilled
                                      style={{
                                        fontSize: "24px",
                                        color: "#FD3D57",
                                      }}
                                    />
                                  }
                                />
                              </div>
                            )}
                            {!room.isAvailable && (
                              <div className="absolute inset-0 bg-[#373b43] bg-opacity-70 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                  Not Available
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Room Content */}
                          <div className="flex-1 flex flex-col">
                            {/* Header Section */}
                            <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                              <div className="flex-1 min-w-0">
                                <Title
                                  level={4}
                                  style={{ margin: 0, color: "#373b43" }}
                                  className="flex items-center gap-2 truncate"
                                >
                                  {room.type}
                                  {room.isAvailable && (
                                    <span className="neu-xs px-2 py-0.5 text-xs text-green-600 font-medium">
                                      Available
                                    </span>
                                  )}
                                </Title>
                                <Text
                                  className="!text-[#6b7588] flex items-center gap-1 mt-1 text-sm"
                                >
                                  <UserOutlined />
                                  Capacity: {room.capacity} adults, {room.child} children
                                </Text>
                              </div>
                              <div className="text-right sm:text-left">
                                {room.discount ? (
                                  <div className="flex items-center gap-2 justify-end">
                                    <Text delete className="text-lg !text-[#6b7588] whitespace-nowrap">
                                      {room.price} Tk
                                    </Text>
                                    <Text strong className="text-2xl !text-primary whitespace-nowrap">
                                      {getEffectivePrice(room)} Tk
                                    </Text>
                                    <span className="neu-xs px-1.5 py-0.5 text-xs text-red-500 font-medium">
                                      {room.discountType === "flat" ? `-${room.discount}Tk` : `-${room.discount}%`}
                                    </span>
                                  </div>
                                ) : (
                                  <Text strong className="text-2xl !text-primary whitespace-nowrap">
                                    {room.price} Tk
                                  </Text>
                                )}
                                <div className="text-xs text-[#6b7588] mt-1">
                                  <span className="font-medium">
                                    Available:{" "}
                                  </span>
                                  <span className="font-bold">
                                    {room?.roomQty} rooms
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-4">
                              <Text strong className="!text-[#484f5c] mb-2 block text-sm">
                                Amenities:
                              </Text>
                              <div className="flex flex-wrap gap-2">
                                {room.amenities
                                  ?.slice(0, 4)
                                  .map((amenity, index) => (
                                    <span
                                      key={index}
                                      className="neu-xs px-3 py-1 text-xs text-[#6b7588]"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                {room.amenities?.length > 4 && (
                                  <span className="neu-xs px-3 py-1 text-xs text-[#6b7588]">
                                    +{room.amenities.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Controls Section */}
                            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-auto">
                              {/* Counter Controls */}
                              <div className="flex justify-between lg:justify-start lg:gap-4 w-full lg:w-auto">

                                {/* Quantity */}
                                <div className="flex flex-col flex-1 lg:flex-none">
                                  <Text
                                    strong
                                    className="text-xs mb-1 !text-[#484f5c] text-center lg:text-left"
                                  >
                                    Rooms
                                  </Text>
                                  <div className="neu-inset-sm flex items-center rounded-xl gap-0 p-1">
                                    <button
                                      className="neu-btn w-7 h-7 flex items-center justify-center !rounded-lg !p-0 text-[#6b7588] text-sm"
                                      onClick={() =>
                                        handleQuantityChange(
                                          room.id,
                                          (roomQuantities[room.id] || 1) - 1
                                        )
                                      }
                                      disabled={
                                        (roomQuantities[room.id] || 1) <= 1 ||
                                        isSelected(room.id)
                                      }
                                    >
                                      <MinusOutlined />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-[#373b43] text-sm">
                                      {roomQuantities[room.id] || 1}
                                    </span>
                                    <button
                                      className="neu-btn w-7 h-7 flex items-center justify-center !rounded-lg !p-0 text-[#6b7588] text-sm"
                                      onClick={() =>
                                        handleQuantityChange(
                                          room.id,
                                          (roomQuantities[room.id] || 1) + 1
                                        )
                                      }
                                      disabled={
                                        (roomQuantities[room.id] || 1) >=
                                        room?.roomQty || isSelected(room.id)
                                      }
                                    >
                                      <PlusOutlined />
                                    </button>
                                  </div>
                                </div>

                                {/* Adults */}
                                <div className="flex flex-col flex-1 lg:flex-none">
                                  <Text
                                    strong
                                    className="text-xs mb-1 !text-[#484f5c] text-center lg:text-left"
                                  >
                                    Adults
                                  </Text>
                                  <div className="neu-inset-sm flex items-center rounded-xl gap-0 p-1">
                                    <button
                                      className="neu-btn w-7 h-7 flex items-center justify-center !rounded-lg !p-0 text-[#6b7588] text-sm"
                                      onClick={() => {
                                        const current =
                                          adultCounts[room.id] ?? 0;
                                        handleAdultCountChange(
                                          room.id,
                                          current - 1
                                        );
                                      }}
                                      disabled={
                                        (adultCounts[room.id] ?? 0) <= 1 ||
                                        isSelected(room.id)
                                      }
                                    >
                                      <MinusOutlined />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-[#373b43] text-sm">
                                      {adultCounts[room.id] ?? 0}
                                    </span>
                                    <button
                                      className="neu-btn w-7 h-7 flex items-center justify-center !rounded-lg !p-0 text-[#6b7588] text-sm"
                                      onClick={() => {
                                        const current =
                                          adultCounts[room.id] ?? 0;
                                        handleAdultCountChange(
                                          room.id,
                                          current + 1
                                        );
                                      }}
                                      disabled={
                                        (room?.capacity + room?.child) *
                                        room?.roomQty <=
                                        adultCounts[room.id] +
                                        childCounts[room.id] ||
                                        isSelected(room.id)
                                      }
                                    >
                                      <PlusOutlined />
                                    </button>
                                  </div>
                                </div>

                                {/* Children */}
                                <div className="flex flex-col flex-1 lg:flex-none">
                                  <Text
                                    strong
                                    className="text-xs mb-1 !text-[#484f5c] text-center lg:text-left"
                                  >
                                    Children
                                  </Text>
                                  <div className="neu-inset-sm flex items-center rounded-xl gap-0 p-1">
                                    <button
                                      className="neu-btn w-7 h-7 flex items-center justify-center !rounded-lg !p-0 text-[#6b7588] text-sm"
                                      onClick={() => {
                                        const current =
                                          childCounts[room.id] ?? 0;
                                        handleChildCountChange(
                                          room.id,
                                          current - 1
                                        );
                                      }}
                                      disabled={
                                        (childCounts[room.id] ?? 0) <= 0 ||
                                        isSelected(room.id)
                                      }
                                    >
                                      <MinusOutlined />
                                    </button>
                                    <span className="w-8 text-center font-semibold text-[#373b43] text-sm">
                                      {childCounts[room.id] ?? 0}
                                    </span>
                                    <button
                                      className="neu-btn w-7 h-7 flex items-center justify-center !rounded-lg !p-0 text-[#6b7588] text-sm"
                                      onClick={() => {
                                        const current =
                                          childCounts[room.id] ?? 0;
                                        handleChildCountChange(
                                          room.id,
                                          current + 1
                                        );
                                      }}
                                      disabled={
                                        (room?.capacity + room?.child) *
                                        room?.roomQty <=
                                        adultCounts[room.id] +
                                        childCounts[room.id] ||
                                        isSelected(room.id)
                                      }
                                    >
                                      <PlusOutlined />
                                    </button>
                                  </div>
                                </div>
                              </div>


                            </div>
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-[50%] mt-5 ml-auto flex-wrap">
                              <button
                                onClick={() => openRoomDetails(room)}
                                className="neu-btn flex-1 flex items-center justify-center gap-1 p-3 h-9 text-xs text-[#6b7588]"
                              >
                                <EyeOutlined className="text-sm" />
                                <span className="hidden sm:inline">
                                  View Details
                                </span>
                                <span className="sm:hidden">
                                  Details
                                </span>
                              </button>
                              <button
                                onClick={() => handleRoomToggle(room)}
                                disabled={
                                  !room.isAvailable ||
                                  checkingAvailability[room.id]
                                }
                                className={`flex-1 flex items-center justify-center gap-1 p-3 h-9 text-xs font-medium transition-all duration-200 rounded-xl ${isSelected(room.id)
                                  ? "neu-btn text-red-500"
                                  : "neu-btn-primary"
                                  }`}
                              >
                                {checkingAvailability[room.id] ? (
                                  "Checking..."
                                ) : (
                                  <>
                                    <span className="hidden sm:inline">
                                      {isSelected(room.id)
                                        ? "Deselect"
                                        : "Select Room"}
                                    </span>
                                    <span className="sm:hidden">
                                      {isSelected(room.id)
                                        ? "Remove"
                                        : "Select"}
                                    </span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            )}

            {activeTab === "map" && (
              <div className="mb-4">
                <div className="neu-card p-4">
                  <Title level={4} style={{ marginBottom: "12px", color: "#373b43" }}>
                    Location
                  </Title>
                  {hotel?.latitude && hotel?.longitude ? (
                    <div>
                      <div className="neu-inset-sm p-1 rounded-xl overflow-hidden">
                        <iframe
                          title="Hotel Location"
                          width="100%"
                          height="300"
                          frameBorder="0"
                          style={{ borderRadius: "10px" }}
                          src={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}&hl=en&output=embed`}
                          allowFullScreen
                        />
                      </div>
                      <div className="mt-3">
                        <Text strong className="!text-[#484f5c]">Address:</Text>
                        <Paragraph className="mb-0 mt-1 !text-[#6b7588]">
                          {hotel.location}
                        </Paragraph>
                      </div>
                    </div>
                  ) : (
                    <Text className="!text-[#6b7588]">Location information not available</Text>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-[35%]">
            {selectedRooms.length > 0 ? (
              <Affix offsetBottom={-310}>
                <div className="neu-card p-4 lg:p-6 w-full">
                  <div className="text-center mb-6">
                    <h1 className="text-base lg:text-2xl font-bold text-[#373b43]">
                      Booking Summary
                    </h1>
                    <div className="w-16 h-1 bg-primary mx-auto mt-2 rounded-full"></div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {/* Total Price */}
                    <div className="neu-sm p-3 flex justify-between items-center">
                      <span className="text-[#6b7588] font-medium">
                        Total Amount
                      </span>
                      <span className="text-base lg:text-2xl font-bold text-primary">
                        {totalPrice} Tk/-
                      </span>
                    </div>

                    {/* Stay Duration */}
                    <div className="neu-xs p-3 flex items-center justify-center gap-2">
                      <CalendarOutlined className="text-primary" />
                      <span className="text-[#484f5c] font-medium">
                        {nights} {nights === 1 ? "Night" : "Nights"} Stay
                      </span>
                    </div>

                    {/* Room Breakdown */}
                    <div className="neu-inset-sm p-4">
                      <h3 className="font-semibold text-[#484f5c] mb-3 flex items-center gap-2">
                        <HomeOutlined className="text-primary" />
                        Selected Rooms
                      </h3>
                      <div className="space-y-2">
                        {selectedRooms.map((room) => (
                          <div
                            key={room.id}
                            className="flex justify-between items-center py-2 border-b border-[#d1d5db] last:border-b-0"
                          >
                            <div>
                              <span className="font-medium text-[#373b43]">
                                {room.type}
                              </span>
                              <span className="text-xs text-[#6b7588] ml-2">
                                ({room.adults} adults, {room.children} children)
                              </span>
                            </div>
                            <span className="neu-xs px-3 py-1 text-sm font-semibold text-primary">
                              {room.quantity}{" "}
                              {room.quantity === 1 ? "room" : "rooms"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    className="neu-btn-primary w-full h-14 text-white font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02]"
                  >
                    <ShoppingCartOutlined />
                    <span>Proceed to Checkout</span>
                  </button>

                  {/* Additional Info */}
                  <div className="mt-4 text-center">
                    <Text
                      className="!text-[#6b7588] text-xs flex items-center justify-center gap-1"
                    >
                      <SafetyCertificateOutlined className="text-green-500" />
                      Secure booking • Free cancellation • Best price guaranteed
                    </Text>
                  </div>
                </div>
              </Affix>
            ) : (
              <div className="neu-card p-6 flex flex-col justify-center items-center w-full gap-2">
                <Text className="!text-[#6b7588] font-bold text-lg">
                  No rooms selected
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Date Picker Drawer */}
        <Drawer
          title={<span style={{ color: "#373b43", fontWeight: 600 }}>Select Stay Dates</span>}
          placement="bottom"
          height={400}
          onClose={() => setDatePickerVisible(false)}
          open={datePickerVisible}
          bodyStyle={{ padding: "16px", background: "#eef0f4" }}
          style={{ background: "#eef0f4" }}
        >
          <div className="px-2">
            <Space direction="vertical" size="large" className="w-full">
              <div>
                <Text strong className="block mb-2 !text-[#484f5c]">
                  Check-in:
                </Text>
                <div className="neu-inset-sm rounded-xl overflow-hidden">
                  <DatePicker
                    selected={checkInDate}
                    onChange={(date) => handleDateChange(date, true)}
                    minDate={startOfDay(new Date())}
                    dateFormat="MMM d, yyyy"
                    className="w-full p-3 !border-0 !bg-transparent"
                    placeholderText="Select check-in date"
                  />
                </div>
              </div>
              <div>
                <Text strong className="block mb-2 !text-[#484f5c]">
                  Check-out:
                </Text>
                <div className="neu-inset-sm rounded-xl overflow-hidden">
                  <DatePicker
                    selected={checkOutDate}
                    onChange={(date) => handleDateChange(date, false)}
                    minDate={addDays(checkInDate, 1)}
                    dateFormat="MMM d, yyyy"
                    className="w-full p-3 !border-0 !bg-transparent"
                    placeholderText="Select check-out date"
                  />
                </div>
              </div>
              <div className="text-center mt-2">
                <span className="neu-xs px-4 py-1.5 text-sm text-primary font-medium">
                  <BellOutlined className="mr-1" />
                  {nights} {nights === 1 ? "night" : "nights"} stay
                </span>
              </div>
              <button
                onClick={() => setDatePickerVisible(false)}
                className="neu-btn-primary w-full h-12 text-white font-semibold text-base rounded-xl"
              >
                Confirm Dates
              </button>
            </Space>
          </div>
        </Drawer>

        {/* Room Details Drawer */}
        <Drawer
          title={<span style={{ color: "#373b43", fontWeight: 600 }}>{currentRoom?.type || "Room Details"}</span>}
          placement="bottom"
          height="80%"
          onClose={() => setRoomDetailsVisible(false)}
          open={roomDetailsVisible && currentRoom}
          bodyStyle={{ padding: "16px", background: "#eef0f4" }}
          style={{ background: "#eef0f4" }}
        >
          {currentRoom && (
            <div>
              {currentRoom.images && currentRoom.images.length > 0 ? (
                <div className="mb-4">
                  <div className="neu-sm p-1 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-8 gap-2 overflow-x-auto">
                      {currentRoom.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "https://via.placeholder.com/300x200"}
                            alt={`${currentRoom.type} - Image ${index + 1}`}
                            className="w-64 h-48 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="absolute bottom-2 right-2 bg-[#373b43] bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                            {index + 1}/{currentRoom.images.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="neu-sm p-1 rounded-xl mb-4">
                  <img
                    src="https://via.placeholder.com/300x200"
                    alt={currentRoom.type}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="neu-card p-4 flex justify-between items-center mb-4">
                <Title level={4} style={{ margin: 0, color: "#373b43" }}>
                  Price Details
                </Title>
                {currentRoom.discount ? (
                  <div className="text-right">
                    <Text delete className="text-base !text-[#6b7588] block">
                      {currentRoom.price} Tk/night
                    </Text>
                    <Text strong className="text-xl !text-primary">
                      {getEffectivePrice(currentRoom)} Tk/night
                    </Text>
                    <span className="neu-xs ml-2 px-1.5 py-0.5 text-xs text-red-500 font-medium">
                      {currentRoom.discountType === "flat" ? `-${currentRoom.discount}Tk` : `-${currentRoom.discount}%`}
                    </span>
                  </div>
                ) : (
                  <Text strong className="text-xl !text-primary">
                    {currentRoom.price} Tk/night
                  </Text>
                )}
              </div>

              <div className="mb-4">
                <div className="neu-card p-4 mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Text className="!text-[#6b7588]">Room Type</Text>
                      <div className="font-medium text-[#373b43]">{currentRoom.type}</div>
                    </div>
                    <div>
                      <Text className="!text-[#6b7588]">Capacity</Text>
                      <div className="font-medium text-[#373b43]">
                        {currentRoom.capacity} Adults, {currentRoom.child}{" "}
                        Children
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Options */}
                <div className="neu-card p-4 mb-4">
                  <Title level={5} className="!text-[#373b43]">Need Help?</Title>
                  <div className="flex gap-3">
                    <a
                      href="https://wa.me/123456789"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <button className="w-full py-2.5 rounded-xl font-medium text-white text-sm bg-[#25D366] shadow-neu-sm">
                        <WhatsAppOutlined className="mr-1" />
                        WhatsApp
                      </button>
                    </a>
                    <a
                      href="http://m.me/hotelname"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <button className="w-full py-2.5 rounded-xl font-medium text-white text-sm bg-[#0084FF] shadow-neu-sm">
                        <MessageOutlined className="mr-1" />
                        Messenger
                      </button>
                    </a>
                  </div>
                </div>

                {currentRoom.amenities && currentRoom.amenities.length > 0 && (
                  <div className="neu-card p-4 mb-4">
                    <Title level={5} className="!text-[#373b43]">Room Amenities</Title>
                    <div className="flex flex-wrap gap-2">
                      {currentRoom.amenities.map((amenity, index) => (
                        <span key={index} className="neu-xs px-3 py-1 text-xs text-[#6b7588]">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {currentRoom.description && (
                  <div className="neu-card p-4 mb-4">
                    <Title level={5} className="!text-[#373b43]">Description</Title>
                    <Paragraph className="!text-[#6b7588]">{currentRoom.description}</Paragraph>
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={() => {
                      handleRoomToggle(currentRoom);
                      setRoomDetailsVisible(false);
                    }}
                    disabled={
                      !currentRoom.isAvailable ||
                      checkingAvailability[currentRoom.id]
                    }
                    className={`w-full h-12 rounded-xl font-semibold text-base transition-all duration-200 ${isSelected(currentRoom.id)
                      ? "neu-btn text-red-500"
                      : "neu-btn-primary"
                      }`}
                  >
                    {checkingAvailability[currentRoom.id]
                      ? "Checking Availability..."
                      : isSelected(currentRoom.id)
                        ? "Deselect Room"
                        : "Select This Room"}
                  </button>
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
