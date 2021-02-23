const express = require("express");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");


app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/api/v1/chats", (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "all chats are here"
    })
})

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);




module.exports = app;