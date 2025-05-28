// external module
const express= require("express");
const authrouter=express.Router();
const authController=require("../controllers/authController");
authrouter.get("/login-page",authController.getLogin);
authrouter.post("/login-page",authController.postLogin);
module.exports=authrouter;                   
                                 



