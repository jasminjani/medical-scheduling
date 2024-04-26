let submit = document.getElementById('submit');
let update = document.getElementById('update');

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
        field.value.trim().length !==6
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
  



submit.addEventListener('click',async(e)=>{
    e.preventDefault();

    if(validate()){
    
    let qualification = document.getElementById('qualification').value
    let consultancyFees = document.getElementById('consultancy_fees').value
    let phone = document.getElementById('phone').value
    let speciality = document.getElementById('speciality').value
    let hname = document.getElementById('hname').value
    let hlocation = document.getElementById('address').value
    let gstno = document.getElementById('gst').value
    let hcity = document.getElementById('city').value
    let pincode = document.getElementById('pincode').value
    
    let data = await fetch('/patient/create',{
        method:"post",
        body:JSON.stringify({speciality:speciality,name:hname,location:hlocation,gst_no:gstno,city:hcity,pincode:pincode,qualification:qualification,consultancy_fees:consultancyFees}),
        headers:{
            "Content-Type":"application/json"
        }
    });

    data = await data.json();

    if(data.success){
        window.location = "/patient"
    }
    else{
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

  if (validate()) {
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


    let fetchData = await fetch("/patient/updateBecomeDoctorDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "doctor_details_id": doctor_details_id, "hospital_id": hospital_id, "qualification": qualification, "consultancy_fees": consultancy_fees, "speciality_id": speciality_id, "hospital_name": hospital_name, "address": address, "gst_no": gst_no, "city": city, "pincode": pincode })
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

if (window.location.href == "http://localhost:8000/patient/updateBecomeDoctorDetails") {
  submit.style.display = "none"
  update.style.display = "block"
}