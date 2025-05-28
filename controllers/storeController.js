const home = require("../models/home");
const favourite = require("../models/favourite");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

exports.getHomes = (req, res, next) => {
  home.find()
    .then((registeredhomes) => {
      res.render("store/homelist", {
        registeredhomes,
        pagetitle: "Homes",
        currentPage: "/homes",
          isLoggedIn:req.isLoggedIn
      });
    })
    .catch(() => {
      console.log("ERROR");
    });
};

exports.getBooking = (req, res, next) => {
  res.render("store/booking", {
    pagetitle: "My Bookings",
    currentPage: "/bookings",
      isLoggedIn:req.isLoggedIn
  });
};

exports.getIndex = (req, res, next) => {
  home.find()
    .then((registeredhomes) => {
      res.render("store/index", {
        registeredhomes,
        pagetitle: "Index",
        currentPage: "/",
          isLoggedIn:req.isLoggedIn
      });
    })
    .catch(() => {
      console.log("ERROR IN INDEX PAGE");
    });
};

exports.getFavouritelist = (req, res, next) => {
  favourite.find()
    .then((favourites) => {
      favourites = favourites.map(fav => fav.favid.toString());
      home.find()
        .then((registeredhomes) => {
          const favouriteHomes = registeredhomes.filter(home =>
            favourites.includes(home._id.toString())
          );
          res.render("store/favouritelist", {
            favouriteHomes,
            pagetitle: "Favourites",
            currentPage: "/favourite-list",
              isLoggedIn:req.isLoggedIn
          });
        });
    });
};

exports.getHomesDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  if (!mongoose.Types.ObjectId.isValid(homeId)) {
    return res.status(400).send("Invalid home ID");
  }
  home.findById(homeId)
    .then((home) => {
      if (!home) {
        console.log("Home not found");
        return res.redirect("/homes");
      }
      res.render("store/homedetail", {
        home,
        pagetitle: "Home Detail",
        currentPage: "",
          isLoggedIn:req.isLoggedIn
      });
    });
};

exports.postAddToFavourites = (req, res, next) => {
  const favid = req.body.id;
  const fav = new favourite({ favid });
  fav.save()
    .then(() => {
      console.log("fav added");
    })
    .catch(() => {
      console.log("Unable to add in favourites");
    })
    .finally(() => {
      res.redirect("/favourite-list");
    });
};

exports.postDeleteFavourites = (req, res, next) => {
  const id = req.params.homeId;
  favourite.deleteOne({ favid: id })
    .then(() => {
      console.log("Fav deleted");
    })
    .catch((err) => {
      console.log("ERR in Delete fav", err);
    })
    .finally(() => {
      res.redirect("/favourite-list");
    });
};
