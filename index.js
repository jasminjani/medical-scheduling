const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
require("dotenv").config();

// database connection
const conn = require("./config/dbConnection");
const PORT = process.env.PORT;

// passport configuration
const passport = require("passport");
const {passportConfig} = require('./middlewares/authMiddleware')
passportConfig(passport)

// middleware
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// setup static file path for css,imgs,js or other files
app.use("/public", express.static(path.join(__dirname, "/public")));

// import routes file
const userRouter = require("./routes/userRoute");
const router = require("./routes/rootRouter");
const prescriptionRouter = require("./routes/prescriptionRoutes");
const hospitalRoute = require("./routes/hospitalRoute");
const doctorRoute = require("./routes/doctorRouter");
const specialitiesRoute = require("./routes/doctorSpecialitiesRouter");

// use root router in index file
app.use("/", router);

// server is running on PORT
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
