let submit = document.getElementById('submit');


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
    
    let data = await fetch('/doctorCreateProfile',{
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