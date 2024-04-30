const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const logger = require("./utils/pino");
require("dotenv").config();

const PORT = process.env.PORT;

// passport configuration
const passport = require("passport");
const { passportConfig } = require("./middlewares/authMiddleware");
passportConfig(passport);

// server is running on PORT
const server = app.listen(PORT, () => {
  logger.info(`server is running on port: http://localhost:${PORT}`);
});

const io = new Server(server);

const { generatePDF } = require("./controllers/pdfController");

// socket initialization
io.on("connection", (socket) => {

  socket.emit('connectmsg', 'thank you for connecting');

  socket.on('delete-slot', (msg) => {
    msg ? io.emit(`delete-slot-${msg.patient_id}`, msg) : 0
  })

  socket.on('cancel-slot', (msg) => {
    msg ? io.emit(`cancel-slot-${msg.doctor_id}`, msg) : 0
  })

  socket.on('generatePDF', async () => {
    try {
      console.log("in socket generate pdf");
      const filename = await generatePDF();
      console.log(filename);
      socket.emit('pdfready', filename);
    }
    catch (error) {
      console.log(error);
    }
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

});

// set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// setup static file path for css,imgs,js or other files
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/uploads")));
app.use(
  "/sweetalert2",
  express.static(path.join(__dirname, "/node_modules/sweetalert2/dist"))
);
// middleware
app.use(passport.initialize());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// use root router in index file
const rootRouter = require("./routes/rootRouter");
const { allRequestLogs } = require("./middlewares/allRequestLogs");

app.use("/", allRequestLogs, rootRouter);

