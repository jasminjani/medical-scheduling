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
  });

  // gender validation
  let male = document.getElementById("male");
  let feMale = document.getElementById("female");

  if (!male.checked && !feMale.checked) {
    let p = document.createElement("p");

    male.parentElement.insertAdjacentElement("afterend", p);

    p.innerHTML = "Select appropriate gender";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid = false;
  }

  let dob = document.getElementById("dob").value;
  let regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dob.match(regex)) {
    let p = document.createElement("p");
    document.getElementById("dob").after(p);
    p.innerHTML = "date format incorrect";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid = false;
  }

  return isvalid;
}

const postData = async () => {
  if (validate() && await specialitiesValidation()) {
    let id = document.getElementById("id").value;
    let hospital_id = document.getElementById("hospital_id").value;
    let doctor_id = document.getElementById("doctor_id").value;
    let profile_picture = document.getElementById("profile_picture");
    let fname = document.getElementById("firstname").value;
    let lname = document.getElementById("lastname").value;
    let hospitalname = document.getElementById("hospitalname").value;
    let consultancyfee = document.getElementById("consultancyfee").value;
    let qualification = document.getElementById("qualification").value;
    let dob = document.getElementById("dob").value;
    let phone = document.getElementById("phone").value;
    let male = document.getElementById("male");
    let female = document.getElementById("female");
    let city = document.getElementById("city").value;
    let address = document.getElementById("address").value;
    let gstno = document.getElementById("gstno").value;
    let location = document.getElementById("location").value;
    let speciality = document.getElementById("speciality").value;
    let pincode = document.getElementById("pincode").value;
    let gender = male.checked ? male.value : female.value;
    let otherSpeciality = document.getElementById('otherSpeciality').value;
    const formData = new FormData();
    formData.append("doctor_id", doctor_id);
    formData.append("hospital_id", hospital_id);
    formData.append("id", id);
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("name", hospitalname);
    formData.append("profile_picture", profile_picture.files[0]);
    formData.append("speciality", speciality);
    formData.append("dob", dob);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("consultancy_fees", consultancyfee);
    formData.append("qualification", qualification);
    formData.append("gst_no", gstno);
    formData.append("location", location);
    formData.append("pincode", pincode);
    formData.append("otherSpeciality",otherSpeciality);
    let fetchData = await fetch("/doctor/profile/update", {
      method: "POST",
      body: formData,
    });
    const { success, data } = await fetchData.json();
    if (success) {
      localStorage.setItem("userinfo", JSON.stringify(data[0]));
      Swal.fire({
        title: "Good job!",
        text: "Update Successfully!",
        icon: "success",
      }).then((result)=>{
        // console.log('fired')
      });
    }
  }
};
