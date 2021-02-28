const USER = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");



// Middleware to get all users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  
    const allUsers = await USER.find({});
    return res.status(200).json({
      status: "success",
      noOfUsers: allUsers.length,
      data: {
        users: allUsers,
      },
    });
});


// Middleware to get current user

exports.currentUser = catchAsync(async (req, res, next) => {
  // console.log(req.user);
  return res.status(200).json({
    status: "success",
    data:{
      user: req.user
    }
  })
})



