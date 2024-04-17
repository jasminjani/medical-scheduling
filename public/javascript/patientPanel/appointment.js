let specialities = document.getElementById("specialities");
let date = document.getElementById("date");
let doctor = document.getElementById("doctors");
let appointments = document.getElementById("appointments");
let slotBook = document.getElementById("slotBook");

function validate() {
  let isvalid = true;

  let dvalid = document.querySelectorAll(".dvalid");

  let validated = document.querySelectorAll(".validated");
  console.log(validated)
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
  if (validate() && checkSelected() && date.value.trim()) {
    let selectDoctorId = doctor.options.selectedIndex;
    let selectedSlotId = appointments.options.selectedIndex;
    let slotId = appointments.children[selectedSlotId].dataset.sid;
    let fees = doctor.children[selectDoctorId].dataset.consultancy_fees;
    let doctorId = doctor.children[selectDoctorId].dataset.did;
    Swal.fire({
      title: `Pay rs. ${fees} for Book An Appointment`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "#d33",
      confirmButtonText: "Pay Now",
    }).then(async(result) => {
      if (result.isConfirmed) {
        let d = await fetch('/bookslot',{
          method:"POST",
          body:JSON.stringify({ paymentAmount:fees, slotId:slotId,doctorId:doctorId}),
          headers:{
            "Content-Type":"application/json"
          }
        })
        console.log(await d.json())
        
        Swal.fire("Payment Done!", "Your Slot is Booked", "success")
        .then((result)=>{
          if(result.isConfirmed){
            window.location.reload(); 
          }
        })
        // window.location.reload()
      }
    });
  }
});

// date validation
let today = new Date();
let minDate = today.toISOString().substring(0, 10);
date.setAttribute("min", minDate);

// generate Doctor combo according to speciality
async function generateDoctorCombo(optionId) {
  let data = await fetch("/getDoctors", {
    method: "POST",
    body: JSON.stringify({ id: optionId }),
    headers: {
      "Content-type": "application/json",
    },
  });

  data = await data.json();

  let doctors = document.getElementById("doctors");

  doctors.innerHTML = data.html;
}

// when speciality change then fetch doctor data according speciality value
specialities.addEventListener("change", async (e) => {
  if(specialities.value.trim()){
    specialities?.nextElementSibling?.remove()
  }
  checkSelected();
  let selectedIndex = specialities.options.selectedIndex;
  specialities.children[0].setAttribute("disabled", "true");
  let optionId = specialities.children[selectedIndex].dataset.unique;
  // console.log("dffdf",optionId);

  if (optionId) {
    await generateDoctorCombo(optionId);
  }
});

//when page loaded if any specialities is selected then fetch doctor according speciality value
window.addEventListener("load", async (e) => {
  let specialities = document.getElementById("specialities");
  checkSelected();
  date.value = "";
  if (specialities.value.trim()) {
    let selectedIndex = specialities.options.selectedIndex;
    specialities.children[0].setAttribute("disabled", "true");
    let optionId = specialities.children[selectedIndex].dataset.unique;
    await generateDoctorCombo(optionId);
  }
});

// when doctor value is not empty then you can select date otherwise not
doctor.addEventListener("change", async (e) => {
  if(doctor.value.trim()){
    doctor?.nextElementSibling?.remove()
  }
  if (doctor.value.trim()) {
    doctor.children[0].setAttribute("disabled", "true");
    date.removeAttribute("disabled");
  } else {
    date.setAttribute("disabled", "true");
  }
});

// when date is changed then fetch slots using doctorId and date
date.addEventListener("change", async (e) => {
  checkSelected();
  if(date.value.trim()){
    date?.nextElementSibling?.remove()
  }
  if (date.value.trim()) {
    let doctor = document.getElementById("doctors");
    let selectedIndex = doctor.options.selectedIndex;
    let doctorId = doctor.children[selectedIndex].dataset.did;

    let data = await fetch("/slots", {
      method: "POST",
      body: JSON.stringify({ doctor_id: doctorId, date: date.value }),
      headers: {
        "Content-type": "application/json",
      },
    });

    data = await data.json();
    appointments.innerHTML = data.html;
  }
});

appointments.addEventListener("change", async (e) => {
  if(appointments.value.trim()){
    appointments?.nextElementSibling?.remove()
  }
  appointments.children[0].setAttribute("disabled", "true");
});

// check that speciality and doctor is selected
// if selected then you have the permission to select date
function checkSelected() {
  let specialities = document.getElementById("specialities");
  let doctor = document.getElementById("doctors");
  if (specialities.value.trim() && doctor.value.trim()) {
    date.removeAttribute("disabled");
    return true;
  } else {
    date.setAttribute("disabled", "true");
    return false;
  }
}
