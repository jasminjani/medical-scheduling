let copyResult = [];


async function fetchPaymentHistory() {
  try {

    const url = `/doctor/payment/history`;
    const response = await fetch(url,{
      method:"POST",
      headers:{
        'Content-Type':"application/json"
      }
    })
    const result = await response.json()
    copyResult = result;

    await appendPaymentHistory(result)
  } catch (error) {
    console.log(error);
  }
}


async function searchPaymentHistory() {
  try {
    
    let searchedData = document.getElementById('a5-searchPatient').value;
    // if (typeof searchedData === "string" && searchedData.length === 0) {
      if (!searchedData) {
        searchedData = "null";
      }

    const url = `/doctor/searchedPaymentHistory/${searchedData}`;
    const response = await fetch(url)
    let result = await response.json()

    await appendPaymentHistory(result);
  } catch (error) {
    console.log(error);
  }
}

let searchBtn = document.getElementById('a5-btn-search');

searchBtn.addEventListener('keyup', function (event) {
  try {
    if (event.key === 'Enter') {
      searchPaymentHistory();
    }
  } catch (e) { console.log(e); }
});


async function appendPaymentHistory(result) {
  try {

    let html = `<tr>
              <th>Sr no.</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Contact No.</th>
              <th>Details</th>
            </tr>`;

    document.getElementById('a5-tbody').innerHTML = html;
    let index = 1;

    if (result.patientHistory.length == 0) {
      return document.getElementById('a5-tbody').innerHTML += `<tr><td colspan='5'>No Data Found !</td></tr>`
    }

    result.patientHistory.forEach(element => {
      let html2 = `<tr>
          <td>${index++}</td>
          <td>${element.fname}</td>
          <td>${element.lname}</td>
          <td>${element.phone}</td>
          <td><p class="a5-btn" onclick="window.location.href='/doctor/payment/history/${element.patient_id}'">Detail</p></td>
        </tr>`

      document.getElementById('a5-tbody').innerHTML = document.getElementById('a5-tbody').innerHTML + html2;
    });
  } catch (error) {
    console.log(error);
  }
}
