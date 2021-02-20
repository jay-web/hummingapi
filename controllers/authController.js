const USER = require("../models/userModel");
const jwt = require("jsonwebtoken");

//  CREATE THE TOKEN TO SEND FOR AUTHENTICATION
const createToken = (userId) => {
  return jwt.sign({ id: userId, name: "humming" }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// SEND THE TOKEN WITH COOKIES

const sendToken = async (user, req, res, statusCode) => {
  const token = createToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT__COOKIES_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  if (process.env.NODE_ENV === "development") {
    cookieOptions.secure = false;
  }

  res.cookie("jwt", token, cookieOptions);

    return  res.status(statusCode).json({
      status: "success",
      token

  })
};

// Middleware For signup
exports.createUser = async (req, res, next) => {
  try {
    const { name, username, email, password, passwordConfirm } = req.body;
    const userInfo = {
      name,
      username,
      email,
      password,
      passwordConfirm,
    };

    const newUser = await USER.create(userInfo);

    sendToken(newUser, req, res, 201)
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

// Middleware for login
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);

    // Check username and password both are provided by user
    if (!username || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide username and password",
      });
    }

    // Check provided details are valid or not
    const user = await USER.findOne({ username: username }).select("+password");

    const isPasswordCorrect = await user.correctPassword(
      password,
      user.password
    );

    if (!user || !isPasswordCorrect) {
      return res.status(401).json({
        status: "failed",
        message: "Incorrect Username or password",
      });
    }

    sendToken(user, req, res, 201)
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
};

// Middleware for log out
exports.logout = async (req, res, next) => {
    res.cookie("jwt", "logout", {
        expiresIn: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        status: "success",

    })
}