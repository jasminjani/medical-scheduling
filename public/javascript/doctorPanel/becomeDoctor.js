let submit = document.getElementById('submit');

async function specialitiesValidation(){
  let newSpeciality = document.getElementById('otherSpeciality');
  let isValid = true;
  const fetchData = await fetch("/specialities");
  const specialities = await fetchData.json();

  await specialities.forEach(Element => {
    // console.log("specialitie : ",Element.speciality.toLowerCase());
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
    dvalid.forEach( async (field) => {
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

        if(newSpeciality.value.trim() === "") {             
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

    if(validate() && await specialitiesValidation()){
    
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