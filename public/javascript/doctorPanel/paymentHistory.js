let data;
let copyData = [];


// ===== PAGINATION GLOBAL VARIABLE ======

let pagefield = 10;
let currentPage = 1;
let length = 0;
let lastpage;
let pageno = document.getElementById("pageno");

// ====================================


async function fetchPaymentHistory() {
  try {
    const url = `/doctor/payment/history`;
    const response = await fetch(url,{
      method:"POST",
      headers:{
        'Content-Type':"application/json"
      }
    })
    data = await response.json();
    data = data.patientHistory;
    copyData = data;

    await appendPaymentHistory();
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
    data = await response.json();
    data = data.patientHistory;

    await appendPaymentHistory();
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


async function appendPaymentHistory() {
  try {

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
    return document.getElementById('a5-tbody').innerHTML = `<tr><td colspan='5'>No Data Found !</td></tr>`
  }

  document.getElementById("a5-tbody").innerHTML = "";

  pageItems.forEach(element => {
    let html2 = `<tr>
        <td>${++index}</td>
        <td>${element.fname}</td>
        <td>${element.lname}</td>
        <td>${element.phone}</td>
        <td><p class="a5-btn" onclick="window.location.href='/doctor/payment/history/${element.patient_id}'">Detail</p></td>
      </tr>`
    document.getElementById('a5-tbody').innerHTML +=  html2;
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