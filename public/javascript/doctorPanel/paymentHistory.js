
async function fetchPaymentHistory() {
  try {

    const url = `http://localhost:8000/showpaymentHistory`;
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
              <th>First Name</th>
              <th>Last Name</th>
              <th>Contact No.</th>
              <th>Details</th>
            </tr>`;

    document.getElementById('a5-tbody').innerHTML = html;
    let index = 1;

    result.patientHistory.forEach(element => {
      let html2 = `<tr>
          <td>${index++}</td>
          <td>${element.fname}</td>
          <td>${element.lname}</td>
          <td>${element.phone}</td>
          <td><p class="a5-btn" onclick="window.location.href='/doctorPaymentHistory/${element.patient_id}'">Detail</p></td>
        </tr>`

      document.getElementById('a5-tbody').innerHTML = document.getElementById('a5-tbody').innerHTML + html2;
    });
  } catch (error) {
    console.log(error);
  }
}
