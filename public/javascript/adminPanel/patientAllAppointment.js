funcId = function (id) {
  return document.getElementById(id);
}

let show = async function (id, slot_id) {

  const url = `http://localhost:8000/admin/patient-appointment/:patient_id/${slot_id}`;
  const response = await fetch(url);
  const result = await response.json();

  let html = `<div class="a5-doctor-section">
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
                  </div>
                  <div class="a5-doctor-more-detail">
                    <p><span class="a5-bold">Appointment Date :</span>
                      ${result.appointmentData[0].date}
                    </p>
                    <p><span class="a5-bold">Time :</span>
                      ${result.appointmentData[0].start_time + " - " + result.appointmentData[0].end_time}
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

  funcId(id).innerHTML = html;
  funcId(id).style.display = 'block';
}

let hide = function (id) {
  funcId(id).style.display = 'none';
}
