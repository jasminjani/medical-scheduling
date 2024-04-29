let result;
let copyResult = [];

async function fetchPatientPayment() {
  try {
    const url = `/patient/payments`;
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
    if (!searchedData) {
      result = copyResult;
    } else {

      const url = `/searchedPatientPayment/${searchedData}`;
      const response = await fetch(url);
      result = await response.json();
    }

    await appendPatientPayment();
  } catch (error) {
    console.log(error);
  }
}

let searchBtn = document.getElementById('a5-btn-search');

searchBtn.addEventListener('keyup', function (event) {
  try {
    if (event.key === 'Enter') {
      searchPatientPayment();
    }
  } catch (e) { console.log(e); }
});


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

    if (data.length == 0) {
      return document.getElementById('a5-tbody').innerHTML += `<tr><td colspan='6'>No Data Found !</td></tr>`
    }

    let timezoneoffset = new Date().getTimezoneOffset();
    data.forEach(element => {
    let start_time = new Date(element.start_time).getTime();
    start_time -= (timezoneoffset * 60 * 1000);
    start_time = new Date(start_time).toLocaleTimeString('en-US')
    console.log(start_time)

    let end_time = new Date(element.end_time).getTime();
    end_time -= (timezoneoffset * 60 * 1000);
    end_time = new Date(end_time).toLocaleTimeString('en-US')
      let html2 = `<tr>
          <td>${index++}</td>
          <td>${element.doctor_name}</td>
          <td>${element.email}</td>
          <td>${element.date}</td>
          <td>${start_time + " - " + end_time}</td>
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
