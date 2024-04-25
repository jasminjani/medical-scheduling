const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");
const logger = require('./utils/pino'); 
require("dotenv").config();

const PORT = process.env.PORT;

// passport configuration
const passport = require("passport");
const { passportConfig } = require("./middlewares/authMiddleware");
passportConfig(passport);

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// setup static file path for css,imgs,js or other files
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/uploads")))
app.use("/sweetalert2", express.static(path.join(__dirname, '/node_modules/sweetalert2/dist')))
// middleware
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// use root router in index file
const rootRouter = require("./routes/rootRouter");
const { allRequestLogs } = require("./middlewares/allRequestLogs");


app.use("/", allRequestLogs, rootRouter);

// server is running on PORT
app.listen(PORT, () => {
  logger.info(`server is running on port: http://localhost:${PORT}`);
  // console.log(`server is running on port: http://localhost:${PORT}`);
});
