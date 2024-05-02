
async function fetchPatientPaymentData() {
  try {

    let patient_id = window.location.href.split('/').pop();

    const url = `/doctor/payment/history/${patient_id}`;
    const response = await fetch(url,{
      method:"POST",
      headers:{
        'Content-Type':"application/json"
      }
    })
    const result = await response.json();

    await appendPatientDetails(result);
    await appendPatientPaymentDetails(result);
  } catch (error) {
    console.log(error);
  }
}




async function appendPatientDetails(result) {
  try {

    let html = `<div class="a5-patient">
        <div class="a5-patient-img">
          <img src="/imgs/${result.paymentDetails[0].profile_picture}" alt="image">
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


async function appendPatientPaymentDetails(result) {
  try {

    let html = `<tr>
                  <th>Index</th>
                  <th>Slot Date</th>
                  <th>Slot Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                </tr>`;

    document.getElementById('a5-tbody').innerHTML = html;
    let index = 1;

    let timezoneoffset = new Date().getTimezoneOffset();
    result.paymentDetails.forEach(element => {
      let start_time = new Date(element.start_time).getTime();
      start_time -= (timezoneoffset * 60 * 1000);
      start_time = new Date(start_time).toLocaleTimeString('en-US')
      // console.log(start_time)
  
      let end_time = new Date(element.end_time).getTime();
      end_time -= (timezoneoffset * 60 * 1000);
      end_time = new Date(end_time).toLocaleTimeString('en-US')
      let refundStatus;
      if (element.is_refunded == 1) {
        refundStatus = "refund"
      } else if (element.is_refunded == 0) {
        refundStatus = "success"
      }
      let html2 = `<tr>
              <td>${index++}</td>
              <td>${element.slote_date}</td>
              <td>${start_time + " - " + end_time}</td>
              <td>${element.payment_amount}</td>
              <td>${refundStatus}</td>
              <td>${element.payment_date}</td>
            </tr>`

      document.getElementById('a5-tbody').innerHTML = document.getElementById('a5-tbody').innerHTML + html2;
    });
  } catch (error) {
    console.log(error);
  }
}
