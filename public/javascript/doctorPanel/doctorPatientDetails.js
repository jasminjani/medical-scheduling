
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
 
  if (data.length == 0) {
    return document.getElementById("patientname").innerHTML += "Not Found!"
  }
  data.forEach(element => {
    document.getElementById("patientProfile").innerHTML = `  <img src='/imgs/${element["profile_picture"]}' alt="image" >`
    document.getElementById("patientname").innerHTML = element["Name"]
    document.getElementById("patientbasicdetail").innerHTML += 
    `<div class="a5-details">
    <p><span class="a5-bold">Date of Birth:</span>${element['Date of Birth']} </p>
    <p><span class="a5-bold">Email:</span>${element['Email']} </p>
    <p><span class="a5-bold">Contact:</span>${element['Contact']} </p></div>
    <div class="a5-details">
    <p><span class="a5-bold">Gender:</span>${element['Gender']} </p>
      <p><span class="a5-bold">Blood Group:</span>${element['Blood Group']}</p>
      <p><span class="a5-bold">City:</span>${element['City']}</p>
    </div>`
    document.getElementById("patientaddress").innerHTML +=
      `<p><span class="a5-bold">Address: </span>
         ${element['Address']}
      </p>`
  });
}


funcId = function (id) {
  return document.getElementById(id);
}

let show = async function (id, date) {

  const fetchData = await fetch(`/patientPrescriptionData/${date}/${Id}`)
  const data = await fetchData.json()
  const key = Object.keys(data)
  console.log(data);
  document.getElementById("appointmentdt").innerHTML = "";
  document.getElementById("mediBox").innerHTML = "";


  if (data.length == 0) {
    return document.getElementById("mediBox").innerHTML += `<p><span class="a5-bold">No Data Found!</span></p>`
  }

  data.forEach(element => {

    document.getElementById("mediBox").innerHTML += 
    `
    <div class="a7-mediInfo-box">
                        <div class="a7-FieldData" id="mediInfo">  
    <div>
          <p><span class="a5-bold">Start Time:</span>${element['Start Time']}</p>
          <p><span class="a5-bold">End Time:</span>${element["End Time"]}</p>
    </div>
    <div >
      <div><span class='a5-bold'>Diagnoses:</span></div><div><div ><p>${element["Diagnoses"]}</p></div></div>
      <div class="a7-presc-scroll"><div class="a7-sticky"><span class="a5-bold ">Presctiptions:</span></div><div>${element['Prescriptions']}</div></div>
        </div>   </div>`

  });

  funcId(id).style.display = 'block';
}
let hide = function (id) {
  funcId(id).style.display = 'none';

}

patientAppointmentDetail()
profileDetailData()


