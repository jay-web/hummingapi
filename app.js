const express = require("express");
const userRoutes = require("./routes/userRoutes");
const app = express();
const cors = require("cors");


app.use(cors());
app.use(express.json());

app.get("/api/v1/chats", (req, res, next) => {
    res.status(200).json({
        status: "success",
        message: "all chats are here"
    })
})

app.use("/api/v1/user", userRoutes);




module.exports = app;