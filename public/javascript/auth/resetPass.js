let submit = document.getElementById("submit");

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

let password = document.getElementById('password');

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
    let password = document.getElementById("password").value;
    let confirmPassword =
      document.getElementById("confirmPassword").value; 

    if (
      password.trim() &&
      confirmPassword.trim() &&
      password.trim() === confirmPassword.trim()
    ) {
      let data = await fetch(
        `/forgot/change-password${window.location.search}`,
        {
          method: "POST",
          body: JSON.stringify({
            password: password,
            confirmPassword: confirmPassword,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      data = await data.json();
    

      if (data.success) {
        Swal.fire({
          title: `Password Updated Successfully !`,
          icon: "success",
        }).then(async (result) => {
          if (result.isConfirmed) {
            window.location="/login"
          }
        });

      } else {
        let errors = document.querySelectorAll(".error");
        if (errors.length > 0) {
          errors.forEach((error) => error.remove());
        }
        let p = document.createElement("p");
        p.classList.add("error");
        p.style.color = "red";
        p.style.textAlign = "center";
        p.style.paddingTop = "15px";
        p.innerHTML = data?.message;
        document.querySelector(".container").appendChild(p);
      }
    } else {
      let errors = document.querySelectorAll(".error");
     
      if (errors.length > 0) {
        errors.forEach((error) => error.remove());
      }
      let p = document.createElement("p");
      p.classList.add("error");
      p.style.color = "red";
      p.style.textAlign = "center";
      p.style.paddingTop = "15px";
      p.innerHTML = "password and confirmpassword doesn't match";
      document.querySelector(".container").appendChild(p);
    }
  }
});