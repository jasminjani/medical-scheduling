



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

  let dob = document.getElementById('dob').value
  let regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dob.match(regex)) {
    let p = document.createElement("p");
    document.getElementById("dob").after(p)
    p.innerHTML = "date format incorrect";
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    isvalid = false;
  }

  return isvalid;

}
validate()