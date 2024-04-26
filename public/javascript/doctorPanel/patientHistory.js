


async function fetchPaymentData() {
  try {

    let patient_id = window.location.href.split('/').pop();

    const url = `/doctor/patients/history/${patient_id}`;
    const response = await fetch(url)
    const result = await response.json();

    await appendPatientDetails(result);
    await appendData(result);
  } catch (error) {
    console.log(error);
  }
}


async function appendData(result) {
  try {

    let html = `<tr>
                  <th>Index</th>
                  <th>Slot Date</th>
                  <th>Slot Time</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                </tr>`;

    document.getElementById('a5-tbody').innerHTML = html;
    let index = 1;

    result.paymentDetails.forEach(element => {
      let html2 = `<tr>
              <td>${index++}</td>
              <td>${element.slote_date}</td>
              <td>${element.start_time + " - " + element.end_time}</td>
              <td>${element.payment_amount}</td>
              <td>${element.payment_date}</td>
            </tr>`

      document.getElementById('a5-tbody').innerHTML = document.getElementById('a5-tbody').innerHTML + html2;
    });
  } catch (error) {
    console.log(error);
  }
}


async function appendPatientDetails(result) {
  try {

    let html = `<div class="a5-patient">
        <div class="a5-patient-img">
          <img src="/assets/adminPanel/patient.png" alt="image">
        </div>
        <div class="a5-patient-details">
          <h1>
            ${result.paymentDetails[0].fname + " " + result.paymentDetails[0].lname}
          </h1>
          <div class="a5-patient-more-detail">
            <div class="a5-details">
              <p><span class="a5-bold">Email :</span> ${result.paymentDetails[0].email}
              </p>
              <p><span class="a5-bold">Contact :</span>${result.paymentDetails[0].phone}
              </p>
              <p><span class="a5-bold">DOB :</span>${result.paymentDetails[0].dob}
              </p>
            </div>
            <div class="a5-details">
              <p><span class="a5-bold">Gender :</span>${result.paymentDetails[0].gender}
              </p>
              <p><span class="a5-bold">City :</span>${result.paymentDetails[0].city}
              </p>
              <p><span class="a5-bold">Blood group :</span>${result.paymentDetails[0].blood_group}
              </p>
            </div>
          </div>
          <div class="a5-patient-address">
            <p><span class="a5-bold">address : </span>${result.paymentDetails[0].address}
            </p>
          </div>
        </div>
      </div>`;

    document.getElementById('a5-patient-basic-details').innerHTML = html;
  } catch (error) {
    console.log(error);
  }
}
