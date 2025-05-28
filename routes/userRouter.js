// external module
const express= require("express");
const userrouter=express.Router();
const homesController=require("../controllers/storeController");
userrouter.get('/',homesController.getIndex) ;  
 userrouter.get('/bookings',homesController.getBooking ) ;  // ./ same folder // ../ means parent folder
userrouter.get('/favourite-list',homesController.getFavouritelist );
userrouter.get('/homes',homesController.getHomes) ;
userrouter.post("/favourites",homesController.postAddToFavourites );
userrouter.get("/homes/:homeId",homesController.getHomesDetails );// homeId is a variable ':' makes it a variable
userrouter.post("/deletefavourite/:homeId",homesController.postDeleteFavourites);

module.exports=userrouter;                   
                                 



