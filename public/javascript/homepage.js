const search = document.getElementById("search-doctor");
const becomeDoctor = document.getElementById("become-doctor");
let data;

const getDoctors = async () => {
  try {
    data = await fetch("/alldoctors", {
      method: "GET",
    });
    data = await data.json();
    data = data.data;

    localStorage.setItem("doctors", JSON.stringify(data));
    putDoctorOnScreen(data);
    setDatalist(data);
  } catch (error) {
    console.log(error);
  }
};

const setDatalist = (data) => {
  let nameOptions = document.querySelector("#doctor-name");

  let datalistOptions = "";

  data.forEach((doctor) => {
    // push doctor Name into datalist for searching
    datalistOptions += `<option value="${doctor.fname + " " + doctor.lname
      }" data-did="${doctor.id}">${doctor.fname + " " + doctor.lname}</option>`;
  });

  nameOptions.innerHTML = datalistOptions;
};

const putDoctorOnScreen = async (data) => {
  let cards = document.querySelector(".cards");

  let card = "";

  if (data.length <= 0) {
    cards.style.justifyContent = "center";
    return (cards.innerHTML = "<p class='not-found'>No Data Found !</p>");
  }

  data.forEach((doctor) => {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i > Math.ceil(Number(doctor.rating)) - 1) {
        stars += `<img src="/assets/bstar.png" width="15px" alt="">`;
      } else {
        stars += `<img src="/assets/gstar.png" width="15px" alt="">`;
      }
    }

    card += `<div class="card">
    <a href="/patient/bookslots/${doctor.id}" class="img">
      <img src="/imgs/${doctor.profile_picture}" alt="" >
    </a>
    <div class="details">
      <p class="name">${doctor.fname + " " + doctor.lname}</p>
      </div>
      <div class="specialities">
        ${doctor.specialities
        .map((speciality) => {
          return `<p class="speciality">${speciality}</p>`;
        })
        .join("")}
      </div>
    <p class="rating">
     ${stars} <span class="total-reviews">(${doctor.total_reviews})</span>
    </p>
  </div>`;
  });

  // if cards div has j-c : center then make it fs
  if (data.length > 4) {
    let swipebtns = document.querySelector(".swipe-btns");
    swipebtns.innerHTML = `<button class="left-swipe"><<</button>
    <button class="right-swipe">>></button>`;
    carousel();
  }
  cards.style.justifyContent = "start";
  cards.innerHTML = card;
};

search.addEventListener("click", async (e) => {
  let speciality = document.getElementById("speciality");
  let doctorName = document.getElementById("dname");
  let doctorCity = document.getElementById('a5-doctorCity');

  if (speciality.value && doctorName.value && doctorCity.value) {
    let filteredDoctor = data.filter((doctor) => {
      return (doctorName.value === doctor.fname + " " + doctor.lname && doctor.specialities.includes(speciality.value) && doctor.city.includes(doctorCity.value));
    });
    putDoctorOnScreen(filteredDoctor);

  } else if (speciality.value && doctorName.value) {
    let filteredDoctor = data.filter((doctor) => {
      return (doctorName.value === doctor.fname + " " + doctor.lname && doctor.specialities.includes(speciality.value));
    });
    putDoctorOnScreen(filteredDoctor);

  } else if (doctorName.value && doctorCity.value) {
    let filteredDoctor = data.filter((doctor) => {
      return (doctorName.value === doctor.fname + " " + doctor.lname && doctor.city.includes(doctorCity.value));
    });
    putDoctorOnScreen(filteredDoctor);

  } else if (speciality.value && doctorCity.value) {
    let filteredDoctor = data.filter((doctor) => {
      return (doctor.specialities.includes(speciality.value) && doctor.city.includes(doctorCity.value));
    });
    putDoctorOnScreen(filteredDoctor);

  } else if (speciality.value) {
    let filteredDoctor = data.filter((doctor) => {
      return doctor.specialities.includes(speciality.value);
    });
    putDoctorOnScreen(filteredDoctor);

  } else if (doctorName.value) {
    let filteredDoctor = data.filter((doctor) => {
      return doctorName.value === doctor.fname + " " + doctor.lname;
    });
    putDoctorOnScreen(filteredDoctor);

  } else if (doctorCity.value) {
    let filteredDoctor = data.filter((doctor) => {
      return doctor.city.includes(doctorCity.value);
    });

    putDoctorOnScreen(filteredDoctor);

  } else {
    putDoctorOnScreen(data);
  }
});

becomeDoctor?.addEventListener("click", async (e) => {
  e.preventDefault();
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));
  let data = await fetch("/patient/doctor/pending", {
    method: "post",
    body: JSON.stringify({ id: userInfo.id }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  data = await data.json();

  if (data.success) {
    window.location.href = "/patient/create";
  } else {
    Swal.fire({
      icon: "success",
      title: "Already Requested",
      // text: "Something went wrong!",
      footer: '<p style="color: #7066e0; cursor: pointer;" onclick="statusKnown()">Know Status!</p>'
    });
  }
});

async function statusKnown() {
  const userStatus = await fetch("/patient/knowStatus")
  const data = await userStatus.json()
  if (data[0]["approved"] == -1) Swal.fire({
    icon: "error",
    title: "Request Rejected!",
    footer: '<a href="/patient/updateBecomeDoctorDetails" style="color: #7066e0; cursor: pointer;" onclick="statusKnown()">Update Details</a>'
  });
  if (data[0]["approved"] == 0) Swal.fire("Request Pending!", "", "info")
}

async function isLoggedIn() {
  let user = await fetch("/current-user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if(user.headers.get("content-type").split(";")[0] == "text/html"){
    return false;
  }
  user = await user.json();

  if (user.success) {
    return true;
  }
  return false;
}

const toggleLoginLogout = async () => {
  let userInfo = JSON.parse(localStorage.getItem("userinfo"));

  if (isLoggedIn() && userInfo) {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "none";
    document.getElementById("logout").style.display = "block";

    document.getElementById("logged-user").style.display = "flex";
    document.querySelector("#logged-user .name").innerHTML = userInfo.fname;
    document
      .querySelector("#logged-user .logo a img")
      .setAttribute(
        "src",
        `${userInfo.profile.trim()
          ? `/imgs/${userInfo.profile}`
          : `/assets/profile.png`
        }`
      );

    let userRedirect = document.querySelector("#logged-user .logo a");

    if (userInfo.role_id == 1) {
      userRedirect.setAttribute("href", "/");
    } else if (userInfo.role_id == 2) {
      document.getElementById("patient-dashboard")?.remove();
      document.getElementById("become-doctor")?.remove();
      document.getElementById("book-appointment")?.remove();
      userRedirect.setAttribute("href", "/doctor/dashboard");
    } else if (userInfo.role_id == 3) {
      document.getElementById("patient-dashboard")?.remove();
      document.getElementById("book-appointment")?.remove();
      document.getElementById("become-doctor")?.remove();
      userRedirect.setAttribute("href", "/admin");
    }
  } else {
    document.getElementById("login").style.display = "block";
    document.getElementById("register").style.display = "block";
    document.getElementById("logout").style.display = "none";
  }
};

if (window.location.pathname == "/") {
  window.onload = toggleLoginLogout;
}

getDoctors();



// contcat us 



async function sendMessage() {

  let isValid = isValidMessage();

  if (isValid) {
    const form = document.getElementById('a2-contact-form-id');
    const formData = new FormData(form);
    const data = new URLSearchParams(formData);

    let resp = await fetch('/contact-message', {
      method: 'post',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    })

    let { success } = await resp.json();
    if (success) {
      form.reset();
      Swal.fire({
        title: "Thank You !",
        text: "We will get back shortly.",
        icon: "success"
      });
    }
  }
}

function isValidMessage() {
  const name = document.getElementById('a2-name').value.trim();
  const mobile_no = document.getElementById('a2-mobile-no').value.trim();
  const email = document.getElementById('a2-email').value.trim();
  const city = document.getElementById('a2-city').value.trim();
  const role = document.getElementById('a2-role').value;
  const message = document.getElementById('a2-message').value.trim();
  const error = document.getElementById('a2-error-msg');

  let isValid = true;
  const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;


  if (!message) {
    error.innerHTML = "Write message";
    isValid = false;
  }
  if (!role) {
    error.innerHTML = "Write Choice Role";
    isValid = false;

  }
  if (!city) {
    error.innerHTML = "Write City";
    isValid = false;

  }
  if (!email.match(emailRegex)) {
    error.innerHTML = "Write Currect Email";
    isValid = false;

  }
  if (!mobile_no.match(/[0-9]{10}/)) {
    error.innerHTML = "Write Currect Mobile Number";
    isValid = false;

  }
  if (!name) {
    error.innerHTML = "Write full name";
    isValid = false;
  }

  if (isValid) {
    error.innerHTML = ''
  }
  return isValid;

}


