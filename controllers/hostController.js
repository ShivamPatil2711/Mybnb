const e = require("express");
const home = require("../models/home");
const mongoose = require("mongoose");

exports.getAddHome = (req, res, next) => {
  res.render("host/editHome", {
    pagetitle: "addHome",
    editing: false,
    currentPage: "/host/airbnb-home",
    isLoggedIn:req.isLoggedIn
  });
};

exports.postAddHome = (req, res, next) => {
  const { housename, price, location, rate, des, password } = req.body;
  const newhome = new home({ housename, price, location, des, rate, password });
  newhome.save()
    .then(() => {
      console.log("Home added successfully");
      res.redirect("/host/host-homes");
    })
    .catch(() => {
      console.log("Error while adding");
      res.render("host/editHome", {
        editing: false,
        pagetitle: "addHome",
        currentPage: "/host/airbnb-home",
          isLoggedIn:req.isLoggedIn
      });
    });
};

exports.getHostHome = (req, res, next) => {
  home.find()
    .then((registeredhomes) => {
      res.render("host/host-homelist", {
        registeredhomes,
        pagetitle: "My homes-lists",
        currentPage: "/host/host-homes",
          isLoggedIn:req.isLoggedIn
      });
    })
    .catch((err) => {
      console.log("Error while retrieving host homes");
    });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";
  if (!mongoose.Types.ObjectId.isValid(homeId)) {
    console.error("Invalid ObjectId:", homeId);
    return res.redirect("/host/host-homes");
  }
  home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.redirect("/host/host-homes");
      }
      res.render("host/editHome", {
        home,
        pagetitle: "EditHome",
        editing,
        currentPage: "/host/host-homes",
          isLoggedIn:req.isLoggedIn
      });
    });
};

exports.postEditHome = (req, res, next) => {
  const { housename, price, location, rate, id, des, password } = req.body;
  home.updateOne({ _id: id }, { housename, price, location, rate, des, password })
    .then(() => {
      console.log("Updated successfully");
      res.redirect("/host/host-homes");
    })
    .catch(() => {
      console.log("Error while updating");
    });
};

exports.deleteHome = (req, res, next) => {
  const id = req.params.homeId;
  home.deleteOne({ _id: id })
    .then(() => {
      console.log("Deleted successfully");
      res.redirect("/host/host-homes");
    });
};

