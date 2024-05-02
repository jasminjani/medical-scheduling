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

    if (field.name == "email" && field.value.trim() !== "") {
      const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      if (!field.value.match(emailRegex)) {
        let p = document.createElement("p");
        field.insertAdjacentElement("afterend", p);
        p.innerHTML = "Invalid Email syntax ";
        p.classList.add("validated");
        p.style.color = "red";
        p.style.margin = "0";
        p.style.fontSize = "12px";
        isvalid = false;
      }
    }
  });

  return isvalid;
}

let email = document.getElementById("email");
let password = document.getElementById("password");

function emailValidation() {
  let validated = document.querySelectorAll(".validated");

  // remove if any error message is in frontend
  if (validated?.length) {
    validated.forEach((item) => {
      item.remove();
    });
  }
  let isvalid = true;
  const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  if (!email.value.match(emailRegex)) {
    let p = document.createElement("p");
    email.insertAdjacentElement("afterend", p);
    p.innerHTML = "Invalid Email syntax ";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid= false;
  }
  return isvalid;
}

function passwordValidation() {
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
  if (password.value.length < 8) {
    p.innerHTML = "password must be at least 8 characters";
    isvalid = false;
  } else if (password.value.search(/[a-zA-Z]/i) < 0) {
    p.innerHTML = "password must contain at least one letter";
    isvalid = false;
  } else if (password.value.search(/[0-9]/) < 0) {
    p.innerHTML = "password must contain at least one digit";
    isvalid = false;
  } else if (password.value.search(/[*?[#@$?]/) < 0) {
    p.innerHTML = "password must contain at least one special character";
    isvalid = false;
  } else {
    isvalid = true;
  }
  return isvalid;
}

email.addEventListener("keyup", () => {
  emailValidation();
});

password.addEventListener("keyup", () => {
  passwordValidation();
});

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (validate() && emailValidation() && passwordValidation()) {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email.trim() && password.trim()) {
      let data = await fetch("/login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      data = await data.json();

      if (data.success) {
        localStorage.setItem("userinfo", JSON.stringify(data.user));
        if (data.user.role_id == 1) {
          window.location = "/";
        } else if (data.user.role_id == 2) {
          window.location = "/doctor/dashboard";
        } else if (data.user.role_id == 3) {
          window.location = "/admin";
        }
      } else {
        document.querySelector(".link").innerHTML = `<p>${data.message}</p>`;
        document.querySelector(".link").style.color = "red";
      }
    }
  }
});

let forgotPass = document.getElementById("forgot-password");
