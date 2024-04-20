const search = document.getElementById("search-doctor");
var data;

const getDoctors = async () => {
  try {
    data = await fetch("/alldoctors", {
      method: "GET",
    });
    data = await data.json();
    data = data.data;
    console.log(data);
    localStorage.setItem('doctors',JSON.stringify(data))
    putDoctorOnScreen(data);
    setDatalist(data);
  } catch (error) {
    console.log(error);
  }
};

const setDatalist = (data) => {
  let nameOptions = document.querySelector("#doctor-name");

  let datalistOptions = "";

  data.forEach((doctor)=>{
    // push doctor Name into datalist for searching
    datalistOptions += `<option value="${
      doctor.fname + " " + doctor.lname
    }" data-did="${doctor.id}">${doctor.fname + " " + doctor.lname}</option>`;
  })

  nameOptions.innerHTML = datalistOptions;
};

const putDoctorOnScreen = async (data) => {
  let cards = document.querySelector(".cards");

  let card = "";

  if (data.length > 4) {
    let swipebtns = document.querySelector(".swipe-btns");
    swipebtns.innerHTML = `  <button class="left-swipe"><<</button>
    <button class="right-swipe">>></button>`;
  }

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
    <a href="/bookslots/${doctor.id}" class="img">
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
  cards.style.justifyContent = "start";
  cards.innerHTML = card;
};

search.addEventListener("click", async (e) => {
  let speciality = document.getElementById("speciality");
  let doctorName = document.getElementById("dname");

  if (speciality.value && doctorName.value) {
    let filteredDoctor = data.filter((doctor) => {
      return doctorName.value === doctor.fname + " " + doctor.lname;
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
  } else {
    putDoctorOnScreen(data);
  }
});

getDoctors();
