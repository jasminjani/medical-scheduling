const search = document.getElementById("search-doctor");
const becomeDoctor = document.getElementById("become-doctor");
let data;
// let copyData = [];

const getDoctors = async () => {
  try {
    data = await fetch("/patient/getNearByDoctor", {
      method: "GET",
    });
    data = await data.json();
    // let patientCity = data.patientCity
    data = data.data;

    // copyData = data;
    // let matchedDoctor = [];
    // data.forEach((doctor) => { if (patientCity == doctor.city) { matchedDoctor.push(doctor) } })
      // console.log("matchedDoctor : ",matchedDoctor);
    localStorage.setItem("doctors", JSON.stringify(data));
    // putDoctorOnScreen(matchedDoctor);
    putDoctorOnScreen(data);
    setDatalist(data);
  } catch (error) {
    console.log(error);
  } 
};

const setDatalist = (data) => {
  let nameOptions = document.querySelector("#doctor-name");

  let datalistOptions = "";

  data.forEach((doctor) => {
    // push doctor Name into datalist for searching
    datalistOptions += `<option value="${doctor.fname + " " + doctor.lname
      }" data-did="${doctor.id}">${doctor.fname + " " + doctor.lname}</option>`;
  });

  nameOptions.innerHTML = datalistOptions;
};

const putDoctorOnScreen = async (data) => {
  let cards = document.querySelector(".cards");

  let card = "";

  if (data.length > 4) {
    let swipebtns = document.querySelector(".swipe-btns");
    swipebtns.innerHTML = `<button class="left-swipe"><<</button>
    <button class="right-swipe">>></button>`;
  }

  if (data.length <= 0) {
    cards.style.justifyContent = "center";
    return (cards.innerHTML = "<p class='not-found'>No Data Found !</p>");
  }

  data.forEach((doctor) => {
      let stars = "";
      for (let i = 0; i < 5; i++) {
        if (i > Math.ceil(Number(doctor.rating)) - 1) {
          stars += `<img src="/assets/bstar.png" width="15px" alt="">`;
        } else {
          stars += `<img src="/assets/gstar.png" width="15px" alt="">`;
        }
      }

      card += `<div class="card">
    <a href="/patient/bookslots/${doctor.id}" class="img">
      <img src="/imgs/${doctor.profile_picture}" alt="" >
    </a>
    <div class="details">
      <p class="name">${doctor.fname + " " + doctor.lname}</p>
      </div>
      <div class="specialities">
        ${doctor.specialities
          .map((speciality) => {
            return `<p class="speciality">${speciality}</p>`;
          })
          .join("")}
      </div>
    <p class="rating">
     ${stars} <span class="total-reviews">(${doctor.total_reviews})</span>
    </p>
  </div>`;
  });

  // if cards div has j-c : center then make it fs
  cards.style.justifyContent = "start";
  cards.innerHTML = card;
};

search.addEventListener("click", async (e) => {
  let speciality = document.getElementById("speciality");
  let doctorName = document.getElementById("dname");

  if (speciality.value && doctorName.value) {
    let filteredDoctor = data.filter((doctor) => {
      return doctorName.value === doctor.fname + " " + doctor.lname;
    });
    putDoctorOnScreen(filteredDoctor);
  } else if (speciality.value) {
    let filteredDoctor = data.filter((doctor) => {
      return doctor.specialities.includes(speciality.value);
    });

    putDoctorOnScreen(filteredDoctor);
  } else if (doctorName.value) {
    let filteredDoctor = data.filter((doctor) => {
      return doctorName.value === doctor.fname + " " + doctor.lname;
    });
    putDoctorOnScreen(filteredDoctor);
  } else {
    putDoctorOnScreen(data);
  }
});

getDoctors();


      // show chat message
      let showBtn = document.getElementById('a2-show-window-btn');
      let showChat = document.querySelector('.a2-chat-window');
      showChat.classList.add('a2-hide-box')
  
      showBtn.addEventListener('click', () => {
        showChat.classList.toggle('a2-hide-box')
      });
   

  
      document.querySelector(".a2-patient-name").innerHTML = `${
        user.fname + " " + user.lname
      }`;

      showBtn.addEventListener("click", () => {
        showChat.classList.toggle("a2-hide-box");
      });
 

      async function getPatientData() {
        let resp = await fetch(`/patient/analytics`);
        let data = await resp.json();

        document.getElementById("doctors-count").innerHTML =
          data[0]?.doctorCount;
        document.getElementById("patients-count").innerHTML =
          data[1]?.patientCount;
        document.getElementById("today-booking-count").innerHTML =
          data[3]?.TodaysBooking;
        document.getElementById("total-booking-count").innerHTML =
          data[2]?.patientTotalBooking;
      }

      getPatientData();
 

    // <!--Upcoming slots script-- >

    // console.log("inside patient");
      const getUpcomingSlots = async () => {
      let user = JSON.parse(localStorage.getItem("userinfo"));
    const response = await fetch(`/patient/bookings/${user.id}`, {
      method: "GET",
    headers: {
      "Content-type": "application/json",
          },
        });

    let {success, data} = await response.json();

        const todaysAppointment = data.filter((e) => {
          return new Date(e.date) < new Date();
        });

    const table = document.getElementById("date-body");

    table.innerHTML = "";

    if (todaysAppointment.length == 0) {
          return (table.innerHTML =
    "<tr><td colspan='5'>No Data Found !</td></tr>");
        }

    let timezoneoffset = new Date().getTimezoneOffset();
        todaysAppointment.forEach((element) => {
      element.start_time = new Date(element.start_time).getTime();
    element.start_time -= timezoneoffset * 60 * 1000;
    element.start_time = new Date(element.start_time).toLocaleTimeString(
    "en-US"
    );
    // console.log(element.start_time);

    element.end_time = new Date(element.end_time).getTime();
    element.end_time -= timezoneoffset * 60 * 1000;
    element.end_time = new Date(element.end_time).toLocaleTimeString("en-US");
    // console.log(element.end_time);
    table.innerHTML += `
    <tr>
      <td>${element.date}</td>
      <td>${element.day}</td>
      <td>${element.start_time}-${element.end_time}</td>
      <td><input type="button" class="view-btn" value="Details" onclick='getDetails(${JSON.stringify(
                element
              )})'></td>
    </tr>
    `;
        });
      };

      const getDetails = async (data) => {
        const modal = document.getElementsByClassName("A3-modal")[0];

    modal.style.visibility = "visible";

    modal.innerHTML = `
    <div class="A3-row-3">
      <h3 id="A3-modal-date">Booking : ${data.booking_date}</h3>
      <input type="button" class="view-btn" value="Close" onclick="handleClose()">
    </div>
    <h4>Doctor Details</h4>
    <div class="card">
      <div class="col">
        <p><i class="fa-solid fa-user-doctor"></i>${data.fname} ${data.lname}<img src="/assets/tick.png" alt="tick" /></p>
        <p><i class="fa-regular fa-envelope"></i>${data.email}</p>
        <p><i class="fa-solid fa-phone"></i>${data.phone}</p>
        <p><i class="fa-solid fa-book"></i>${data.qualification}</p>
      </div>
      <div class="col">
        <p><i class="fa-solid fa-indian-rupee-sign"></i>${data.consultancy_fees}</p>
        <p><i class="fa-regular fa-hospital"></i>${data.name}</p>
        <p><i class="fa-solid fa-location-dot"></i>${data.location}</p>
        <p><i class="fa-solid fa-pen"></i>${data.pincode}</p>
      </div>
    </div>
    `
    }


    const handleClose = () => {
      document.getElementsByClassName("A3-modal")[0].style.visibility = "hidden";
    }
