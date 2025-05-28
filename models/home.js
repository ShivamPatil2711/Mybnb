const {ObjectId}=require("mongodb");
const mongoose=require("mongoose");
const homeSchema=mongoose.Schema({// Structure of the Table BLUEPRINT OF THE TABLE
housename:{type:String,required:true},
price:{type:Number , required:true},
location :{type:String ,required:true},
rate:{type:String ,required:true},
des:String
});
module.exports=mongoose.model("Home",homeSchema);// Class name Home + it acts as both class + table







