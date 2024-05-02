let date = document.getElementById("date");
let appointments = document.getElementById("appointments");
let slotBook = document.getElementById("slotBook");

// const socket = io();
// delete booked slot from dropdown which  is booked by other during single user check the slot
socket.on('madechanges', () => {
  getSlots();
})

function validate() {
  let isvalid = true;

  let dvalid = document.querySelectorAll(".dvalid");

  let validated = document.querySelectorAll(".validated");

  // remove if any error message is in frontend
  if (validated?.length) {
    validated.forEach((item) => {
      item.remove();
    });
  }


  // empty fields and email and phone number validation
  dvalid.forEach((field) => {
    if (field.value.trim() === "") {
      let p = document.createElement("p");
      field.insertAdjacentElement("afterend", p);
      p.innerHTML = "*required";
      p.classList.add("validated");
      p.style.color = "red";
      p.style.margin = "0";
      p.style.fontSize = "12px";
      isvalid = false;
    }
  });
  return isvalid;
}

slotBook.addEventListener("click", async (e) => {
  e.preventDefault();
  if (validate() && date.value.trim()) {
    let doctors = JSON.parse(localStorage.getItem('doctors'))
    let doctorId = document.getElementById('did').value;

    let fees = doctors.filter((doctor) => doctor.id == doctorId)[0].consultancy_fees;

    let selectedSlotId = appointments.options.selectedIndex;
    let slotId = appointments.children[selectedSlotId].dataset.sid;

    let userInfo = JSON.parse(localStorage.getItem('userinfo'))

    let patientDetails = await fetch("/patient/details", {
      method: "POST",
      body: JSON.stringify({ id: userInfo.id }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    patientDetails = await patientDetails.json();

    let bloodGroup = "";
    let medicalHistory;
    if (patientDetails.success) {
      await Swal.fire({
        html:
          '<lable>Blood Group : <input type="text" id="bloodGroup" class="bloodGroup" placeholder="Enter Blood Group"></label> <br> <br> <br>' +
          '<lable>Medical History : <input type="file" accept="application/pdf" id="medicalHistory" class="medicalHistory"></label>',
        showCancelButton: true,
      }).then(async (result) => {
        bloodGroup = document.getElementById('bloodGroup').value;
        medicalHistory = document.getElementById('medicalHistory').files[0];
        let formData = new FormData();
        formData.append('patientId', userInfo.id)
        formData.append('bloodgroup', bloodGroup)
        formData.append('medicalHistory', medicalHistory)

        let patient = await fetch("/patient/otherDetails", {
          method: "POST",
          body: formData
        })
      });
    }


    Swal.fire({
      title: `Pay rs. ${fees} for Book An Appointment`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Pay Now",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let d = await fetch("/patient/bookslot", {
          method: "POST",
          body: JSON.stringify({
            paymentAmount: fees,
            slotId: slotId,
            doctorId: doctorId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        d = await d.json();

        if (d.success) {
          // make message for change slot
          socket.emit('changeslot')
          socket.emit('notification',userInfo.email)
          Swal.fire("Payment Done!", "Your Slot is Booked", "success").then(
            (result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            }
          );
        }

        // window.location.reload()
      }
    });
  }
});

// date validation
let today = new Date();
let minDate = today.toISOString().substring(0, 10);
date.setAttribute("min", minDate);

// when date is changed then fetch slots using doctorId and date
const getSlots = async (e) => {
  if (date.value.trim()) {
    date?.nextElementSibling?.remove();
  }

  if (date.value.trim()) {
    let doctor_id = window.location.pathname.split("/");
    doctor_id = doctor_id[doctor_id.length - 1]
    let data = await fetch("/patient/slots", {
      method: "POST",
      body: JSON.stringify({ doctor_id, date: date.value }),
      headers: {
        "Content-type": "application/json",
      },
    });

    data = await data.json();
    let result = data.result;
    let html = `<option value="">--Select slot--</option>`;
    let timezoneoffset = new Date().getTimezoneOffset();
    result.forEach((slot) => {
      slot.start_time = new Date(slot.start_time).getTime();
      slot.start_time -= (timezoneoffset * 60 * 1000);
      slot.start_time = new Date(slot.start_time).toLocaleTimeString('en-US')
      // console.log(slot.start_time)

      slot.end_time = new Date(slot.end_time).getTime();
      slot.end_time -= (timezoneoffset * 60 * 1000);
      slot.end_time = new Date(slot.end_time).toLocaleTimeString('en-US')
      // console.log(slot.end_time)
      // dt = dt.toLocaleString('en-US',{timeZone:userTimezone})
      html += `<option value=${slot.start_time + "-" + slot.id} data-sid="${slot.id
        }">${slot.start_time + " - " + slot.end_time}</option>`;
    });

    appointments.innerHTML = html;
  }
}

window.onload = getSlots;

date.addEventListener("change", getSlots);

appointments.addEventListener("change", async (e) => {
  if (appointments.value.trim()) {
    appointments?.nextElementSibling?.remove();
  }
  appointments.children[0].setAttribute("disabled", "true");
});

const getDoctors = async () => {
  try {
    let data = await fetch("/alldoctors", {
      method: "GET",
    });
    data = await data.json();
    data = data.data;

    localStorage.setItem("doctors", JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

const getDoctorData = async () => {
  let id = window.location.pathname.split("/");
  id = Number(id[id.length - 1]);
  if (!isNaN(id)) {
    await getDoctors();
    let doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    let doctor = doctors.filter((doctor) => doctor.id === id)[0];


    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i > Math.ceil(Number(doctor.rating)) - 1) {
        stars += `<img src="/assets/bstar.png" width="15px" alt="">`;
      } else {
        stars += `<img src="/assets/gstar.png" width="15px" alt="">`;
      }
    }

    let html = ` <div class="doctor-img">
    <img src="/imgs/${doctor.profile_picture}" alt="" />
  </div>
  <div class="doctor-details">
    <input type="hidden" value="${doctor.id}" id="did">
    <p class="name"><span>Name: </span>${doctor.fname + " " + doctor.lname}</p>
    <p class="qualification"><span>Qualification: </span>${doctor.qualification}</p>
    <p class="qualification"><span>Speciality: </span>${doctor.specialities.map((speciality) => `${speciality.toUpperCase()}`)}</p>
    <p class="fees"><span>Fees: </span>Rs. ${doctor.consultancy_fees}</p>
    <p class="hospital-name"><span>Clinic/hospital: </span>${doctor.hospital_name}</p>
    <p class="address"><span>City: </span> ${doctor.city}</p>
    <p class="address"><span>Address: </span> ${doctor.location}</p>
    <div class="rating">
    ${stars}
      <span id="review-count">(${doctor.total_reviews})</span>
    </div>
  </div>`;

    document.querySelector('.doctor-profile').innerHTML = html
  }
};

getDoctorData();


