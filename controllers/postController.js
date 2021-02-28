const POST = require("../models/postModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllPost = catchAsync( async (req, res, next ) => {
    
  
        let posts = await POST.find({postBy: req.user.id});
        
        res.status(200).json({
            status: "success",
            numberOfPosts: posts.length,
            data:{
                posts: posts
            }
        })
    
})

exports.createPost = catchAsync(async (req, res, next) => {
    
        const post = {
            content : req.body.content,
            postBy: req.user.id
        }
        let createdPost = await POST.create(post);
        let newPost = await POST.findById(createdPost.id);

        res.status(201).json({
            status: "success",
            data:{
                post: newPost,
            }
        });
   
});

exports.deletePost = catchAsync( async (req, res, next) => {
    console.log(req.user, req.body.userId, req.body.postId);
    console.log(req.body);
    if(req.user.id !== req.body.userId){
        return next( new AppError("you are not authorized to delete this post", 401));
       
    }
    
        let response = await POST.findByIdAndDelete(req.body.postId);
        console.log(response);
        
        res.status(200).json({
            status: "success",
            message: "Successfully deleted",
            deletedPostId: response._id 
        })
    
});

exports.searchPost =catchAsync( async (req, res, next) => {
   
        let post = await POST.findOne({ content: req.body.search});
        console.log({post});
        
        res.status(200).json({
            status: "success",
            
            data: {
                post: post
            }
        })
   
});