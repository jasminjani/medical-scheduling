const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const http = require("http");
// const server = http.createServer(app);
const { Server } = require("socket.io");
// const io = socket(server);
const path = require("path");
const logger = require("./utils/pino");
require("dotenv").config();
const socketio = require('socket.io');
const fs=require('fs')

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
  // console.log(socket.client.id);
  // console.log(socket.id);

  socket.on("reminder", (userEmail) => {
    console.log(userEmail);
    socket.emit(`reminder-${userEmail}`, "Your appointment");
  });

  socket.emit('connectmsg','thank you for connecting')

  // socket.on('message', (data) => {
  //       console.log(`New message from : ${data}`);
  //   })

  socket.on('generatePDF',async(id)=>{
    try{
      const filename=await generatePDF(id);
      socket.emit('pdfready',filename);
    }
    catch(error){
      console.log(error);
    }
  })

  socket.on('downloadPDF',async(filename)=>{
    try{
      if(fs.existsSync(`uploads/pdfs/${filename}`)){
      const file=fs.readFileSync(`uploads/pdfs/${filename}`)
      socket.emit('pdfFile',{filename,file})
      }
    }catch(error){
      console.log("error in downloading PDF",error);
    }
  })

  socket.on('deletePDF',(filename)=>{
    try{
      if(fs.existsSync(`uploads/pdfs/${filename}`)){
        const file=fs.unlinkSync(`uploads/pdfs/${filename}`);
      }
    }
    catch(error){
      console.log("error in deleting pdf",error);
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

