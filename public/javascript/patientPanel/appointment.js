let date = document.getElementById("date");
let appointments = document.getElementById("appointments");
let slotBook = document.getElementById("slotBook");

function validate() {
  let isvalid = true;

  let dvalid = document.querySelectorAll(".dvalid");

  let validated = document.querySelectorAll(".validated");
  console.log(validated);
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
    console.log(doctorId)
    let fees = doctors.filter((doctor) => doctor.id = doctorId)[0].consultancy_fees;
    console.log(fees)
    let selectedSlotId = appointments.options.selectedIndex;
    let slotId = appointments.children[selectedSlotId].dataset.sid;

    let userInfo = JSON.parse(localStorage.getItem('userinfo'))

    let patientDetails = await fetch("/patient/details",{
      method:"POST",
      body:JSON.stringify({id:userInfo.id}),
      headers:{
        "Content-Type":"application/json"
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
      }).then(async(result)=>{
          bloodGroup = document.getElementById('bloodGroup').value;
          medicalHistory = document.getElementById('medicalHistory').files[0];
          let formData = new FormData();
          formData.append('patientId',userInfo.id)
          formData.append('bloodgroup',bloodGroup)
          formData.append('medicalHistory',medicalHistory)

          let patient = await fetch("/patient/otherDetails",{
            method:"POST",
            body:formData
          })
          console.log(await patient.json())
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
        console.log(await d.json());

        Swal.fire("Payment Done!", "Your Slot is Booked", "success").then(
          (result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          }
        );
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
    appointments.innerHTML = data.html;
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

const getDoctorData = async () => {
  let id = window.location.pathname.split("/");
  id = Number(id[id.length - 1]);
  if (!isNaN(id)) {
    let doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    let doctor = doctors.filter((doctor) => doctor.id === id)[0];
    // console.log(doctor)

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
    <p class="qualification"><span>qualification: </span>${doctor.qualification}</p>
    <p class="speciality"><span>speciality: </span>${doctor.specialities.map((speciality) => `${speciality.toUpperCase()}`)}</p>
    <p class="fees"><span>Fees: </span>Rs. ${doctor.consultancy_fees}</p>
    <p class="hospital-name"><span>clinic/hospital: </span>${doctor.hospital_name}</p>
    <p class="address"><span>city: </span> ${doctor.city}</p>
    <p class="address"><span>address: </span> ${doctor.location}</p>
    <div class="rating">
    ${stars}
      <span id="review-count">(${doctor.total_reviews})</span>
    </div>
  </div>`;

    document.querySelector('.doctor-profile').innerHTML = html
  }
};

getDoctorData();


