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

  socket.on("reminder",async(userEmail) => {
    let result;
    try {
      [result] = await conn.query(`select concat(users_patient.fname," ",users_patient.lname) as patient_name,
      concat(users_doctor.fname," ",users_doctor.lname) as doctor_name,users_patient.email,slot_bookings.patient_id,
        time_slots.start_time,time_slots.end_time,slot_bookings.id as booking_id from slot_bookings
        inner join time_slots on time_slots.id=slot_bookings.slot_id
        inner join users as users_patient on slot_bookings.patient_id=users_patient.id
        inner join users as users_doctor on time_slots.doctor_id = users_doctor.id
        where time_slots.date=curdate() &&
        slot_bookings.id not in (select booking_id from prescriptions) &&
        timestampdiff(minute,utc_timestamp(),time_slots.start_time) between 0 and 120
        && slot_bookings.is_canceled = 0 && slot_bookings.is_deleted=0;`);
    } catch (error) {
      logger.error(error)
      console.log(error)
    }

    result.forEach((data)=>{
      socket.emit(`reminder-${data.email}`, {
        message:`today appointment is booked with ${data.doctor_name}`,
        startTime:data.start_time,
        endTime: data.end_time
      });
    })

  });

  // user req for change slot
  socket.on('changeslot',()=>{
    socket.broadcast.emit('madechanges')
  })

  socket.emit('connectmsg','thank you for connecting')

  socket.on('cancel-slot', (msg) => {
    msg ? io.emit(`cancel-slot-${msg.doctor_id}`, msg) : 0
  })

  socket.on('generatePDF',async(id)=>{
    try{
      const filename=await generatePDF(id);
      socket.emit('pdfready',filename);
    }
    catch (error) {
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
const conn = require("./config/dbConnection");

app.use("/", allRequestLogs, rootRouter);


