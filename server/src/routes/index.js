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




module.exports = router;
