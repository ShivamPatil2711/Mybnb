const express= require("express");
const path=require("path");
const app=express();
const session=require("express-session");
const mongoDbStore=require("connect-mongodb-session")(session);
const mongodbURL="mongodb://127.0.0.1:27017/MyHomes"
const store=new mongoDbStore({
  url:mongodbURL,
  collection:"sessions"
});
//      'property'    'value'//
app.set('view engine','ejs');
app.set("views","views");
const mongoose=require("mongoose");
const errors=require("./controllers/errors");
const userrouter=require("./routes/userRouter");
const {hostrouter}=require("./routes/hostRouter");
const rootDir=require("./utils/pathutil");
const authrouter = require("./routes/authrouter");
const cookieParser=require("cookie-parser");
const constants = require("constants");
app.use(express.static(path.join(rootDir,"public")));
app.use(express.urlencoded({extended:true}));// body parsing( user data)
app.use(cookieParser());
app.use(session({
secret:"Shivam Ptil",// for encrypting data
resave:false,
saveUninitialized:true,
store:store
}))
app.use((req,res,next)=>{
 // req.isLoggedIn=req.cookies.isLoggedIn==="true"? true:false; // cookie data always in string 
   req.isLoggedIn=req.session.isLoggedIn===true? true:false; // cookie data always in string 
  next();
})
app.use(authrouter);
app.use(userrouter);
app.use('/host',(req,res,next)=>{
  if(req.isLoggedIn){
    next();
  }
  else{
  res.redirect("/login-page");
  }
})
app.use('/host',hostrouter);// '/hostxxxxxxxx'
app.use(errors.error404);// page not found
const DB_PATH="mongodb://127.0.0.1:27017/MyHomes";
mongoose.connect(DB_PATH).then(()=>{
  console.log("Connected to Mongo");
  app.listen(4000,()=>{
    console.log("server running on http://localhost:4000");// ise port pe website run ho raha he
  })
})
.catch((err)=>{
console.log("ERORR OCURRED",err);
})
