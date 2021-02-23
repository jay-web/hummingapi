const POST = require("../models/postModel");

exports.getAllPost = async (req, res, next ) => {
    try{
        let posts = await POST.find({});

        res.status(200).json({
            status: "success",
            data:{
                posts: posts
            }
        })
    }catch(error){
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
    
}

exports.createPost = async (req, res, next) => {
    console.log(req.user)
    console.log(req.body);
    try{
        const post = {
            content : req.body.content
        }
        let newPost = await POST.create(post);
    
        res.status(201).json({
            status: "success",
            data:{
                post: newPost,
                postBy: req.user.id
            }
        })
    }catch(error){
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
   
}