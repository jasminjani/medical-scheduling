let submit = document.getElementById('submit');
let update = document.getElementById('update');

async function specialitiesValidation() {

  let isValid = true;
  let otherSpeciality_id;

  const fetchData = await fetch("/specialities");
  const specialities = await fetchData.json();

  await specialities.forEach(element => {
    if (element.speciality.toLowerCase() == "other") {
      otherSpeciality_id = element.speciality_id
    }
  })

  if (document.getElementById('speciality').value == otherSpeciality_id) {

    let newSpeciality = document.getElementById('otherSpeciality');

    if (newSpeciality.value.trim() === "") {
      let p = document.createElement("p");
      newSpeciality.insertAdjacentElement("afterend", p);
      p.innerHTML = "*required";
      p.classList.add("validated");
      p.style.color = "red";
      p.style.margin = "0";
      p.style.fontSize = "12px";
      isValid = false;
    }

    await specialities.forEach(Element => {
      if (Element.speciality.toLowerCase() == newSpeciality.value.toLowerCase()) {
        let p = document.createElement("p");
        newSpeciality.insertAdjacentElement("afterend", p);
        p.innerHTML = "speciality already exist";
        p.classList.add("validated");
        p.style.color = "red";
        p.style.margin = "0";
        p.style.fontSize = "12px";
        isValid = false;
      }
    })

    // let newSpeciality = document.getElementById('otherSpeciality').value;
    // const fetchData = await fetch("/specialities");
    // const specialities = await fetchData.json();
    // if (speciality == 24 ) {
    //   specialities.forEach(Element => {
    //     console.log("specialitie : ",Element.speciality);
    //     if (Element.speciality == newSpeciality) { console.log("speciality already exist"); }
    //   })
    // }
  }

  return isValid;
}

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
  dvalid.forEach(async (field) => {
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

    if (field.name == "speciality" && field.value == 24) {

      let newSpeciality = document.getElementById('otherSpeciality');
      // document.getElementById('otherSpeciality').classList.add("dvalid");

      if (newSpeciality.value.trim() === "") {
        let p = document.createElement("p");
        newSpeciality.insertAdjacentElement("afterend", p);
        p.innerHTML = "*required";
        p.classList.add("validated");
        p.style.color = "red";
        p.style.margin = "0";
        p.style.fontSize = "12px";
        isvalid = false;
      }
    }

    // let newSpeciality = document.getElementById('otherSpeciality').value;
    // const fetchData = await fetch("/specialities");
    // const specialities = await fetchData.json();
    // if (speciality == 24 ) {
    //   specialities.forEach(Element => {
    //     console.log("specialitie : ",Element.speciality);
    //     if (Element.speciality == newSpeciality) { console.log("speciality already exist"); }
    //   })
    // }

    if (
      field.name == "phone" &&
      field.value.trim() !== "" &&
      field.value.trim().length !== 10
    ) {
      let p = document.createElement("p");
      field.insertAdjacentElement("afterend", p);
      p.innerHTML = "mobile number length should be 10";
      p.classList.add("validated");
      p.style.color = "red";
      p.style.margin = "0";
      p.style.fontSize = "12px";
      isvalid = false;
    }

    if (
      field.name == "consultancy_fees" &&
      field.value.trim() !== "" &&
      isNaN(field.value.trim())
    ) {
      let p = document.createElement("p");
      field.insertAdjacentElement("afterend", p);
      p.innerHTML = "Please enter a Number";
      p.classList.add("validated");
      p.style.color = "red";
      p.style.margin = "0";
      p.style.fontSize = "12px";
      isvalid = false;
    }

    if (
      field.name == "pincode" &&
      field.value.trim() !== "" &&
      isNaN(field.value.trim())
    ) {
      let p = document.createElement("p");
      field.insertAdjacentElement("afterend", p);
      p.innerHTML = "Please enter a Number";
      p.classList.add("validated");
      p.style.color = "red";
      p.style.margin = "0";
      p.style.fontSize = "12px";
      isvalid = false;
    }
    else if (
      field.name == "pincode" &&
      field.value.trim() !== "" &&
      field.value.trim().length !== 6
    ) {
      let p = document.createElement("p");
      field.insertAdjacentElement("afterend", p);
      p.innerHTML = "Please enter a valid number";
      p.classList.add("validated");
      p.style.color = "red";
      p.style.margin = "0";
      p.style.fontSize = "12px";
      isvalid = false;
    }
  });

  return isvalid;
}




submit.addEventListener('click', async (e) => {
  e.preventDefault();

  if (validate() && await specialitiesValidation()) {

    let qualification = document.getElementById('qualification').value
    let consultancyFees = document.getElementById('consultancy_fees').value
    // let phone = document.getElementById('phone').value
    let speciality = document.getElementById('speciality').value
    let hname = document.getElementById('hname').value
    let hlocation = document.getElementById('address').value
    let gstno = document.getElementById('gst').value
    let hcity = document.getElementById('city').value
    let pincode = document.getElementById('pincode').value
    let otherSpeciality = document.getElementById('otherSpeciality').value;

    let data = await fetch('/patient/create', {
      method: "post",
      body: JSON.stringify({ otherSpeciality: otherSpeciality, speciality: speciality, name: hname, location: hlocation, gst_no: gstno, city: hcity, pincode: pincode, qualification: qualification, consultancy_fees: consultancyFees }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    data = await data.json();

    if (data.success) {
      window.location = "/patient"
    }
    else {
      document.querySelector('.link').innerHTML = data.message
      document.querySelector('.link').style.color = "red";
    }

  }
})



const fetchUpdateData = async () => {
  const fetchData = await fetch("/patient/updateBecomeDoctorData")
  const data = await fetchData.json()
  data.forEach(element => {
    document.getElementById("qualification").value = element["qualification"]
    document.getElementById("consultancy_fees").value = element["consultancy_fees"]
    document.getElementById("speciality").value = element["speciality_id"]
    document.getElementById("hname").value = element["hospital_name"]
    document.getElementById("address").value = element["location"]
    document.getElementById("gst").value = element["gst_no"]
    document.getElementById("city").value = element["city"]
    document.getElementById("pincode").value = element["pincode"]
    document.getElementById("hospital_id").value = element["hospital_id"]
    document.getElementById("doctor_details_id").value = element["doctor_details_id"]
  });
}

fetchUpdateData()


const postUpdateData = async () => {

  if (validate() && await specialitiesValidation()) {
    let doctor_details_id = document.getElementById("doctor_details_id").value
    let hospital_id = document.getElementById("hospital_id").value
    let qualification = document.getElementById("qualification").value
    let consultancy_fees = document.getElementById("consultancy_fees").value
    let speciality_id = document.getElementById("speciality").value
    let hospital_name = document.getElementById("hname").value
    let address = document.getElementById("address").value
    let gst_no = document.getElementById("gst").value
    let city = document.getElementById("city").value
    let pincode = document.getElementById("pincode").value
    let otherSpeciality = document.getElementById('otherSpeciality').value;


    let fetchData = await fetch("/patient/updateBecomeDoctorDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "otherSpeciality": otherSpeciality,"doctor_details_id": doctor_details_id, "hospital_id": hospital_id, "qualification": qualification, "consultancy_fees": consultancy_fees, "speciality_id": speciality_id, "hospital_name": hospital_name, "address": address, "gst_no": gst_no, "city": city, "pincode": pincode })
    })

    const { success } = await fetchData.json()
    if (success) {
      Swal.fire({
        title: "Update Successfully!",
        icon: "success"
      });
      window.location = "/"


    }

  }
}




update.addEventListener("click", postUpdateData)

if (window.location.pathname == "/patient/updateBecomeDoctorDetails") {
  submit.style.display = "none"
  update.style.display = "block"
}