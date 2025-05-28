const path=require("path");
const express= require("express");
const rootDir=require("../utils/pathutil");
const homesController=require("../controllers/hostController");
const hostrouter=express.Router();
hostrouter.get('/airbnb-home',homesController.getAddHome);
hostrouter.post('/airbnb-home',homesController.postAddHome);
hostrouter.get('/host-homes',homesController.getHostHome);
hostrouter.post('/edithome',homesController.postEditHome);
hostrouter.get('/edithome/:homeId',homesController.getEditHome);
hostrouter.post('/deletehome/:homeId',homesController.deleteHome);

exports.hostrouter=hostrouter;

