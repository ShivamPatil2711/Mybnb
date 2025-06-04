const e = require("express");
   const user=require("../models/user");
    const mongoose=require("mongoose");
const { check, validationResult } = require('express-validator');
    const bcrypt = require('bcryptjs');
  exports.getLogin=(req,res,next)=>{
  res.render("auth/login",{pagetitle:"Login-page",currentPage:"/login-page",isLoggedIn:req.isLoggedIn});
  }
  exports.postLogin = async (req, res, next) => {
  try {
    const { email, password, log } = req.body;

    if (log === 'in') {
      const User = await user.findOne({ email });
      if (!User) {
        return res.redirect('/login-page');
      }
      // Compare submitted password with hashed password
      const isMatch = await bcrypt.compare(password, User.password);
      if (!isMatch) {
        return res.redirect('/login-page');
      }
      req.session.isLoggedIn = true;
      req.session.user = User;
      req.session.save(() => {
        return res.redirect("/");
      });
    } else {
      // Check if session user exists and matches provided email/password
      if (
        !req.session.user ||
        req.session.user.email !== email ||
        !(await bcrypt.compare(password, req.session.user.password))
      ) {
        // Credentials do not match session user
        return res.redirect('/login-page');
      }
      await new Promise((resolve, reject) => {
        req.session.destroy(err => {
          if (err) {
            console.log("Session destroy error:", err);
            return reject(err);
          }
          resolve();
        });
      });
      res.clearCookie('connect.sid');
      return res.redirect('/login-page');
    }
  } catch (err) {
    console.error("Error while logging in:", err);
    return res.status(500).send("Internal Server Error");
  }
};

  exports.getsignup=(req,res,next)=>{
  res.render("auth/signup",{pagetitle:"Sign Up",currentPage:"/signup-page",isLoggedIn:false,oldInput:{FirstName:"",LastName:"",email:"",password:"",userType:""},errorMessages:[]});
  }
 exports.postsignup = [
  // Validation checks
  check('FirstName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('First Name should be at least 2 characters long')
    .matches(/^[A-Za-z\s]+$/)
    .withMessage('First Name should contain only alphabets'),

  check('LastName')
    .matches(/^[A-Za-z\s]*$/)
    .withMessage('Last Name should contain only alphabets'),

  check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),

  check('password')
    .isLength({ min: 8 })
    .withMessage('Password should be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password should contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password should contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password should contain at least one number')
    .matches(/[!@&]/)
    .withMessage('Password should contain at least one special character')
    .trim(),

  check('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  check('userType')
    .notEmpty()
    .withMessage('Please select a user type')
    .isIn(['guest', 'host'])
    .withMessage('Invalid user type'),

  check('terms')
    .notEmpty()
    .withMessage('Please accept the terms and conditions')
    .custom((value) => {
      if (value !== 'on') {
        throw new Error('Please accept the terms and conditions');
      }
      return true;
    }),

  // Validation result handling
  (req, res, next) => {
    const { FirstName, LastName, email, password, userType } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).render('auth/signup', {
        pagetitle: 'signup-page',
        currentPage: 'signup-page',
        isLoggedIn: false,
        errorMessages: errors.array().map(error => error.msg), // <-- pass errors here
        oldInput:{
          FirstName,
          LastName,
          email,
          password,
          userType,

        } // <-- (optional) to repopulate form fields
      });
    }
res.redirect('/login-page'); // Redirect to login page if validation passes
    // Password hashing and user creation
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const newUser = new user({
          FirstName:"",
          LastName: "",
          email: "",
          password: hashedPassword,
          userType: "",
        });
        return newUser.save();
      })
      .then(() => {
        res.redirect('/login-page');
      })
      .catch((err) => {
        console.log('Error while registering user', err);
        res.render('auth/signup', {
          pagetitle: 'signup-page',
          currentPage: 'signup-page',
          isLoggedIn: false,
          errorMessages: ['An error occurred while registering. Please try again later.'],
          oldInput: {   
            FirstName:"",
            LastName: "",
            email: "",
            password: "",
            userType: "",
          }
        });
      });
  },
];

