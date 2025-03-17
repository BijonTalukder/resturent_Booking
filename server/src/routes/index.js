const express = require('express');
const { PrismaClient } = require('@prisma/client');
const UserController = require('../controllers/userController');
const UserService = require('../services/User/userService');
const AuthService = require('../services/Authentication/AuthService');
const AuthController = require('../controllers/AuthController');
const BcryptHasher = require('../utility/BcryptPasswordHasher');
const HotelService = require('../services/Hotel/HotelService');
const HotelController = require('../controllers/hotelController');


const router = express.Router();

const prisma = new PrismaClient();
const userService = new UserService(prisma)
const userController= new UserController(userService)
const hasher = new BcryptHasher()
const authService = new AuthService(prisma,hasher);
const authController = new AuthController(authService)
const hotelService = new HotelService(prisma);
const hotelController = new HotelController(hotelService);


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

module.exports = router;
