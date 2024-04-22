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
  




submit.addEventListener('click', async (e) => {
    e.preventDefault();
    if (validate()) {
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        if(email.trim() && password.trim()){
            let data = await fetch('/login', {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
                headers: {
                    "Content-Type": "application/json",
                }
            })
    
            data = await data.json();
            console.log(data);
            
            if (data.success) {
                localStorage.setItem('userinfo',JSON.stringify(data.user))
                window.location = "/"
            }
            else{
                document.querySelector('.link').innerHTML = `<p>${data.message}</p>`;
                document.querySelector('.link').style.color = "red";
            }
        }

    }
});

let forgotPass = document.getElementById('forgot-password');