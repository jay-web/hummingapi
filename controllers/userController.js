const USER = require("../models/userModel");



// Middleware to get all users
exports.getAllUsers = async (req, res, next) => {
  
  try{
    const allUsers = await USER.find({});
    return res.status(200).json({
      status: "success",
      noOfUsers: allUsers.length,
      data: {
        users: allUsers,
      },
    });
  }catch(error){
    res.status(500).json({
      status: "failed",
      message: error.message
    })
  }
  
};


// Middleware to get current user

exports.currentUser = async  (req, res, next) => {
  // console.log(req.user);
  return res.status(200).json({
    status: "success",
    data:{
      user: req.user
    }
  })
}



