const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    content:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now()
    },
    postBy:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }]
});


postSchema.pre(/^find/, function(next){
    this.populate({path: "postBy"});
    next();
})

const POST = mongoose.model("Post", postSchema);


module.exports = POST;