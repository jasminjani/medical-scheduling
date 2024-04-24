
async function fetchPatientAllAppointment() {
  try {
    let patient_id = window.location.href.split('/').pop();

    const url = `http://localhost:8000/admin/get-patient-appointment/${patient_id}`;
    const response = await fetch(url);
    const result = await response.json();

    await appendPatientDetails(result);
    await appendPatientAllAppointment(result);

  } catch (error) {
    console.log(error);
  }
}


async function appendPatientDetails(result) {
  try {

    let html = `<div class="a5-patient">
    <div class="a5-patient-img">
      <img src="/imgs/${result.patientDetails[0].profile_picture}" alt="image">
    </div>
    <div class="a5-patient-details">
      <h1>${result.patientDetails[0].fname + " " + result.patientDetails[0].lname}
      </h1>
      <div class="a5-patient-more-detail">
        <div class="a5-details">
          <p><span class="a5-bold">Email :</span>
            ${result.patientDetails[0].email}
          </p>
          <p><span class="a5-bold">Contact :</span>
            ${result.patientDetails[0].phone}
          </p>
          <p><span class="a5-bold">DOB :</span>
            ${result.patientDetails[0].dob}
          </p>
        </div>
        <div class="a5-details">
          <p><span class="a5-bold">Gender :</span>${result.patientDetails[0].gender}
          </p>
          <p><span class="a5-bold">City :</span>
            ${result.patientDetails[0].city}
          </p>
          <p><span class="a5-bold">Blood group :</span>
            ${result.patientDetails[0].blood_group}
          </p>
        </div>
      </div>
      <div class="a5-patient-address">
        <p><span class="a5-bold">address : </span>${result.patientDetails[0].address}
        </p>
      </div>
    </div>
  </div>`;

    document.getElementById('a5-patient-basic-details').innerHTML = html;

  } catch (error) {
    console.log(error);
  }
}


async function appendPatientAllAppointment(result) {
  try {

    let header = `<tr>
                    <th>Sr no.</th>
                    <th>Doctor Name</th>
                    <th>Speciality</th>
                    <th>Appointment Date</th>
                    <th>Details</th>
                  </tr>`;

    document.getElementById('a5-tbody').innerHTML = header;
    let index = 1;

    if (!result.allAppointment) {
      document.getElementById('a5-tbody').innerHTML = header + `<tr><td colspan="5">No data found!!</td></tr>`;
    } else {

      result.allAppointment.forEach(element => {
        let appointmentDetails = `<tr>
            <td>${index++}</td>
            <td>${element.fname + " " + element.lname}</td>
            <td>${element.speciality}</td>
            <td>${element.date}</td>
            <td>
              <p onclick="show('a5-popup', '${element.slot_id}')" class="a5-btn">Detail</p>
            </td>
          </tr>`;

        document.getElementById('a5-tbody').innerHTML = document.getElementById('a5-tbody').innerHTML + appointmentDetails;
      });
    }
  } catch (error) {
    console.log(error);
  }
}


funcId = function (id) {
  try {
    return document.getElementById(id);
  } catch (error) {
    console.log(error);
  }
}

let show = async function (id, slot_id) {
  try {

    const url = `http://localhost:8000/admin/patient-appointment/:patient_id/${slot_id}`;
    const response = await fetch(url);
    const result = await response.json();
    let html;
    if (!result.appointmentData) {
      html = `<div class="a5-doctor-section">
                <div class="a5-doctor-card">
                  <h3> Data Not Found !! </h3>
                </div>
              </div>
              <p class="a5-btn" onclick="hide('a5-popup')"> Close </p>`;

    } else {

      let appointmentStatus;
      if (result.appointmentData[0].is_refunded == 1) { appointmentStatus = "Refund" }
      if (result.appointmentData[0].is_refunded == 0) { appointmentStatus = "Success" }

      html = `<div class="a5-doctor-section">
              <div class="a5-doctor-card">
                <h3>Dr. ${result.appointmentData[0].fname + " " + result.appointmentData[0].lname}
                </h3>
                <div class="a5-doctor-detail">
                  <div class="a5-doctor-more-detail">
                    <p><span class="a5-bold">Speciality :</span>
                      ${result.appointmentData[0].speciality}
                    </p>
                    <p><span class="a5-bold">Hospital :</span>
                      ${result.appointmentData[0].name}
                    </p>
                    <p><span class="a5-bold">Amount :</span>
                      ${result.appointmentData[0].payment_amount}
                    </p>
                  </div>
                  <div class="a5-doctor-more-detail">
                    <p><span class="a5-bold">Appointment Date :</span>
                      ${result.appointmentData[0].date}
                    </p>
                    <p><span class="a5-bold">Time :</span>
                      ${result.appointmentData[0].start_time + " - " + result.appointmentData[0].end_time}
                    </p>
                    <p><span class="a5-bold">Status :</span>
                      ${appointmentStatus}
                    </p>
                  </div>
                </div>
                <div class="a5-prescription">
                  <p><span class="a5-bold">Prescription :</span>
                    ${result.appointmentData[0].prescription}
                  </p>
                  <p><span class="a5-bold">Diagnosis :</span>
                    ${result.appointmentData[0].diagnoses}
                  </p>
                </div>
              </div>
            </div>

            <p class="a5-btn" onclick="hide('a5-popup')"> Close </p>`;
    }

    funcId(id).innerHTML = html;
    funcId(id).style.display = 'block';

  } catch (error) {
    console.log(error);
  }
}

let hide = function (id) {
  try {
    funcId(id).style.display = 'none';
  } catch (error) {
    console.log(error);
  }
}
