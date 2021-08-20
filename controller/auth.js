const User = require("../models/user");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const _ = require("lodash");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.MAIL_KEY);

//Create New Account
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // error handling
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "User with this email already exist",
        });
      }
      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
      });

      newUser.save((err, user) => {
        if (err) {
          console.log(err);
          return res.status(401).json({
            error: "something went wrong",
          });
        } else {
          return res.json({
            message: user,
            message: "user registred successfully",
          });
        }
      });
    });
  }
};

// Signin to account
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  // error handling
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  await User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with this email does not exist ,please signup",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Email and password do not match",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, { httpOnly: true, secure: true });

    const { _id, firstName, lastName, email } = user;

    return res.json({
      token,
      user: { _id, firstName, lastName, email },
    });
  });
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  // error handling
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const { email } = req.body;
  await User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with this email does not exist in DB",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "15m",
    });

    let currentDate = new Date();

    const data = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Link",
      html: `
                <p>Hey we have received request for reset your account password on ${currentDate}</p> 
                <h1>Please use the following Link to reset your account password</h1>
                <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>
                <hr />
                <p>This email may containe sensetive information</p>
                <p>${process.env.CLIENT_URL}</p>`,
    };

    return user.updateOne({ resetLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: "Reset link error",
        });
      } else {
        sgMail
          .send(data)
          .then((sent) => {
            return res.json({
              message: `Reset password link sent to ${email}`,
            });
          })
          .catch((err) => {
            return res.status(400).json({
              error: err.message,
            });
          });
      }
    });
  });
};

//Reset Password
exports.resetPassword = async (req, res) => {
  // error handling
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const { newPass, resetLink } = req.body;

  User.findOne({ resetLink }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found with this token",
      });
    }

    const obj = {
      password: newPass,
      resetLink: "",
    };

    user = _.extend(user, obj);
    user.save((err, result) => {
      if (err) {
        // console.log(err);
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: "Your password has been changed",
      });
    });
  });
};

// signout
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user signout successfully",
  });
};

// signin middlewere
exports.isSignedIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["sha1", "RS256", "HS256"],
  userProperty: "auth",
});

// Checking authentication
exports.isAuthenticated = (req, res, next) => {
  let checker = req.user && req.auth && req.user._id == req.auth._id;

  if (!checker) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};

// Get user byId
exports.getUserById = async (req, res, next, id) => {
  await User.findById(id)
    .populate("likes", "content postedBy likes")
    .populate({
      path: "replyTo",
      populate: {
        path: "postedBy",
        select: "_id firstName lastName email",
      },
    })
    .populate("postedBy")
    .populate({
      path: "posts",
      populate: { path: "likes comments" },
    })
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "No user found in DB",
        });
      }
      req.user = user;
      next();
    });
};

exports.getUser = (req, res) => {
  req.user.hashed_password = undefined;
  req.user.salt = undefined;

  return res.json(req.user);
};

// get user profile
exports.getUserProfile = async (req, res, next) => {
  await User.findOne({ email: req.params.email })
    .populate({
      path: "likes",
      populate: {
        path: "postedBy",
        select: "_id firstName lastName email",
      },
    })
    .populate({
      path: "replyTo",
      populate: {
        path: "postedBy",
        select: "_id firstName lastName email",
      },
    })
    .populate("postedBy")
    .populate({
      path: "posts",
      populate: { path: "likes comments" },
    })
    .select("-salt")
    .select(" -hashed_password")
    .exec((err, user) => {
      if (err || !user) {
        console.log(err);
        return res.status(400).json({
          error: "No user found in DB",
        });
      }
      return res.json(user);
    });
};

//Follow/unfollw friend
exports.follow = async (req, res) => {
  const userId = req.params.userId;
  const profileId = req.params.profileId;

  if (userId !== profileId) {
    const user = await User.findById(userId).then((user) => {
      if (user.following.includes(profileId)) {
        user.following.pull(profileId);
      } else {
        user.following.addToSet(profileId);
      }
      user.save();
    });

    await User.findById(profileId).then((user) => {
      if (user.followers.includes(userId)) {
        user.followers.pull(userId);
      } else {
        user.followers.addToSet(userId);
      }
      user.save();
      return res.json(user);
    });
  } else {
    return res.status(400).json({
      error: "something went wrong",
    });
  }
};

// search user
exports.searchUser = async (req, res) => {
  let searchPattern = new RegExp("^" + req.query.firstName);
  User.find({ firstName: { $regex: searchPattern, $options: "$i" } })
    .select("-salt -hashed_password")
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
    });
};
