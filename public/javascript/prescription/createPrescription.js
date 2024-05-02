
// const showDetails = async () => {
//   try{
//     let patient_id = document.getElementById("id").value;

//     let res = await fetch(`/createprescription/${patient_id}`);
//     const resjson = await res.json();
//     console.log(resjson)
//     const ele = document.getElementsByClassName("A4-table-content");
//     const keys = Object.keys(resjson.result[0]);
//     let i = 0;
//     keys.forEach((element) => {
//       if (element != "id") {
//         ele[i].innerText = resjson.result[0][element];
//         i++;
//       }
//     });
//     document.getElementById("id").value = resjson.result[0].id;
//   }
//   catch(error){
//     logger.error(error);
//   }
// };

// showDetails();

const removeError = async (id) => {
  document.getElementById(id).innerHTML = "";
};

// document.getElementsByClassName("A4-PrescriptionDetails")[0].style.display ="none";
// document.getElementById("A4-generatePdf").style.display = "none";

let insert_id;

const submitPrescription = async () => {
  try{
    if (!validate()) {
      return false;
    } else {
      // document.getElementsByClassName("A4-addPrescription")[0].style.display =
      //   "none";
      // document.getElementsByClassName("A4-PrescriptionDetails")[0].style.display =
      //   "none";
      // document.getElementById("A4-generatePdf").style.display = "block";

      const form = document.getElementById("myForm");
      const obj = new URLSearchParams(new FormData(form));
      let res = await fetch(`/doctor/prescription/create`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: obj,
      });
      let resjson=await res.json();
      await Swal.fire({
      position: "center",
      icon: "success",
      title: "Prescription has been saved",
      showConfirmButton: false,
      timer: 1500
      });
      insert_id = resjson.insert_id;
      location.href = location.origin+`/doctor/dashboard/`;
    }
  }
  catch(error){
    logger.error(error);
  }
};


const validate = async () => {
  
  const diagnosisval = document.getElementById("diagnosis").value;
  const prescriptionval = document.getElementById("prescription").value;
  
  try{
    if (diagnosisval.trim().length <= 0 || prescriptionval.trim().length <= 0) {
      document.getElementById("prescriptionerror").innerHTML ="both field must be filled out";
      return false;
    } else {
      return true;
    }
  }
  catch(error){
    logger.error(error);
  }
};

const generatePDF = async () => {
  location.href = `/generate/${insert_id}`;
};

const back = async () => {

  if(!insert_id){
    Swal.fire({
      title: "you've not added the prescription!are you sure you want to exit?",
      showCancelButton: true,
      confirmButtonText: "Exit",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        location.href = location.origin+`/doctor/dashboard/`;
      }
    });
  }
  else{
    location.href = location.origin+`/doctorDashboard/`;
  }
  
};


async function showDetails() {
  try {

    let slot_bookings_id = window.location.pathname.split("/").pop();
    // console.log(slot_bookings_id)
    const url = `/doctor/patient/prescription/${slot_bookings_id}`;
    let  response = await fetch(url)
    let result = await response.json();

    await appendPatientDetails(result);
  } catch (error) {
    console.log(error);
  }
}

showDetails();


async function appendPatientDetails(result) {
  try {

    let html = `<div class="a5-patient">
        <div class="a5-patient-img">
          <img src="/imgs/${result[0].profile_picture}" alt="image">
        </div>
        <div class="a5-patient-details">
          <h1>
            ${result[0].fname + " " + result[0].lname}
          </h1>
          <div class="a5-patient-more-detail">
            <div class="a5-details">
              <p><span class="a5-bold">Email :</span> ${result[0].email}
              </p>
              <p><span class="a5-bold">Contact :</span>${result[0].phone}
              </p>
              <p><span class="a5-bold">DOB :</span>${result[0].dob}
              </p>
            </div>
            <div class="a5-details">
              <p><span class="a5-bold">Gender :</span>${result[0].gender}
              </p>
              <p><span class="a5-bold">City :</span>${result[0].city}
              </p>
              <p><span class="a5-bold">Blood group :</span>${result[0].blood_group}
              </p>
            </div>
          </div>
          <div class="a5-patient-address">
            <p><span class="a5-bold">address : </span>${result[0].address}
            </p>
          </div>
        </div>
      </div>`;

    document.getElementById('a5-patient-basic-details').innerHTML = html;
  } catch (error) {
    console.log(error);
  }
}