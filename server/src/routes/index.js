const express = require('express');
const { PrismaClient } = require('@prisma/client');
const UserController = require('../controllers/userController');
const UserService = require('../services/User/userService');
const AuthService = require('../services/Authentication/AuthService');
const AuthController = require('../controllers/AuthController');
const BcryptHasher = require('../utility/BcryptPasswordHasher');
const HotelService = require('../services/Hotel/HotelService');
const HotelController = require('../controllers/hotelController');
const RoomController = require('../controllers/RoomController');
const RoomService = require('../services/Room/RoomService');
const BookingService = require('../services/Booking/BookingService');
const BookingController = require('../controllers/BookingController');
const SliderController = require('../controllers/sliderController');
const SliderService = require('../services/Slider/SliderService');
const NotificationService = require('../services/Notification/NotificationService');
const NotificationController = require('../controllers/notificationController');
const DivisionService = require('../services/Division/divisionService');
const DivisionController = require('../controllers/divisionController');
const DistrictService = require('../services/District/districtService');
const DistrictController = require('../controllers/districtController');
const divisionService = new DivisionService();
const divisionController = new DivisionController(divisionService);
const router = express.Router();

const prisma = new PrismaClient();
const userService = new UserService(prisma)
const userController= new UserController(userService)
const hasher = new BcryptHasher()
const authService = new AuthService(prisma,hasher);
const authController = new AuthController(authService)
const hotelService = new HotelService(prisma);
const hotelController = new HotelController(hotelService);
const roomService = new RoomService();
const roomController= new RoomController(roomService)
const bookingService = new BookingService();
const bookingController = new BookingController(bookingService);
const sliderService = new SliderService(prisma);
const notificationService = new NotificationService(prisma);

const notificationController = new NotificationController(notificationService)
const districtService = new DistrictService();
const districtController = new DistrictController(districtService); 

//-------------------User Routes-----------------------
router.post("/user/register",async(req,res,next)=>{
    userController.createUser(req,res,next)

})

router.post("/user/login",async(req,res,next)=>{
    authController.login(req,res,next)
})

router.get("/user",async(req,res,next)=>{
    userController.getAllUsers(req,res,next)
})
router.get("/user/:id",async(req,res,next)=>{
    userController.getSingleUser(req,res,next)
})
router.put("/user/:id",async(req,res,next)=>{
    userController.updateUser(req,res,next)
})
router.delete("/user/:id",async(req,res,next)=>{
    userController.deleteUser(req,res,next)
})

//-------------------Hotel Routes-----------------------
router.post("/hotel/create",async(req,res,next)=>{
    hotelController.createHotel(req,res,next)
})
router.get("/hotel",async(req,res,next)=>{
    hotelController.getAllHotels(req,res,next)
})
router.get("/hotel/:id",async(req,res,next)=>{
    hotelController.getSingleHotel(req,res,next)
})
router.put("/hotel/:id",async(req,res,next)=>{
    hotelController.updateHotel(req,res,next)
})
router.delete("/hotel/:id",async(req,res,next)=>{
    hotelController.deleteHotel(req,res,next)
})


router.get("/hotel/:divisionId/division",async(req,res,next)=>{
    hotelController.getHotelByDivision(req,res,next)
})
//-------------------Room Routes-----------------------
router.post("/room/create",async(req,res,next)=>{
    roomController.createRoom(req,res,next)
})
router.get("/room",async(req,res,next)=>{
    roomController.getAllRooms(req,res,next)
})
router.get("/room/:id",async(req,res,next)=>{
    roomController.getSingleRoom(req,res,next)
})
router.put("/room/:id",async(req,res,next)=>{
    roomController.updateRoom(req,res,next)
})
router.delete("/room/:id",async(req,res,next)=>{
    roomController.deleteRoom(req,res,next)
})
router.post("/room/checkAvailability",async(req,res,next)=>{
    roomController.checkAvailability(req,res,next)
})

router.get("/hotel/:hotelId/rooms",async(req,res,next)=>{
    roomController.getRoomsByHotel(req,res,next)
})

//-------------------Booking Routes-----------------------
router.post("/booking/create",async(req,res,next)=>{
    bookingController.createBooking(req,res,next)
})
router.get("/booking",async(req,res,next)=>{
    bookingController.getAllBookings(req,res,next)
})
router.get("/booking/:id",async(req,res,next)=>{
    bookingController.getSingleBooking(req,res,next)
})
router.put("/booking/:id",async(req,res,next)=>{
    bookingController.updateBooking(req,res,next)
})
router.delete("/booking/:id",async(req,res,next)=>{
    bookingController.deleteBooking(req,res,next)
})
router.post("/booking/check-availability",async(req,res,next)=>{
    bookingController.checkAvailability(req,res,next)
})

router.get("/booking/user/:userId",async(req,res,next)=>{
    bookingController.getBookingsByUser(req,res,next)
})


//slider routes
//[route("/sliders/create")]
router.post("/sliders/create", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.createSlider(req, res, next)
})
//[route("/sliders")]
router.get("/sliders", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.getSliders(req, res, next)
})
//[route("/sliders/{id}")]
router.get("/sliders/:id", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.getSliderById(req, res, next)
})
//[route("/sliders/{id}")]
router.put("/sliders/:id", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.updateSlider(req, res, next)
})
//[route("/sliders/{id}")]
router.delete("/sliders/:id", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.deleteSlider(req, res, next)
})

//-------------------Notification Routes-----------------------
//[route("/notification/create")]
router.post("/notification/create", (req, res, next) => {
    notificationController.createNotification(req, res, next)
}
)
//[route("/notification")]
router.get("/notification/:userId", (req, res, next) => {
    notificationController.getNotifications(req, res, next)
}
)
//[route("/notification/{id}")]
router.put("/notification/:id/read", (req, res, next) => {
    notificationController.markAsRead(req, res, next)
}
)

//division routes
router.post("/division/create", (req, res, next) => {
    divisionController.createDivision(req, res, next)
})
router.get("/division", (req, res, next) => {
    divisionController.getAllDivisions(req, res, next)
})
router.get("/division/:id", (req, res, next) => {
    divisionController.getDivisionById(req, res, next)
})
router.put("/division/:id", (req, res, next) => {
    divisionController.updateDivision(req, res, next)
})
router.delete("/division/:id", (req, res, next) => {
    divisionController.deleteDivision(req, res, next)
})
//District routes
router.post("/district/create", (req, res, next) => {
    districtController.createDistrict(req, res, next)
})
router.get("/district", (req, res, next) => {
    districtController.getAllDistricts(req, res, next)
    
})
router.get("/district/:id", (req, res, next) => {
    districtController.getDistrictById(req, res, next)
})
router.put("/district/:id", (req, res, next) => {
    districtController.updateDistrict(req, res, next)
})
router.delete("/district/:id", (req, res, next) => {
    districtController.deleteDistrict(req, res, next)
})


const axios = require("axios");

async function fetchAndSaveDistricts() {
    console.log("Fetching and saving districts...");
    
    try {
        console.log(1);
        
      // Step 1: Fetch division mapping
      const localDivisions = await axios.get("http://localhost:5000/api/v1/division");
      console.log(2, localDivisions);
      
      const divisionMap = {};
  
      if (Array.isArray(localDivisions.data?.data)) {
        for (const div of localDivisions.data.data) {
          divisionMap[div.serialId] = div._id; // external id -> Mongo _id
        }
      }
  
      // Step 2: Fetch districts from external API
      const { data } = await axios.get("https://bdapi.vercel.app/api/v.1/district");
  
      if (Array.isArray(data?.data)) {
        for (const district of data.data) {
          const divisionId = divisionMap[district.division_id]; // Get MongoDB _id
          if (!divisionId) {
            console.warn(`Division not found for district: ${district.name}`);
            continue;
          }
  
          // Step 3: Insert into your local DB
          await axios.post("http://localhost:5000/api/v1/district/create", {
            serialId: parseInt(district.id),
            name: district.name,
            bn_name: district.bn_name,
            division_id: district.division_id, // optional for reference
            divisionId: divisionId, // this is the actual MongoDB _id to join
          });
  
          console.log(`Saved district: ${district.name}`);
        }
  
        console.log("All districts saved.");
      } else {
        console.log("No districts found in response.");
      }
    } catch (err) {
      console.error("Error fetching or saving districts:", err);
    }
  }
  
// fetchAndSaveDistricts();


module.exports = router;
