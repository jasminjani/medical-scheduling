const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
require("dotenv").config();

// database connection
const conn = require("./config/dbConnection");

const PORT = process.env.PORT || 8000;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// setup static file path for css,imgs,js or other files
app.use("/public", express.static(path.join(__dirname, "/public")));

// import routes file
const userRouter = require("./routes/userRoute");
const router = require("./routes/rootRouter");

// setup middleware of rotues file
app.use("/", userRouter);

// use root router in index file
app.use('/', router);

// server is running on PORT
app.listen(PORT, () => {
  console.log(`server is running on port: http://localhost:${PORT}`);
});
