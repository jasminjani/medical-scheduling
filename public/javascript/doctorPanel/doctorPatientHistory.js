const fetchData = async () => {
  let fetchdata = await fetch(`/getPatientData`)
  let data = await fetchdata.json()
  return data
}

let currentPage = 1;
const pagefield = 1;
let length = 0;
let pageno = document.getElementById("pageno");

const pagination = async () => {
  let data = await fetchData()
  length = data.length;
  pageno.innerHTML = currentPage;

  const endIndex = currentPage * pagefield;
  const startIndex = endIndex - pagefield;
  const pageItems = data.slice(startIndex, endIndex);

  let tabledata = "";

  pageItems.map((value, index) => {
    let patient_id = value.patient_id
    tabledata += `<tr>
    <td hidden >${patient_id}</td>
    <td>${value.name}</td>
    <td>${value.phone}</td>
    <td><p class="a5-btn" onclick='window.location.href ="/viewPatientHistory/${patient_id}"'>View More</a></td>
  </tr>`
  })
  document.getElementById("a5-tbody").innerHTML += tabledata;
}

const removeFun = async () => {
  document.getElementById("a5-tbody").innerHTML = `<tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>More Details</th>
                </tr>`}

if (currentPage == 1) {
  document.getElementById('firstpage').disabled = true
  document.querySelector('#prevButton').disabled = true
}


function firstpageFun() {
  currentPage = 1;
  pagination()
  removeFun()
  if (currentPage != length / pagefield) {
    document.getElementById('lastpage').disabled = false;
    document.getElementById('nextButton').disabled = false;
  }
  if (currentPage == 1) {
    document.getElementById('firstpage').disabled = true
    document.getElementById('prevButton').disabled = true
  }
}

function prevButtonFun() {
  if (currentPage > 1) {
    currentPage--;
    pagination()
    removeFun()
    document.getElementById('lastpage')

  }
  if (currentPage != length / pagefield) {
    document.getElementById('lastpage').disabled = false;
    document.getElementById('nextButton').disabled = false;
  }
  if (currentPage == 1) {
    document.getElementById('firstpage').disabled = true
    document.getElementById('prevButton').disabled = true
  }
}

function nextButtonFun() {
  if ((currentPage * pagefield) < length) {
    currentPage++;
  }
  if (currentPage != 1) {
    document.getElementById('firstpage').disabled = false;
    document.getElementById('prevButton').disabled = false;
  }
  lastpage = Math.ceil(length / pagefield);
  if (currentPage == lastpage) {
    document.getElementById('lastpage').disabled = true
    document.getElementById('nextButton').disabled = true
  }
  pagination()
  removeFun()
}

function lastpageFun() {
  lastpage = Math.ceil(length / pagefield);
  currentPage = lastpage
  pagination()
  removeFun()
  if (currentPage != 1) {
    document.getElementById('firstpage').disabled = false;
    document.getElementById('prevButton').disabled = false;

    if (currentPage == lastpage) {
      document.getElementById('lastpage').disabled = true
      document.getElementById('nextButton').disabled = true
    }
  }
}
document.querySelector('#firstpage').addEventListener("click", firstpageFun)
document.querySelector('#lastpage').addEventListener("click", lastpageFun)
document.querySelector('#prevButton').addEventListener("click", prevButtonFun)
document.querySelector('#nextButton').addEventListener("click", nextButtonFun)
pagination()

