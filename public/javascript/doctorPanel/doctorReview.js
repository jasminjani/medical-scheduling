let search = document.getElementById("search").value
let pagefield = 1
let currentPage = 1
let length = 0
let pageno = document.getElementById("pageno")

const fetchDataFun = async () => {
 
  let fetchdata = await fetch(`/doctor/reviews`)
  let data = await fetchdata.json()
  return data
}

const searchFetchDataFun = async ()=>{
  let fetchdata
  let data
  fetchdata = await fetch(`/doctor/searchReview/${search}`)
  data = await fetchdata.json()
  return data
}



const pagination = async (result) => {
 
  let data
  if(search)
  {
    data = await searchFetchDataFun()
  }
  else
  {
    data = await fetchDataFun()
  }
  

  length = data.length;
  pageno.innerHTML = currentPage;

  const endIndex = currentPage * pagefield;
  const startIndex = endIndex - pagefield;
  const pageItems = data.slice(startIndex, endIndex);

  let tabledata = "";

  pageItems.map((value) => {
    tabledata += `<tr>
          
          <td hidden>${value.date}</td>
          <td class="csearch">${value.name}</td>
          <td class="csearch">${value.rating}</td>
          <td class="A7-review-message csearch">${value.review}</td>
          <td class="csearch">${value.date}</td>
        </tr>`
  })

  document.getElementById("a5-tbody").innerHTML += tabledata;

}

const removeFun = async () => {
  document.getElementById("a5-tbody").innerHTML = `<tr>
                  <th>Name </th>
                <th>Rating</th>
                <th>Message</th>
                <th>Date</th>
                </tr>`
}



function firstpageFun() {
  currentPage = 1;
  pagination()
  removeFun()
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
    removeFun()
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
  removeFun()
}

function lastpageFun() {
  lastpage = Math.ceil(length / pagefield);
  currentPage = lastpage
  pagination()
  removeFun()
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



pagination()


const searchStrategy = async () => {
  let tbl = document.getElementsByClassName("csearch")
  console.log(tbl);
}

searchStrategy()