const POST = require("../models/postModel");
const USER = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllPost = catchAsync( async (req, res, next ) => {
    
  
        let posts = await POST.find({postBy: req.user.id}).sort({ 'date': -1});
        
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
        let newPost = await POST.populate(createdPost, {path: 'postBy'})
        // let newPost = await POST.findById(createdPost.id);

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

exports.likePost = catchAsync(async (req, res, next) => {
    console.log("body", req.body);
    console.log("user", req.user);

    let isLiked = req.user.likes && req.user.likes.includes(req.body.postId);

    // * if postId is already include so delete it from array else add it
    let option = isLiked ? "$pull" : "$addToSet" ;

    // * Add/remove the postId into user likes array
    await USER.findByIdAndUpdate(req.user.id, {[option]: {likes: req.body.postId}});

    // * Add/remove the userId into post likes array
    let updatedPost =  await POST.findByIdAndUpdate(req.body.postId, { [option]: { likes: req.user.id}}, {new :true});


    console.log(isLiked);

    res.status(200).json({
        status: "success",
        data:{
            post: updatedPost
        }
        
    })

});