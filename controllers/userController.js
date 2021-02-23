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


// Middleware to 



