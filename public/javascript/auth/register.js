let submit = document.getElementById("submit");

function dateValidation(year, month, day) {
  let isvalid = true;

  if (isNaN(year.value.trim())) {
    let p = document.createElement("p");
    year.insertAdjacentElement("afterend", p);
    p.innerHTML = "*Enter Number Only";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid = false;
  } else if (year.value.trim() && year.value.trim().length !== 4) {
    let p = document.createElement("p");
    year.insertAdjacentElement("afterend", p);
    p.innerHTML = "*Invalid Year";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid = false;
  } else if (
    year.value.trim() &&
    Number(year.value.trim()) > new Date().getFullYear()
  ) {
    let p = document.createElement("p");
    
    year.insertAdjacentElement("afterend", p);
    p.innerHTML = "*Invalid Year";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid = false;
  }

  if (isNaN(month.value.trim())) {
    let p = document.createElement("p");
    month.insertAdjacentElement("afterend", p);
    p.innerHTML = "*Enter Number Only";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid = false;
  } else if (
    month.value.trim() &&
    (month.value.trim().length > 2 ||
      Number(month.value) == 0 ||
      Number(month.value) > 12)
  ) {
    let p = document.createElement("p");
    month.insertAdjacentElement("afterend", p);
    p.innerHTML = "*Invalid Month";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid = false;
  }

  if (isNaN(day.value.trim())) {
    let p = document.createElement("p");
    day.insertAdjacentElement("afterend", p);
    p.innerHTML = "*Enter Number Only";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid = false;
  } else if (
    day.value.trim() &&
    (day.value.trim().length > 2 ||
      Number(day.value) == 0 ||
      Number(day.value) > 31)
  ) {
    let p = document.createElement("p");
    day.insertAdjacentElement("afterend", p);
    p.innerHTML = "*Invalid Day";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid = false;
  }
  return isvalid;
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

    if (field.name == "email" && field.value.trim() !== "") {
      const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      if (!field.value.match(emailRegex)) {
        let p = document.createElement("p");
        field.insertAdjacentElement("afterend", p);
        p.innerHTML = "Invalid Email syntax";
        p.classList.add("validated");
        p.style.color = "red";
        p.style.margin = "0";
        p.style.fontSize = "12px";
        isvalid = false;
      }
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
  
  //date of birth validation
  let year = document.getElementById("year");
  let month = document.getElementById("month");
  let day = document.getElementById("day");
  let isValidDate = dateValidation(year, month, day);

  if (isValidDate && isvalid && year.value && month.value && day.value) {
    let date = `${year.value.trim()}-${month.value.trim()}-${day.value.trim()}`;
    if (isNaN(new Date(date))) {
      let p = document.createElement("p");
      year.parentElement.parentElement.insertAdjacentElement("afterend", p);
      p.innerHTML = "*Invalid Date";
      p.classList.add("validated");
      p.style.color = "red";
      p.style.margin = "0";
      p.style.fontSize = "12px";
      isvalid = false;
    }
  }

  return isvalid;
}

let password = document.getElementById('password')


function passwordValidation (){
  let validated = document.querySelectorAll(".validated");

  // remove if any error message is in frontend
  if (validated?.length) {
    validated.forEach((item) => {
      item.remove();
    });
  }
  let p = document.createElement("p");
  password.insertAdjacentElement("afterend", p);
  p.classList.add("validated");
  p.style.color = "red";
  p.style.margin = "0";
  p.style.fontSize = "12px";
  let isvalid = true;
  if(password.value.length<8){
    p.innerHTML = "password must be at least 8 characters";
    isvalid = false;
  }
  else if(password.value.search(/[a-zA-Z]/i)<0){
    p.innerHTML = "password must contain at least one letter";
    isvalid = false;
  }
  else if(password.value.search(/[0-9]/)<0){
    p.innerHTML = "password must contain at least one digit";
    isvalid = false;
  }
  else if(password.value.search(/[*?[#@$?]/)<0){
    p.innerHTML = "password must contain at least one special character";
    isvalid = false;
  }
  else{
    isvalid = true;
  }
  return isvalid;
}

password.addEventListener('keyup',()=>{
  passwordValidation();
})


submit.addEventListener("click", async (e) => {
  e.preventDefault();

  if (validate() && passwordValidation()) {
    // get data and
    let fname = document.getElementById("fname").value;
    let lname = document.getElementById("lname").value;
    let email = document.getElementById("email").value;
    let year = document.getElementById("year").value;
    let month = document.getElementById("month").value;
    let day = document.getElementById("day").value;
    let phone = document.getElementById("phone").value;
    let male = document.getElementById("male");
    let female = document.getElementById("female");
    let city = document.getElementById("city").value;
    let address = document.getElementById("address").value;
    let profile = document.getElementById("profile");
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let gender = male.checked ? male.value : female.value;
    let dob = `${year}-${month}-${day}`;
    // create formData
    const formData = new FormData();
    formData.append("fname", fname);
    formData.append("lname", lname);
    formData.append("email", email);
    formData.append("dob", dob);
    formData.append("phone", phone);
    formData.append("gender", gender);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("profile", profile.files[0]);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    // make registration request
    if (password === confirmPassword) {
      let data = await fetch("/register", {
        method: "post",
        body: formData,
      });

      data = await data.json();
   
      if (data?.success) {
        let activelink = document.getElementsByClassName("active-link");
        for (let i = 0; i < activelink.length; i++) {
          activelink[i].remove();
        }
        let p = document.createElement("p");
        p.classList.add("active-link");
        p.innerHTML = `<a href="/account-activation/?activationKey=${data.user.activation_token}&email=${data.user.email}" target="_blank">Click Here</a> to Activate Account!`;
        document.querySelector(".link").innerHTML = p.innerHTML;
        document.querySelector(".link").style.color = "black";
      } else {
        document.querySelector(".link").innerHTML = `<p>${data.message}</p>`;
        document.querySelector(".link").style.color = "red";
      }
    }
    else{
      let msg = document.querySelector('.link');
      msg.innerHTML = "Password and confirmPassword doesn't match"
      msg.style.color = "red";
    }
  }
});
