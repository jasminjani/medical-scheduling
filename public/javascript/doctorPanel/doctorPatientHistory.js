let data;

// let search = document.getElementById("search").value


const fetchData = async () => {
  try {
    let fetchdata = await fetch(`/doctor/patients`)
    data = await fetchdata.json();
    // return data
    await pagination();
  } catch {
    console.log(error);
  }
}

const searchPatientDetails = async () => {
  try {

    let searchedData = document.getElementById('search').value;
    // if (typeof searchedData === "string" && searchedData.length === 0) {
    if (!searchedData) {
      searchedData = "null";
    }
    const url = `/doctor/patients-detail/${searchedData}`;
    const response = await fetch(url);
    data = await response.json();
    // return data;
    await pagination();
  } catch (error) {
    console.log(error);
  }
}

let searchBtn = document.getElementById('a5-btn-search');

searchBtn.addEventListener('keyup', function (event) {
  try {
    if (event.key === 'Enter') {
      searchPatientDetails();
    }
  } catch (error) { console.log(error); }
});

let currentPage = 1;
const pagefield = 10;
let length = 0;
let pageno = document.getElementById("pageno");


const pagination = async () => {
  try {

    //  data = await fetchData()
    // if (search) {
    //   data = data.filter((obj) => {
    //     return obj.name.includes(search) 
    //   })
    // }


    length = data.length;
    if (length == 0) {
      document.getElementById("a5-tbody").innerHTML = `<tr><td colspan='3'  style='text-align:center'>Data Not Found!</td></tr>`;
    }
    else {
      pageno.innerHTML = currentPage;


      const endIndex = currentPage * pagefield;
      const startIndex = endIndex - pagefield;
      const pageItems = data.slice(startIndex, endIndex);

      let tabledata = "";
      document.getElementById("a5-tbody").innerHTML = tabledata;

      pageItems.map((value) => {
        let patient_id = value.patient_id
        tabledata += `<tr>
    <td hidden >${patient_id}</td>
    <td>${value.name}</td>
    <td>${value.phone}</td>
    <td><p class="a5-btn" onclick='window.location.href ="/doctor/patients/history/${patient_id}"'>View More</a></td>
  </tr>`
      })
      document.getElementById("a5-tbody").innerHTML += tabledata;
    }
  } catch (error) {
    console.log(error);
  }

}

const removeFun = async () => {
  document.getElementById("a5-tbody").innerHTML = `<tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>More Details</th>
                </tr>`}

if (currentPage == 1) {
  document.getElementById('homebtn').disabled = true
  document.querySelector('#previousbtn').disabled = true
}


function firstpageFun() {
  currentPage = 1;
  pagination()
  // removeFun()
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
    // removeFun()
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
  // removeFun()
}

function lastpageFun() {
  lastpage = Math.ceil(length / pagefield);
  currentPage = lastpage
  pagination()
  // removeFun()
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
// pagination()

