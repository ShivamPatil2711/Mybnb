  const e = require("express");
  const home=require("../models/home");
    const mongoose=require("mongoose");
  exports.getLogin=(req,res,next)=>{
  res.render("host/login",{currentPage:"/login-page",isLoggedIn:req.isLoggedIn});
  }
  exports.postLogin = async (req, res, next) => {
  try {
    if (req.body.log === "in") {
      req.session.isLoggedIn = true;
      return res.redirect("/");
    } else {
      await new Promise((resolve, reject) => {
        req.session.destroy(err => {
          if (err) {
              console.log("Session destroy error:", err);
            reject(err);
          }
          else{
              console.log("Session destroyed successfully");
          resolve();
          }
            
        });
      });
      res.clearCookie('connect.sid');
      return res.redirect('/login-page');
    }
  } catch (err) {
    return res.status(500).send('Error destroying session');
  }
};
