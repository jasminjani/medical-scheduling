const fetchCountData = async () => {
  const fetchData = await fetch(`/doctor/analytics`)
  const data = await fetchData.json()

  data.forEach(element => {
    document.getElementById("patient").innerHTML = `<h4>${element["patient"]}</h4>`

    if (element["revenue"] == null) {
      document.getElementById("revenue").innerHTML = `<h4>0</h4>`
    }
    else {
      document.getElementById("revenue").innerHTML = `<h4>${element["revenue"]}</h4>`
    }
    document.getElementById("appointment").innerHTML = `<h4>${element["slot"]}</h4>`
  });
}
fetchCountData()

const fetchReviewData = async () => {
  let feedbackCard = document.getElementById("feedbackCard")
  const fetchData = await fetch(`/doctor/reviews/all`)
  const data = await fetchData.json()
  let key = Object.keys(data)


  if (data.length == 0) {
    feedbackCard.innerHTML = "<h2 style='align-item:center'>Data Not Found!</h2>"
  }

  key.forEach(element => {
    `<div>
  </div>`
    let dtkey = Object.keys(data[element])

    let div1Card = document.createElement("div")
    div1Card.setAttribute("class", "a7-card-se6")
    let div2CardBox = document.createElement("div")
    div2CardBox.setAttribute("class", "a7-card-box-se6")
    let div3Color = document.createElement("div")
    div3Color.setAttribute("class", "a7-card-color-se6")
    let div4Profile = document.createElement("div")
    div4Profile.setAttribute("class", "a7-profile-se6")
    let div5Rating = document.createElement("div")
    div5Rating.setAttribute("class", "a7-rating-se6")
    let div6TextContent = document.createElement("div")
    div6TextContent.setAttribute("class", "a7-text-content-se6")
    let div7Signature = document.createElement("div")
    div7Signature.setAttribute("class", "a7-signature-se6")

    dtkey.forEach(item => {
      if (item == 'profile_picture') {
        let imageProfile = document.createElement("img")
        imageProfile.src = `/imgs/${data[element][item]}`
        div4Profile.appendChild(imageProfile)
      }
      else if (item == 'rating') {

        for (let i = 0; i < 5; i++) {

          if (i >= data[element][item]) {
            let img = document.createElement("img")
            img.style.height = "15px"
            img.style.width = "16px"
            img.src = `/assets/doctorPanel/star-empty-icon.webp`

            div5Rating.appendChild(img)
          }
          else {
            let img = document.createElement("img")
            img.style.height = "15px"
            img.style.width = "16px"
            img.src = `/assets/doctorPanel/images.png`
            div5Rating.appendChild(img)
          }

        }
      }
      else if (item == "review") {
        let para = document.createElement("p")
        para.setAttribute("class", "para-review")
        para.textContent = data[element][item]
        div6TextContent.appendChild(para)
      }
      else if (item == "Name") {
        let name = document.createElement("h3")
        name.textContent = data[element][item]
        div7Signature.appendChild(name)
      }
      else if (item == "email") {
        let email = document.createElement("p")
        email.textContent = data[element][item]
        div7Signature.appendChild(email)
      }
    });
    div3Color.appendChild(div4Profile)
    div3Color.appendChild(div5Rating)
    div3Color.appendChild(div6TextContent)
    div3Color.appendChild(div7Signature)
    div2CardBox.appendChild(div3Color)
    div1Card.appendChild(div2CardBox)
    feedbackCard.appendChild(div1Card)
  });
};


fetchReviewData()

const fetchAppointmentData = async () => {
  try {
    let table = document.getElementById("appointmentTable");
    let fetchData = await fetch('/doctor/appointments/today')
    let data = await fetchData.json()
    // console.log(data);
    if (data.length === 0) {
      table.innerHTML = "<h2 style='text-align: center; margin-top: 100px;'>Data Not Found!</h2>"
    }
    let timezoneoffset = new Date().getTimezoneOffset();
    data.forEach(function (element, index) {
      element.start_time = new Date(element.start_time).getTime();
      element.start_time -= (timezoneoffset * 60 * 1000);
      let startDate = element.start_time;
      element.start_time = new Date(element.start_time).toLocaleTimeString('en-US')

      element.end_time = new Date(element.end_time).getTime();
      element.end_time -= (timezoneoffset * 60 * 1000);
      element.end_time = new Date(element.end_time).toLocaleTimeString('en-US')

      let str = `
            <tr>
                <td>${index + 1}</td>
                <td>${element.patient_name}</td>
                <td>${element.start_time}-${element.end_time}</td>
                <td><input type="button" ${startDate >= Date.now() ? `disabled`: ''} value="Add Prescription" onclick="addPrescription(${element.booking_id})" id="addprescription-btn"></td>
                <td><input type="hidden" value="${element.booking_id}" id="booking_id"></td>
            </tr>`;
      table.innerHTML += str;
    });
  }
  catch (error) {
    console.log(error);
  }
}

const addPrescription = async (booking_id) => {

  location.href = `/doctor/prescription/${booking_id}`;

}

fetchAppointmentData();
