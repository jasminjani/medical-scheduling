let submit = document.getElementById("submit");

function validate() {
  let isvalid = true;
  let errors = document.querySelectorAll('.error');

  errors.forEach((error)=>{
    error.remove();
  })
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

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (validate()) {
    let email = document.getElementById("email").value;

    if (email.trim()) {
      let data = await fetch("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      data = await data.json();
     

      if (data.success) {
        let div = document.createElement("div");
        div.classList.add("active-link");

        let html = `
                    <div>
                      <p>Create New Password Link</p>
                      <a href="/forgot?token=${data.token}&email=${email}">/forgot?token=${data.token}&email=${email}</a>
                      </div>
              `;

        div.innerHTML = html;

        document.querySelector(".container").appendChild(div);
      } else {
        let errors = document.querySelectorAll('.error');

        errors.forEach((error)=>{
          error.remove();
        })
        let p = document.createElement("p");
        p.classList.add("error");
        p.style.color = "red";
        p.style.textAlign = "center";
        p.style.paddingTop = "15px";
        p.innerHTML = "Invalid Email!";
        document.querySelector(".container").appendChild(p);
      }
    }
  }
});
