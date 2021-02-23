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
    }
});


const POST = mongoose.model("Post", postSchema);


module.exports = POST;