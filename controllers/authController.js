const USER = require("../models/userModel");


// Middleware For signup
exports.createUser = async (req, res, next) => {
   try{
    const {name, username, email, password, passwordConfirm } = req.body;
    const userInfo = {
        name,
        username,
        email,
        password,
        passwordConfirm
    }

    const newUser = await USER.create(userInfo);
    
    res.status(200).json({
        status: "success",
        body:{
            user: newUser
        }
    })
   }catch(error){
        res.status(500).json({
            status: "failed",
            message: error.message
        })
   }
    
}


// Middleware for login
exports.login = async (req, res, next) => {
    try{
        const {username, password} = req.body;
        console.log(username, password);

        // Check username and password both are provided by user
        if(!username || !password){
            return res.status(400).json({
                status: "failed",
                message: "Please provide username and password"
            })
        }

        // Check provided details are valid or not
        const user = await USER.findOne({ username: username}).select("+password");
        
        const isPasswordCorrect = await user.correctPassword(password, user.password);

        if(!user || !isPasswordCorrect){
            return res.status(401).json({
                status: "failed",
                message: "Incorrect Username or password"
            })
        }

      
        res.status(200).json({
            status: "success",
            body:{
                user: "user"
            }
        })
    }catch(error){
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}