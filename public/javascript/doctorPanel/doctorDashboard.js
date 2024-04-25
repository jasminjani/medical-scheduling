
const fetchCountData = async () => {
  const fetchData = await fetch(`/dashBoardCount`)
  const data = await fetchData.json()
  let key = Object.keys(data[0])
  key.forEach(element => {
    if (element == 'patient') {
      document.getElementById(element).innerHTML = `<h4>${data[0][element]}</h4>`
    }
    if (element == 'revenue') {
      if(data[0][element] == null)
      {
        document.getElementById(element).innerHTML = `<h4>0</h4>`
      }
      else
      {
      document.getElementById(element).innerHTML = `<h4>${data[0][element]}</h4>`
      }
    }
    if (element == 'slot') {
      document.getElementById("appointment").innerHTML = `<h4>${data[0][element]}</h4>`
    }
  });
}
fetchCountData()

const fetchReviewData = async () => {

  const fetchData = await fetch(`/dashBoardReviews`)
  const data = await fetchData.json()
  let key = Object.keys(data)
  let feedbackCard = document.getElementById("feedbackCard")

  
  key.forEach(element => {

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
        para.style.height = '100px'
        para.style.width = '200px'
        para.style.overflow = 'scroll'
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
}


fetchReviewData()

// const fetchAppointMents = async () => {
//   let fetchData = await fetch('/dashBoardAppointments')
//   let data = await fetchData.json()
//   let key = Object.keys(data)
//   console.log(data);
//   console.log(key);
//   let count = 1;


//   key.forEach(element => {
//     let dtkey = Object.keys(data[element])
//     let table = document.getElementById("appointmentTable")
//     let div1 = document.createElement('div')
//     let countdiv = document.createElement("div")
//     countdiv.textContent = count++
//     div1.appendChild(countdiv)
//     div1.setAttribute("class", "a7-table-data")
//     dtkey.forEach(item => {
//       if (item == 'patient_id') {
//         let btn = document.createElement("div")
//         btn.textContent = "Add Prescription"
//         btn.setAttribute("id", "hh")
//         btn.setAttribute("onclick", `location.href ='/prescription/${data[element][item]}'`)
//         btn.setAttribute("class", "a7-btn-style a5-btn")
//         div1.appendChild(btn)
//       } else {

//         let divspan = document.createElement("div")
//         let span = document.createElement('span')
//         span.setAttribute("class", "a7-table-border")
//         span.textContent = data[element][item]
//         divspan.appendChild(span)
//         div1.appendChild(divspan)

//       }
//     });

//     table.appendChild(div1)
//   });
// }

// fetchAppointMents()


const fetchAppointmentData=async()=>{
  try{
    let fetchData = await fetch('/dashBoardAppointments')
    let data = await fetchData.json()
    let key = Object.keys(data[0])
    console.log("in fetchAppointmentData");
    console.log(data);
    console.log(key);

    data.forEach(function (element, index) {
          let table = document.getElementById("appointmentTable");
          let str = `
            <tr>
                <td>${index+1}</td>
                <td>${element.patient_name}</td>
                <td>${element.appointment_time}</td>
                <td><input type="button" value="Add Prescription" onclick="addPrescription(${element.patient_id},${element.booking_id})" id="addprescription-btn"></td>
                <td><input type="hidden" value="${element.booking_id}" id="booking_id"></td>
            </tr>`;
              table.innerHTML += str;
            });
  }
  catch(error){
    console.log(error);
  }

}

const addPrescription=async(patient_id,booking_id)=>{
  location.href =`/prescription/${patient_id}/${booking_id}`;
}

fetchAppointmentData();
