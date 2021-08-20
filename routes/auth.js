const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  isSignedIn,
  isAuthenticated,
  getUserById,
  getUser,
  getUserProfile,
  follow,
  searchUser,
} = require("../controller/auth");

router.param("userId", getUserById);

router.post(
  "/signup",
  [
    check("firstName", "Firstname should be atleast 3 characters").isLength({
      min: 3,
    }),
    check("lastName", "Lastname should be atleast 3 characters").isLength({
      min: 3,
    }),
    check("email", "Email is required").isEmail(),
    check("password", "Password should be atleast 5 char").isLength({ min: 5 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "Email is required").isEmail(),
    check("password", "password feild is required").isLength({ min: 5 }),
  ],
  signin
);

router.get("/signout", signout);

router.put("/forgot-password", forgotPassword);
router.put(
  "/reset-password",
  [
    check("newPass", "password must be minimum 5 char long").isLength({
      min: 5,
    }),
  ],
  resetPassword
);

//User by userId
router.get("/user/:userId", isSignedIn, getUser);
//User by email
router.get("/profile/:email", getUserProfile);
//Search User
router.get("/search-user", searchUser);
//follow-unfollow user
router.put("/follow/:userId/:profileId", follow);

module.exports = router;
