const patientAppointmentDetail = async () => {

  let fetchdata = await fetch(`/getpatientHistoryData/${Id}`)
  let data = await fetchdata.json()
  let key = Object.keys(data)
  key.forEach(element => {
    let dtkey = Object.keys(data[element])
    dtkey.forEach(item => {
      if (item == "Appointment Date") {

        document.getElementById("trdetail").innerHTML += `
              <tr>
              <td class="tddata">${data[element][item]}</td>
              <td>
                  <p onclick=show('a5-popup','${data[element][item]}') class="a5-btn">Detail</p>
                </td>
                </tr>`
      }
    });
  });
}

const profileDetailData = async () => {
  let fetchData = await fetch(`/viewPatientDetailsData/${Id}`)
  let data = await fetchData.json()
  let Key = Object.keys(data[0])
  Key.forEach(item => {
    if (item == "profile_picture") {
      document.getElementById("patientProfile").innerHTML = `  <img src='/imgs/${data[0][item]}' alt="image" >`
    }
    if (item == "Name") {
      document.getElementById("patientname").innerHTML = data[0][item]
    }
    if (item == 'Date of Birth' || item == 'Email' || item == 'Contact') {
      document.getElementById("patientbasicdetail").innerHTML += `

              <p><span class="a5-bold">${item}:</span>
                  ${data[0][item]}
              </p>`
    }
    if (item == 'Gender' || item == 'Blood Group' || item == 'City') {
      document.getElementById("patientaddressdetail").innerHTML += `
              <p><span class="a5-bold">${item}:</span>
                  ${data[0][item]}
              </p>`
    }
    if (item == "Address") {
      document.getElementById("patientaddress").innerHTML +=
        `<p><span class="a5-bold">${item}: </span>
         ${data[0][item]}
      </p>`
    }


  });
}


funcId = function (id) {
  return document.getElementById(id);
}

let show = async function (id, date) {

  const fetchData = await fetch(`/patientPrescriptionData/${Id}/${date}`)
  const data = await fetchData.json()
  const key = Object.keys(data)

  document.getElementById("appointmentdt").innerHTML = "";
  document.getElementById("a7-medicineDetail").innerHTML = "";

  if (key == "") {
    let span = document.createElement("span")
    span.textContent = "Data not Found!"
    span.style.fontSize = "25px"
    document.getElementById("a7-medicineDetail").appendChild(span)
  }
  key.forEach(item => {

    const dtkey = Object.keys(data[item])

    let div2 = document.createElement("div")
    div2.setAttribute("class", "a7-mediInfo-box")
    let div3 = document.createElement("div")
    div3.setAttribute("class", "a7-mediInfo-color")
    let div = document.createElement('div')
    div.setAttribute("class", "a7-mediInfo")

    dtkey.forEach(element => {

      let para = document.createElement("p")
      let fieldDiv = document.createElement("div")
      fieldDiv.setAttribute("class", "a7-div-field")
      let span = document.createElement("span")
      span.setAttribute("class", "a5-bold")
      span.innerText = element + ':'
      para.textContent = data[item][element]
      fieldDiv.appendChild(span)
      fieldDiv.appendChild(para)
      div.append(fieldDiv)
    });

    div2.appendChild(div)
    div3.appendChild(div2)
    document.getElementById("a7-medicineDetail").appendChild(div3)
  });
  funcId(id).style.display = 'block';
}
let hide = function (id) {
  funcId(id).style.display = 'none';

}

patientAppointmentDetail()
profileDetailData()
