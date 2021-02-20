const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const PORT = process.env.PORT || 5000;

const DB = process.env.MONGO_DATABASE.replace(
  "<password>",
  process.env.MONGO_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DATABASE CONNECTED 😎 ");
  });

const server = app.listen(PORT, () => {
  console.log("Humming Server running at 🏄 port " + PORT);
});
