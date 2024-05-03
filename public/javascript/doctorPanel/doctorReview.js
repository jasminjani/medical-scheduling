// Pagination Declare Global Variable
let data;
let pagefield = 10
let currentPage = 1
let length = 0
let pageno = document.getElementById("pageno")

const fetchDataFun = async () => {
  try {
    let fetchdata = await fetch(`/doctor/reviews/all`)
    data = await fetchdata.json()
    await pagination();

  } catch (error) {
    console.log(error);
  }
}
const searchPatientReview = async () => {
  try {

    let searchedData = document.getElementById('search').value;
   
    if (!searchedData) {
      searchedData = "null";
    }

    const url = `/doctor/searchReview/${searchedData}`;
    const response = await fetch(url);
    data = await response.json();
    await pagination();

  } catch (error) {
    console.log(error);
  }
}

let searchBtn = document.getElementById('a5-btn-search');

searchBtn.addEventListener('keyup', function (event) {
  try {
    if (event.key === 'Enter') {
      searchPatientReview();
    }
  } catch (error) { console.log(error); }
});

const pagination = async () => {

  length = data.length;
  if (length == 0) {
    document.getElementById("a5-tbody").innerHTML = "<tr><td colspan='5'  style='text-align:center'>Data Not Found!</td></tr>"
  } else {
    pageno.innerHTML = currentPage;

    const endIndex = currentPage * pagefield;
    const startIndex = endIndex - pagefield;
    const pageItems = data.slice(startIndex, endIndex);

    let tabledata = "";
    document.getElementById("a5-tbody").innerHTML = tabledata;

    pageItems.map((value) => {
      tabledata += `<tr>      
          <td hidden>${value.date}</td>
          <td class="csearch">${value.Name}</td>
          <td class="csearch">${value.rating}</td>
          <td class="A7-review-message csearch">${value.review}</td>
          <td class="csearch">${value.date}</td>
        </tr>`
    })
    document.getElementById("a5-tbody").innerHTML += tabledata;
  }
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
    pagination()
    
    document.getElementById('endbtn')

  }
  if (currentPage != length / pagefield) {
    document.getElementById('endbtn').disabled = false;
    document.getElementById('nextbtn').disabled = false;
  }
  if (currentPage == 1) {
    document.getElementById('homebtn').disabled = true
    document.getElementById('previousbtn').disabled = true
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
  lastpage = Math.ceil(length / pagefield);
  if (currentPage == lastpage) {
    document.getElementById('endbtn').disabled = true
    document.getElementById('nextbtn').disabled = true
  }
  pagination()
 
}

function lastpageFun() {
  lastpage = Math.ceil(length / pagefield);
  currentPage = lastpage
  pagination()
 
  if (currentPage != 1) {
    document.getElementById('homebtn').disabled = false;
    document.getElementById('previousbtn').disabled = false;

    if (currentPage == lastpage) {
      document.getElementById('endbtn').disabled = true
      document.getElementById('nextbtn').disabled = true
    }
  }
}
document.querySelector('#homebtn').addEventListener("click", firstpageFun)
document.querySelector('#endbtn').addEventListener("click", lastpageFun)
document.querySelector('#previousbtn').addEventListener("click", prevButtonFun)
document.querySelector('#nextbtn').addEventListener("click", nextButtonFun)

document.getElementById("a5-btn-search").addEventListener("click", pagination)


// pagination()


