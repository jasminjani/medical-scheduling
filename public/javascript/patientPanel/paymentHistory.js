let result;
let copyResult = [];

async function fetchPatientPayment() {
  try {
    const url = `/payments`;
    const response = await fetch(url);
    result = await response.json();
    copyResult = result;
    await appendPatientPayment()
  } catch (error) {
    console.log(error);
  }
}


async function searchPatientPayment() {
  try {

    let searchedData = document.getElementById('a5-searchPatient').value;

    const url = `http://localhost:8000/searchedPatientPayment/${searchedData}`;
    const response = await fetch(url);

    // for display all data in null search
    if (response.statusText == "Not Found") {
      result = copyResult;
    } else {
      result = await response.json();
    }

    await appendPatientPayment();
  } catch (error) {
    console.log(error);
  }
}


async function appendPatientPayment() {
  try {
    let html = `<tr>
              <th>Sr no.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Appointment time</th>
              <th>Amount</th>
            </tr>`;

    document.getElementById('a5-tbody').innerHTML = html;
    let index = 1;

    let successArr = [];
    let refundArr = [];

    result.message.forEach(element => {
      if (element.is_refunded == 1) {
        refundArr.push(element);
      } else {
        successArr.push(element);
      }
    });

    let status = document.getElementById('paymentStatus').value;
    let data = [];

    if (status == 1) {
      data = refundArr;
    }
    else {
      data = successArr;
    }

    if(data.length==0){
      return document.getElementById('a5-tbody').innerHTML += `<tr><td colspan='6'>No Data Found !</td></tr>`
    }

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

async function changeStatus() {
  try {

    result = copyResult;
    await appendPatientPayment();
    document.getElementById('a5-searchPatient').value = "";

  } catch (error) {
    console.log(error);
  }
}
