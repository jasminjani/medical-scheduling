
async function fetchPaymentHistory() {
  try {
    let patient_id = 7;
    const url = `http://localhost:8000/payments/${patient_id}`;
    const response = await fetch(url)
    const result = await response.json()

    await appendPaymentHistory(result)
  } catch (error) {
    console.log(error);
  }
}


async function searchPaymentHistory() {
  try {

    let searchedData = document.getElementById('a5-searchPatient').value;

    const url = `http://localhost:8000/searchedPaymentHistory/${searchedData}`;
    const response = await fetch(url)
    const result = await response.json()
    console.log(result);



    await appendPaymentHistory(result);
  } catch (error) {
    console.log(error);
  }
}


async function appendPaymentHistory(result) {
  try {

    let html = `<tr>
              <th>Index</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Appointment time</th>
              <th>Amount</th>
            </tr>`;

    document.getElementById('a5-tbody').innerHTML = html;
    let index = 1;

    //

    let successArr = [];
    let refundArr = [];

    result.message.forEach(element => {
      if (element.is_refunded == 1) {
        refundArr.push(element);
      } else {
        successArr.push(element);
      }
    });
    console.log("success : ", successArr);
    console.log("refund : ", refundArr);

    let status = document.getElementById('paymentStatus').value;
    console.log(status);
    let data = [];

    if (status == 1) {
      data = refundArr;
    }
    else {
      data = successArr;
    }
    //



    data.forEach(element => {

      let html2 = `<tr>
          <td>${index++}</td>
          <td>${element.doctor_name}</td>
          <td>${element.email}</td>
          <td>${element.date}</td>
          <td>${element.start_time + " - " + element.end_time}</td>
          <td>${element.payment_amount}</td>
        </tr>`

      document.getElementById('a5-tbody').innerHTML = document.getElementById('a5-tbody').innerHTML + html2;
    });
  } catch (error) {
    console.log(error);
  }
}
