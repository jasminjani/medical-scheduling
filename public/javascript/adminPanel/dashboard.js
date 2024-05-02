let data;

const getDoctors = async () => {
  try {
    data = await fetch("/alldoctors", {
      method: "GET",
    });
    data = await data.json();
    data = data.data;

    localStorage.setItem('doctors', JSON.stringify(data))
    putDoctorOnScreen(data);
  } catch (error) {
    console.log(error);
  }
};


const putDoctorOnScreen = async (data) => {
  let cards = document.querySelector(".cards");

  let card = "";

  if (data.length > 4) {
    let swipebtns = document.querySelector(".swipe-btns");
    swipebtns.innerHTML = `<button class="left-swipe"><<</button>
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
    <p class="img">
      <img src="/imgs/${doctor.profile_picture}" alt="" >
    </p>
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
  carousel();
};

getDoctors();