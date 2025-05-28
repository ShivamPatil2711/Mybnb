 const fs=require("fs");
 const path=require("path");
 const rootdir=require("../utils/pathutil");
 const filepath=path.join(rootdir,"data","favourite.json");
 const mongoose=require("mongoose");
 const favouriteSchema=mongoose.Schema({
  favid:{type:mongoose.Schema.Types.ObjectId,required:true}
 });
module.exports=mongoose.model("Favourites",favouriteSchema);