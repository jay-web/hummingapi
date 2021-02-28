const USER = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const app = require("../app");

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
      token, 
      data:{
        username:user.username,
        
      }

  })
};

// Middleware For signup
exports.createUser = catchAsync(async (req, res, next) => {
 
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

});

// Middleware for login
exports.login = catchAsync(async (req, res, next) => {
 
    const { username, password } = req.body;
    console.log(username, password);

    // Check username and password both are provided by user
    if (!username || !password) {
      return next( new AppError("Please provide username and password",401));
    }

    // Check provided details are valid or not
    const user = await USER.findOne({ username: username }).select("+password");

    const isPasswordCorrect = await user.correctPassword(
      password,
      user.password
    );

    if (!user || !isPasswordCorrect) {
      return next(new AppError("Incorrect Username or password", 401));
    }
    
    sendToken(user, req, res, 201)
  
});

// Middleware for log out
exports.logout = async (req, res, next) => {
    res.cookie("jwt", "logout", {
        expiresIn: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.user = null;
    res.status(200).json({
        status: "success",
    })
}

// Middleware to apply login feature other middlware i.e protect

exports.protect = catchAsync (async (req, res, next) => {

    let token ;

    // Check token is available with request or not
    if(req.headers && req.headers.authorization){
      token = req.headers.authorization.split(" ")[1];
    }else if(req.cookies.jwt){
      token = req.cookies.jwt
    }

    // if token is not available
    if(!token){
      return next(new AppError("You are not logged in, please login", 401));
    }

    // if token is available, check the token validation
    let decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check whether user still exist or not, means user get deleted from DB AFTER issuing token

    let currentUser = await USER.findById(decoded.id);
    if(!currentUser){
      return next(new AppError("User belongs to token is not exist now !!", 401));
    }

    // Check password get changed after login or not
    const passwordChanged = await currentUser.isPasswordChanged(decoded.iat);
    if(passwordChanged){
      return next(new AppError("User has changed the password, please login again !!!", 401));
      
    }

    // if everything seems fine, passed to the next middleware
    req.user = currentUser;
    res.locals.user = currentUser;
  
    next();
});

// Middleware to check user is already logged in or not

exports.isLoggedIn = async (req, res, next) => {
  let token ;

  // Check token is available with request or not
  if(req.headers && req.headers.authorization){
    token = req.headers.authorization.split(" ")[1];
  }else if(req.cookies.jwt){
    token = req.cookies.jwt
  }
  
  // Step 1 = Check whether token available in header or not
  if (token) {
    try {
      // Step 2 = Verify token
      // * since jwt.verify accept the callback function which after verifying
      // * but we are using async await, so we will convert it into to return a promise
      // * which we can access using await
      // * using build in util module function promisify
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      // Step 3 == Check whether user still exist or not (user deleted after issuing token)
      const currentUser = await USER.findById(decoded.id);
      if (!currentUser) {
       
        return next();
      }

      // Step 4 == Check whether user has changed the password after login(after getting token)
      const passwordChanged = await currentUser.isPasswordChanged(
        decoded.iat
      );
      if (passwordChanged) {
       
        return next();
      }

      // Finally if above steps are fine, so will grant the access
      // !  Very important passing the user to the request to get used in later middleware
      res.locals.user = currentUser;
      req.user = currentUser;
      
     
        return next();
    } catch (err) {
      
      return next();
    }
  }
 
  next();
};