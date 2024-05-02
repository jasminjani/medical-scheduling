let result;
let copyResult = [];
let data;

// ===== PAGINATION GLOBAL VARIABLE ======

let pagefield = 10;
let currentPage = 1;
let length = 0;
let lastpage;
let pageno = document.getElementById("pageno");

// ====================================

// ======= ONLOAD ALL PAYMENT HISTORY FETCH FUNCTION ========
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

// ========= SEARCH PAYMENT HISTORY FUNCTION ==========
async function searchPatientPayment() {
  try {

    let searchedData = document.getElementById('a5-searchPatient').value;
    if (!searchedData) {
      searchedData = "";
    }

    const url = `/patient/payments/${searchedData}`;
    const response = await fetch(url);
    result = await response.json();
    await appendPatientPayment();
  } catch (error) {
    console.log(error);
  }
}

// ======== SEARCH DATA ON ENTER KEY ==========
let searchBtn = document.getElementById('a5-btn-search');
searchBtn.addEventListener('keyup', function (event) {
  try {
    if (event.key === 'Enter') {
      searchPatientPayment();
    }
  } catch (error) { console.log(error); }
});

// ====== FUNCTION FOR DIFFRENCIATE SUCCESS AND REFUND PAYMENT =======
async function appendPatientPayment() {
  try {

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
    data = [];

    if (status == 1) {
      data = refundArr;
    }
    else {
      data = successArr;
    }
    currentPage = 1;
    if (currentPage == 1) {
      document.getElementById('homebtn').disabled = true
      document.getElementById('previousbtn').disabled = true
    }
    await pagination();


  } catch (error) {
    console.log(error);
  }
}

// ========== FUNCTION FOR STATUS CHANGE =========
async function changeStatus() {
  try {

    result = copyResult;
    await appendPatientPayment();
    document.getElementById('a5-searchPatient').value = "";

  } catch (error) {
    console.log(error);
  }
}



// =========== PAGINATION AND DATA DISPLAY ===============



const pagination = async () => {

  pageno.innerHTML = currentPage;
  length = data.length;
  if (data.length == 0) {
    length = 1;
  }

  const endIndex = currentPage * pagefield;
  const startIndex = endIndex - pagefield;
  let index = startIndex;
  const pageItems = data.slice(startIndex, endIndex);
  lastpage = Math.ceil(length / pagefield);
  if (currentPage == lastpage) {
    document.getElementById('endbtn').disabled = true;
    document.getElementById('nextbtn').disabled = true;
  }
  if (currentPage != lastpage) {
    document.getElementById('endbtn').disabled = false;
    document.getElementById('nextbtn').disabled = false;
  }

  if (data.length == 0) {
    return document.getElementById('a5-tbody').innerHTML = `<tr><td colspan='6'>No Data Found !</td></tr>`;
  }

  let tabledata = "";
  document.getElementById("a5-tbody").innerHTML = tabledata;


  let timezoneoffset = new Date().getTimezoneOffset();
  pageItems.forEach(element => {
    let start_time = new Date(element.start_time).getTime();
    start_time -= (timezoneoffset * 60 * 1000);
    start_time = new Date(start_time).toLocaleTimeString('en-US')
    // console.log(start_time)

    let end_time = new Date(element.end_time).getTime();
    end_time -= (timezoneoffset * 60 * 1000);
    end_time = new Date(end_time).toLocaleTimeString('en-US')
    let html2 = `<tr>
        <td>${++index}</td>
        <td>${element.doctor_name}</td>
        <td>${element.email}</td>
        <td>${element.date}</td>
        <td>${start_time + " - " + end_time}</td>
        <td>${element.payment_amount}</td>
      </tr>`

    document.getElementById('a5-tbody').innerHTML = document.getElementById('a5-tbody').innerHTML + html2;
  });
}



function firstpageFun() {
  currentPage = 1;
  pagination()
  if (currentPage != length / pagefield) {
    document.getElementById('endbtn').disabled = false;
    document.getElementById('nextbtn').disabled = false;
  }
  if (currentPage == 1) {
    document.getElementById('homebtn').disabled = true
    document.getElementById('previousbtn').disabled = true
  }
}

function prevButtonFun() {
  if (currentPage > 1) {
    currentPage--;
  }
  pagination();
  if (currentPage != lastpage) {
    document.getElementById('endbtn').disabled = false;
    document.getElementById('nextbtn').disabled = false;
  }
  if (currentPage == 1) {
    document.getElementById('homebtn').disabled = true;
    document.getElementById('previousbtn').disabled = true;
  }
}

function nextButtonFun() {
  if ((currentPage * pagefield) < length) {
    currentPage++;
  }
  if (currentPage != 1) {
    document.getElementById('homebtn').disabled = false;
    document.getElementById('previousbtn').disabled = false;
  }
  if (currentPage == lastpage) {
    document.getElementById('endbtn').disabled = true;
    document.getElementById('nextbtn').disabled = true;
  }
  pagination()
}

function lastpageFun() {
  currentPage = lastpage;
  pagination();
  if (currentPage != 1) {
    document.getElementById('homebtn').disabled = false;
    document.getElementById('previousbtn').disabled = false;

    if (currentPage == lastpage) {
      document.getElementById('endbtn').disabled = true;
      document.getElementById('nextbtn').disabled = true;
    }
  }
}
document.querySelector('#homebtn').addEventListener("click", firstpageFun);
document.querySelector('#endbtn').addEventListener("click", lastpageFun);
document.querySelector('#previousbtn').addEventListener("click", prevButtonFun);
document.querySelector('#nextbtn').addEventListener("click", nextButtonFun);

document.getElementById("a5-btn-search").addEventListener("click", pagination);