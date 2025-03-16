const express = require('express');
const { PrismaClient } = require('@prisma/client');
const UserController = require('../controllers/userController');
const UserService = require('../services/User/userService');


const router = express.Router();

const prisma = new PrismaClient();
const userService = new UserService(prisma)
const userController= new UserController(userService)
router.post("/user/register",async(req,res,next)=>{
    userController.createUser(req,res,next)

})

router.post("/user/login",async(req,res,next)=>{
    userController.login(req,res,next)
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


module.exports = router;
